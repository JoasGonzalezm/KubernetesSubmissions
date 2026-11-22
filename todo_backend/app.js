const http = require('http')
const { Pool } = require('pg')
const { connect, StringCodec } = require('nats')

const PORT = process.env.PORT
if (!PORT) throw new Error('Missing environment variable PORT')
const MAX_TODO_LENGTH = 140

const log = (message, fields = {}) => {
  console.log(JSON.stringify({ time: new Date().toISOString(), message, ...fields }))
}

// Connection settings come from PGHOST, PGUSER, PGPASSWORD, PGDATABASE env variables
const pool = new Pool()

const NATS_URL = process.env.NATS_URL
const NATS_SUBJECT = 'todos'
const sc = StringCodec()
let nats = null

const connectNats = async () => {
  if (!NATS_URL) return
  try {
    nats = await connect({ servers: NATS_URL, maxReconnectAttempts: -1 })
    log('connected to NATS', { url: NATS_URL })
  } catch (error) {
    log('NATS connection failed, retrying', { error: error.message })
    setTimeout(connectNats, 5000)
  }
}

// Messages are best effort: the todo is saved even if NATS is down
const publish = (action, todo) => {
  if (!nats) return
  nats.publish(NATS_SUBJECT, sc.encode(JSON.stringify({ action, todo })))
}

const initDb = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      text VARCHAR(140) NOT NULL,
      done BOOLEAN NOT NULL DEFAULT false
    )`)
}

const readBody = (req) => new Promise((resolve, reject) => {
  let data = ''
  req.on('data', (chunk) => { data += chunk })
  req.on('end', () => resolve(data))
  req.on('error', reject)
})

const sendJson = (res, status, body) => {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(body))
}

const server = http.createServer(async (req, res) => {
  // Probes are not logged to keep the request log readable
  if (req.method === 'GET' && req.url === '/healthz') {
    try {
      await pool.query('SELECT 1')
      return sendJson(res, 200, { status: 'ok' })
    } catch (error) {
      return sendJson(res, 500, { status: 'database unavailable' })
    }
  }
  log('request', { method: req.method, url: req.url })
  try {
    if (req.method === 'GET' && req.url === '/todos') {
      const { rows } = await pool.query('SELECT id, text, done FROM todos ORDER BY id')
      return sendJson(res, 200, rows)
    }
    if (req.method === 'POST' && req.url === '/todos') {
      let text
      try {
        text = JSON.parse(await readBody(req)).text
      } catch {
        log('todo rejected', { reason: 'invalid JSON' })
        return sendJson(res, 400, { error: 'invalid JSON' })
      }
      if (typeof text !== 'string' || !text.trim()) {
        log('todo rejected', { reason: 'text is required' })
        return sendJson(res, 400, { error: 'text is required' })
      }
      if (text.trim().length > MAX_TODO_LENGTH) {
        log('todo rejected', { reason: 'too long', length: text.trim().length, todo: text })
        return sendJson(res, 400, { error: `todo can be at most ${MAX_TODO_LENGTH} characters` })
      }
      const { rows } = await pool.query(
        'INSERT INTO todos (text) VALUES ($1) RETURNING id, text, done',
        [text.trim()],
      )
      log('todo created', { todo: rows[0].text })
      publish('created', rows[0])
      return sendJson(res, 201, rows[0])
    }
    const todoMatch = req.url.match(/^\/todos\/(\d+)$/)
    if (req.method === 'PUT' && todoMatch) {
      let done
      try {
        done = JSON.parse(await readBody(req)).done
      } catch {
        return sendJson(res, 400, { error: 'invalid JSON' })
      }
      if (typeof done !== 'boolean') {
        return sendJson(res, 400, { error: 'done must be a boolean' })
      }
      const { rows } = await pool.query(
        'UPDATE todos SET done = $1 WHERE id = $2 RETURNING id, text, done',
        [done, Number(todoMatch[1])],
      )
      if (rows.length === 0) return sendJson(res, 404, { error: 'todo not found' })
      log('todo updated', { id: rows[0].id, done: rows[0].done })
      publish('updated', rows[0])
      return sendJson(res, 200, rows[0])
    }
    sendJson(res, 404, { error: 'not found' })
  } catch (error) {
    console.error(error)
    sendJson(res, 500, { error: 'internal server error' })
  }
})

const start = async () => {
  connectNats()
  // The database may still be starting, so retry for a while
  for (let attempt = 1; ; attempt++) {
    try {
      await initDb()
      break
    } catch (error) {
      if (attempt >= 30) throw error
      console.log(`Database not ready (${error.message}), retrying...`)
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  }
  server.listen(PORT, () => {
    console.log(`Server started in port ${PORT}`)
  })
}

start()

const http = require('http')
const { Pool } = require('pg')

const PORT = process.env.PORT || 3000

// Connection settings come from PGHOST, PGUSER, PGPASSWORD, PGDATABASE env variables
const pool = new Pool({ connectionTimeoutMillis: 2000 })

let dbInitialized = false

const initDb = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS counter (
      id INTEGER PRIMARY KEY,
      value INTEGER NOT NULL
    )`)
  await pool.query('INSERT INTO counter (id, value) VALUES (1, 0) ON CONFLICT (id) DO NOTHING')
  dbInitialized = true
}

// Creates the table on first successful connection
const ensureDb = async () => {
  if (!dbInitialized) await initDb()
}

const increment = async () => {
  await ensureDb()
  const { rows } = await pool.query('UPDATE counter SET value = value + 1 WHERE id = 1 RETURNING value')
  return rows[0].value - 1
}

const current = async () => {
  await ensureDb()
  const { rows } = await pool.query('SELECT value FROM counter WHERE id = 1')
  return rows[0].value
}

const server = http.createServer(async (req, res) => {
  try {
    // The HTTPRoute rewrites /pingpong to /
    if (req.method === 'GET' && req.url === '/') {
      res.writeHead(200, { 'Content-Type': 'text/plain' })
      return res.end(`pong ${await increment()}`)
    }
    // Readiness probe and GKE health check: ready only when the database answers
    if (req.method === 'GET' && req.url === '/healthz') {
      await ensureDb()
      await pool.query('SELECT 1')
      res.writeHead(200, { 'Content-Type': 'text/plain' })
      return res.end('ok')
    }
    if (req.method === 'GET' && req.url === '/pings') {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify({ pings: await current() }))
    }
    res.writeHead(404)
    res.end('Not found')
  } catch (error) {
    console.error(error.message)
    res.writeHead(500)
    res.end('Internal server error')
  }
})

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
})

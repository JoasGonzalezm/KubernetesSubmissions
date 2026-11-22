const fs = require('fs')
const http = require('http')
const path = require('path')

const requireEnv = (name) => {
  const value = process.env[name]
  if (!value) throw new Error(`Missing environment variable ${name}`)
  return value
}

const PORT = requireEnv('PORT')
const IMAGE_DIR = requireEnv('IMAGE_DIR')
const IMAGE_URL = requireEnv('IMAGE_URL')
const TODO_BACKEND_URL = requireEnv('TODO_BACKEND_URL')
const IMAGE_TTL_MS = Number(requireEnv('IMAGE_TTL_MINUTES')) * 60 * 1000

const imagePath = path.join(IMAGE_DIR, 'image.jpg')
const metaPath = path.join(IMAGE_DIR, 'image.json')

fs.mkdirSync(IMAGE_DIR, { recursive: true })

const readMeta = () => {
  try {
    return JSON.parse(fs.readFileSync(metaPath, 'utf8'))
  } catch {
    return null
  }
}

const writeMeta = (meta) => fs.writeFileSync(metaPath, JSON.stringify(meta))

const fetchImage = async () => {
  const response = await fetch(IMAGE_URL)
  if (!response.ok) throw new Error(`Image fetch failed: ${response.status}`)
  const buffer = Buffer.from(await response.arrayBuffer())
  fs.writeFileSync(imagePath, buffer)
  writeMeta({ fetchedAt: Date.now(), servedAfterExpiry: false })
  console.log('Fetched a new image')
}

// The image stays the same for 10 minutes. After that the old image is
// served once more, and the next request gets a new one.
const ensureImage = async () => {
  const meta = readMeta()
  if (!meta || !fs.existsSync(imagePath)) return fetchImage()

  const expired = Date.now() - meta.fetchedAt > IMAGE_TTL_MS
  if (!expired) return
  if (!meta.servedAfterExpiry) return writeMeta({ ...meta, servedAfterExpiry: true })
  return fetchImage()
}

const fetchTodos = async () => {
  const response = await fetch(`${TODO_BACKEND_URL}/todos`)
  if (!response.ok) throw new Error(`Todo backend responded ${response.status}`)
  return response.json()
}

const markDone = async (id) => {
  await fetch(`${TODO_BACKEND_URL}/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ done: true }),
  })
}

const createTodo = async (text) => {
  await fetch(`${TODO_BACKEND_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
}

// The "break the app" button sets this to false, which makes the liveness probe fail
let isHealthy = true

const backendReady = async () => {
  try {
    const response = await fetch(`${TODO_BACKEND_URL}/healthz`, { signal: AbortSignal.timeout(2000) })
    return response.ok
  } catch {
    return false
  }
}

const readBody = (req) => new Promise((resolve, reject) => {
  let data = ''
  req.on('data', (chunk) => { data += chunk })
  req.on('end', () => resolve(data))
  req.on('error', reject)
})

const escapeHtml = (text) => text
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')

const page = (todos) => `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>The project App</title>
  </head>
  <body>
    <h1>The project App</h1>
    <img src="/image" alt="Random image" style="max-width: 400px">
    <form method="POST" action="/todos">
      <input name="todo" maxlength="140" required>
      <button type="submit">Create todo</button>
    </form>
    <h2>Todo</h2>
    <ul>
      ${todos.filter((todo) => !todo.done).map((todo) => `<li>
        ${escapeHtml(todo.text)}
        <form method="POST" action="/todos/${todo.id}/done" style="display: inline">
          <button type="submit">Mark as done</button>
        </form>
      </li>`).join('\n      ')}
    </ul>
    <h2>Done</h2>
    <ul>
      ${todos.filter((todo) => todo.done).map((todo) => `<li>${escapeHtml(todo.text)}</li>`).join('\n      ')}
    </ul>
    <form method="POST" action="/break">
      <button type="submit">Break the app</button>
    </form>
    <p>DevOps with Kubernetes 2026</p>
  </body>
</html>`

const server = http.createServer(async (req, res) => {
  try {
    // Liveness probe
    if (req.method === 'GET' && req.url === '/healthz') {
      res.writeHead(isHealthy ? 200 : 500, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify({ status: isHealthy ? 'ok' : 'unhealthy' }))
    }
    // Readiness probe: healthy and the backend (and its database) answers
    if (req.method === 'GET' && req.url === '/ready') {
      const ready = isHealthy && await backendReady()
      res.writeHead(ready ? 200 : 500, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify({ status: ready ? 'ready' : 'not ready' }))
    }
    if (!isHealthy) {
      res.writeHead(500, { 'Content-Type': 'text/plain' })
      return res.end('The app is broken')
    }
    if (req.method === 'POST' && req.url === '/break') {
      isHealthy = false
      console.log('The app was broken on purpose')
      res.writeHead(302, { Location: '/' })
      return res.end()
    }
    if (req.method === 'GET' && req.url === '/') {
      await ensureImage()
      const todos = await fetchTodos()
      res.writeHead(200, { 'Content-Type': 'text/html' })
      return res.end(page(todos))
    }
    if (req.method === 'POST' && req.url === '/todos') {
      const text = new URLSearchParams(await readBody(req)).get('todo')
      if (text) await createTodo(text)
      res.writeHead(302, { Location: '/' })
      return res.end()
    }
    const doneMatch = req.url.match(/^\/todos\/(\d+)\/done$/)
    if (req.method === 'POST' && doneMatch) {
      await markDone(doneMatch[1])
      res.writeHead(302, { Location: '/' })
      return res.end()
    }
    if (req.method === 'GET' && req.url === '/image') {
      if (!fs.existsSync(imagePath)) await fetchImage()
      res.writeHead(200, { 'Content-Type': 'image/jpeg' })
      return fs.createReadStream(imagePath).pipe(res)
    }
    // For testing that the cached image survives a container crash
    if (req.method === 'GET' && req.url === '/shutdown') {
      res.end('Shutting down')
      return setTimeout(() => process.exit(1), 100)
    }
    res.writeHead(404)
    res.end('Not found')
  } catch (error) {
    console.error(error)
    res.writeHead(500)
    res.end('Internal server error')
  }
})

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
})

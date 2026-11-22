const http = require('http')

const PORT = process.env.PORT || 3000
const GREETING = process.env.GREETING || 'Hello'
const VERSION = process.env.VERSION || 'v1'

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    return res.end(`${GREETING} from ${VERSION}`)
  }
  res.writeHead(404)
  res.end('Not found')
})

server.listen(PORT, () => {
  console.log(`Greeter ${VERSION} started in port ${PORT}`)
})

const { connect, StringCodec } = require('nats')

const NATS_URL = process.env.NATS_URL
// When WEBHOOK_URL is not set the messages are only logged (used in staging)
const WEBHOOK_URL = process.env.WEBHOOK_URL
const NATS_SUBJECT = 'todos'
// All replicas join the same queue group, so each message is handled by only one of them
const QUEUE_GROUP = 'broadcaster'

if (!NATS_URL) throw new Error('Missing environment variable NATS_URL')

const sc = StringCodec()

const toMessage = ({ action, todo }) => {
  if (action === 'created') return `A todo was created: ${todo.text}`
  return `A todo was marked as ${todo.done ? 'done' : 'not done'}: ${todo.text}`
}

const forward = async (message) => {
  if (!WEBHOOK_URL) {
    console.log(`[log only] ${message}`)
    return
  }
  const response = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user: 'bot', message }),
  })
  if (!response.ok) throw new Error(`Webhook responded ${response.status}`)
  console.log(`Forwarded: ${message}`)
}

const main = async () => {
  const nc = await connect({ servers: NATS_URL, maxReconnectAttempts: -1 })
  console.log(`Connected to NATS at ${NATS_URL}, ${WEBHOOK_URL ? 'forwarding to webhook' : 'logging only'}`)

  const subscription = nc.subscribe(NATS_SUBJECT, { queue: QUEUE_GROUP })
  for await (const msg of subscription) {
    try {
      await forward(toMessage(JSON.parse(sc.decode(msg.data))))
    } catch (error) {
      console.error('Could not forward message:', error.message)
    }
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

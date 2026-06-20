import { Hono } from 'hono'
import { serve } from '@hono/node-server'

const app = new Hono()

app.get('/', (c) => {
  return c.json({ message: '⚡ Hono server running via Vibe Code Editor!' })
})

app.get('/api/hello', (c) => {
  return c.json({ message: 'Hello from Hono!', timestamp: new Date().toISOString() })
})

serve({ fetch: app.fetch, port: 3001 }, (info) => {
  console.log(`Server listening on http://localhost:${info.port}`)
})

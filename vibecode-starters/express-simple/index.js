const express = require('express')

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: '⚡ Express server running via Vibe Code Editor!' })
})

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express!', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})

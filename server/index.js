import './env.js'
import express from 'express'
import compression from 'compression'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { existsSync } from 'node:fs'

import tutorialsRouter from './routes/tutorials.js'
import checkpointsRouter from './routes/checkpoints.js'
import executeRouter from './routes/execute.js'
import { errorHandler } from './middleware/errorHandler.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 3001

const app = express()

app.use(compression())
// event_log blobs can be large for long recordings.
app.use(express.json({ limit: '25mb' }))

app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.use('/api/tutorials', tutorialsRouter)
app.use('/api/checkpoints', checkpointsRouter)
app.use('/api/execute', executeRouter)

// In production, serve the built SPA and fall back to index.html for client routes.
if (process.env.NODE_ENV === 'production') {
  const distDir = resolve(__dirname, '../client/dist')
  if (existsSync(distDir)) {
    app.use(express.static(distDir))
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api/')) return next()
      res.sendFile(resolve(distDir, 'index.html'))
    })
  }
}

app.use(errorHandler)

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`CodeCast API listening on http://localhost:${PORT}`)
})

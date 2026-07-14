import { Router } from 'express'
import { v4 as uuid } from 'uuid'
import db from '../db/init.js'
import { httpError } from '../middleware/errorHandler.js'

const router = Router()

const LANGUAGES = new Set(['python', 'cpp', 'sql'])

/** GET /api/tutorials?status=published — list (studio omits the filter). */
router.get('/', (req, res) => {
  const { status } = req.query
  let rows
  if (status) {
    if (!['draft', 'published'].includes(status)) {
      throw httpError(400, 'Invalid status filter')
    }
    rows = db
      .prepare(
        `SELECT id, title, description, language, status, duration_ms, created_at, updated_at
         FROM tutorials WHERE status = ? ORDER BY updated_at DESC`
      )
      .all(status)
  } else {
    rows = db
      .prepare(
        `SELECT id, title, description, language, status, duration_ms, created_at, updated_at
         FROM tutorials ORDER BY updated_at DESC`
      )
      .all()
  }
  res.json(rows)
})

/** GET /api/tutorials/:id — full tutorial incl. event_log + checkpoints[]. */
router.get('/:id', (req, res) => {
  const tutorial = db.prepare('SELECT * FROM tutorials WHERE id = ?').get(req.params.id)
  if (!tutorial) throw httpError(404, 'Tutorial not found')

  const checkpoints = db
    .prepare('SELECT * FROM checkpoints WHERE tutorial_id = ? ORDER BY timestamp_ms ASC')
    .all(tutorial.id)

  res.json({
    ...tutorial,
    event_log: tutorial.event_log ? JSON.parse(tutorial.event_log) : [],
    checkpoints,
  })
})

/** POST /api/tutorials — create draft shell {title, description, language} -> {id}. */
router.post('/', (req, res) => {
  const { title, description = '', language } = req.body || {}
  if (!title || !title.trim()) throw httpError(400, 'Title is required')
  if (!LANGUAGES.has(language)) throw httpError(400, 'Invalid or missing language')

  const id = uuid()
  db.prepare(
    `INSERT INTO tutorials (id, title, description, language, status)
     VALUES (?, ?, ?, ?, 'draft')`
  ).run(id, title.trim(), description, language)

  res.status(201).json({ id })
})

/**
 * PATCH /api/tutorials/:id — save event_log + duration_ms, OR flip status to
 * 'published', OR update metadata. All fields optional; only provided ones change.
 */
router.patch('/:id', (req, res) => {
  const tutorial = db.prepare('SELECT id FROM tutorials WHERE id = ?').get(req.params.id)
  if (!tutorial) throw httpError(404, 'Tutorial not found')

  const { title, description, event_log, duration_ms, status } = req.body || {}
  const sets = []
  const values = []

  if (title !== undefined) {
    if (!title.trim()) throw httpError(400, 'Title cannot be empty')
    sets.push('title = ?')
    values.push(title.trim())
  }
  if (description !== undefined) {
    sets.push('description = ?')
    values.push(description)
  }
  if (event_log !== undefined) {
    sets.push('event_log = ?')
    values.push(typeof event_log === 'string' ? event_log : JSON.stringify(event_log))
  }
  if (duration_ms !== undefined) {
    sets.push('duration_ms = ?')
    values.push(duration_ms)
  }
  if (status !== undefined) {
    if (!['draft', 'published'].includes(status)) throw httpError(400, 'Invalid status')
    sets.push('status = ?')
    values.push(status)
  }

  if (sets.length === 0) throw httpError(400, 'No fields to update')

  sets.push("updated_at = CURRENT_TIMESTAMP")
  values.push(req.params.id)

  db.prepare(`UPDATE tutorials SET ${sets.join(', ')} WHERE id = ?`).run(...values)
  res.json({ ok: true })
})

/** DELETE /api/tutorials/:id — cascade delete tutorial + checkpoints. */
router.delete('/:id', (req, res) => {
  const info = db.prepare('DELETE FROM tutorials WHERE id = ?').run(req.params.id)
  if (info.changes === 0) throw httpError(404, 'Tutorial not found')
  res.json({ ok: true })
})

export default router

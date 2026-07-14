import { Router } from 'express'
import { v4 as uuid } from 'uuid'
import db from '../db/init.js'
import { httpError } from '../middleware/errorHandler.js'

const router = Router()

/** POST /api/checkpoints — create a checkpoint on a tutorial. */
router.post('/', (req, res) => {
  const { tutorial_id, timestamp_ms, title, objective, correct_output_delta } = req.body || {}

  if (!tutorial_id) throw httpError(400, 'tutorial_id is required')
  if (typeof timestamp_ms !== 'number') throw httpError(400, 'timestamp_ms must be a number')
  if (!title || !title.trim()) throw httpError(400, 'Title is required')
  if (!objective || !objective.trim()) throw httpError(400, 'Objective is required')
  if (correct_output_delta === undefined || correct_output_delta === null) {
    throw httpError(400, 'correct_output_delta is required')
  }

  const exists = db.prepare('SELECT id FROM tutorials WHERE id = ?').get(tutorial_id)
  if (!exists) throw httpError(404, 'Tutorial not found')

  const id = uuid()
  db.prepare(
    `INSERT INTO checkpoints (id, tutorial_id, timestamp_ms, title, objective, correct_output_delta)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(id, tutorial_id, Math.round(timestamp_ms), title.trim(), objective.trim(), correct_output_delta)

  const checkpoint = db.prepare('SELECT * FROM checkpoints WHERE id = ?').get(id)
  res.status(201).json(checkpoint)
})

/** PATCH /api/checkpoints/:id — edit an existing checkpoint. */
router.patch('/:id', (req, res) => {
  const checkpoint = db.prepare('SELECT id FROM checkpoints WHERE id = ?').get(req.params.id)
  if (!checkpoint) throw httpError(404, 'Checkpoint not found')

  const { timestamp_ms, title, objective, correct_output_delta } = req.body || {}
  const sets = []
  const values = []

  if (timestamp_ms !== undefined) {
    if (typeof timestamp_ms !== 'number') throw httpError(400, 'timestamp_ms must be a number')
    sets.push('timestamp_ms = ?')
    values.push(Math.round(timestamp_ms))
  }
  if (title !== undefined) {
    if (!title.trim()) throw httpError(400, 'Title cannot be empty')
    sets.push('title = ?')
    values.push(title.trim())
  }
  if (objective !== undefined) {
    if (!objective.trim()) throw httpError(400, 'Objective cannot be empty')
    sets.push('objective = ?')
    values.push(objective.trim())
  }
  if (correct_output_delta !== undefined) {
    sets.push('correct_output_delta = ?')
    values.push(correct_output_delta)
  }

  if (sets.length === 0) throw httpError(400, 'No fields to update')
  values.push(req.params.id)

  db.prepare(`UPDATE checkpoints SET ${sets.join(', ')} WHERE id = ?`).run(...values)
  const updated = db.prepare('SELECT * FROM checkpoints WHERE id = ?').get(req.params.id)
  res.json(updated)
})

/** DELETE /api/checkpoints/:id */
router.delete('/:id', (req, res) => {
  const info = db.prepare('DELETE FROM checkpoints WHERE id = ?').run(req.params.id)
  if (info.changes === 0) throw httpError(404, 'Checkpoint not found')
  res.json({ ok: true })
})

export default router

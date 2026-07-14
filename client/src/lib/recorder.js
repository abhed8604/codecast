/**
 * Framework-free keystroke recorder. It knows nothing about React or Monaco —
 * the hook feeds it raw content-change deltas and execution outputs, timestamped
 * relative to when recording started.
 *
 * Events are Monaco content-change deltas (small), with an occasional `fullValue`
 * keyframe so backward scrubbing can resync cheaply instead of replaying from 0.
 */

import { KEYFRAME_INTERVAL } from './constants.js'

/**
 * @param {{ keyframeInterval?: number }} [opts]
 */
export function createRecorder({ keyframeInterval = KEYFRAME_INTERVAL } = {}) {
  /** @type {number|null} */
  let startTime = null
  /** @type {import('./types.js').ReplayEvent[]} */
  let events = []
  let editCount = 0

  const now = () => (startTime == null ? 0 : Math.round(performance.now() - startTime))

  return {
    /** Begin a fresh recording. Captures the starting editor value as a keyframe. */
    start(initialValue = '') {
      startTime = performance.now()
      events = [{ t: 0, type: 'edit', fullValue: initialValue }]
      editCount = 0
    },

    /**
     * @param {import('monaco-editor').editor.IModelContentChange[]} changes
     * @param {string} fullValue - current full editor value (used for keyframes)
     */
    recordEdit(changes, fullValue) {
      if (startTime == null) return
      editCount += 1
      /** @type {import('./types.js').ReplayEvent} */
      const ev = { t: now(), type: 'edit', changes }
      if (editCount % keyframeInterval === 0 && fullValue != null) {
        ev.fullValue = fullValue
      }
      events.push(ev)
    },

    /** Record a Run + its captured output. */
    recordExecution(output = '', error = '') {
      if (startTime == null) return
      events.push({ t: now(), type: 'execution', output, error })
    },

    getEvents() {
      return events
    },

    getElapsed() {
      return now()
    },

    /** Finish and return the serializable payload. */
    stop() {
      const duration_ms = now()
      const result = { events: events.slice(), duration_ms }
      startTime = null
      return result
    },
  }
}

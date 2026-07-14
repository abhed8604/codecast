/**
 * Framework-free replay engine. Operates directly on a Monaco text model,
 * applying recorded content-change deltas to reproduce the typing.
 *
 * Two entry points:
 *  - seekForward: cheap — apply pending edits between a cursor and a later time.
 *  - rebuildTo:   for backward/arbitrary scrub — reset to the nearest keyframe
 *                 (or empty) and replay deltas up to the target time.
 */

/** Apply one edit event's deltas atomically. Keyframe-only events are skipped. */
function applyEditEvent(model, ev) {
  if (!ev.changes || ev.changes.length === 0) return
  const ops = ev.changes.map((c) => ({ range: c.range, text: c.text, forceMoveMarkers: true }))
  model.applyEdits(ops)
}

/**
 * Apply edit events from `fromIndex` forward while their time <= targetTimeMs.
 * Execution events are ignored here (output is handled by the caller).
 *
 * @returns {number} the next index to process (the cursor)
 */
export function seekForward(model, eventLog, fromIndex, targetTimeMs) {
  let i = Math.max(0, fromIndex)
  for (; i < eventLog.length; i++) {
    const ev = eventLog[i]
    if (ev.t > targetTimeMs) break
    if (ev.type === 'edit') applyEditEvent(model, ev)
  }
  return i
}

/**
 * Rebuild the model state at `targetTimeMs` from scratch. Jumps to the nearest
 * preceding keyframe, then applies deltas up to the target.
 *
 * @returns {number} the next index to process (the cursor)
 */
export function rebuildTo(model, eventLog, targetTimeMs) {
  let keyframeValue = ''
  let startIdx = 0

  for (let i = 0; i < eventLog.length; i++) {
    const ev = eventLog[i]
    if (ev.t > targetTimeMs) break
    if (ev.type === 'edit' && ev.fullValue != null) {
      keyframeValue = ev.fullValue
      startIdx = i + 1
    }
  }

  model.setValue(keyframeValue)

  let i = startIdx
  for (; i < eventLog.length; i++) {
    const ev = eventLog[i]
    if (ev.t > targetTimeMs) break
    if (ev.type === 'edit') applyEditEvent(model, ev)
  }
  return i
}

/**
 * Rebuild the instructor's code at `targetTimeMs` using a throwaway model,
 * returning the resulting text. The model is always disposed.
 */
export function reconstructAt(monaco, eventLog, langId, targetTimeMs) {
  const model = monaco.editor.createModel('', langId)
  try {
    rebuildTo(model, eventLog, targetTimeMs)
    return model.getValue()
  } finally {
    model.dispose()
  }
}
/**
 * The most recent execution output at or before targetTimeMs. Kept here so the
 * output panel stays in sync with the same event stream driving the editor.
 *
 * @returns {{ output: string, error: string }|null}
 */
export function latestExecutionUpTo(eventLog, targetTimeMs) {
  let found = null
  for (let i = 0; i < eventLog.length; i++) {
    const ev = eventLog[i]
    if (ev.t > targetTimeMs) break
    if (ev.type === 'execution') found = ev
  }
  return found ? { output: found.output ?? '', error: found.error ?? '' } : null
}

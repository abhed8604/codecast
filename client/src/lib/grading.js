import { lastIndexAtOrBefore } from './seek.js'

/**
 * The core grading mechanic — output-diff only, no hidden test cases.
 * Everything here is pure and runs entirely client-side.
 */

/** Canonicalize output for tolerant comparison. */
export function normalize(str) {
  return String(str ?? '')
    .trim()
    .replace(/\r\n/g, '\n')
    .replace(/\n+$/, '')
    .toLowerCase()
}

/**
 * Output of the most recent 'execution' event at or before `timestampMs`,
 * or '' if there is none yet. Deterministic — identical for every student.
 *
 * @param {import('./types.js').ReplayEvent[]} eventLog
 * @param {number} timestampMs
 * @returns {string}
 */
export function getBaselineOutputAt(eventLog, timestampMs) {
  const executions = eventLog.filter((e) => e.type === 'execution')
  const idx = lastIndexAtOrBefore(executions, timestampMs)
  return idx >= 0 ? (executions[idx].output ?? '') : ''
}

/**
 * Suggested correct_output_delta for a checkpoint: the NEW output the student
 * must produce AFTER this checkpoint (i.e. between here and the next checkpoint,
 * or the end of the recording). This matches what the student actually writes,
 * since they start from the instructor's code at this checkpoint.
 *
 * @param {import('./types.js').ReplayEvent[]} eventLog
 * @param {number} checkpointMs - where the author dropped this checkpoint
 * @param {number} endMs - next checkpoint timestamp, or the recording duration
 * @returns {string}
 */
export function suggestDelta(eventLog, checkpointMs, endMs) {
  const atCp = normalize(getBaselineOutputAt(eventLog, checkpointMs))
  const atEnd = normalize(getBaselineOutputAt(eventLog, endMs))
  return atEnd.startsWith(atCp) ? atEnd.slice(atCp.length) : atEnd
}

/**
 * Grade a student's run at a checkpoint.
 *
 * The student starts from the instructor's code at the checkpoint (which produces
 * `baselineOutput` when run) and appends their own code. So their full output is
 * `baselineOutput` + their new output, and that new output must equal
 * `correctOutputDelta`.
 *
 * @param {string} fullRunOutput - stdout from running the student's whole program
 * @param {string} baselineOutput - output expected up to this checkpoint (deterministic)
 * @param {string} correctOutputDelta - the new output expected after this checkpoint
 * @returns {boolean}
 */
export function gradeRun(fullRunOutput, baselineOutput, correctOutputDelta) {
  const full = normalize(fullRunOutput)
  const delta = normalize(correctOutputDelta)
  const baseline = normalize(baselineOutput)
  if (delta === '') return full === baseline // nothing to add — must reproduce the baseline
  const rest = full.startsWith(baseline) ? full.slice(baseline.length).trim() : full
  return rest === delta
}

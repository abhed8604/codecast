import { useCallback } from 'react'
import { getBaselineOutputAt, gradeRun, suggestDelta } from '../lib/grading.js'

/**
 * Thin React wrapper around lib/grading.js. Binds the current tutorial's event
 * log so components can grade/suggest without re-passing it every call.
 *
 * @param {import('../lib/types.js').ReplayEvent[]} eventLog
 */
export function useGrading(eventLog = []) {
  const baselineAt = useCallback((ms) => getBaselineOutputAt(eventLog, ms), [eventLog])

  const grade = useCallback(
    (fullRunOutput, checkpointTimestampMs, correctOutputDelta) => {
      const baseline = getBaselineOutputAt(eventLog, checkpointTimestampMs)
      return gradeRun(fullRunOutput, baseline, correctOutputDelta)
    },
    [eventLog]
  )

  const suggest = useCallback(
    (checkpointMs, endMs) => suggestDelta(eventLog, checkpointMs, endMs),
    [eventLog]
  )

  return { baselineAt, grade, suggest }
}

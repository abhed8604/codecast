/**
 * Helpers for working with a tutorial's ordered checkpoints.
 */

/**
 * Timestamp (ms) of the first checkpoint strictly after `fromMs`, or `fallback`
 * when none remain. `epsilon` lets callers exclude the checkpoint sitting
 * exactly at `fromMs` (e.g. a 1ms margin when resuming from a boundary).
 */
export function nextCheckpointAfter(checkpoints, fromMs, fallback, epsilon = 0) {
  const after = checkpoints
    .filter((c) => c.timestamp_ms > fromMs + epsilon)
    .map((c) => c.timestamp_ms)
  return after.length ? Math.min(...after) : fallback
}

import { SEEK_TOLERANCE_MS } from './constants.js'

/** The checkpoint whose timestamp is within `tolerance` ms of `ms`, else null. */
export function cpAt(checkpoints, ms, tolerance = SEEK_TOLERANCE_MS) {
  return checkpoints.find((c) => Math.abs(c.timestamp_ms - ms) < tolerance) || null
}

/**
 * Binary-search helpers over a time-ordered event log. Recordings can contain
 * thousands of keystroke events, so backward scrubbing must not scan linearly.
 *
 * All functions assume `events` is sorted ascending by `.t`.
 */

/**
 * Index of the last event with `.t <= targetMs`, or -1 if none.
 * @param {{t:number}[]} events
 * @param {number} targetMs
 * @returns {number}
 */
export function lastIndexAtOrBefore(events, targetMs) {
  let lo = 0
  let hi = events.length - 1
  let ans = -1
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    if (events[mid].t <= targetMs) {
      ans = mid
      lo = mid + 1
    } else {
      hi = mid - 1
    }
  }
  return ans
}

/**
 * Index of the first event with `.t > afterMs`, or events.length if none.
 * @param {{t:number}[]} events
 * @param {number} afterMs
 * @returns {number}
 */
export function firstIndexAfter(events, afterMs) {
  return lastIndexAtOrBefore(events, afterMs) + 1
}

/**
 * The first event matching a predicate whose `.t` is strictly greater than afterMs.
 * Used to find the next execution event after resuming from a checkpoint.
 * @param {{t:number,type:string}[]} events
 * @param {number} afterMs
 * @param {(e:any)=>boolean} predicate
 * @returns {any|null}
 */
export function firstEventAfter(events, afterMs, predicate) {
  let i = firstIndexAfter(events, afterMs)
  for (; i < events.length; i++) {
    if (predicate(events[i])) return events[i]
  }
  return null
}

import { useCallback, useEffect, useRef, useState } from 'react'
import { seekForward, rebuildTo } from '../lib/replayer.js'
import { CLOCK_THROTTLE_MS } from '../lib/constants.js'

/**
 * Thin React wrapper around lib/replayer.js. Drives the replay clock with
 * requestAnimationFrame, applies edits to the attached Monaco model, and mirrors
 * the clock to React state throttled to ~60ms so UI stays smooth without
 * re-rendering on every frame.
 *
 * @param {{ eventLog: import('../lib/types.js').ReplayEvent[], durationMs: number }} args
 */
export function useReplayer({ eventLog, durationMs }) {
  const modelRef = useRef(null)
  const clockRef = useRef(0)
  const cursorRef = useRef(0) // next event index for cheap forward seeking
  const rafRef = useRef(null)
  const lastFrameRef = useRef(0)
  const limitRef = useRef(durationMs)
  const onLimitRef = useRef(null)
  const lastWriteRef = useRef(0)

  const [isPlaying, setIsPlaying] = useState(false)
  const [clockMs, setClockMs] = useState(0)

  const attach = useCallback((editor) => {
    modelRef.current = editor.getModel()
  }, [])

  /** Drop the model reference (call before the attached editor unmounts so the
   * rAF loop can keep advancing the clock without touching a disposed model). */
  const detach = useCallback(() => {
    modelRef.current = null
  }, [])

  const applyClock = useCallback(
    (ms, forceRebuild = false) => {
      const model = modelRef.current
      if (!model) {
        clockRef.current = ms
        return
      }
      if (!forceRebuild && ms >= clockRef.current) {
        cursorRef.current = seekForward(model, eventLog, cursorRef.current, ms)
      } else {
        cursorRef.current = rebuildTo(model, eventLog, ms)
      }
      clockRef.current = ms
    },
    [eventLog]
  )

  const pushClock = useCallback((ms, force = false) => {
    const now = performance.now()
      if (force || now - lastWriteRef.current > CLOCK_THROTTLE_MS) {
      lastWriteRef.current = now
      setClockMs(ms)
    }
  }, [])

  const stop = useCallback(() => {
    setIsPlaying(false)
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
  }, [])

  const frame = useCallback(
    (ts) => {
      const dt = ts - lastFrameRef.current
      lastFrameRef.current = ts
      let next = clockRef.current + dt
      const limit = limitRef.current
      let reached = false
      if (next >= limit) {
        next = limit
        reached = true
      }
      applyClock(next)
      pushClock(next, reached)
      if (reached) {
        stop()
        const cb = onLimitRef.current
        onLimitRef.current = null
        cb?.(next)
      } else {
        rafRef.current = requestAnimationFrame(frame)
      }
    },
    [applyClock, pushClock, stop]
  )

  /** Play until `limitMs` (defaults to full duration); onLimit fires on arrival. */
  const play = useCallback(
    (limitMs, onLimit) => {
      const limit = limitMs == null ? durationMs : Math.min(limitMs, durationMs)
      limitRef.current = limit
      onLimitRef.current = onLimit || null
      if (clockRef.current >= limit) {
        onLimit?.(clockRef.current)
        return
      }
      lastFrameRef.current = performance.now()
      setIsPlaying(true)
      rafRef.current = requestAnimationFrame(frame)
    },
    [durationMs, frame]
  )

  const pause = useCallback(() => stop(), [stop])

  /** Jump to an absolute time. `rebuild` forces a from-keyframe rebuild (used to
   * restore instructor state after the student mutated the editor). */
  const seek = useCallback(
    (ms, { rebuild = false } = {}) => {
      stop()
      const clamped = Math.max(0, Math.min(ms, durationMs))
      applyClock(clamped, rebuild)
      pushClock(clamped, true)
    },
    [applyClock, durationMs, pushClock, stop]
  )

  useEffect(() => () => stop(), [stop])

  return { attach, detach, play, pause, seek, isPlaying, clockMs, clockRef }
}

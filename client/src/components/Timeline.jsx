import { useCallback, useEffect, useRef, useState } from 'react'
import { PlayIcon, PauseIcon, FlagIcon } from './Icons.jsx'
import { formatDuration } from './Badges.jsx'
import { CheckpointStatus } from '../lib/types.js'

const markerColor = {
  [CheckpointStatus.PASSED]: 'bg-success ring-success/40',
  [CheckpointStatus.SKIPPED]: 'bg-[#EAB308] ring-[#EAB308]/40',
  pending: 'bg-ink-muted ring-ink-muted/40',
}

/**
 * Replay transport: play/pause + scrubbable track with colored checkpoint
 * markers. Scrub seeks are throttled during drag and finalized on release.
 *
 * `maxScrubMs` (optional) blocks scrubbing past an unresolved checkpoint.
 */
export default function Timeline({
  durationMs = 0,
  clockMs = 0,
  isPlaying = false,
  onPlayPause,
  onSeek,
  onMarkerClick,
  checkpoints = [],
  progress = {},
  maxScrubMs = null,
  showTransport = true,
}) {
  const trackRef = useRef(null)
  const draggingRef = useRef(false)
  const lastEmitRef = useRef(0)
  const [hoverPct, setHoverPct] = useState(null)

  const pct = durationMs > 0 ? Math.min(100, (clockMs / durationMs) * 100) : 0

  const posToMs = useCallback(
    (clientX) => {
      const el = trackRef.current
      if (!el) return 0
      const rect = el.getBoundingClientRect()
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      let ms = ratio * durationMs
      if (maxScrubMs != null) ms = Math.min(ms, maxScrubMs)
      return ms
    },
    [durationMs, maxScrubMs]
  )

  const emitSeek = useCallback(
    (ms, { throttle = false } = {}) => {
      if (throttle) {
        const now = performance.now()
        if (now - lastEmitRef.current < 50) return
        lastEmitRef.current = now
      }
      onSeek?.(ms)
    },
    [onSeek]
  )

  const onPointerDown = (e) => {
    draggingRef.current = true
    e.currentTarget.setPointerCapture?.(e.pointerId)
    emitSeek(posToMs(e.clientX))
  }

  useEffect(() => {
    function move(e) {
      const rect = trackRef.current?.getBoundingClientRect()
      if (rect) {
        setHoverPct(Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)))
      }
      if (!draggingRef.current) return
      emitSeek(posToMs(e.clientX), { throttle: true })
    }
    function up(e) {
      if (!draggingRef.current) return
      draggingRef.current = false
      emitSeek(posToMs(e.clientX)) // final, un-throttled
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
  }, [emitSeek, posToMs])

  const blockedPct = maxScrubMs != null && durationMs > 0 ? (maxScrubMs / durationMs) * 100 : null

  return (
    <div className="flex items-center gap-4">
      {showTransport && (
        <button
          onClick={onPlayPause}
          className="btn btn-primary grid h-11 w-11 shrink-0 place-items-center !rounded-full !p-0"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <PauseIcon className="text-xl" /> : <PlayIcon className="text-xl" />}
        </button>
      )}

      <span className="mono w-12 shrink-0 text-right text-xs text-ink-muted">
        {formatDuration(clockMs)}
      </span>

      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onMouseLeave={() => setHoverPct(null)}
        className="group relative h-9 flex-1 cursor-pointer select-none"
        role="slider"
        aria-label="Replay position"
        aria-valuemin={0}
        aria-valuemax={durationMs}
        aria-valuenow={clockMs}
      >
        {/* track */}
        <div className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-surface-2">
          {/* blocked-zone shading */}
          {blockedPct != null && blockedPct < 100 && (
            <div
              className="absolute inset-y-0 bg-danger/10"
              style={{ left: `${blockedPct}%`, right: 0 }}
            />
          )}
          {/* progress fill */}
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet-deep to-violet-primary"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* hover preview tick */}
        {hoverPct != null && (
          <div
            className="pointer-events-none absolute top-1/2 h-3 w-0.5 -translate-y-1/2 rounded bg-violet-glow/40"
            style={{ left: `${hoverPct}%` }}
          />
        )}

        {/* checkpoint markers */}
        {checkpoints.map((cp) => {
          const left = durationMs > 0 ? (cp.timestamp_ms / durationMs) * 100 : 0
          const status = progress[cp.id] || 'pending'
          return (
            <button
              key={cp.id}
              onClick={(e) => {
                e.stopPropagation()
                onMarkerClick?.(cp)
              }}
              title={cp.title}
              className="absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${left}%` }}
            >
              <span
                className={`block h-3 w-3 rounded-full ring-2 ring-void transition-transform hover:scale-125 ${markerColor[status]}`}
              />
            </button>
          )
        })}

        {/* playhead handle */}
        <div
          className="pointer-events-none absolute top-1/2 z-20 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-glow shadow-[0_0_12px_rgba(196,181,253,0.6)] ring-2 ring-void"
          style={{ left: `${pct}%` }}
        />
      </div>

      <span className="mono w-12 shrink-0 text-xs text-ink-muted">
        {formatDuration(durationMs)}
      </span>

      {checkpoints.length > 0 && (
        <span className="mono hidden shrink-0 items-center gap-1.5 text-xs text-ink-muted sm:inline-flex">
          <FlagIcon className="text-sm text-violet-glow" /> {checkpoints.length}
        </span>
      )}
    </div>
  )
}

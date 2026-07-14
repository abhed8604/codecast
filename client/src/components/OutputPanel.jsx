import { motion, AnimatePresence } from 'framer-motion'
import { TerminalIcon, AlertIcon } from './Icons.jsx'

/**
 * Terminal-style output surface. Renders loading (shimmer), empty, success, and
 * error states — never just a static success box.
 */
export default function OutputPanel({ output, error, status, running, className = '' }) {
  const hasError = status === 'error' || (!!error && !running)
  const hasContent = !!output || !!error

  return (
    <div
      className={`flex min-h-0 flex-col overflow-hidden rounded-card bg-void ring-1 ring-violet-primary/12 ${className}`}
    >
      <div className="flex items-center justify-between border-b border-violet-primary/10 px-4 py-2.5">
        <span className="mono inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] text-ink-muted">
          <TerminalIcon className="text-sm" /> Output
        </span>
        {!running && hasContent && (
          <span
            className={`mono text-[11px] uppercase tracking-wider ${
              hasError ? 'text-danger' : 'text-success'
            }`}
          >
            {hasError ? 'error' : 'ok'}
          </span>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hide p-4">
        <AnimatePresence mode="wait">
          {running ? (
            <motion.div
              key="running"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {[80, 55, 68].map((w, i) => (
                <div
                  key={i}
                  className="relative h-3.5 overflow-hidden rounded bg-surface-2"
                  style={{ width: `${w}%` }}
                >
                  <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-violet-primary/15 to-transparent" />
                </div>
              ))}
              <p className="mono pt-1 text-xs text-ink-muted">Running in sandbox...</p>
            </motion.div>
          ) : !hasContent ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mono flex h-full items-center text-sm text-ink-faint"
            >
              <span>Run the code to see output here.</span>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {output && (
                <pre className="mono whitespace-pre-wrap break-words text-sm leading-relaxed text-ink">
                  {output}
                </pre>
              )}
              {error && (
                <div className="rounded-lg bg-danger/8 p-3 ring-1 ring-danger/20">
                  <span className="mono mb-1 flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-danger">
                    <AlertIcon className="text-sm" /> stderr
                  </span>
                  <pre className="mono whitespace-pre-wrap break-words text-sm leading-relaxed text-[#fca5a5]">
                    {error}
                  </pre>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

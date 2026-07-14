import { AnimatePresence, motion } from 'framer-motion'
import { RunIcon, CheckIcon, XIcon, SkipIcon, ArrowRightIcon, FlagIcon } from './Icons.jsx'

const sheetVariants = {
  hidden: { y: '110%' },
  visible: { y: 0, transition: { type: 'spring', stiffness: 260, damping: 30 } },
  exit: { y: '110%', transition: { duration: 0.25 } },
}

/**
 * The checkpoint challenge — a bottom sheet (not a centered pop-out) so the
 * editor stays visible while the student works. Shows the objective, run
 * feedback, and the Continue/Skip actions.
 */
export default function ChallengePanel({
  open,
  checkpoint,
  index,
  total,
  running,
  result, // null | { passed: boolean }
  canContinue,
  onRun,
  onContinue,
  onSkip,
}) {
  return (
    <AnimatePresence>
      {open && checkpoint && (
        <motion.aside
          variants={sheetVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="sheet-panel fixed inset-x-0 bottom-0 z-40 px-4 pb-6 pt-5 md:px-8"
          role="dialog"
          aria-label="Checkpoint challenge"
        >
          <div className="mx-auto max-w-[1400px]">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-violet-primary/25" />

            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <span className="mono inline-flex items-center gap-1.5 rounded-full bg-violet-primary/12 px-2.5 py-0.5 text-[11px] uppercase tracking-wider text-violet-glow ring-1 ring-violet-primary/20">
                    <FlagIcon className="text-xs" /> Checkpoint {index}
                    {total ? ` / ${total}` : ''}
                  </span>
                </div>
                <h3 className="font-display text-2xl font-semibold tracking-tight text-ink">
                  {checkpoint.title}
                </h3>
                <p className="mt-2 max-w-[70ch] text-[15px] leading-relaxed text-ink-muted">
                  {checkpoint.objective}
                </p>

                <AnimatePresence mode="wait">
                  {result && !running && (
                    <motion.div
                      key={result.passed ? 'pass' : 'fail'}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`mt-4 inline-flex items-center gap-2 rounded-control px-3 py-1.5 text-sm font-medium ring-1 ${
                        result.passed
                          ? 'bg-success/10 text-success ring-success/25'
                          : 'bg-danger/10 text-danger ring-danger/25'
                      }`}
                    >
                      {result.passed ? (
                        <>
                          <CheckIcon className="text-base" /> Output matches — nicely done.
                        </>
                      ) : (
                        <>
                          <XIcon className="text-base" /> Not quite — output doesn&apos;t match yet.
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-3">
                <button onClick={onRun} disabled={running} className="btn btn-ghost">
                  <RunIcon className="text-base" />
                  {running ? 'Running...' : 'Run'}
                  <kbd className="mono ml-1 hidden rounded bg-void/60 px-1.5 py-0.5 text-[10px] text-ink-muted sm:inline">
                    Ctrl+Enter
                  </kbd>
                </button>
                <button onClick={onSkip} className="btn btn-ghost">
                  <SkipIcon className="text-base" /> Skip
                </button>
                <button
                  onClick={onContinue}
                  disabled={!canContinue}
                  className="btn btn-primary"
                  title={canContinue ? 'Resume playback' : 'Pass a run to continue'}
                >
                  Continue <ArrowRightIcon className="text-base" />
                </button>
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

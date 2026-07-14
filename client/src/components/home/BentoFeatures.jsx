import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SpotlightCard from '../SpotlightCard.jsx'
import Typewriter from '../Typewriter.jsx'
import { CodeIcon, FlagIcon, TerminalIcon, ShieldIcon, WandIcon, CheckIcon } from '../Icons.jsx'

/* ---------- per-card perpetual animations (isolated) ---------- */

function WatchTyper() {
  return (
    <div className="mono flex h-12 items-center overflow-hidden whitespace-nowrap rounded-control bg-void px-4 text-[14px] leading-relaxed ring-1 ring-violet-primary/15">
      <span className="text-ink-faint">{'> '}</span>
      <Typewriter
        phrases={['total = 0', 'for i in data:', '  total += i', 'return total']}
        typeSpeed={60}
        deleteSpeed={24}
        hold={1100}
      />
    </div>
  )
}

function CheckpointPulse() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    let a
    const loop = () => {
      a = setTimeout(() => setShow(true), 1600)
      setTimeout(() => setShow(false), 1600 + 3000)
    }
    loop()
    const id = setInterval(loop, 6400)
    return () => {
      clearTimeout(a)
      clearInterval(id)
    }
  }, [])
  return (
    <div className="flex h-9 items-center gap-3">
      <span className="relative flex h-3 w-3 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-glow/60" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-violet-glow" />
      </span>
      <span className="mono text-sm text-ink">lesson paused at a checkpoint</span>
      <AnimatePresence>
        {show && (
          <motion.span
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { type: 'spring', stiffness: 420, damping: 14 },
            }}
            exit={{ opacity: 0, scale: 0.85 }}
            className="mono rounded-full bg-violet-primary/15 px-2.5 py-0.5 text-xs text-violet-glow ring-1 ring-violet-primary/30"
          >
            Checkpoint 3 / 5
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}

const STREAM = [
  '$ python lesson.py',
  '> replaying keystrokes…',
  '2 4 6 8 10',
  'output matches expected',
  '✓ checkpoint passed',
]

function StreamOutput() {
  const [n, setN] = useState(1)
  useEffect(() => {
    const id = setInterval(() => setN((v) => (v >= STREAM.length ? 0 : v + 1)), 900)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="mono h-[140px] space-y-1.5 overflow-hidden text-[13px]">
      {STREAM.slice(0, n).map((l, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          className={
            l.startsWith('✓')
              ? 'text-success'
              : l.startsWith('>')
                ? 'text-ink-faint'
                : l.startsWith('$')
                  ? 'text-violet-glow'
                  : 'text-ink'
          }
        >
          {l}
        </motion.div>
      ))}
      <span className="inline-block h-3.5 w-2 animate-blink bg-violet-glow align-middle" />
    </div>
  )
}

const CHECKS = [
  'output matches',
  'types correct',
  'no runtime errors',
  'runs in time',
  'edge cases',
]

function GradeList() {
  const [order, setOrder] = useState(CHECKS)
  useEffect(() => {
    const id = setInterval(() => setOrder((o) => [...o].sort(() => Math.random() - 0.5)), 1700)
    return () => clearInterval(id)
  }, [])
  return (
    <ul className="space-y-2">
      {order.map((c, i) => (
        <motion.li
          key={c}
          layout
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          className="flex items-center gap-2 rounded-control bg-surface-2 px-3 py-2 text-sm text-ink"
        >
          <CheckIcon className="text-sm text-success" />
          {c}
          <span className="mono ml-auto text-xs text-ink-faint">+{((i + 1) * 7.3).toFixed(1)}</span>
        </motion.li>
      ))}
    </ul>
  )
}

function CommandInput() {
  return (
    <div className="flex items-center gap-3 rounded-control bg-void px-4 py-3.5 ring-1 ring-violet-primary/15">
      <span className="mono text-violet-glow">›</span>
      <span className="mono block truncate text-[15px] text-ink">
        <Typewriter
          phrases={[
            'Teach "binary search"',
            'Record a Python lesson',
            'Add a checkpoint at 0:42',
            'Publish to your students',
          ]}
          typeSpeed={55}
          deleteSpeed={26}
          hold={1300}
        />
      </span>
      <span className="mono ml-auto hidden items-center gap-1.5 rounded bg-violet-primary/10 px-2 py-0.5 text-[10px] text-violet-glow sm:inline-flex">
        <span className="h-1.5 w-1.5 animate-blink rounded-full bg-violet-glow" /> processing
      </span>
    </div>
  )
}

/* ---------- layout ---------- */

function Card({ eyebrow, title, icon: Icon, children, className = '' }) {
  return (
    <SpotlightCard
      className={`group h-full rounded-panel bg-surface p-7 shadow-card ring-1 ring-violet-primary/10 ${className}`}
    >
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-violet-primary/12 text-violet-glow ring-1 ring-violet-primary/20">
          <Icon className="text-xl" />
        </span>
        <div>
          <p className="mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">{eyebrow}</p>
          <h3 className="font-display text-xl font-semibold tracking-tight text-ink">{title}</h3>
        </div>
      </div>
      {children}
    </SpotlightCard>
  )
}

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default function BentoFeatures() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-20 md:px-8 md:py-28">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={reveal}
        className="mb-12 max-w-2xl"
      >
        <p className="mono mb-3 text-[12px] uppercase tracking-[0.2em] text-violet-glow">
          Why CodeCast
        </p>
        <h2 className="font-display text-4xl font-semibold tracking-tighter text-ink md:text-5xl">
          A lesson that types, pauses, and grades itself.
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          custom={0}
          className="lg:col-span-2"
        >
          <Card eyebrow="Replay engine" title="Watch it type itself" icon={CodeIcon}>
            <WatchTyper />
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">
              Every keystroke is captured with its timestamp, then replayed so students see the code
              come to life — not a flat screencast.
            </p>
          </Card>
        </motion.div>

        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          custom={1}
          className="lg:col-span-1"
        >
          <Card eyebrow="Checkpoints" title="Pause and solve" icon={FlagIcon}>
            <CheckpointPulse />
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">
              Playback stops exactly where the student should take over.
            </p>
          </Card>
        </motion.div>

        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          custom={2}
          className="lg:col-span-2"
        >
          <Card eyebrow="Real execution" title="Runs in a sandbox" icon={TerminalIcon}>
            <StreamOutput />
          </Card>
        </motion.div>

        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          custom={3}
          className="lg:col-span-1"
        >
          <Card eyebrow="Auto-grading" title="Graded on the fly" icon={ShieldIcon}>
            <GradeList />
          </Card>
        </motion.div>

        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          custom={4}
          className="lg:col-span-3"
        >
          <Card eyebrow="Authoring" title="Publish in minutes" icon={WandIcon}>
            <CommandInput />
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">
              Type what you want to teach. Record once, drop checkpoints, and ship a playable
              lesson.
            </p>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

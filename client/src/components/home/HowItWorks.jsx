import { motion } from 'framer-motion'
import { RecordIcon, PlayCircleIcon, FlagIcon } from '../Icons.jsx'

const STEPS = [
  {
    n: '01',
    icon: RecordIcon,
    title: 'Record the act of coding',
    body: 'Open Studio and type. Every keystroke and run is captured with its timestamp — no camera, no editing.',
  },
  {
    n: '02',
    icon: PlayCircleIcon,
    title: 'Students watch it type',
    body: 'Playback reproduces your typing exactly, so the logic unfolds the way you built it — line by line.',
  },
  {
    n: '03',
    icon: FlagIcon,
    title: 'They write the checkpoint',
    body: 'At each flag, playback stops. The student writes real code that must run and match the expected output to continue.',
  },
]

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-20 md:px-8 md:py-28">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={reveal}
        className="mb-16 max-w-2xl"
      >
        <p className="mono mb-3 text-[12px] uppercase tracking-[0.2em] text-violet-glow">
          How it works
        </p>
        <h2 className="font-display text-4xl font-semibold tracking-tighter text-ink md:text-5xl">
          Three moves, from blank file to lesson.
        </h2>
      </motion.div>

      <div className="space-y-6">
        {STEPS.map((s, i) => {
          const Icon = s.icon
          const flipped = i % 2 === 1
          return (
            <motion.div
              key={s.n}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={reveal}
              className={`grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_1fr] ${
                flipped ? 'lg:[&>*:first-child]:order-2' : ''
              }`}
            >
              {/* copy */}
              <div className={flipped ? 'lg:pl-12' : 'lg:pr-12'}>
                <div className="mb-4 flex items-center gap-4">
                  <span className="font-display text-3xl font-semibold text-violet-primary/40">
                    {s.n}
                  </span>
                  <span className="h-px flex-1 bg-gradient-to-r from-violet-primary/30 to-transparent" />
                </div>
                <div className="mb-4 inline-grid h-12 w-12 place-items-center rounded-2xl bg-violet-primary/12 text-violet-glow ring-1 ring-violet-primary/20">
                  <Icon className="text-2xl" />
                </div>
                <h3 className="mb-3 font-display text-2xl font-semibold tracking-tight text-ink">
                  {s.title}
                </h3>
                <p className="max-w-[44ch] text-[15px] leading-relaxed text-ink-muted">{s.body}</p>
              </div>

              {/* decorative panel */}
              <div className="relative">
                <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[32px] bg-violet-primary/8 blur-2xl" />
                <div className="frost flex h-44 items-center justify-center rounded-panel p-6 shadow-card">
                  <StepVisual step={i} />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

function StepVisual({ step }) {
  if (step === 0) {
    return (
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-danger/10 px-4 py-2 ring-1 ring-danger/25">
          <span className="h-2.5 w-2.5 animate-blink rounded-full bg-danger" />
          <span className="mono text-sm font-medium text-danger">REC</span>
        </span>
        <span className="mono text-sm text-ink-muted">recording keystrokes…</span>
      </div>
    )
  }
  if (step === 1) {
    return (
      <pre className="mono w-full whitespace-pre-wrap text-[13px] leading-relaxed text-ink">
        <span className="text-violet-glow">def </span>
        <span className="text-ink">sum_even(nums):</span>
        {'\n'}
        <span className="text-ink-faint">{'  '}# typing out live…</span>
        <span className="ml-1 inline-block h-3.5 w-2 animate-blink bg-violet-glow align-middle" />
      </pre>
    )
  }
  return (
    <div className="flex w-full items-center justify-between">
      <span className="mono inline-flex items-center gap-2 rounded-full bg-violet-primary/12 px-3 py-1.5 text-xs text-violet-glow ring-1 ring-violet-primary/25">
        Checkpoint 2 / 5
      </span>
      <span className="mono rounded-full bg-success/10 px-3 py-1.5 text-xs text-success ring-1 ring-success/25">
        ✓ passed
      </span>
    </div>
  )
}

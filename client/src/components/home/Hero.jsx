import { motion } from 'framer-motion'
import MagneticButton from '../MagneticButton.jsx'
import CodeTypingDemo from '../CodeTypingDemo.jsx'
import { ArrowRightIcon, PlayCircleIcon, SparkIcon } from '../Icons.jsx'

const LANGS = ['Python', 'C++', 'SQL', 'JavaScript', 'Go', 'Rust']

const rise = {
  hidden: { opacity: 0, y: 26 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default function Hero() {
  return (
    <section className="relative flex min-h-[90dvh] items-center overflow-hidden">
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-10 px-4 py-16 md:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left — copy */}
        <div className="max-w-2xl">
          <motion.span
            custom={0}
            variants={rise}
            initial="hidden"
            animate="visible"
            className="mono mb-6 inline-flex items-center gap-2 rounded-full border border-violet-primary/20 bg-violet-primary/10 px-3.5 py-1.5 text-[12px] uppercase tracking-[0.2em] text-violet-glow"
          >
            <SparkIcon className="text-sm" />
            Keystroke-native lessons
          </motion.span>

          <h1 className="font-display text-[13vw] font-semibold leading-[0.95] tracking-tighter text-ink sm:text-7xl md:text-[5.4rem]">
            <motion.span
              custom={1}
              variants={rise}
              initial="hidden"
              animate="visible"
              className="block"
            >
              Code that
            </motion.span>
            <motion.span
              custom={2}
              variants={rise}
              initial="hidden"
              animate="visible"
              className="block text-stroke-gradient animate-gradient-pan"
            >
              writes itself
            </motion.span>
            <motion.span
              custom={2.4}
              variants={rise}
              initial="hidden"
              animate="visible"
              className="block text-violet-primary"
            >
              .
            </motion.span>
          </h1>

          <motion.p
            custom={3}
            variants={rise}
            initial="hidden"
            animate="visible"
            className="mt-7 max-w-[56ch] text-lg leading-relaxed text-ink-muted"
          >
            Instructors record the act of typing, not a video. Watch the code appear keystroke by
            keystroke, then stop at every checkpoint and write real code that has to run and match
            before the lesson moves on.
          </motion.p>

          <motion.div
            custom={4}
            variants={rise}
            initial="hidden"
            animate="visible"
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <MagneticButton to="/lecture/student" variant="primary">
              <PlayCircleIcon className="text-base" /> Start as student
            </MagneticButton>
            <MagneticButton to="/lecture/studio" variant="ghost">
              Open Studio <ArrowRightIcon className="text-base" />
            </MagneticButton>
          </motion.div>

          <motion.div
            custom={5}
            variants={rise}
            initial="hidden"
            animate="visible"
            className="mt-10 flex flex-wrap items-center gap-2"
          >
            {LANGS.map((l) => (
              <span
                key={l}
                className="mono rounded-full border border-violet-primary/12 bg-surface px-3 py-1 text-[12px] text-ink-muted"
              >
                {l}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Right — live demo */}
        <div className="relative">
          {/* Ambient backlight — fades in with the window so it never flashes
              at full strength while the frosted panel is still transparent. */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute -inset-10 -z-10 rounded-[48px] bg-violet-primary/25 blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute -bottom-6 left-4 right-4 -z-10 h-24 rounded-full bg-violet-deep/40 blur-2xl"
          />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-panel [box-shadow:0_0_70px_-12px_rgba(139,92,246,0.45)]"
          >
            <div className="animate-float">
              <CodeTypingDemo />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

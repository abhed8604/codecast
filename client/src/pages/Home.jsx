import { motion } from 'framer-motion'
import ModeCards from '../components/ModeCards.jsx'

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default function Home() {
  return (
    <div className="relative">
      <section className="relative min-h-[100dvh] overflow-hidden">
        <div className="mx-auto flex min-h-[100dvh] max-w-[1400px] flex-col justify-center px-4 py-24 md:px-8">
          {/* Asymmetric, left-aligned hero — no centered slab. */}
          <div className="max-w-3xl">
            <motion.span
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mono mb-6 inline-flex items-center gap-2 rounded-full border border-violet-primary/20 bg-violet-primary/10 px-3.5 py-1.5 text-[12px] uppercase tracking-[0.2em] text-violet-glow"
            >
              <span className="h-1.5 w-1.5 animate-blink rounded-full bg-violet-glow" />
              Keystroke-native lessons
            </motion.span>

            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="font-display text-[13vw] font-semibold leading-[0.95] tracking-tighter text-ink sm:text-7xl md:text-[5.5rem]"
            >
              Code that
              <br />
              <span className="text-violet-glow">writes itself</span>
              <span className="text-violet-primary">.</span>
            </motion.h1>

            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mt-7 max-w-[58ch] text-lg leading-relaxed text-ink-muted"
            >
              Instructors record the act of typing, not a video. Students watch the code appear
              keystroke by keystroke, then stop at each checkpoint and write real code that has to
              run and match the expected output before the lesson moves on.
            </motion.p>
          </div>

          {/* Mode select sits inside the hero flow, lower-left weighted. */}
          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-16 w-full max-w-4xl"
          >
            <ModeCards />
          </motion.div>
        </div>
      </section>
    </div>
  )
}

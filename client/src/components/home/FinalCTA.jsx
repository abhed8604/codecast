import { motion } from 'framer-motion'
import MagneticButton from '../MagneticButton.jsx'
import { ArrowRightIcon, SparkIcon } from '../Icons.jsx'

export default function FinalCTA() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-20 md:px-8 md:py-28">
      <div className="relative overflow-hidden rounded-modal bg-surface px-6 py-20 text-center shadow-card ring-1 ring-violet-primary/15 md:px-12">
        {/* ambient mesh glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-violet-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-40" />

        <motion.span
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mono mb-5 inline-flex items-center gap-2 rounded-full border border-violet-primary/20 bg-violet-primary/10 px-3.5 py-1.5 text-[12px] uppercase tracking-[0.2em] text-violet-glow"
        >
          <SparkIcon className="text-sm" />
          Ready when you are
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tighter text-ink md:text-6xl"
        >
          Turn the code in your head into a lesson that teaches itself.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <MagneticButton to="/lecture/studio" variant="primary">
            Record your first lesson <ArrowRightIcon className="text-base" />
          </MagneticButton>
          <MagneticButton to="/lecture/student" variant="ghost">
            Browse lessons
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  )
}

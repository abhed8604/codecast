import { motion } from 'framer-motion'

/**
 * On-brand empty state — composed, not a bare "no data" line. Frosted icon
 * medallion, clear copy, and a prominent CTA.
 */
export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 24 }}
      className="mx-auto flex max-w-md flex-col items-center rounded-panel bg-surface/60 px-8 py-16 text-center ring-1 ring-violet-primary/10"
    >
      {Icon && (
        <div className="mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-violet-primary/10 text-3xl text-violet-glow ring-1 ring-violet-primary/20">
          <Icon />
        </div>
      )}
      <h3 className="mb-2 font-display text-2xl font-medium tracking-tight text-ink">{title}</h3>
      {description && (
        <p className="mb-7 max-w-[42ch] text-[15px] leading-relaxed text-ink-muted">
          {description}
        </p>
      )}
      {action}
    </motion.div>
  )
}

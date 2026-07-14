import { motion } from 'framer-motion'

/**
 * Hover-lift card wrapper. Flat, honest hover state — scale + soft shadow +
 * violet border-glow. No tilt, no 3D. Used on tutorial list cards and the
 * Student/Studio mode-select cards.
 */
export default function Card({
  children,
  className = '',
  onClick,
  as = 'div',
  interactive = true,
}) {
  const Component = motion[as] || motion.div
  return (
    <Component
      onClick={onClick}
      whileHover={interactive ? { scale: 1.02 } : undefined}
      whileTap={interactive && onClick ? { scale: 0.985 } : undefined}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className={[
        'group relative rounded-card bg-surface p-6',
        'shadow-card ring-1 ring-violet-primary/10',
        interactive
          ? 'transition-shadow duration-300 hover:shadow-card-hover hover:ring-violet-primary/40'
          : '',
        onClick ? 'cursor-pointer' : '',
        className,
      ].join(' ')}
    >
      {children}
    </Component>
  )
}

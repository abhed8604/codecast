/**
 * Shared Framer Motion variants for staggered card grids (Studio / Student
 * list views). Import `grid` + `item` so the stagger timing stays
 * consistent across pages.
 */
export const grid = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

export const item = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 220, damping: 24 },
  },
}

import { useRef } from 'react'

/**
 * Card with a cursor-tracking radial border glow. The pointer position is
 * written straight to CSS custom props (--mx/--my) — no React state, no
 * re-renders. Pair with the `.spotlight` utility in index.css.
 */
export default function SpotlightCard({ children, className = '' }) {
  const ref = useRef(null)

  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <div ref={ref} onMouseMove={onMove} className={`spotlight ${className}`}>
      {children}
    </div>
  )
}

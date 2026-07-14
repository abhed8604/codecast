import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CodeIcon } from './Icons.jsx'

/**
 * Slim, sticky top bar. The one systemic z-index context for navigation.
 */
export default function Header() {
  const { pathname } = useLocation()
  const onHome = pathname === '/'

  return (
    <header className="sticky top-0 z-40 border-b border-violet-primary/10 bg-void/70 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.8)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 md:px-8">
        <Link to="/" className="group flex items-center gap-2.5" aria-label="CodeCast home">
          <motion.span
            whileHover={{ rotate: -8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="grid h-9 w-9 place-items-center rounded-control bg-violet-primary/15 text-lg text-violet-glow ring-1 ring-violet-primary/25"
          >
            <CodeIcon />
          </motion.span>
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            Code<span className="text-violet-glow">Cast</span>
          </span>
        </Link>

        {!onHome && (
          <nav className="flex items-center gap-1 text-sm">
            <NavLink to="/lecture/student" active={pathname.startsWith('/lecture/student')}>
              Student
            </NavLink>
            <NavLink to="/lecture/studio" active={pathname.startsWith('/lecture/studio')}>
              Studio
            </NavLink>
          </nav>
        )}
      </div>
    </header>
  )
}

function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className={[
        'rounded-control px-3.5 py-1.5 font-medium transition-colors',
        active
          ? 'bg-violet-primary/15 text-ink ring-1 ring-violet-primary/25'
          : 'text-ink-muted hover:text-ink',
      ].join(' ')}
    >
      {children}
    </Link>
  )
}

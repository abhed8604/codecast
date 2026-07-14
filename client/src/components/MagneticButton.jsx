import { Link } from 'react-router-dom'

/**
 * Styled link/button used for primary CTAs. Kept as a thin wrapper so call sites
 * don't change — no magnetic pull, just the standard `btn` styling.
 */
export default function MagneticButton({
  to,
  onClick,
  children,
  variant = 'primary',
  className = '',
}) {
  const cls = [
    'btn',
    variant === 'primary' ? 'btn-primary' : variant === 'ghost' ? 'btn-ghost' : '',
    className,
  ].join(' ')

  if (to) {
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    )
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  )
}

import { LANGUAGES } from '../lib/types.js'

const langStyles = {
  python: 'text-[#E9D5FF] bg-violet-primary/12 ring-violet-primary/20',
  cpp: 'text-[#C4B5FD] bg-violet-deep/25 ring-violet-primary/20',
  sql: 'text-[#A78BFA] bg-violet-primary/10 ring-violet-primary/20',
}

export function LanguageBadge({ language }) {
  const meta = LANGUAGES[language] || { label: language }
  return (
    <span
      className={`mono inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider ring-1 ${
        langStyles[language] || langStyles.python
      }`}
    >
      {meta.label}
    </span>
  )
}

export function StatusBadge({ status }) {
  const published = status === 'published'
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider ring-1 ${
        published
          ? 'bg-success/10 text-success ring-success/25'
          : 'bg-ink-faint/20 text-ink-muted ring-ink-faint/30'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${published ? 'bg-success' : 'bg-ink-muted'}`} />
      {published ? 'Published' : 'Draft'}
    </span>
  )
}

export function formatDuration(ms) {
  if (!ms || ms < 0) return '0:00'
  const total = Math.round(ms / 1000)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

/**
 * Curated inline SVG icon set — no emojis anywhere in the app, and no icon-font
 * dependency bloating the tiny Home/list bundles. Every icon shares a 24px box
 * and a global strokeWidth of 1.5 for visual consistency.
 */

const base = {
  width: '1em',
  height: '1em',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export const PlayIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M7 5.5v13l11-6.5-11-6.5Z" fill="currentColor" stroke="none" />
  </svg>
)

export const PauseIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="7" y="5" width="3.2" height="14" rx="1" fill="currentColor" stroke="none" />
    <rect x="13.8" y="5" width="3.2" height="14" rx="1" fill="currentColor" stroke="none" />
  </svg>
)

export const RecordIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="6" fill="currentColor" stroke="none" />
  </svg>
)

export const StopIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="6" y="6" width="12" height="12" rx="2.5" fill="currentColor" stroke="none" />
  </svg>
)

export const PlusIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const TrashIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-.7 12a2 2 0 0 1-2 1.9H8.7a2 2 0 0 1-2-1.9L6 7" />
    <path d="M10 11v5M14 11v5" />
  </svg>
)

export const CheckIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M4.5 12.5 10 18 20 6" />
  </svg>
)

export const XIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

export const ArrowRightIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const ArrowLeftIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
)

export const SkipIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M5 6v12l8-6-8-6Z" fill="currentColor" stroke="none" />
    <path d="M15 6v12" />
  </svg>
)

export const PencilIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3Z" />
    <path d="M13.5 6.5l3 3" />
  </svg>
)

export const FlagIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M6 21V4M6 4h11l-2 4 2 4H6" />
  </svg>
)

export const CodeIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13 6l-2 12" />
  </svg>
)

export const BookIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M5 5a2 2 0 0 1 2-2h11v16H7a2 2 0 0 0-2 2V5Z" />
    <path d="M5 19a2 2 0 0 1 2-2h11" />
  </svg>
)

export const SlidersIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M4 8h10M18 8h2M4 16h4M12 16h8" />
    <circle cx="15" cy="8" r="2.2" fill="var(--bg-surface)" />
    <circle cx="9.5" cy="16" r="2.2" fill="var(--bg-surface)" />
  </svg>
)

export const RunIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M6 4.5v15l12-7.5-12-7.5Z" fill="currentColor" stroke="none" />
  </svg>
)

export const TerminalIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2.5" />
    <path d="M7 9l3 3-3 3M13 15h4" />
  </svg>
)

export const AlertIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3 2.5 20h19L12 3Z" />
    <path d="M12 10v4M12 17.5v.01" />
  </svg>
)

export const SparkIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
  </svg>
)

export const ShieldIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3 5 6v6c0 4 3 6.5 7 9 4-2.5 7-5 7-9V6l-7-3Z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
)

export const WandIcon = (p) => (
  <svg {...base} {...p}>
    <path
      d="M15 5l1.5 3.5L20 10l-3.5 1.5L15 15l-1.5-3.5L10 10l3.5-1.5L15 5Z"
      fill="currentColor"
      stroke="none"
    />
    <path d="M5 19l3-3M4 14l1 1M6 20l1-1" />
  </svg>
)

export const PlayCircleIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M10 8.5v7l5-3.5-5-3.5Z" fill="currentColor" stroke="none" />
  </svg>
)

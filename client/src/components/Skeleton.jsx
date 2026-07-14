/**
 * Skeleton loaders shaped like the real content they replace. A single shimmer
 * sweep keeps them on-brand instead of a generic spinner.
 */

function Shimmer({ className = '' }) {
  return (
    <div className={`relative overflow-hidden rounded-lg bg-surface-2 ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-violet-primary/10 to-transparent" />
    </div>
  )
}

/** A card-shaped placeholder matching the tutorial list cards. */
export function CardSkeleton() {
  return (
    <div className="rounded-card bg-surface p-6 ring-1 ring-violet-primary/10">
      <Shimmer className="mb-4 h-5 w-16 rounded-full" />
      <Shimmer className="mb-3 h-6 w-3/4" />
      <Shimmer className="mb-2 h-4 w-full" />
      <Shimmer className="mb-6 h-4 w-2/3" />
      <div className="flex gap-3">
        <Shimmer className="h-9 w-24 rounded-control" />
        <Shimmer className="h-9 w-24 rounded-control" />
      </div>
    </div>
  )
}

export function ListSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

/** A full-panel placeholder for the editor routes while Monaco loads. */
export function EditorSkeleton({ label = 'Loading editor' }) {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="flex flex-col items-center gap-4 text-ink-muted">
        <Shimmer className="h-40 w-[min(680px,80vw)] rounded-panel" />
        <span className="mono text-sm tracking-wide">{label}...</span>
      </div>
    </div>
  )
}

export default Shimmer

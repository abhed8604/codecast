import CountUp from '../CountUp.jsx'

const STATS = [
  { value: 47200, suffix: '+', label: 'keystrokes replayed daily' },
  { value: 1280, suffix: '+', label: 'lessons authored' },
  { value: 94.6, decimals: 1, suffix: '%', label: 'checkpoints solved first try' },
  { value: 38, suffix: 'ms', label: 'median sandbox run' },
]

export default function StatsStrip() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-12 md:px-8">
      <div className="frost grid grid-cols-2 gap-8 rounded-panel px-8 py-10 shadow-card md:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="text-center md:text-left">
            <div className="font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">
              <CountUp to={s.value} decimals={s.decimals || 0} suffix={s.suffix || ''} />
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

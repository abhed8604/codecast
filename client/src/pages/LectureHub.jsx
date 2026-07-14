import ModeCards from '../components/ModeCards.jsx'

export default function LectureHub() {
  return (
    <div className="mx-auto max-w-[1100px] px-4 py-16 md:px-8 md:py-24">
      <div className="mb-10 max-w-2xl">
        <p className="mono mb-3 text-[12px] uppercase tracking-[0.2em] text-violet-glow">
          Choose a mode
        </p>
        <h1 className="font-display text-4xl font-semibold tracking-tighter text-ink md:text-5xl">
          Where do you want to start?
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
          Jump into published lessons as a student, or open the studio to record and author your
          own.
        </p>
      </div>
      <ModeCards />
    </div>
  )
}

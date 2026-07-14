import Hero from '../components/home/Hero.jsx'
import BentoFeatures from '../components/home/BentoFeatures.jsx'
import HowItWorks from '../components/home/HowItWorks.jsx'
import StatsStrip from '../components/home/StatsStrip.jsx'
import FinalCTA from '../components/home/FinalCTA.jsx'

export default function Home() {
  return (
    <div className="relative">
      {/* Ambient mesh-gradient + grid backdrop (decorative, non-interactive). */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-24 h-[34rem] w-[34rem] rounded-full bg-violet-deep/20 blur-[120px] animate-drift" />
        <div className="absolute top-1/4 -right-24 h-[30rem] w-[30rem] rounded-full bg-violet-primary/15 blur-[120px] animate-drift-slow" />
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-void" />
      </div>

      <Hero />
      <BentoFeatures />
      <HowItWorks />
      <StatsStrip />
      <FinalCTA />
    </div>
  )
}

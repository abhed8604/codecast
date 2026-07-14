import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Card from './Card.jsx'
import { BookIcon, SlidersIcon, ArrowRightIcon } from './Icons.jsx'

const MODES = [
  {
    to: '/lecture/student',
    icon: BookIcon,
    label: 'Student Mode',
    blurb: 'Watch code type itself out, then solve each checkpoint before playback resumes.',
    tag: 'Watch & solve',
  },
  {
    to: '/lecture/studio',
    icon: SlidersIcon,
    label: 'Studio Mode',
    blurb: 'Record your keystrokes, drop checkpoints at key moments, and publish playable lessons.',
    tag: 'Record & author',
  },
]

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 22 } },
}

/** The two-card mode selector, staggered in on mount. Shared by Home and LectureHub. */
export default function ModeCards() {
  const navigate = useNavigate()
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-6 md:grid-cols-2"
    >
      {MODES.map(({ to, icon: Icon, label, blurb, tag }) => (
        <motion.div key={to} variants={item}>
          <Card onClick={() => navigate(to)} className="h-full">
            <div className="flex h-full flex-col">
              <div className="mb-5 flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-primary/12 text-2xl text-violet-glow ring-1 ring-violet-primary/20">
                  <Icon />
                </span>
                <span className="mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
                  {tag}
                </span>
              </div>
              <h3 className="mb-2 font-display text-2xl font-semibold tracking-tight text-ink">
                {label}
              </h3>
              <p className="mb-6 max-w-[38ch] text-[15px] leading-relaxed text-ink-muted">
                {blurb}
              </p>
              <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-violet-glow transition-transform duration-300 group-hover:translate-x-1">
                Enter <ArrowRightIcon className="text-base" />
              </span>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}

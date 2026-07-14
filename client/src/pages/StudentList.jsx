import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { api } from '../api/client.js'
import Card from '../components/Card.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { ListSkeleton } from '../components/Skeleton.jsx'
import { LanguageBadge, formatDuration } from '../components/Badges.jsx'
import { BookIcon, PlayIcon, ArrowLeftIcon, CheckIcon } from '../components/Icons.jsx'
import { useTutorialStore } from '../store/useTutorialStore.js'

const grid = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}
const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 220, damping: 24 } },
}

function progressFor(tutorialId) {
  try {
    return JSON.parse(localStorage.getItem(`codecast:progress:${tutorialId}`) || '{}')
  } catch {
    return {}
  }
}

export default function StudentList() {
  const navigate = useNavigate()
  const [tutorials, setTutorials] = useState(null)
  const [error, setError] = useState(null)
  const pushToast = useTutorialStore((s) => s.pushToast)

  useEffect(() => {
    let alive = true
    api
      .listTutorials('published')
      .then((rows) => alive && setTutorials(rows))
      .catch((e) => {
        if (!alive) return
        setError(e.message)
        pushToast(e.message, 'error')
      })
    return () => {
      alive = false
    }
  }, [pushToast])

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 md:px-8">
      <button
        onClick={() => navigate('/lecture')}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
      >
        <ArrowLeftIcon className="text-base" /> Back
      </button>

      <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mono mb-2 text-[12px] uppercase tracking-[0.2em] text-violet-glow">
            Student Mode
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-tighter text-ink md:text-5xl">
            Published lessons
          </h1>
        </div>
        {tutorials?.length > 0 && (
          <p className="mono text-sm text-ink-muted">
            {tutorials.length} lesson{tutorials.length === 1 ? '' : 's'}
          </p>
        )}
      </header>

      {tutorials === null && !error && <ListSkeleton />}

      {tutorials !== null && tutorials.length === 0 && (
        <EmptyState
          icon={BookIcon}
          title="No lessons published yet"
          description="Once an instructor records and publishes a lesson in Studio Mode, it will show up here ready to play."
          action={
            <button onClick={() => navigate('/lecture/studio')} className="btn btn-primary">
              Open Studio Mode
            </button>
          }
        />
      )}

      {tutorials?.length > 0 && (
        <motion.div
          variants={grid}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
        >
          {tutorials.map((t) => {
            const progress = progressFor(t.id)
            const solved = Object.values(progress).filter((s) => s === 'passed').length
            return (
              <motion.div key={t.id} variants={item}>
                <Card onClick={() => navigate(`/lecture/student/${t.id}`)} className="h-full">
                  <div className="flex h-full flex-col">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <LanguageBadge language={t.language} />
                      <span className="mono text-xs text-ink-muted">
                        {formatDuration(t.duration_ms)}
                      </span>
                    </div>
                    <h3 className="mb-2 font-display text-xl font-semibold tracking-tight text-ink">
                      {t.title}
                    </h3>
                    <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-ink-muted">
                      {t.description || 'No description provided.'}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-violet-glow">
                        <PlayIcon className="text-base" /> Watch
                      </span>
                      {solved > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs text-success">
                          <CheckIcon className="text-sm" /> {solved} solved
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}

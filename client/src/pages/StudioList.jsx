import { lazy, Suspense, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { api } from '../api/client.js'
import Card from '../components/Card.jsx'
import Modal from '../components/Modal.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { ListSkeleton, EditorSkeleton } from '../components/Skeleton.jsx'
import { LanguageBadge, StatusBadge, formatDuration } from '../components/Badges.jsx'
import {
  SlidersIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  ArrowLeftIcon,
} from '../components/Icons.jsx'
import { useTutorialStore } from '../store/useTutorialStore.js'

// Lazy so Monaco stays out of the Studio bundle until recording starts.
const Record = lazy(() => import('../pages/Record.jsx'))

const grid = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }
const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 220, damping: 24 } },
}

export default function StudioList() {
  const navigate = useNavigate()
  const [tutorials, setTutorials] = useState(null)
  const [error, setError] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [recording, setRecording] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const pushToast = useTutorialStore((s) => s.pushToast)

  const load = () =>
    api
      .listTutorials()
      .then(setTutorials)
      .catch((e) => {
        setError(e.message)
        pushToast(e.message, 'error')
      })

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function confirmDelete() {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      await api.deleteTutorial(pendingDelete.id)
      pushToast('Lesson deleted', 'success')
      setPendingDelete(null)
      setTutorials((prev) => prev.filter((t) => t.id !== pendingDelete.id))
    } catch (e) {
      pushToast(e.message, 'error')
    } finally {
      setDeleting(false)
    }
  }

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
            Studio Mode
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-tighter text-ink md:text-5xl">
            Your lessons
          </h1>
        </div>
        <button
          onClick={() => setRecording(true)}
          className="btn btn-primary"
        >
          <PlusIcon className="text-base" /> Record New
        </button>
      </header>

      {tutorials === null && !error && <ListSkeleton />}

      {tutorials !== null && tutorials.length === 0 && (
        <EmptyState
          icon={SlidersIcon}
          title="Nothing recorded yet"
          description="Record your first lesson: type code while CodeCast captures every keystroke, then drop checkpoints where students should take over."
          action={
            <button onClick={() => navigate('/lecture/studio/record')} className="btn btn-primary">
              <PlusIcon className="text-base" /> Record your first lesson
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
          {tutorials.map((t) => (
            <motion.div key={t.id} variants={item}>
              <Card
                className="h-full cursor-pointer"
                onClick={() => navigate(`/lecture/studio/${t.id}/watch`)}
              >
                <div className="flex h-full flex-col">
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <LanguageBadge language={t.language} />
                      <StatusBadge status={t.status} />
                    </div>
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

                  <div className="mt-auto flex items-center justify-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/lecture/studio/${t.id}/checkpoints`)
                      }}
                      className="btn btn-ghost !px-3 text-xs"
                      title="Edit checkpoints"
                    >
                      <PencilIcon className="text-sm" /> Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setPendingDelete(t)
                      }}
                      className="btn btn-danger !px-3 text-xs"
                      title="Delete lesson"
                    >
                      <TrashIcon className="text-sm" /> Delete
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      <Modal
        open={!!pendingDelete}
        onClose={() => !deleting && setPendingDelete(null)}
        title="Delete lesson?"
        maxWidth="max-w-md"
      >
        <p className="mb-1 text-[15px] leading-relaxed text-ink-muted">
          This permanently deletes{' '}
          <span className="font-medium text-ink">{pendingDelete?.title}</span> and all of its
          checkpoints. This cannot be undone.
        </p>
        <div className="mt-7 flex justify-end gap-3">
          <button
            onClick={() => setPendingDelete(null)}
            disabled={deleting}
            className="btn btn-ghost"
          >
            Cancel
          </button>
          <button onClick={confirmDelete} disabled={deleting} className="btn btn-danger">
            <TrashIcon className="text-base" /> {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>
      <Suspense fallback={<EditorSkeleton label="Loading recorder" />}>
        <Record embedded open={recording} onClose={() => setRecording(false)} />
      </Suspense>
    </div>
  )
}

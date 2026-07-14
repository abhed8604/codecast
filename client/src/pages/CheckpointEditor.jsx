import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ReplayEditor from '../components/ReplayEditor.jsx'
import OutputPanel from '../components/OutputPanel.jsx'
import Timeline from '../components/Timeline.jsx'
import Modal from '../components/Modal.jsx'
import CheckpointForm from '../components/CheckpointForm.jsx'
import { EditorSkeleton } from '../components/Skeleton.jsx'
import { LanguageBadge, StatusBadge, formatDuration } from '../components/Badges.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { useReplayer } from '../hooks/useReplayer.js'
import { useGrading } from '../hooks/useGrading.js'
import { latestExecutionUpTo } from '../lib/replayer.js'
import { nextCheckpointAfter } from '../lib/checkpoints.js'
import { api } from '../api/client.js'
import { useTutorialStore } from '../store/useTutorialStore.js'
import { ArrowLeftIcon, PlusIcon, FlagIcon, PencilIcon, TrashIcon } from '../components/Icons.jsx'

export default function CheckpointEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const pushToast = useTutorialStore((s) => s.pushToast)

  const [tutorial, setTutorial] = useState(null)
  const [error, setError] = useState(null)
  const [publishing, setPublishing] = useState(false)

  const [formState, setFormState] = useState(null) // { mode:'add'|'edit', checkpoint? }
  const [saving, setSaving] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)

  const editorReadyRef = useRef(false)

  const eventLog = useMemo(() => tutorial?.event_log || [], [tutorial])
  const durationMs = tutorial?.duration_ms || 0
  const checkpoints = useMemo(() => tutorial?.checkpoints || [], [tutorial])

  const replayer = useReplayer({ eventLog, durationMs })
  const { suggest } = useGrading(eventLog)

  useEffect(() => {
    let alive = true
    api
      .getTutorial(id)
      .then((t) => alive && setTutorial(t))
      .catch((e) => {
        if (!alive) return
        setError(e.message)
        pushToast(e.message, 'error')
      })
    return () => {
      alive = false
    }
  }, [id, pushToast])

  const onEditorReady = useCallback(
    (editor) => {
      replayer.attach(editor)
      editorReadyRef.current = true
      replayer.seek(0)
    },
    [replayer]
  )

  const onSeek = useCallback((ms) => replayer.seek(ms), [replayer])

  const baselineOutput = useMemo(
    () => latestExecutionUpTo(eventLog, replayer.clockMs),
    [eventLog, replayer.clockMs]
  )

  // End of the segment the student will write: the next checkpoint's timestamp,
  // or the recording's full duration if this is the last checkpoint.
  const segmentEndMs = useCallback(
    (fromMs) => nextCheckpointAfter(checkpoints, fromMs, durationMs),
    [checkpoints, durationMs]
  )

  function openAdd() {
    replayer.pause()
    setFormState({ mode: 'add', timestampMs: Math.round(replayer.clockMs) })
  }

  function openEdit(cp) {
    replayer.pause()
    setFormState({ mode: 'edit', checkpoint: cp, timestampMs: cp.timestamp_ms })
  }

  async function submitForm(data) {
    setSaving(true)
    try {
      if (formState.mode === 'add') {
        const created = await api.createCheckpoint({
          tutorial_id: id,
          timestamp_ms: formState.timestampMs,
          ...data,
        })
        setTutorial((t) => ({
          ...t,
          checkpoints: [...t.checkpoints, created].sort((a, b) => a.timestamp_ms - b.timestamp_ms),
        }))
        pushToast('Checkpoint added', 'success')
      } else {
        const updated = await api.updateCheckpoint(formState.checkpoint.id, data)
        setTutorial((t) => ({
          ...t,
          checkpoints: t.checkpoints
            .map((c) => (c.id === updated.id ? updated : c))
            .sort((a, b) => a.timestamp_ms - b.timestamp_ms),
        }))
        pushToast('Checkpoint updated', 'success')
      }
      setFormState(null)
    } catch (e) {
      pushToast(e.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return
    try {
      await api.deleteCheckpoint(pendingDelete.id)
      setTutorial((t) => ({
        ...t,
        checkpoints: t.checkpoints.filter((c) => c.id !== pendingDelete.id),
      }))
      pushToast('Checkpoint removed', 'success')
      setPendingDelete(null)
    } catch (e) {
      pushToast(e.message, 'error')
    }
  }

  async function publish() {
    setPublishing(true)
    try {
      await api.updateTutorial(id, { status: 'published' })
      setTutorial((t) => ({ ...t, status: 'published' }))
      pushToast('Lesson published', 'success')
    } catch (e) {
      pushToast(e.message, 'error')
    } finally {
      setPublishing(false)
    }
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <EmptyState
          icon={FlagIcon}
          title="Couldn't load this lesson"
          description={error}
          action={
            <button onClick={() => navigate('/lecture/studio')} className="btn btn-primary">
              Back to Studio
            </button>
          }
        />
      </div>
    )
  }

  if (!tutorial) return <EditorSkeleton label="Loading recording" />

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 md:px-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <button
            onClick={() => navigate('/lecture/studio')}
            className="mb-2 inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
          >
            <ArrowLeftIcon className="text-base" /> Studio
          </button>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="truncate font-display text-2xl font-semibold tracking-tight text-ink">
              {tutorial.title}
            </h1>
            <LanguageBadge language={tutorial.language} />
            <StatusBadge status={tutorial.status} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(`/lecture/studio/${id}/watch`)} className="btn btn-ghost">
            Self-test
          </button>
          <button
            onClick={publish}
            disabled={publishing || tutorial.status === 'published'}
            className="btn btn-primary"
          >
            {tutorial.status === 'published'
              ? 'Published'
              : publishing
                ? 'Publishing...'
                : 'Publish'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
        {/* Replay + output */}
        <div className="flex flex-col gap-4">
          <div className="h-[52vh] overflow-hidden rounded-card shadow-card ring-1 ring-violet-primary/15">
            <ReplayEditor language={tutorial.language} onReady={onEditorReady} />
          </div>
          <div className="rounded-card bg-surface p-4 shadow-card ring-1 ring-violet-primary/12">
            <Timeline
              durationMs={durationMs}
              clockMs={replayer.clockMs}
              isPlaying={replayer.isPlaying}
              onPlayPause={() => (replayer.isPlaying ? replayer.pause() : replayer.play())}
              onSeek={onSeek}
              onMarkerClick={(cp) => replayer.seek(cp.timestamp_ms)}
              checkpoints={checkpoints}
            />
          </div>
          <button onClick={openAdd} className="btn btn-primary w-full !py-3">
            <PlusIcon className="text-base" /> Add checkpoint at {formatDuration(replayer.clockMs)}
          </button>
        </div>

        {/* Sidebar: baseline output + checkpoint list */}
        <div className="flex flex-col gap-4">
          <OutputPanel
            className="h-[26vh]"
            output={baselineOutput?.output}
            error={baselineOutput?.error}
            status={baselineOutput?.error ? 'error' : 'success'}
          />

          <div className="flex min-h-0 flex-1 flex-col rounded-card bg-surface shadow-card ring-1 ring-violet-primary/12">
            <div className="flex items-center justify-between border-b border-violet-primary/10 px-4 py-3">
              <span className="mono inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] text-ink-muted">
                <FlagIcon className="text-sm text-violet-glow" /> Checkpoints
              </span>
              <span className="mono text-xs text-ink-muted">{checkpoints.length}</span>
            </div>

            {checkpoints.length === 0 ? (
              <div className="flex flex-1 items-center justify-center p-6 text-center">
                <p className="max-w-[32ch] text-sm leading-relaxed text-ink-faint">
                  Scrub to a moment where the student should take over, then add a checkpoint. The
                  expected output is suggested automatically.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-violet-primary/8 overflow-y-auto">
                {checkpoints.map((cp, i) => (
                  <li key={cp.id} className="group flex items-start gap-3 px-4 py-3">
                    <span className="mono mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-violet-primary/12 text-xs text-violet-glow">
                      {i + 1}
                    </span>
                    <button
                      onClick={() => replayer.seek(cp.timestamp_ms)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <p className="truncate text-sm font-medium text-ink">{cp.title}</p>
                      <p className="mono text-xs text-ink-muted">
                        {formatDuration(cp.timestamp_ms)}
                      </p>
                    </button>
                    <div className="flex shrink-0 gap-1 opacity-60 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => openEdit(cp)}
                        className="grid h-7 w-7 place-items-center rounded-lg text-ink-muted hover:bg-violet-primary/10 hover:text-ink"
                        aria-label="Edit checkpoint"
                      >
                        <PencilIcon className="text-sm" />
                      </button>
                      <button
                        onClick={() => setPendingDelete(cp)}
                        className="grid h-7 w-7 place-items-center rounded-lg text-ink-muted hover:bg-danger/10 hover:text-danger"
                        aria-label="Delete checkpoint"
                      >
                        <TrashIcon className="text-sm" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Add / edit checkpoint */}
      <Modal
        open={!!formState}
        onClose={() => !saving && setFormState(null)}
        title={formState?.mode === 'edit' ? 'Edit checkpoint' : 'Add checkpoint'}
      >
        {formState && (
          <CheckpointForm
            timestampMs={formState.timestampMs}
            initial={formState.checkpoint || {}}
            suggestedDelta={
              formState.mode === 'add'
                ? suggest(formState.timestampMs, segmentEndMs(formState.timestampMs))
                : ''
            }
            saving={saving}
            onSubmit={submitForm}
            onCancel={() => setFormState(null)}
          />
        )}
      </Modal>

      {/* Delete confirm */}
      <Modal
        open={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        title="Remove checkpoint?"
        maxWidth="max-w-md"
      >
        <p className="text-[15px] leading-relaxed text-ink-muted">
          Remove <span className="font-medium text-ink">{pendingDelete?.title}</span>? Students will
          no longer stop at this point.
        </p>
        <div className="mt-7 flex justify-end gap-3">
          <button onClick={() => setPendingDelete(null)} className="btn btn-ghost">
            Cancel
          </button>
          <button onClick={confirmDelete} className="btn btn-danger">
            <TrashIcon className="text-base" /> Remove
          </button>
        </div>
      </Modal>
    </div>
  )
}

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import ReplayEditor from '../components/ReplayEditor.jsx'
import CodeEditor from '../components/CodeEditor.jsx'
import OutputPanel from '../components/OutputPanel.jsx'
import Timeline from '../components/Timeline.jsx'
import DiffView from '../components/DiffView.jsx'
import Modal from '../components/Modal.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { EditorSkeleton } from '../components/Skeleton.jsx'
import { LanguageBadge } from '../components/Badges.jsx'
import { ArrowLeftIcon, FlagIcon, CheckIcon, RunIcon, SkipIcon, ArrowRightIcon } from '../components/Icons.jsx'

import { useReplayer } from '../hooks/useReplayer.js'
import { useGrading } from '../hooks/useGrading.js'
import { latestExecutionUpTo, reconstructAt } from '../lib/replayer.js'
import { firstEventAfter } from '../lib/seek.js'
import { nextCheckpointAfter, cpAt } from '../lib/checkpoints.js'
import { LANGUAGES, CheckpointStatus } from '../lib/types.js'
import { api } from '../api/client.js'
import { useTutorialStore } from '../store/useTutorialStore.js'

export default function Watch({ mode = 'student' }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const pushToast = useTutorialStore((s) => s.pushToast)
  const loadProgress = useTutorialStore((s) => s.loadProgress)
  const setCheckpointStatus = useTutorialStore((s) => s.setCheckpointStatus)
  const progress = useTutorialStore((s) => s.progress)

  const [tutorial, setTutorial] = useState(null)
  const [error, setError] = useState(null)

  const [view, setView] = useState('replay') // replay | challenge
  const [diffOpen, setDiffOpen] = useState(false) // comparison popup overlay
  const [infoOpen, setInfoOpen] = useState(false) // checkpoint title/description popup
  const [activeCp, setActiveCp] = useState(null)
  const [initialCode, setInitialCode] = useState('')
  const [running, setRunning] = useState(false)
  const [output, setOutput] = useState(null)
  const [runResult, setRunResult] = useState(null)
  const [diffData, setDiffData] = useState(null)

  const replayEditorRef = useRef(null)
  const editableRef = useRef(null)
  const monacoRef = useRef(null)
  const studentCodeRef = useRef('') // live student code, robust to ref flushes
  const resumeRef = useRef(0) // where playback continues after the diff popup closes

  const eventLog = useMemo(() => tutorial?.event_log || [], [tutorial])
  const durationMs = tutorial?.duration_ms || 0
  const checkpoints = useMemo(() => tutorial?.checkpoints || [], [tutorial])
  const langId = LANGUAGES[tutorial?.language]?.monaco || 'plaintext'

  const replayer = useReplayer({ eventLog, durationMs })
  const { grade } = useGrading(eventLog)

  // ---- load ---------------------------------------------------------------
  useEffect(() => {
    let alive = true
    api
      .getTutorial(id)
      .then((t) => {
        if (!alive) return
        setTutorial(t)
        loadProgress(id)
      })
      .catch((e) => {
        if (!alive) return
        setError(e.message)
        pushToast(e.message, 'error')
      })
    return () => {
      alive = false
    }
  }, [id, loadProgress, pushToast])

  // Re-theme the whole document to "checkpoint mode" (black-yellow) while the
  // student is solving. Cleaned up on exit/unmount so we always revert to the
  // default black-violet theme.
  useEffect(() => {
    const root = document.documentElement
    if (view === 'challenge') root.setAttribute('data-mode', 'challenge')
    else root.removeAttribute('data-mode')
    return () => root.removeAttribute('data-mode')
  }, [view])

  // ---- derived, reactive --------------------------------------------------
  const maxScrubMs = useMemo(() => {
    const pending = checkpoints.filter((c) => (progress[c.id] || 'pending') === 'pending')
    return pending.length ? Math.min(...pending.map((c) => c.timestamp_ms)) : durationMs
  }, [checkpoints, progress, durationMs])

  const allResolved = useMemo(
    () =>
      checkpoints.length > 0 &&
      checkpoints.every((c) => progress[c.id] && progress[c.id] !== 'pending'),
    [checkpoints, progress]
  )

  // ---- transport ----------------------------------------------------------
  const startPlay = useCallback(() => {
    const clock = replayer.clockRef.current
    const here = cpAt(checkpoints, clock)
    if (here) {
      enterChallenge(here)
      return
    }
    const boundary = nextCheckpointAfter(checkpoints, clock, durationMs, 1)
    replayer.play(boundary, (reached) => {
      const cp = cpAt(checkpoints, reached)
      if (cp) enterChallenge(cp)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkpoints, durationMs, replayer, enterChallenge])

  const onSeek = useCallback((ms) => replayer.seek(ms), [replayer])

  const onReplayReady = useCallback(
    (editor, monaco) => {
      replayEditorRef.current = editor
      monacoRef.current = monaco
      replayer.attach(editor)
      replayer.seek(0)
    },
    [replayer]
  )

  // ---- challenge ----------------------------------------------------------
  function enterChallenge(cp) {
    const instructorSoFar =
      replayEditorRef.current?.getValue() ??
      reconstructAt(monacoRef.current, eventLog, langId, cp.timestamp_ms)
    replayer.pause()
    replayer.detach()
    setActiveCp(cp)
    setInitialCode(instructorSoFar)
    setRunResult(null)
    setOutput(null)
    setView('challenge')
  }

  const runChallenge = useCallback(async () => {
    if (running || !activeCp) return
    const code = editableRef.current?.getValue() ?? ''
    setRunning(true)
    setOutput(null)
    try {
      const res = await api.execute(code, tutorial.language)
      setOutput(res)
      const passed = grade(res.output || '', activeCp.timestamp_ms, activeCp.correct_output_delta)
      setRunResult({ passed })
      pushToast(
        passed ? 'Output matches — nicely done.' : "Output didn't match yet.",
        passed ? 'success' : 'error'
      )
    } catch (e) {
      setOutput({ output: '', error: e.message, status: 'error' })
      setRunResult({ passed: false })
    } finally {
      setRunning(false)
    }
  }, [running, activeCp, tutorial, grade, pushToast])

  function resolveAndShowDiff(status) {
    const studentCode = studentCodeRef.current || editableRef.current?.getValue() || ''
    const cp = activeCp
    setCheckpointStatus(id, cp.id, status)

    const segEnd = nextCheckpointAfter(checkpoints, cp.timestamp_ms, durationMs)
    const original = reconstructAt(monacoRef.current, eventLog, langId, segEnd)
    const cpIndex = checkpoints.findIndex((c) => c.id === cp.id) + 1
    setDiffData({ original, modified: studentCode, cpIndex, cpTitle: cp.title })

    // Play the instructor's solution so the NEW output appears in the panel
    // behind the comparison popup, then open the popup at that point.
    const startMs = cp.timestamp_ms
    const nextExec = firstEventAfter(eventLog, startMs, (e) => e.type === 'execution')
    const diffUntil = nextExec ? nextExec.t : segEnd

    resumeRef.current = nextCheckpointAfter(checkpoints, cp.timestamp_ms, durationMs) // where playback continues after closing
    // The ReplayEditor now stays mounted across modes, so re-attach the replayer
    // to it and run the deferred playback inline instead of waiting for a
    // remount that no longer happens.
    const editor = replayEditorRef.current
    if (editor) replayer.attach(editor)
    replayer.seek(startMs)
    if (diffUntil > startMs + 1) replayer.play(diffUntil, () => setDiffOpen(true))
    else setDiffOpen(true)
    setView('replay')
  }

  function closeDiff() {
    setDiffOpen(false)
    setDiffData(null)
    setActiveCp(null)
    setRunResult(null)
    setOutput(null)
    // Resume and stop at the next checkpoint (handled by startPlay's boundary).
    const target = resumeRef.current
    replayer.play(target, (reached) => {
      const cp = cpAt(checkpoints, reached)
      if (cp) enterChallenge(cp)
    })
  }

  // ---- keyboard shortcuts -------------------------------------------------
  useEffect(() => {
    function onKey(e) {
      const tag = e.target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.code === 'Space' && view === 'replay') {
        e.preventDefault()
        replayer.isPlaying ? replayer.pause() : startPlay()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [view, replayer, startPlay])

  // ---- render -------------------------------------------------------------
  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <EmptyState
          icon={FlagIcon}
          title="Couldn't load this lesson"
          description={error}
          action={
            <button
              onClick={() => navigate(mode === 'studio' ? '/lecture/studio' : '/lecture/student')}
              className="btn btn-primary"
            >
              Back
            </button>
          }
        />
      </div>
    )
  }

  if (!tutorial) return <EditorSkeleton label="Loading lesson" />

  const backTo = mode === 'studio' ? '/lecture/studio' : '/lecture/student'
  const displayOutput =
    view === 'challenge' ? output : latestExecutionUpTo(eventLog, replayer.clockMs)

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 pb-40 md:px-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <button
            onClick={() => navigate(backTo)}
            className="mb-2 inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
          >
            <ArrowLeftIcon className="text-base" /> Back
          </button>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="truncate font-display text-2xl font-semibold tracking-tight text-ink">
              {tutorial.title}
            </h1>
            <LanguageBadge language={tutorial.language} />
            {allResolved && (
              <span className="inline-flex items-center gap-1 text-xs text-success">
                <CheckIcon className="text-sm" /> Complete
              </span>
            )}
          </div>
        </div>
        <AnimatePresence>
          {view === 'challenge' && activeCp && (
            <motion.div
              key="cp-actions"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="flex shrink-0 items-center gap-2"
            >
              <button
                type="button"
                onClick={() => setInfoOpen(true)}
                className="btn btn-ghost grid h-9 w-9 place-items-center rounded-full !px-0 text-base"
                aria-label="Checkpoint info"
                title="Checkpoint details"
              >
                ?
              </button>
              <button
                type="button"
                onClick={runChallenge}
                disabled={running}
                className="btn btn-ghost"
              >
                <RunIcon className="text-base" />
                {running ? 'Running…' : 'Run'}
              </button>
              <button
                type="button"
                onClick={() => resolveAndShowDiff(CheckpointStatus.SKIPPED)}
                className="btn btn-ghost"
              >
                <SkipIcon className="text-base" /> Skip
              </button>
              <button
                type="button"
                onClick={() => resolveAndShowDiff(CheckpointStatus.PASSED)}
                disabled={!runResult?.passed}
                className="btn btn-primary"
                title={runResult?.passed ? 'Resume playback' : 'Pass a run to continue'}
              >
                Continue <ArrowRightIcon className="text-base" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main stage */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="relative h-[58vh] overflow-hidden rounded-card shadow-card ring-1 ring-violet-primary/15">
          {/* Both editors stay mounted and we only cross-fade their visibility.
              This avoids remounting Monaco on mode switch (which would blank the
              editor, discard its model, then refill it — the "blink"). The theme
              itself still flips in place via the global data-mode observer. */}
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${
              view === 'replay' ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
          >
            <ReplayEditor language={tutorial.language} onReady={onReplayReady} />
          </div>
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${
              view === 'challenge' ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
          >
            <CodeEditor
              key={activeCp?.id}
              language={tutorial.language}
              defaultValue={initialCode}
              onChange={(val) => {
                studentCodeRef.current = val ?? ''
              }}
              onReady={(editor, monaco) => {
                editableRef.current = editor
                monacoRef.current = monaco
                studentCodeRef.current = editor.getValue()
              }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <OutputPanel
            className="h-[58vh]"
            output={displayOutput?.output}
            error={displayOutput?.error}
            status={displayOutput?.error ? 'error' : 'success'}
            running={running}
          />
        </div>
      </div>

      {/* Transport — rendered identically in both modes so the layout never
          shifts. While a checkpoint is being solved it's made non-interactive
          (pointer-events only, no visual change) so scrubbing/playing can't
          discard in-progress work. */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-3 rounded-card bg-surface px-4 py-3 shadow-card ring-1 ring-violet-primary/12"
      >
        <div className={view === 'challenge' ? 'pointer-events-none' : ''}>
          <Timeline
            durationMs={durationMs}
            clockMs={replayer.clockMs}
            isPlaying={replayer.isPlaying}
            onPlayPause={() => (replayer.isPlaying ? replayer.pause() : startPlay())}
            onSeek={onSeek}
            onMarkerClick={(cp) => replayer.seek(Math.min(cp.timestamp_ms, maxScrubMs))}
            checkpoints={checkpoints}
            progress={progress}
            maxScrubMs={maxScrubMs}
          />
        </div>
      </motion.div>

      {/* Comparison popup — opens after the instructor's new output appears */}
      <Modal
        open={diffOpen}
        onClose={closeDiff}
        title={
          diffData?.cpTitle
            ? `Checkpoint ${diffData.cpIndex} — ${diffData.cpTitle}`
            : 'Your solution vs instructor'
        }
        maxWidth="max-w-4xl"
      >
        <p className="mb-4 text-sm leading-relaxed text-ink-muted">
          Green is what the instructor wrote; red is where your code diverged.
        </p>
        <div className="h-[62vh] overflow-hidden rounded-card shadow-card ring-1 ring-violet-primary/15">
          <DiffView
            language={tutorial.language}
            original={diffData?.original || ''}
            modified={diffData?.modified || ''}
            className="h-full"
          />
        </div>
        <div className="mt-5 flex justify-end">
          <button onClick={closeDiff} className="btn btn-primary">
            Close
          </button>
        </div>
      </Modal>

      {/* Checkpoint info popup — title + description, opened via the "?" button */}
      <Modal open={infoOpen} onClose={() => setInfoOpen(false)} title={activeCp?.title}>
        <p className="text-[15px] leading-relaxed text-ink-muted">{activeCp?.objective}</p>
      </Modal>
    </div>
  )
}

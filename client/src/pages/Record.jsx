import { useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import CodeEditor from '../components/CodeEditor.jsx'
import OutputPanel from '../components/OutputPanel.jsx'
import Modal from '../components/Modal.jsx'
import { useRecorder } from '../hooks/useRecorder.js'
import { api } from '../api/client.js'
import { LANGUAGES } from '../lib/types.js'
import { useTutorialStore } from '../store/useTutorialStore.js'
import { formatDuration } from '../components/Badges.jsx'
import { RecordIcon, StopIcon, RunIcon, ArrowLeftIcon } from '../components/Icons.jsx'

export default function Record({ embedded = false, open = true, onClose }) {
  const navigate = useNavigate()
  const pushToast = useTutorialStore((s) => s.pushToast)

  const [phase, setPhase] = useState('setup') // setup | recording | saving
  const [meta, setMeta] = useState({ title: '', description: '', language: 'python' })
  const [formError, setFormError] = useState('')

  const [output, setOutput] = useState(null) // { output, error, status }
  const [running, setRunning] = useState(false)

  const editorRef = useRef(null)
  const { elapsed, start, recordEdit, recordExecution, stop } = useRecorder()

  const onEditorReady = useCallback((editor) => {
    editorRef.current = editor
  }, [])

  const onEditorChange = useCallback(
    (value, ev) => {
      // recordEdit no-ops until recording has started, so no guard needed here
      // (avoids dropping the first keystroke while isRecording state propagates).
      recordEdit(ev?.changes || [], value ?? '')
    },
    [recordEdit]
  )

  function beginRecording() {
    if (!meta.title.trim()) {
      setFormError('Please give your lesson a title before recording.')
      return
    }
    setFormError('')
    setPhase('recording')
    // Editor mounts empty; start() captures the empty initial keyframe
    // synchronously so the first keystroke is never dropped.
    start('')
  }

  const runCode = useCallback(async () => {
    if (running) return
    const code = editorRef.current?.getValue() ?? ''
    setRunning(true)
    setOutput(null)
    try {
      const res = await api.execute(code, meta.language)
      setOutput(res)
      recordExecution(res.output || '', res.error || '')
    } catch (e) {
      const errRes = { output: '', error: e.message, status: 'error' }
      setOutput(errRes)
      recordExecution('', e.message)
    } finally {
      setRunning(false)
    }
  }, [running, meta.language, recordExecution])

  async function finishRecording() {
    const { events, duration_ms } = stop()
    setPhase('saving')
    try {
      const { id } = await api.createTutorial({
        title: meta.title.trim(),
        description: meta.description.trim(),
        language: meta.language,
      })
      await api.updateTutorial(id, { event_log: events, duration_ms })
      pushToast('Recording saved — add checkpoints next', 'success')
      navigate(`/lecture/studio/${id}/checkpoints`)
    } catch (e) {
      pushToast(e.message, 'error')
      setPhase('recording')
    }
  }

  // Keyboard: Ctrl/Cmd+Enter runs while recording.
  function onKeyDown(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && phase === 'recording') {
      e.preventDefault()
      runCode()
    }
  }

  let content

  if (phase === 'setup') {
    content = (
      <div className={embedded ? '' : 'mx-auto max-w-2xl px-4 py-12 md:px-8'}>
        {!embedded && (
          <button
            onClick={() => navigate('/lecture/studio')}
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
          >
            <ArrowLeftIcon className="text-base" /> Back to Studio
          </button>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className={embedded ? '' : 'rounded-panel bg-surface p-8 ring-1 ring-violet-primary/12'}
        >
          {!embedded && (
            <>
              <p className="mono mb-2 text-[12px] uppercase tracking-[0.2em] text-violet-glow">
                New recording
              </p>
              <h1 className="mb-6 font-display text-3xl font-semibold tracking-tighter text-ink">
                Set up your lesson
              </h1>
            </>
          )}

          {embedded && (
            <p className="mb-4 text-sm leading-relaxed text-ink-muted">
              Give your lesson a title and language, then start capturing every
              keystroke and run.
            </p>
          )}

          <div className={embedded ? 'flex w-full flex-col gap-3' : 'flex flex-col gap-5'}>
            <div className="flex flex-col gap-1.5">
              <label className="field-label">Title</label>
              <input
                className="field-input"
                value={meta.title}
                onChange={(e) => setMeta((m) => ({ ...m, title: e.target.value }))}
                placeholder="e.g. List comprehensions from scratch"
                autoFocus
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="field-label">Description</label>
              <textarea
                className="field-input min-h-[60px] resize-y"
                value={meta.description}
                onChange={(e) => setMeta((m) => ({ ...m, description: e.target.value }))}
                placeholder="A short summary of what students will learn."
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="field-label">Language</label>
              <div className="grid grid-cols-3 gap-2">
                {Object.values(LANGUAGES).map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setMeta((m) => ({ ...m, language: l.id }))}
                    className={`rounded-control px-3 py-2 text-sm font-medium transition-all ${
                      meta.language === l.id
                        ? 'bg-violet-primary text-[#120b1c] ring-1 ring-violet-primary'
                        : 'bg-void text-ink-muted ring-1 ring-violet-primary/15 hover:text-ink'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {formError && <p className="text-sm text-danger">{formError}</p>}

            <button onClick={beginRecording} className="btn btn-primary mt-1 w-full !py-2.5">
              <RecordIcon className="text-base text-danger" /> Start recording
            </button>
            <p className="text-center text-xs leading-relaxed text-ink-faint">
              The editor starts empty. Every keystroke and every run is captured with its timestamp.
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

    // recording / saving
    else {
    content = (
          <div
            className={embedded ? '' : 'mx-auto max-w-[1400px] px-4 py-6 md:px-8'}
            onKeyDown={onKeyDown}
          >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-danger/10 px-3 py-1.5 ring-1 ring-danger/25">
              <span className="h-2.5 w-2.5 animate-blink rounded-full bg-danger" />
              <span className="mono text-sm font-medium text-danger">REC</span>
            </span>
            <span className="mono text-lg text-ink">{formatDuration(elapsed)}</span>
            {!embedded && (
              <span className="hidden text-sm text-ink-muted sm:inline">— {meta.title}</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={runCode} disabled={running || phase === 'saving'} className="btn btn-ghost">
              <RunIcon className="text-base" /> {running ? 'Running...' : 'Run'}
            </button>
            <button
              onClick={finishRecording}
              disabled={phase === 'saving'}
              className="btn btn-primary"
            >
              <StopIcon className="text-base" /> {phase === 'saving' ? 'Saving...' : 'Stop & save'}
            </button>
          </div>
        </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="h-[62vh] overflow-hidden rounded-card ring-1 ring-violet-primary/15">
          <CodeEditor
            language={meta.language}
            onReady={onEditorReady}
            onChange={onEditorChange}
          />
        </div>
        <OutputPanel
          className="h-[62vh]"
          output={output?.output}
          error={output?.error}
          status={output?.status}
          running={running}
        />
      </div>
    </div>
    )
  }

  if (!embedded) return content
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={phase === 'setup' ? 'Record a lesson' : 'Recording'}
      maxWidth={phase === 'setup' ? 'max-w-lg' : 'max-w-5xl'}
    >
      <div className="scrollbar-hide max-h-[78vh] overflow-y-auto">{content}</div>
    </Modal>
  )
}

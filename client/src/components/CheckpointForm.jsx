import { useState } from 'react'
import { formatDuration } from './Badges.jsx'
import { FlagIcon } from './Icons.jsx'

/**
 * Checkpoint authoring form — rendered inside Modal. Label sits above input,
 * helper text present, error below. The correct-output field is pre-filled with
 * the auto-suggested delta but stays fully editable.
 */
export default function CheckpointForm({
  timestampMs,
  initial = {},
  suggestedDelta = '',
  onSubmit,
  onCancel,
  saving = false,
}) {
  const [title, setTitle] = useState(initial.title || '')
  const [objective, setObjective] = useState(initial.objective || '')
  const [delta, setDelta] = useState(
    initial.correct_output_delta != null ? initial.correct_output_delta : suggestedDelta
  )

  function submit(e) {
    e.preventDefault()
    onSubmit?.({
      title: title.trim(),
      objective: objective.trim(),
      correct_output_delta: delta,
    })
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <div className="flex items-center gap-2 rounded-control bg-violet-primary/8 px-3.5 py-2 ring-1 ring-violet-primary/15">
        <FlagIcon className="text-base text-violet-glow" />
        <span className="mono text-sm text-ink-muted">
          Triggers at <span className="text-violet-glow">{formatDuration(timestampMs)}</span>{' '}
          <span className="text-ink-faint">({Math.round(timestampMs)}ms)</span>
        </span>
      </div>

      <Field label="Title">
        <input
          className="field-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Filter out the odd numbers"
          autoFocus
        />
      </Field>

      <Field
        label="Objective"
        helper="Shown to the student in the challenge panel. Be specific about the task."
      >
        <textarea
          className="field-input min-h-[88px] resize-y"
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          placeholder="Write a loop that prints only the even values from the list."
        />
      </Field>

      <Field
        label="Expected new output"
        helper="Only the NEW output the student's code should add after this point. Auto-suggested from your recording — edit if needed. Leave blank if there is no expected output."
      >
        <textarea
          className="field-input mono min-h-[88px] resize-y text-sm"
          value={delta}
          onChange={(e) => setDelta(e.target.value)}
          placeholder="2&#10;4&#10;6"
          spellCheck={false}
        />
      </Field>

      <div className="mt-1 flex justify-end gap-3">
        <button type="button" onClick={onCancel} disabled={saving} className="btn btn-ghost">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="btn btn-primary">
          {saving ? 'Saving...' : initial.id ? 'Save changes' : 'Add checkpoint'}
        </button>
      </div>
    </form>
  )
}

function Field({ label, helper, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="field-label">{label}</label>
      {children}
      {helper ? (
        <p className="text-xs leading-relaxed text-ink-faint">{helper}</p>
      ) : null}
    </div>
  )
}

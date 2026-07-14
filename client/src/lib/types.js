// Shared shape documentation via JSDoc typedefs. No TypeScript build step —
// this exists purely for editor autocomplete and catching obvious mismatches.

/**
 * A single recorded moment in a tutorial. Either a code edit (a Monaco content
 * change delta) or an execution (Run + captured output).
 *
 * @typedef {Object} ReplayEvent
 * @property {number} t - milliseconds from recording start
 * @property {'edit'|'execution'} type
 * @property {import('monaco-editor').editor.IModelContentChange[]} [changes] - for 'edit'
 * @property {string} [fullValue] - optional periodic snapshot (safety keyframe) for 'edit'
 * @property {string} [output] - for 'execution'
 * @property {string} [error] - for 'execution'
 */

/**
 * @typedef {Object} Checkpoint
 * @property {string} id
 * @property {string} tutorial_id
 * @property {number} timestamp_ms
 * @property {string} title
 * @property {string} objective
 * @property {string} correct_output_delta
 * @property {string} [created_at]
 */

/**
 * @typedef {Object} Tutorial
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {'python'|'cpp'|'sql'} language
 * @property {'draft'|'published'} status
 * @property {number} [duration_ms]
 * @property {ReplayEvent[]} [event_log]
 * @property {Checkpoint[]} [checkpoints]
 * @property {string} [created_at]
 * @property {string} [updated_at]
 */

/** Per-checkpoint progress status. Imported everywhere it's used. */
export const CheckpointStatus = Object.freeze({
  PENDING: 'pending',
  PASSED: 'passed',
  SKIPPED: 'skipped',
})

/** Human-readable + editor labels for the three supported languages. */
export const LANGUAGES = Object.freeze({
  python: { id: 'python', label: 'Python', monaco: 'python', ext: 'py' },
  cpp: { id: 'cpp', label: 'C++', monaco: 'cpp', ext: 'cpp' },
  sql: { id: 'sql', label: 'SQL', monaco: 'sql', ext: 'sql' },
})

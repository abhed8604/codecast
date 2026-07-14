let defined = false
let observerAttached = false

export const THEME_NAME = 'codecast-violet'
export const CHALLENGE_THEME = 'codecast-yellow'

/**
 * Resolve which Monaco theme should be active based on the document's
 * `data-mode` attribute. `data-mode="challenge"` (checkpoint mode) flips the
 * whole app — chrome and code editor alike — to black-yellow.
 */
export function currentThemeName() {
  const mode = typeof document !== 'undefined'
    ? document.documentElement.getAttribute('data-mode')
    : null
  return mode === 'challenge' ? CHALLENGE_THEME : THEME_NAME
}

/**
 * Define and register the Monaco themes used across the whole app (live
 * recording, read-only replay, checkpoint editing, diff view). Two themes
 * share one accent system: `codecast-violet` (default) and `codecast-yellow`
 * (checkpoint mode). A single global MutationObserver re-themes every mounted
 * editor whenever `data-mode` changes.
 *
 * Takes the `monaco` instance handed to us by @monaco-editor/react's onMount so
 * we never statically import `monaco-editor` here — that keeps Monaco out of the
 * main bundle and confined to the lazily-loaded editor routes.
 *
 * Idempotent — safe to call from every editor mount.
 */
export function defineCodecastTheme(monacoInstance) {
  if (!monacoInstance) return THEME_NAME
  if (!defined) {
    monacoInstance.editor.defineTheme(THEME_NAME, {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6B6280', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'C4B5FD' },
        { token: 'string', foreground: 'A78BFA' },
        { token: 'number', foreground: 'E9D5FF' },
        { token: 'function', foreground: '8B5CF6' },
      ],
      colors: {
        'editor.background': '#0B0B0F',
        'editor.foreground': '#F1EDF7',
        'editorLineNumber.foreground': '#4A4058',
        'editorCursor.foreground': '#8B5CF6',
        'editor.selectionBackground': '#4C1D9580',
        'editorGutter.background': '#0B0B0F',
      },
    })

    // Checkpoint theme — same neutral-dark surface, blue accents (matches the
    // CSS `--violet-*` challenge tokens).
    monacoInstance.editor.defineTheme(CHALLENGE_THEME, {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '5B6B82', fontStyle: 'italic' },
        { token: 'keyword', foreground: '93C5FD' },
        { token: 'string', foreground: '60A5FA' },
        { token: 'number', foreground: 'BFDBFE' },
        { token: 'function', foreground: '3B82F6' },
      ],
      colors: {
        'editor.background': '#0B0B0F',
        'editor.foreground': '#F1F5F9',
        'editorLineNumber.foreground': '#3B4A5E',
        'editorCursor.foreground': '#3B82F6',
        'editor.selectionBackground': '#3B82F640',
        'editorGutter.background': '#0B0B0F',
      },
    })

    defined = true
  }

  // Apply the theme that matches the current mode immediately, and keep every
  // editor in sync when the mode flips (e.g. replay <-> challenge).
  monacoInstance.editor.setTheme(currentThemeName())

  if (!observerAttached && typeof document !== 'undefined') {
    const observer = new MutationObserver(() => {
      monacoInstance.editor.setTheme(currentThemeName())
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-mode'],
    })
    observerAttached = true
  }

  return THEME_NAME
}

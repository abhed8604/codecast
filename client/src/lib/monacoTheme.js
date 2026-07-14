let defined = false

export const THEME_NAME = 'codecast-violet'

/**
 * Define and register the single Monaco theme used across the whole app
 * (live recording, read-only replay, checkpoint editing, diff view).
 *
 * Takes the `monaco` instance handed to us by @monaco-editor/react's onMount so
 * we never statically import `monaco-editor` here — that keeps Monaco out of the
 * main bundle and confined to the lazily-loaded editor routes.
 *
 * Idempotent — safe to call from every editor mount.
 */
export function defineCodecastTheme(monacoInstance) {
  if (!monacoInstance) return THEME_NAME
  if (defined) return THEME_NAME
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
  defined = true
  return THEME_NAME
}

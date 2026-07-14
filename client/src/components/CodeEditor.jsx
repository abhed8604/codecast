import Editor from '@monaco-editor/react'
import '../lib/monacoSetup.js'
import { defineCodecastTheme, currentThemeName } from '../lib/monacoTheme.js'
import { LANGUAGES } from '../lib/types.js'

const baseOptions = {
  fontFamily: '"JetBrains Mono", ui-monospace, monospace',
  fontSize: 14,
  lineHeight: 21,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  smoothScrolling: true,
  cursorSmoothCaretAnimation: 'on',
  cursorBlinking: 'smooth',
  padding: { top: 16, bottom: 16 },
  renderLineHighlight: 'none',
  scrollbar: {
    verticalScrollbarSize: 0,
    horizontalScrollbarSize: 0,
    useShadows: false,
    handleMouseWheel: true,
    overviewRulerLanes: 0,
  },
  automaticLayout: true,
  tabSize: 4,
  fontLigatures: true,
  overviewRulerLanes: 0,
}

/**
 * Editable Monaco instance — used for live recording and for the student's
 * checkpoint solving. Emits raw content-change events so the recorder can
 * capture keystroke deltas.
 */
export default function CodeEditor({
  language,
  value,
  defaultValue = '',
  readOnly = false,
  onReady,
  onChange,
  height = '100%',
}) {
  const monacoLang = LANGUAGES[language]?.monaco || 'plaintext'

  function handleMount(editor, monaco) {
    defineCodecastTheme(monaco)
    onReady?.(editor, monaco)
  }

  return (
    <Editor
      height={height}
      theme={currentThemeName()}
      language={monacoLang}
      value={value}
      defaultValue={defaultValue}
      onMount={handleMount}
      onChange={(val, ev) => onChange?.(val, ev)}
      options={{ ...baseOptions, readOnly }}
      loading={
        <div className="grid h-full place-items-center bg-surface">
          <span className="mono text-sm text-ink-muted">Loading editor...</span>
        </div>
      }
    />
  )
}

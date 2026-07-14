import Editor from '@monaco-editor/react'
import '../lib/monacoSetup.js'
import { defineCodecastTheme, THEME_NAME } from '../lib/monacoTheme.js'
import { LANGUAGES } from '../lib/types.js'

const replayOptions = {
  fontFamily: '"JetBrains Mono", ui-monospace, monospace',
  fontSize: 14,
  lineHeight: 21,
  minimap: { enabled: false },
  readOnly: true,
  domReadOnly: true,
  scrollBeyondLastLine: false,
  smoothScrolling: true,
  cursorSmoothCaretAnimation: 'on',
  cursorBlinking: 'smooth',
  cursorStyle: 'line',
  padding: { top: 16, bottom: 16 },
  renderLineHighlight: 'none',
  scrollbar: { verticalScrollbarSize: 0, horizontalScrollbarSize: 0, useShadows: false, handleMouseWheel: true, overviewRulerLanes: 0 },
  automaticLayout: true,
  overviewRulerLanes: 0,
  // Keep the caret visible during read-only replay so it reads as "typing".
  hideCursorInOverviewRuler: true,
}

/**
 * Read-only Monaco instance used for replay. The replayer attaches to this
 * editor's model and mutates it via applyEdits to reproduce the typing.
 */
export default function ReplayEditor({ language, onReady, height = '100%' }) {
  const monacoLang = LANGUAGES[language]?.monaco || 'plaintext'

  function handleMount(editor, monaco) {
    defineCodecastTheme(monaco)
    monaco.editor.setTheme(THEME_NAME)
    editor.getModel()?.setValue('')
    onReady?.(editor, monaco)
  }

  return (
    <Editor
      height={height}
      theme={THEME_NAME}
      language={monacoLang}
      defaultValue=""
      onMount={handleMount}
      options={replayOptions}
      loading={
        <div className="grid h-full place-items-center bg-surface">
          <span className="mono text-sm text-ink-muted">Loading replay...</span>
        </div>
      }
    />
  )
}

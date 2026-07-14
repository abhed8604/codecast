import { useEffect, useRef } from 'react'
import { useMonaco } from '@monaco-editor/react'
import '../lib/monacoSetup.js'
import { defineCodecastTheme, THEME_NAME } from '../lib/monacoTheme.js'
import { LANGUAGES } from '../lib/types.js'

const diffOptions = {
  fontFamily: '"JetBrains Mono", ui-monospace, monospace',
  fontSize: 13.5,
  lineHeight: 20,
  readOnly: true,
  renderSideBySide: true,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  automaticLayout: true,
  renderOverviewRuler: false,
  scrollbar: {
    verticalScrollbarSize: 0,
    horizontalScrollbarSize: 0,
    useShadows: false,
    handleMouseWheel: true,
    alwaysConsumeMouseWheel: false,
  },
  renderLineHighlight: 'none',
}

/**
 * Side-by-side comparison, managed manually (not via @monaco-editor/react's
 * <DiffEditor>). We create the models and editor ourselves and dispose the
 * editor BEFORE its models on cleanup — the correct order avoids the
 * "TextModel got disposed before DiffEditorWidget model got reset" crash.
 *
 * Left = instructor's code for this segment (correct, green).
 * Right = the student's submission (red where it diverges). Read-only.
 */
export default function DiffView({ language, original = '', modified = '', className = '' }) {
  const monaco = useMonaco()
  const containerRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (!monaco || !el) return

    defineCodecastTheme(monaco)
    const monacoLang = LANGUAGES[language]?.monaco || 'plaintext'

    const editor = monaco.editor.createDiffEditor(el, { ...diffOptions, theme: THEME_NAME })
    const originalModel = monaco.editor.createModel(original, monacoLang)
    const modifiedModel = monaco.editor.createModel(modified, monacoLang)
    editor.setModel({ original: originalModel, modified: modifiedModel })

    return () => {
      // Dispose the widget first (it safely resets its model refs), then the
      // models we own. Reversing this order is what triggers the crash.
      editor.dispose()
      originalModel.dispose()
      modifiedModel.dispose()
    }
  }, [monaco, language, original, modified])

  return (
    <div
      className={`flex min-h-0 flex-col overflow-hidden rounded-card ring-1 ring-violet-primary/15 ${className}`}
    >
      <div className="grid grid-cols-2 gap-px border-b border-violet-primary/10 bg-violet-primary/10">
        <div className="flex items-center justify-center bg-surface-2 py-2.5">
          <span className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-[12px] font-semibold uppercase tracking-wider text-success ring-1 ring-success/25">
            <span className="h-1.5 w-1.5 rounded-full bg-success" /> Instructor
          </span>
        </div>
        <div className="flex items-center justify-center bg-surface-2 py-2.5">
          <span className="inline-flex items-center gap-2 rounded-full bg-danger/10 px-3 py-1 text-[12px] font-semibold uppercase tracking-wider text-danger ring-1 ring-danger/25">
            <span className="h-1.5 w-1.5 rounded-full bg-danger" /> Your code
          </span>
        </div>
      </div>
      <div ref={containerRef} className="scrollbar-hide min-h-0 flex-1" />
    </div>
  )
}

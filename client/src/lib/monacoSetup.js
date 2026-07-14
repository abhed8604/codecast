import { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'

/**
 * Bundle Monaco locally instead of pulling it from a CDN at runtime, so the app
 * works offline / self-hosted. Imported only by the lazy editor components, so
 * Monaco stays out of the main bundle and lands in the editor route chunks.
 *
 * python / cpp / sql all use the base editor worker (no dedicated language
 * workers), so one worker covers every language we support.
 */
self.MonacoEnvironment = {
  getWorker() {
    return new editorWorker()
  },
}

loader.config({ monaco })

export default monaco

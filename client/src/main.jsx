import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// NOTE: StrictMode is intentionally omitted. Its double-invoked effects cause
// @monaco-editor/react's DiffEditor to dispose its model before the widget
// resets ("TextModel got disposed before DiffEditorWidget model got reset").
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <App />
  </BrowserRouter>
)

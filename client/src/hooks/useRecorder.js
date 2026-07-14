import { useCallback, useEffect, useRef, useState } from 'react'
import { createRecorder } from '../lib/recorder.js'

/**
 * Thin React wrapper around lib/recorder.js. Owns a single recorder instance and
 * a lightweight display timer; all capture logic lives in the pure lib.
 */
export function useRecorder() {
  const recorderRef = useRef(null)
  if (recorderRef.current == null) recorderRef.current = createRecorder()

  const [isRecording, setIsRecording] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef(null)

  const start = useCallback((initialValue = '') => {
    recorderRef.current.start(initialValue)
    setIsRecording(true)
    setElapsed(0)
    timerRef.current = setInterval(() => {
      setElapsed(recorderRef.current.getElapsed())
    }, 100)
  }, [])

  const recordEdit = useCallback((changes, fullValue) => {
    recorderRef.current.recordEdit(changes, fullValue)
  }, [])

  const recordExecution = useCallback((output, error) => {
    recorderRef.current.recordExecution(output, error)
  }, [])

  const stop = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = null
    setIsRecording(false)
    return recorderRef.current.stop()
  }, [])

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current)
    },
    []
  )

  return { isRecording, elapsed, start, recordEdit, recordExecution, stop }
}

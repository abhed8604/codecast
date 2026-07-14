import { create } from 'zustand'
import { CheckpointStatus } from '../lib/types.js'

/**
 * Global store. Deliberately small: toasts (app-wide feedback), the loaded
 * tutorial, a lightweight replay clock slice, and checkpoint progress mirrored
 * from localStorage. Components should select single fields, never destructure
 * the whole store, so the replay clock ticking doesn't re-render everything.
 */

const progressKey = (tutorialId) => `codecast:progress:${tutorialId}`

function readProgress(tutorialId) {
  try {
    return JSON.parse(localStorage.getItem(progressKey(tutorialId)) || '{}')
  } catch {
    return {}
  }
}

let toastSeq = 0

export const useTutorialStore = create((set, get) => ({
  // ---- Toasts -------------------------------------------------------------
  toasts: [],
  pushToast: (message, variant = 'success', ttl = 3200) => {
    const id = ++toastSeq
    set((s) => ({ toasts: [...s.toasts, { id, message, variant }] }))
    if (ttl) setTimeout(() => get().dismissToast(id), ttl)
    return id
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  // ---- Current tutorial ---------------------------------------------------
  currentTutorial: null,
  setCurrentTutorial: (t) => set({ currentTutorial: t }),

  // ---- Replay clock (throttled writes from the rAF loop) ------------------
  clockMs: 0,
  durationMs: 0,
  isPlaying: false,
  setClock: (ms) => set({ clockMs: ms }),
  setDuration: (ms) => set({ durationMs: ms }),
  setPlaying: (v) => set({ isPlaying: v }),

  // ---- Checkpoint progress (mirrors localStorage) -------------------------
  progress: {},
  loadProgress: (tutorialId) => set({ progress: readProgress(tutorialId) }),
  setCheckpointStatus: (tutorialId, checkpointId, status) => {
    const next = { ...readProgress(tutorialId), [checkpointId]: status }
    try {
      localStorage.setItem(progressKey(tutorialId), JSON.stringify(next))
    } catch {
      /* storage may be unavailable; keep in-memory copy anyway */
    }
    set({ progress: next })
  },
  resetProgress: (tutorialId) => {
    try {
      localStorage.removeItem(progressKey(tutorialId))
    } catch {
      /* ignore */
    }
    set({ progress: {} })
  },
}))

export { CheckpointStatus }

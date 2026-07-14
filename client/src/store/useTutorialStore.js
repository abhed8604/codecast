import { create } from 'zustand'

/**
 * Global store. Deliberately small: toasts (app-wide feedback) and a
 * checkpoint-progress slice mirroed from localStorage. Components should select
 * single fields, never destructure the whole store.
 */

const progressKey = (tutorialId) => `codecast:progress:${tutorialId}`

function readProgress(tutorialId) {
  try {
    return JSON.parse(localStorage.getItem(progressKey(tutorialId)) || '{}')
  } catch {
    return {}
  }
}

/** Read a tutorial's saved checkpoint progress directly (for list views that
 *  show many tutorials at once; the store's `progress` holds only one). */
export function getProgress(tutorialId) {
  return readProgress(tutorialId)
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

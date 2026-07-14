import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useTutorialStore } from '../store/useTutorialStore.js'
import { CheckIcon, AlertIcon, XIcon } from './Icons.jsx'

const accent = {
  success: { color: 'var(--success)', Icon: CheckIcon },
  error: { color: 'var(--danger)', Icon: AlertIcon },
  info: { color: 'var(--violet-glow)', Icon: CheckIcon },
}

/**
 * Non-blocking frosted toasts, bottom-right, auto-dismiss. Same visual language
 * as the Modal. Reads/writes the global toast queue in the store.
 */
export default function ToastHost() {
  const toasts = useTutorialStore((s) => s.toasts)
  const dismiss = useTutorialStore((s) => s.dismissToast)

  return createPortal(
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => {
          const { color, Icon } = accent[t.variant] || accent.info
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              className="frost pointer-events-auto flex items-start gap-3 rounded-panel px-4 py-3"
            >
              <span
                className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-sm"
                style={{ color, background: `${color}1f` }}
              >
                <Icon />
              </span>
              <p className="flex-1 pt-0.5 text-sm text-ink">{t.message}</p>
              <button
                onClick={() => dismiss(t.id)}
                className="text-ink-muted transition-colors hover:text-ink"
                aria-label="Dismiss"
              >
                <XIcon className="text-base" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>,
    document.body
  )
}

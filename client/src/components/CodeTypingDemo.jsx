import { memo, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FlagIcon } from './Icons.jsx'

const SNIPPET = `// build a counter that never forgets
def make_counter():
    count = 0
    def next():
        nonlocal count
        count += 1
        return count
    return next

c = make_counter()
print(c(), c(), c())   # -> 1 2 3`

const COLORS = {
  comment: 'text-ink-faint italic',
  string: 'text-[#E9D5FF]',
  keyword: 'text-violet-glow',
  number: 'text-[#C4B5FD]',
  text: 'text-ink',
}

function highlight(src) {
  const tokenRe =
    /(\/\/[^\n]*|"[^"]*"|'[^']*'|\b(def|return|for|in|if|else|while|class|import|from|print|range|len|nonlocal|True|False|None)\b|\b\d+\b)/g
  const parts = []
  let last = 0
  let m
  while ((m = tokenRe.exec(src))) {
    if (m.index > last) parts.push({ t: src.slice(last, m.index), c: 'text' })
    const tok = m[1]
    let c = 'text'
    if (tok.startsWith('//')) c = 'comment'
    else if (tok.startsWith('"') || tok.startsWith("'")) c = 'string'
    else if (/^\d+$/.test(tok)) c = 'number'
    else c = 'keyword'
    parts.push({ t: tok, c })
    last = m.index + tok.length
  }
  if (last < src.length) parts.push({ t: src.slice(last), c: 'text' })
  return parts
}

function CodeTypingDemoBase() {
  const [typed, setTyped] = useState('')
  const [done, setDone] = useState(false)
  const fullRef = useRef(SNIPPET)
  const idxRef = useRef(0)

  useEffect(() => {
    let timer
    const step = () => {
      const full = fullRef.current
      if (idxRef.current < full.length) {
        idxRef.current += 1
        setTyped(full.slice(0, idxRef.current))
        const ch = full[idxRef.current - 1]
        const delay = ch === '\n' ? 240 : 24 + Math.random() * 46
        timer = setTimeout(step, delay)
      } else {
        setDone(true)
        timer = setTimeout(() => {
          idxRef.current = 0
          setTyped('')
          setDone(false)
        }, 2600)
      }
    }
    timer = setTimeout(step, 700)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="frost relative overflow-hidden rounded-panel p-3 shadow-card">
      {/* title bar */}
      <div className="mb-3 flex items-center gap-2 px-1">
        <span className="h-3 w-3 rounded-full bg-violet-primary/70" />
        <span className="h-3 w-3 rounded-full bg-violet-deep/70" />
        <span className="h-3 w-3 rounded-full bg-ink-faint/60" />
        <span className="mono ml-3 text-[11px] text-ink-muted">counter.py</span>
        <span className="mono ml-auto flex items-center gap-1.5 text-[11px] text-ink-muted">
          <span className="h-1.5 w-1.5 animate-blink rounded-full bg-violet-glow" />
          replaying
        </span>
      </div>

      <pre className="mono h-[244px] overflow-hidden whitespace-pre-wrap break-words px-2 text-[13.5px] leading-[1.7]">
        {highlight(typed).map((p, i) => (
          <span key={i} className={COLORS[p.c]}>
            {p.t}
          </span>
        ))}
        <span className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[3px] animate-blink bg-violet-glow align-middle" />
      </pre>

      <div className="mt-1 flex h-[28px] items-center px-1">
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="cp"
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-violet-primary/12 px-3 py-1 text-[12px] font-medium text-violet-glow ring-1 ring-violet-primary/25"
            >
              <FlagIcon className="text-xs" /> Checkpoint reached — your turn
            </motion.div>
          ) : (
            <motion.span
              key="rec"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mono text-[11px] text-ink-faint"
            >
              capturing every keystroke…
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default memo(CodeTypingDemoBase)

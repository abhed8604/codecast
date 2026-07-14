import { memo, useEffect, useState } from 'react'

/**
 * Loops through an array of phrases, typing each character-by-character, holding,
 * then deleting. Used for the "command input" bento card. Isolated + memoized so
 * the parent never re-renders from the timer churn.
 */
function TypewriterBase({ phrases, typeSpeed = 55, deleteSpeed = 28, hold = 1500 }) {
  const [text, setText] = useState('')
  const [idx, setIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = phrases[idx % phrases.length]
    let t
    if (!deleting && text === current) {
      t = setTimeout(() => setDeleting(true), hold)
    } else if (deleting && text === '') {
      setDeleting(false)
      setIdx((i) => (i + 1) % phrases.length)
    } else if (deleting) {
      t = setTimeout(() => setText(current.slice(0, text.length - 1)), deleteSpeed)
    } else {
      t = setTimeout(() => setText(current.slice(0, text.length + 1)), typeSpeed)
    }
    return () => clearTimeout(t)
  }, [text, deleting, idx, phrases, typeSpeed, deleteSpeed, hold])

  return (
    <span className="mono">
      {text}
      <span className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[2px] animate-blink bg-violet-glow" />
    </span>
  )
}

export default memo(TypewriterBase)

// A manga-style speech cloud.
// kind: 'speech' | 'shout' | 'thought' | 'mutter'    tail: 'left' | 'down'
import { useEffect, useState } from 'react'
import { prefersReducedMotion } from './useFrameLoop'

// Shows the text letter by letter. Any key press shows the full text at once.
function useTyped(text, enabled) {
  const [count, setCount] = useState(enabled ? 0 : text.length)

  useEffect(() => {
    if (!enabled || prefersReducedMotion()) { setCount(text.length); return }
    let n = 0
    let timer
    function tick() {
      n += 1
      setCount(n)
      if (n < text.length) timer = setTimeout(tick, 30)
    }
    setCount(0)
    timer = setTimeout(tick, 30)
    function skip() { clearTimeout(timer); setCount(text.length) }
    window.addEventListener('keydown', skip)
    return () => { clearTimeout(timer); window.removeEventListener('keydown', skip) }
  }, [text, enabled])

  return count
}

export default function SpeechBubble({ text, kind = 'speech', tail = 'left', typing = false }) {
  const count = useTyped(text, typing)
  return (
    <div className={`bubble bubble--${kind} bubble--tail-${tail}`}>
      <div className="bubble__shape">
        <div className="bubble__text">
          {/* the hidden part keeps the bubble the same size while typing */}
          <span>{text.slice(0, count)}</span>
          <span className="bubble__ghost">{text.slice(count)}</span>
        </div>
      </div>
      {kind === 'thought'
        ? <><span className="bubble__dot bubble__dot--big" /><span className="bubble__dot bubble__dot--small" /></>
        : <span className="bubble__tail" />}
    </div>
  )
}

// Plays a list of steps like [{ frame: 'stand', ms: 1200 }, ...] in a loop.
// Returns the name of the frame to show right now.
import { useEffect, useState } from 'react'

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function useFrameLoop(steps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setIndex(0)                                   // start again when the mood changes
    if (prefersReducedMotion() || steps.length < 2) return
    let i = 0
    let timer
    function next() {
      i = (i + 1) % steps.length
      setIndex(i)
      timer = setTimeout(next, steps[i].ms)
    }
    timer = setTimeout(next, steps[0].ms)
    return () => clearTimeout(timer)              // always clean up
  }, [steps])

  return (steps[index] ?? steps[0]).frame
}

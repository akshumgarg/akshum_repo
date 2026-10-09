import { useEffect, useState } from 'react'
import { prefersReducedMotion } from '../mascot/useFrameLoop.js'

export const CARTRIDGE_MS = 900 // must match the animation times in cartridge.css

// key = a string that identifies the project that was just opened, or null on screens with no cartridge.
// Returns true while the cartridge animation should show.
export function useCartridge(key) {
  const [doneKey, setDoneKey] = useState(null)
  const reduced = prefersReducedMotion()

  useEffect(() => {
    if (key === null) {
      setDoneKey(null) // we left the project, so the next opening plays again
      return
    }
    if (reduced) return
    const timer = setTimeout(() => setDoneKey(key), CARTRIDGE_MS)
    return () => clearTimeout(timer) // always clean up
  }, [key, reduced])

  return key !== null && doneKey !== key && !reduced
}
import { useEffect } from 'react'

// While active, dispatches 'TICK' every ms milliseconds.
export function useGameTick(active, ms, dispatch) {
  useEffect(() => {
    if (!active) return
    const id = setInterval(() => dispatch('TICK'), ms)
    return () => clearInterval(id) // always clean up
  }, [active, ms, dispatch])
}
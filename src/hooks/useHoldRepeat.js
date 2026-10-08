import { useRef, useEffect, useCallback } from 'react'

const START_DELAY = 400 // ms before repeating starts
const REPEAT_EVERY = 100 // ms between repeats

// Returns pointer handlers for one on-screen button.
// Press once at once, then repeat while the button is held.
export function useHoldRepeat(onPress, action) {
  const delayTimer = useRef(null)
  const repeatTimer = useRef(null)

  // Always call the newest onPress, so repeats never see old state.
  const latest = useRef(onPress)
  useEffect(() => {
    latest.current = onPress
  })

  const stop = useCallback(() => {
    clearTimeout(delayTimer.current)
    clearInterval(repeatTimer.current)
  }, [])

  const start = useCallback(() => {
    stop()
    latest.current(action)
    delayTimer.current = setTimeout(() => {
      repeatTimer.current = setInterval(() => latest.current(action), REPEAT_EVERY)
    }, START_DELAY)
  }, [action, stop])

  useEffect(() => stop, [stop]) // stop when the button is removed

  return {
    onPointerDown: start,
    onPointerUp: stop,
    onPointerLeave: stop,
    onPointerCancel: stop,
  }
}
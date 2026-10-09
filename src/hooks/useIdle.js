import { useEffect, useState } from 'react'

const YAWN_MS = 1600 // how long the yawn lasts before the character falls asleep

// 'awake' -> (after idleMs with no key or tap) 'yawn' -> (1.6 s later) 'sleep'.
// Any key press or tap wakes it up and restarts the timer.
export function useIdle(idleMs = 20000) {
  const [phase, setPhase] = useState('awake')

  useEffect(() => {
    let yawnTimer
    let sleepTimer

    function arm() {
      clearTimeout(yawnTimer)
      clearTimeout(sleepTimer)
      yawnTimer = setTimeout(() => {
        setPhase('yawn')
        sleepTimer = setTimeout(() => setPhase('sleep'), YAWN_MS)
      }, idleMs)
    }

    function onActivity() {
      setPhase('awake')
      arm()
    }

    arm()
    window.addEventListener('keydown', onActivity)
    window.addEventListener('pointerdown', onActivity)
    return () => {
      clearTimeout(yawnTimer)
      clearTimeout(sleepTimer)
      window.removeEventListener('keydown', onActivity)
      window.removeEventListener('pointerdown', onActivity)
    }
  }, [idleMs])

  return phase
}
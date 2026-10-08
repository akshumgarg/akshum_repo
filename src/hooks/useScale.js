import { useState, useEffect } from 'react'

// One number: how much to enlarge or shrink the console to fit the window.
function calcScale() {
  return Math.min(window.innerWidth / 420, window.innerHeight / 700, 1.5)
}

export function useScale() {
  const [scale, setScale] = useState(calcScale)

  useEffect(() => {
    function onResize() {
      setScale(calcScale())
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize) // cleanup is required
  }, [])

  return scale
}

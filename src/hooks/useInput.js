import { useEffect } from 'react'

// Keyboard key (lowercase) -> action name
const KEY_TO_ACTION = {
  arrowup: 'UP', w: 'UP',
  arrowdown: 'DOWN', s: 'DOWN',
  arrowleft: 'LEFT', a: 'LEFT',
  arrowright: 'RIGHT', d: 'RIGHT',
  enter: 'A', z: 'A',
  backspace: 'B', escape: 'B', x: 'B',
  ' ': 'START',
  q: 'SELECT',
}

export function useInput(press) {
  useEffect(() => {
    function onKeyDown(e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return // keep browser shortcuts working
      const action = KEY_TO_ACTION[e.key.toLowerCase()]
      if (!action) return
      e.preventDefault() // stops arrows and Space from scrolling the page
      if (e.repeat && action !== 'UP' && action !== 'DOWN') return // only UP and DOWN repeat
      press(action)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown) // cleanup is required
  }, [press])
}
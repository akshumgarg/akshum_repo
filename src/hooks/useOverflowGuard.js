import { useEffect } from 'react'

// Dev only. Warns in the console if a page is taller than the screen body.
// ref = the element that holds the page content. label = name shown in the warning.
export function useOverflowGuard(ref, label) {
  useEffect(() => {
    if (!import.meta.env.DEV) return
    let cancelled = false

    // Wait for the font, because the wrong font gives the wrong height.
    document.fonts.ready.then(() => {
      const content = ref.current
      if (cancelled || !content) return
      const body = content.parentElement
      const room = body.clientHeight - 8 // the body has 4px padding top and bottom
      if (content.offsetHeight > room) {
        console.warn(`OVERFLOW: "${label}" is ${content.offsetHeight}px tall, room is ${room}px`)
      }
    })

    return () => {
      cancelled = true
    }
  }, [ref, label])
}
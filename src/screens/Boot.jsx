import { useState, useEffect } from 'react'
import { portfolio } from '../data/portfolio.js'

// Boot screen. Waits for the font so the layout does not jump,
// then the name drops in and PRESS START blinks.
export default function Boot() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    const fonts = document.fonts ? document.fonts.ready : Promise.resolve()
    fonts.then(() => {
      if (!cancelled) setReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (!ready) return <div className="center-screen" />

  return (
    <div className="center-screen">
      <div className="boot__name">{portfolio.name}</div>
      <div className="boot__sub dim">PORTFOLIO SYSTEM</div>
      <div className="boot__press">
        <span className="blink">PRESS START</span>
      </div>
    </div>
  )
}
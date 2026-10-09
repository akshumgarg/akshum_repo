import { useState, useEffect } from 'react'
import { portfolio } from '../data/portfolio.js'
import Mascot from '../mascot/Mascot.jsx' // NEW

// Boot screen. Waits for the font so the layout does not jump,
// then the character bows and PRESS START blinks.
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
      {/* NEW: the big bowing character with the welcome cloud. Replaces the name and PORTFOLIO SYSTEM lines */}
      <Mascot
        layout="boot"
        mood="bow"
        say={`WELCOME! I AM ${portfolio.name.toUpperCase()}. PLEASE LOOK AROUND!`}
      />
      <div className="boot__press">
        <span className="blink">PRESS START</span>
      </div>
    </div>
  )
}
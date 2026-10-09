// Puts the console in 3D space.
//   Drag with mouse or finger = rotate.   F = flip to the other side.   R = back to the front.
// The front face is your normal <Console /> (it comes in as children).
// The back face is <ConsoleBack />. The thickness is made of thin layers ("slices").
import { useCallback, useEffect, useRef } from 'react'
import ConsoleBack from './ConsoleBack.jsx'

const DEPTH = 36     // thickness in px. Must match --depth in console3d.css
const SLICES = 30    // thin layers that make the rounded side of the body
const MAX_TILT = 40  // how far you can tilt up and down (degrees)

// z position of each slice, from the back to the front
const SLICE_Z = Array.from({ length: SLICES }, (_, i) => -DEPTH / 2 + ((i + 1) * DEPTH) / (SLICES + 1))

// Puts the angles on the element. smooth = move with an animation.
function paint(el, angles, smooth) {
  el.classList.toggle('is-smooth', smooth)
  el.style.transform = `rotateX(${angles.rx}deg) rotateY(${angles.ry}deg)`
  // seen from the side it gets darker, like real light and shade
  el.style.setProperty('--shade', (Math.abs(Math.sin((angles.ry * Math.PI) / 180)) * 0.45).toFixed(2))
}

export default function Console3D({ children }) {
  const sceneRef = useRef(null)
  const bodyRef = useRef(null)
  const angles = useRef({ rx: 0, ry: 0 })   // current rotation in degrees
  const last = useRef(null)                 // last pointer position while dragging

  // Small intro: starts turned a little, then swings to the front.
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) { paint(bodyRef.current, angles.current, false); return }
    angles.current = { rx: 12, ry: -40 }
    paint(bodyRef.current, angles.current, false)
    let id = requestAnimationFrame(() => {
      id = requestAnimationFrame(() => {
        angles.current = { rx: 0, ry: 0 }
        paint(bodyRef.current, angles.current, true)
      })
    })
    return () => cancelAnimationFrame(id)
  }, [])

  // 'flip' = turn to the other side, 'reset' = back to the front
  const turn = useCallback((kind) => {
    const a = angles.current
    a.ry = kind === 'flip' ? (Math.round(a.ry / 180) + 1) * 180 : Math.round(a.ry / 360) * 360
    a.rx = 0
    paint(bodyRef.current, a, true)
  }, [])

  // Keyboard: F and R are not used by the game keys.
  useEffect(() => {
    function onKeyDown(e) {
      if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return
      const key = e.key.toLowerCase()
      if (key === 'f') turn('flip')
      if (key === 'r') turn('reset')
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [turn])

  function onPointerDown(e) {
    if (e.target.closest('button, a')) return          // game buttons keep working
    last.current = { x: e.clientX, y: e.clientY }
    sceneRef.current.setPointerCapture(e.pointerId)
    sceneRef.current.classList.add('is-dragging')
  }

  function onPointerMove(e) {
    if (!last.current) return
    const a = angles.current
    a.ry += (e.clientX - last.current.x) * 0.6
    a.rx = Math.max(-MAX_TILT, Math.min(MAX_TILT, a.rx - (e.clientY - last.current.y) * 0.4))
    last.current = { x: e.clientX, y: e.clientY }
    paint(bodyRef.current, a, false)
  }

  function onPointerUp() {
    if (!last.current) return
    last.current = null
    sceneRef.current.classList.remove('is-dragging')
    const a = angles.current
    const nearest = Math.round(a.ry / 180) * 180
    if (Math.abs(a.ry - nearest) < 14) a.ry = nearest   // close to front or back: snap
    if (Math.abs(a.rx) < 8) a.rx = 0
    paint(bodyRef.current, a, true)
  }

  return (
    <div
      className="scene"
      ref={sceneRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="scene__shadow" />

      <div className="c3d-float">
        <div className="c3d-body" ref={bodyRef}>
          {SLICE_Z.map((z) => (
            <div key={z} className="c3d-slice" style={{ transform: `translateZ(${z}px)` }} />
          ))}
          {/* flat walls so the edge never disappears when seen exactly from the side */}
          <div className="c3d-wall c3d-wall--left" />
          <div className="c3d-wall c3d-wall--right" />
          <div className="c3d-wall c3d-wall--top" />
          <div className="c3d-wall c3d-wall--bottom" />

          <div className="c3d-front">{children}</div>
          <ConsoleBack />
        </div>
      </div>

      <div className="scene__tools">
        <button type="button" tabIndex={-1} aria-label="Flip the console" onClick={() => turn('flip')}>FLIP</button>
        <button type="button" tabIndex={-1} aria-label="Show the front" onClick={() => turn('reset')}>FRONT</button>
        <span>DRAG TO ROTATE</span>
      </div>
    </div>
  )
}

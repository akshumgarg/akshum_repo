// Puts the console in 3D space.
//   Drag with mouse or finger = rotate.   F = flip to the other side.   R = back to the front.
// The front face is your normal <Console /> (it comes in as children). The back face is <ConsoleBack />.
// The thickness is a solid prism: thin side faces computed from the console outline (a few dozen tiny layers,
// instead of dozens of full-size ones, so phones can draw it).
import { useCallback, useEffect, useRef } from 'react'
import ConsoleBack from './ConsoleBack.jsx'

const W = 380            // console size. Must match console.css and --w / --h in console3d.css
const H = 640
const DEPTH = 36         // thickness in px. Must match --depth in console3d.css
const RADII = { tl: 14, tr: 14, br: 70, bl: 14 } // corner sizes. Must match console.css (14px 14px 70px 14px)
const MAX_TILT = 40      // how far you can tilt up and down (degrees)
const SIDE_RGB = [179, 174, 155] // side color, #b3ae9b

// Points along a corner arc (angles in degrees, y points down like on the screen)
function arc(cx, cy, r, fromDeg, toDeg, steps) {
  const pts = []
  for (let i = 0; i <= steps; i++) {
    const a = ((fromDeg + ((toDeg - fromDeg) * i) / steps) * Math.PI) / 180
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)])
  }
  return pts
}

// One thin wall per piece of the outline. Walked counter-clockwise, so each wall faces outward.
function buildSides() {
  const { tl, tr, br, bl } = RADII
  const raw = [
    [0, tl],
    [0, H - bl],
    ...arc(bl, H - bl, bl, 180, 90, 4),
    ...arc(W - br, H - br, br, 90, 0, 10),
    ...arc(W - tr, tr, tr, 0, -90, 4),
    ...arc(tl, tl, tl, -90, -180, 4),
  ]
  // drop points that repeat
  const pts = raw.filter((p, i) => i === 0 || Math.hypot(p[0] - raw[i - 1][0], p[1] - raw[i - 1][1]) > 0.01)
  const first = pts[0]
  const last = pts[pts.length - 1]
  if (Math.hypot(first[0] - last[0], first[1] - last[1]) < 0.01) pts.pop()

  return pts.map((p0, i) => {
    const p1 = pts[(i + 1) % pts.length]
    const dx = p1[0] - p0[0]
    const dy = p1[1] - p0[1]
    const len = Math.hypot(dx, dy)
    const deg = (Math.atan2(dy, dx) * 180) / Math.PI
    // light from the top left: walls facing up or left are brighter, down or right darker
    const nx = -dy / len
    const ny = dx / len
    const f = 0.86 + 0.16 * (nx * -0.55 + ny * -0.8)
    const rgb = SIDE_RGB.map((c) => Math.round(Math.min(255, c * f)))
    return {
      key: i,
      style: {
        width: `${(len + 0.6).toFixed(2)}px`, // a hair longer, so neighbours never leave a crack
        transform: `translate3d(${p0[0].toFixed(2)}px, ${p0[1].toFixed(2)}px, ${DEPTH / 2}px) rotateZ(${deg.toFixed(3)}deg) rotateX(-90deg)`,
        background: `rgb(${rgb.join(',')})`,
      },
    }
  })
}

const SIDES = buildSides() // built once

// Puts the angles on the element. smooth = move with an animation.
function paint(el, angles, smooth) {
  const rad = (deg) => (deg * Math.PI) / 180
  el.classList.toggle('is-smooth', smooth)
  el.style.transform = `rotateX(${angles.rx}deg) rotateY(${angles.ry}deg)`
  // seen from the side it gets darker, like real light and shade
  el.style.setProperty('--shade', (Math.abs(Math.sin(rad(angles.ry))) * 0.45).toFixed(2))
  // how far the front is turned sideways and up/down (-1 to 1): the buttons use this to show their sides
  el.style.setProperty('--tx', Math.sin(rad(angles.ry)).toFixed(3))
  el.style.setProperty('--ty', (-Math.sin(rad(angles.rx))).toFixed(3))
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
          {SIDES.map((s) => (
            <div key={s.key} className="c3d-side" style={s.style} />
          ))}

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
import '../styles/buttons3d.css'

// Thin layers stacked in depth. They give a button its thickness when the console turns in 3D.
// They only show inside the 3D console (see buttons3d.css) and never take clicks.
export default function Slices({ count, top = false }) {
  const upperFrom = Math.ceil(count / 2) // a pressed button hides its upper half
  return Array.from({ length: count }, (_, i) => {
    let cls = 'slice'
    if (i >= upperFrom) cls += ' slice--upper'
    if (top && i === count - 1) cls += ' slice--top'
    return <span key={i} className={cls} style={{ '--i': i }} aria-hidden="true" />
  })
}
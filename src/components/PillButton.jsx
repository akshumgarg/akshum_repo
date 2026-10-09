// Used for START and SELECT. The label is also the action name.
// The three empty spans are the layers under the button that make its thickness (see console3d.css).
export default function PillButton({ label, x, y, onPress, pressed }) {
  const down = pressed === label
  return (
    <div className={`pill${down ? ' is-down' : ''}`} style={{ left: x, top: y }}>
      <span className="btn-layer btn-layer--0" aria-hidden="true" />
      <span className="btn-layer btn-layer--1" aria-hidden="true" />
      <span className="btn-layer btn-layer--2" aria-hidden="true" />
      <button
        className={`pill-btn${down ? ' is-pressed' : ''}`}
        aria-label={`${label} button`}
        tabIndex={-1}
        onPointerDown={() => onPress(label)}
        onContextMenu={(e) => e.preventDefault()}
      />
      <span className="btn-label">{label}</span>
    </div>
  )
}
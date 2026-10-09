// Used for START and SELECT. The label is also the action name.
export default function PillButton({ label, x, y, onPress, pressed }) {
  return (
    <div className="pill" style={{ left: x, top: y }}>
      <button
        className={`pill-btn${pressed === label ? ' is-pressed' : ''}`}
        aria-label={`${label} button`}
        tabIndex={-1}
        onPointerDown={() => onPress(label)}
        onContextMenu={(e) => e.preventDefault()}
      />
      <span className="btn-label">{label}</span>
    </div>
  )
}
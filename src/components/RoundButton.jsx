import Slices from './Slices.jsx'

// Used for A and B. The label is also the action name.
export default function RoundButton({ label, x, y, onPress, pressed }) {
  return (
    <div className="round" style={{ left: x, top: y }}>
      <button
        className={`round-btn${pressed === label ? ' is-pressed' : ''}`}
        aria-label={`${label} button`}
        tabIndex={-1}
        onPointerDown={() => onPress(label)}
        onContextMenu={(e) => e.preventDefault()}
      />
      <Slices count={6} />
      <span className="btn-label">{label}</span>
    </div>
  )
}
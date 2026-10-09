const DIRECTIONS = [
  { dir: 'up', label: 'Up', action: 'UP' },
  { dir: 'down', label: 'Down', action: 'DOWN' },
  { dir: 'left', label: 'Left', action: 'LEFT' },
  { dir: 'right', label: 'Right', action: 'RIGHT' },
]

// The four empty spans are the layers of the cross that make its thickness (see console3d.css).
export default function Dpad({ onPress, pressed }) {
  const down = DIRECTIONS.some((d) => d.action === pressed)
  return (
    <div className={`dpad${down ? ' is-down' : ''}`}>
      <span className="btn-layer btn-layer--0" aria-hidden="true" />
      <span className="btn-layer btn-layer--1" aria-hidden="true" />
      <span className="btn-layer btn-layer--2" aria-hidden="true" />
      <span className="btn-layer btn-layer--3" aria-hidden="true" />
      {DIRECTIONS.map(({ dir, label, action }) => (
        <button
          key={dir}
          className={`dpad-btn${pressed === action ? ' is-pressed' : ''}`}
          data-dir={dir}
          aria-label={label}
          tabIndex={-1}
          onPointerDown={() => onPress(action)}
          onContextMenu={(e) => e.preventDefault()}
        />
      ))}
    </div>
  )
}
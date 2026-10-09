const DIRECTIONS = [
  { dir: 'up', label: 'Up', action: 'UP' },
  { dir: 'down', label: 'Down', action: 'DOWN' },
  { dir: 'left', label: 'Left', action: 'LEFT' },
  { dir: 'right', label: 'Right', action: 'RIGHT' },
]

export default function Dpad({ onPress, pressed }) {
  return (
    <div className="dpad">
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
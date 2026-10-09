import Slices from './Slices.jsx'

const DIRECTIONS = [
  { dir: 'up', label: 'Up', action: 'UP' },
  { dir: 'down', label: 'Down', action: 'DOWN' },
  { dir: 'left', label: 'Left', action: 'LEFT' },
  { dir: 'right', label: 'Right', action: 'RIGHT' },
]

export default function Dpad({ onPress, pressed }) {
  // In the 3D console the whole cross tilts toward the pressed direction.
  const tilt = DIRECTIONS.find((d) => d.action === pressed)?.dir

  return (
    <div className={`dpad${tilt ? ` dpad--${tilt}` : ''}`}>
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
      <Slices count={7} top />
    </div>
  )
}
import '../styles/game.css'
import { COLS, ROWS } from '../state/snake.js'

// Draws the board. No logic.
export default function GameScreen({ game }) {
  if (!game) {
    return (
      <div className="center-screen">
        <div>NO DATA</div>
      </div>
    )
  }

  const { snake, food, over } = game

  return (
    <div className="game">
      <svg
        className="game__board"
        viewBox={`0 0 ${COLS} ${ROWS}`}
        shapeRendering="crispEdges"
        aria-hidden="true"
      >
        <rect x="0" y="0" width={COLS} height={ROWS} style={{ fill: 'var(--c0)', stroke: 'var(--c2)', strokeWidth: 0.3 }} />
        {food && <rect x={food[0] + 0.2} y={food[1] + 0.2} width="0.6" height="0.6" style={{ fill: 'var(--c3)' }} />}
        {snake.map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="1" height="1" style={{ fill: i === 0 ? 'var(--c3)' : 'var(--c2)' }} />
        ))}
      </svg>
      {over && <p className="game__over">GAME OVER</p>}
    </div>
  )
}
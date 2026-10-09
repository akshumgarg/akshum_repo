// Draws one frame (a grid of text) as a small SVG picture.
// Each character in the grid is one pixel: '.' = clear, '0'..'3' = palette shade.
import { frames as baseFrames } from './frames/character'
import { extraFrames } from './frames/extra'
const frames = { ...baseFrames, ...extraFrames }

const cache = {}   // frame name -> list of rectangles (built once, then reused)

function getRects(name) {
  if (cache[name]) return cache[name]
  const rows = frames[name] ?? frames.stand
  const rects = []
  rows.forEach((row, y) => {
    let x = 0
    while (x < row.length) {
      if (row[x] === '.') { x += 1; continue }
      // join pixels of the same shade in one row into one rectangle
      let end = x
      while (end + 1 < row.length && row[end + 1] === row[x]) end += 1
      rects.push({ x, y, w: end - x + 1, shade: row[x] })
      x = end + 1
    }
  })
  cache[name] = rects
  return rects
}

export default function PixelSprite({ frame, className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {getRects(frame).map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={1} style={{ fill: `var(--c${r.shade})` }} />
      ))}
    </svg>
  )
}

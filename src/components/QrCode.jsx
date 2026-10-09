// Draws the QR code from src/data/qr.js as a small SVG. No library, no logic.
import { qr } from '../data/qr.js'

const BORDER = 4 // quiet border, in modules (the standard size, so phones read it easily)

// Join dark modules in one row into one rectangle. Built once.
const rects = []
qr.rows.forEach((row, y) => {
  let x = 0
  while (x < row.length) {
    if (row[x] !== '1') { x += 1; continue }
    let end = x
    while (end + 1 < row.length && row[end + 1] === '1') end += 1
    rects.push({ x: x + BORDER, y: y + BORDER, w: end - x + 1 })
    x = end + 1
  }
})

export default function QrCode() {
  const total = qr.size + BORDER * 2
  return (
    <svg
      className="back__qr"
      viewBox={`0 0 ${total} ${total}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label="QR code that opens this portfolio on your phone"
    >
      <rect width={total} height={total} fill="#f4f0e2" />
      {rects.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={1} fill="#1a1a22" />
      ))}
    </svg>
  )
}
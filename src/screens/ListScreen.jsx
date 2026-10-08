const VISIBLE = 10

// Draws a list with a cursor. Shows only 10 rows and moves them as the cursor moves.
export default function ListScreen({ items, cursor }) {
  if (items.length === 0) {
    return (
      <div className="center-screen">
        <div>NO DATA</div>
      </div>
    )
  }

  const start = Math.max(0, Math.min(cursor - Math.floor(VISIBLE / 2), items.length - VISIBLE))
  const rows = items.slice(start, start + VISIBLE)
  const hiddenAbove = start > 0
  const hiddenBelow = start + VISIBLE < items.length

  return (
    <div className="list">
      <div className="list__more">{hiddenAbove ? '▲' : ''}</div>
      <ul className="list__rows">
        {rows.map((item, n) => {
          const i = start + n
          const on = i === cursor
          return (
            <li key={i} className={on ? 'list__row list__row--on' : 'list__row'}>
              <span className="list__cursor">{on ? '▶' : ''}</span>
              {item.label}
            </li>
          )
        })}
      </ul>
      <div className="list__more">{hiddenBelow ? '▼' : ''}</div>
    </div>
  )
}
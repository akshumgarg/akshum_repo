import { useRef } from 'react'
import { useOverflowGuard } from '../hooks/useOverflowGuard.js'

// Draws ONE page: a title and its lines. The footer pager is drawn by ScreenView.
export default function PagesScreen({ page, index }) {
  const ref = useRef(null)
  useOverflowGuard(ref, page ? `${page.title} (page ${index + 1})` : 'no page')

  if (!page) {
    return (
      <div className="center-screen">
        <div>NO DATA</div>
      </div>
    )
  }

  return (
    <div className="pages" ref={ref}>
      <p className="pages__title">{page.title}</p>
      {page.lines.map((line, i) => (
        <p className="pages__line" key={i}>
          {line}
        </p>
      ))}
    </div>
  )
}
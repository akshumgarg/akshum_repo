// The glass: header row, body, footer row. Draws only, no logic.
export default function ScreenFrame({ title, footer, children }) {
  return (
    <div className="screen" aria-live="polite">
      <div className="screen-header">{title}</div>
      <div className="screen-body">{children}</div>
      <div className="screen-footer">{footer}</div>
    </div>
  )
}

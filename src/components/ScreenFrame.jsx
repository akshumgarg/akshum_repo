// The glass: header row, body, footer row. Draws only, no logic.
// mascot = optional small character strip, shown between the body and the footer.
export default function ScreenFrame({ title, footer, mascot, children }) { // NEW: mascot
  return (
    <div className="screen" aria-live="polite">
      <div className="screen-header">{title}</div>
      <div className="screen-body">{children}</div>
      {mascot && <div className="screen-mascot">{mascot}</div>} {/* NEW */}
      <div className="screen-footer">{footer}</div>
    </div>
  )
}
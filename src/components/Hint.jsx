// Footer line. items = [['A', 'OPEN'], ['B', 'BACK']]
// center (optional) = text in the middle, for example the page counter.
export default function Hint({ items, center }) {
    const text = items.map(([key, label]) => `${key} ${label}`).join('  ')
  
    if (!center) return <span className="hint">{text}</span>
  
    return (
      <span className="footer-row">
        <span className="hint">{text}</span>
        <span className="footer-center">{center}</span>
      </span>
    )
  }
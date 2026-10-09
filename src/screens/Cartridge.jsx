import '../styles/cartridge.css'

// The cartridge dropping into the slot. Draws only. It covers the page for a moment.
export default function Cartridge({ label }) {
  return (
    <div className="cartridge" aria-hidden="true">
      <div className="cartridge__body">
        <div className="cartridge__label">{label}</div>
      </div>
      <div className="cartridge__slot" />
    </div>
  )
}
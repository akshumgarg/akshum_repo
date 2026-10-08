import Dpad from './Dpad.jsx'
import RoundButton from './RoundButton.jsx'
import PillButton from './PillButton.jsx'

// The whole console body. Whatever you pass as children is shown on the screen.
// onPress(action) is called by the buttons. pressed is the action to show as pushed in.
export default function Console({ palette, scale, onPress, pressed, children }) {
  const btn = { onPress, pressed }

  return (
    <div
      className="console"
      data-palette={palette}
      style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
    >
      <div className="bezel">
        <span className="power-light" />
        {children}
      </div>
      <div className="brand">AKSHUM SYSTEM</div>

      <Dpad {...btn} />
      <RoundButton label="B" x={232} y={470} {...btn} />
      <RoundButton label="A" x={292} y={440} {...btn} />
      <PillButton label="SELECT" x={118} y={552} {...btn} />
      <PillButton label="START" x={192} y={552} {...btn} />

      <div className="speaker">
        {[0, 1, 2, 3, 4].map((n) => (
          <span key={n} />
        ))}
      </div>
    </div>
  )
}
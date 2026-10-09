// The back of the console. Only draws, no logic. Edit the words here.
export default function ConsoleBack() {
  return (
    <div className="c3d-back">
      <div className="back__grip back__grip--left" />
      <div className="back__grip back__grip--right" />

      <div className="back__screw back__screw--tl" />
      <div className="back__screw back__screw--tr" />
      <div className="back__screw back__screw--bl" />
      <div className="back__screw back__screw--br" />

      <div className="back__label">A.G. WORKS</div>
      <div className="back__sub">PORTFOLIO SYSTEM</div>

      <div className="back__battery">
        <div className="back__notch" />
        <div className="back__lines"><i /><i /><i /><i /><i /></div>
        <div className="back__text">NO BATTERIES NEEDED</div>
      </div>

      <div className="back__small">MODEL AG-01</div>
    </div>
  )
}

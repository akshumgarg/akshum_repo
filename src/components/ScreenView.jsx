// Reads the top of the stack and shows the right screen inside the frame.
import ScreenFrame from './ScreenFrame.jsx'
import Hint from './Hint.jsx'
import Boot from '../screens/Boot.jsx'
import ListScreen from '../screens/ListScreen.jsx'
import PagesScreen from '../screens/PagesScreen.jsx'
import GameScreen from '../screens/GameScreen.jsx'
import Cartridge from '../screens/Cartridge.jsx'
import { screenRules, linkForA } from '../state/screenRules.js'
import Mascot from '../mascot/Mascot.jsx'
import { getMascot } from '../state/getMascot.js'
import { useCartridge } from '../hooks/useCartridge.js'

// What the mascot shows when nobody has pressed anything for a while.
const IDLE_INFO = {
  yawn: { mood: 'yawn', say: 'YAWN...' },
  sleep: { mood: 'sleep', say: 'ZZZ...' },
}

// What the mascot shows while the cartridge drops in.
const CARTRIDGE_INFO = { mood: 'excited', say: "LET'S GO!" }

function Message({ text }) {
  return (
    <div className="center-screen">
      <div>{text}</div>
    </div>
  )
}

function listHint(id) {
  if (id === 'menu') return [['A', 'OPEN']]
  if (id === 'options') return [['A', 'CHANGE'], ['B', 'BACK']]
  return [['A', 'OPEN'], ['B', 'BACK']]
}

// idle = 'awake' | 'yawn' | 'sleep' (from useIdle in App.jsx)
export default function ScreenView({ state, idle = 'awake' }) {
  const top = state.stack[state.stack.length - 1]
  const rule = screenRules[top.id]
  const back = [['B', 'BACK']]

  // Hooks must run before any early return.
  // A new key each time a project opens, null on screens without a cartridge.
  const cartKey = rule?.getCartridge ? `${top.id}:${top.params?.index ?? ''}` : null
  const loading = useCartridge(cartKey)

  if (!rule) {
    return (
      <ScreenFrame title="ERROR" footer={<Hint items={back} />}>
        <Message text="NO DATA" />
      </ScreenFrame>
    )
  }

  if (rule.kind === 'boot') {
    return (
      <ScreenFrame title="PORTFOLIO" footer={<Hint items={[['START', 'PLAY']]} />}>
        <Boot />
      </ScreenFrame>
    )
  }

  // Which mood and line to show for this page (or null = no character).
  // The cartridge reaction comes first, then the idle sleep, then the normal mood.
  const base = getMascot(top, state.page, state.cursors[top.id] ?? 0, state.settings)
  let info = base
  if (base && loading) info = CARTRIDGE_INFO
  else if (base && idle !== 'awake') info = IDLE_INFO[idle]
  const strip = info ? <Mascot layout="strip" {...info} /> : null

  if (rule.kind === 'list') {
    const items = rule.getItems(top.params, state.settings)
    const cursor = state.cursors[top.id] ?? 0
    return (
      <ScreenFrame title={rule.title} footer={<Hint items={listHint(top.id)} />} mascot={strip}>
        <ListScreen items={items} cursor={cursor} />
      </ScreenFrame>
    )
  }

  if (rule.kind === 'pages') {
    const pages = rule.getPages(top.params)
    const hasLink = linkForA(state) !== null
    const hint = hasLink ? [['A', 'GO'], ['B', 'BACK']] : back
    const counter = pages.length > 0 ? `< ${state.page + 1}/${pages.length} >` : null
    return (
      <ScreenFrame title={rule.title} footer={<Hint items={hint} center={counter} />} mascot={strip}>
        <PagesScreen page={pages[state.page]} index={state.page} />
        {loading && <Cartridge label={rule.getCartridge(top.params)} />}
      </ScreenFrame>
    )
  }

  if (rule.kind === 'game') {
    const game = state.game
    const hint = game?.over ? [['A', 'AGAIN'], ['B', 'EXIT']] : [['B', 'EXIT']]
    const score = game ? `SCORE ${game.score}` : null
    return (
      <ScreenFrame title={rule.title} footer={<Hint items={hint} center={score} />}>
        <GameScreen game={game} />
      </ScreenFrame>
    )
  }

  return (
    <ScreenFrame title={rule.title} footer={<Hint items={back} />}>
      <Message text="COMING SOON" />
    </ScreenFrame>
  )
}
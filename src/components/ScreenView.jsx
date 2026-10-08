// Reads the top of the stack and shows the right screen inside the frame.
import ScreenFrame from './ScreenFrame.jsx'
import Hint from './Hint.jsx'
import Boot from '../screens/Boot.jsx'
import ListScreen from '../screens/ListScreen.jsx'
import PagesScreen from '../screens/PagesScreen.jsx'
import { screenRules, linkForA } from '../state/screenRules.js'

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

export default function ScreenView({ state }) {
  const top = state.stack[state.stack.length - 1]
  const rule = screenRules[top.id]
  const back = [['B', 'BACK']]

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

  if (rule.kind === 'list') {
    const items = rule.getItems(top.params, state.settings)
    const cursor = state.cursors[top.id] ?? 0
    return (
      <ScreenFrame title={rule.title} footer={<Hint items={listHint(top.id)} />}>
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
      <ScreenFrame title={rule.title} footer={<Hint items={hint} center={counter} />}>
        <PagesScreen page={pages[state.page]} index={state.page} />
      </ScreenFrame>
    )
  }

  return (
    <ScreenFrame title={rule.title} footer={<Hint items={back} />}>
      <Message text="COMING SOON" />
    </ScreenFrame>
  )
}
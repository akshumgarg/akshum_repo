import { useReducer, useState, useRef, useCallback, useEffect } from 'react'
import './styles/palettes.css'
import './styles/console.css'
import './styles/screen.css'
import './styles/screens.css'
import Console from './components/Console.jsx'
import ScreenView from './components/ScreenView.jsx'
import PlainView from './components/PlainView.jsx'
import { useScale } from './hooks/useScale.js'
import { useInput } from './hooks/useInput.js'
import { reducer } from './state/reducer.js'
import { initialState } from './state/initialState.js'
import { linkForA } from './state/screenRules.js'
import { loadSettings, saveSettings } from './state/settingsStorage.js'
import { playSound, soundForAction } from './audio/sound.js'
import './styles/console3d.css'
import Console3D from './components/Console3D.jsx'

const PRESSED_MS = 120

// Start from the initial state, but with the saved settings.
function init() {
  return { ...initialState, settings: loadSettings() }
}

function topId(state) {
  return state.stack[state.stack.length - 1].id
}

export default function App() {
  const scale = useScale()
  const [state, dispatch] = useReducer(reducer, null, init)
  const [pressed, setPressed] = useState(null)
  const timer = useRef(null)

  // Keys and on-screen buttons both end up here.
  const press = useCallback(
    (action) => {
      // pressed look
      setPressed(action)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setPressed(null), PRESSED_MS)

      const url = linkForA(state)
      const opensLink = action === 'A' && url
      const next = reducer(state, action) // the reducer is pure, so this is safe

      // Sound: uses the NEW setting, so turning sound on beeps and turning it off is silent.
      // No beep when nothing happened (like B on the menu).
      if (next.settings.sound && (opensLink || next !== state)) {
        const leavingBoot = topId(state) === 'boot' && topId(next) === 'menu'
        playSound(leavingBoot ? 'boot' : soundForAction(action))
      }

      // A on a link opens it and stops (plan Section 7.4).
      if (opensLink) {
        if (url.startsWith('mailto:')) window.location.href = url
        else window.open(url, '_blank', 'noopener,noreferrer')
        return
      }

      dispatch(action)
    },
    [state]
  )

  useEffect(() => () => clearTimeout(timer.current), [])
  useEffect(() => saveSettings(state.settings), [state.settings])
  useInput(press)

  // Plain view: a normal page instead of the console.
  if (state.view === 'plain') {
    return <PlainView onBack={() => dispatch('SHOW_CONSOLE')} />
  }

  return (
    <div className="stage">
      <div className="scene-holder" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
  <Console3D>
    <Console
      palette={state.settings.palette}
      scale={1}
      onPress={press}
      pressed={pressed}
    >
      <ScreenView state={state} />
    </Console>
  </Console3D>
</div>

      <button type="button" className="plain-link" onClick={() => dispatch('SHOW_PLAIN')}>
        Skip game: plain view
      </button>

      <div className="rotate-overlay">TURN YOUR PHONE UPRIGHT</div>
    </div>
  )
}
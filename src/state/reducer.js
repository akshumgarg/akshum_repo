// Pure function: (state, action) -> new state.
// No window, no document, no component imports.
import { screenRules } from './screenRules.js'
import { PALETTES } from './initialState.js'
import { newGame, tick, turn } from './snake.js'

const KONAMI = ['UP', 'UP', 'DOWN', 'DOWN', 'LEFT', 'RIGHT', 'LEFT', 'RIGHT', 'B', 'A']
const DIRECTIONS = ['UP', 'DOWN', 'LEFT', 'RIGHT']

function topOf(state) {
  return state.stack[state.stack.length - 1]
}

function push(state, id, params) {
  return { ...state, stack: [...state.stack, { id, params }], page: 0 }
}

// Never removes the last screen, so B on the menu does nothing.
function pop(state) {
  if (state.stack.length <= 1) return state
  return { ...state, stack: state.stack.slice(0, -1), page: 0 }
}

function goMenu(state) {
  return { ...state, stack: [{ id: 'menu' }], page: 0 }
}

function setCursor(state, id, value) {
  return { ...state, cursors: { ...state.cursors, [id]: value } }
}

function cyclePalette(state) {
  const i = PALETTES.indexOf(state.settings.palette)
  const next = PALETTES[(i + 1) % PALETTES.length]
  return { ...state, settings: { ...state.settings, palette: next } }
}

// onSelect returns a small description of what to do.
function applyEffect(state, effect) {
  if (!effect) return state
  if (effect.push) return push(state, effect.push, effect.params)
  if (effect.cycle === 'palette') return cyclePalette(state)
  if (effect.toggle === 'sound') {
    return { ...state, settings: { ...state.settings, sound: !state.settings.sound } }
  }
  if (effect.plain) return { ...state, view: 'plain' }
  return state
}

// The hidden code only counts on the menu: B and the arrows would take you elsewhere on other screens.
function nextKonami(state, action, screenId) {
  if (screenId !== 'menu') return 0
  const i = state.konami ?? 0
  if (action === KONAMI[i]) return i + 1
  return action === KONAMI[0] ? 1 : 0
}

function startGame(state) {
  const seed = state.game?.seed ?? 20261009
  return { ...push(state, 'game'), konami: 0, game: newGame(seed) }
}

// Everything the buttons do, except the timer and the Konami counter.
function reduce(state, action) {
  const top = topOf(state)

  // These work on every screen.
  if (action === 'START') return goMenu(state)
  if (action === 'SELECT') return cyclePalette(state)
  if (action === 'B') return pop(state)
  if (action === 'SHOW_PLAIN') return { ...state, view: 'plain' }
  if (action === 'SHOW_CONSOLE') return { ...state, view: 'console' }

  const rule = screenRules[top.id]
  if (!rule) return state

  if (rule.kind === 'boot' && action === 'A') return goMenu(state)

  if (rule.kind === 'list') {
    const count = rule.getItems(top.params, state.settings).length
    if (count === 0) return state
    const cursor = state.cursors[top.id] ?? 0
    if (action === 'UP') return setCursor(state, top.id, (cursor - 1 + count) % count)
    if (action === 'DOWN') return setCursor(state, top.id, (cursor + 1) % count)
    if (action === 'A') return applyEffect(state, rule.onSelect(cursor, state.settings))
  }

  if (rule.kind === 'pages') {
    const count = rule.getPages(top.params).length
    if (count === 0) return state
    if (action === 'LEFT') return { ...state, page: Math.max(state.page - 1, 0) }
    if (action === 'RIGHT') return { ...state, page: Math.min(state.page + 1, count - 1) }
  }

  if (rule.kind === 'game') {
    if (!state.game) return state
    if (DIRECTIONS.includes(action)) {
      const game = turn(state.game, action)
      return game === state.game ? state : { ...state, game }
    }
    if (action === 'A' && state.game.over) return { ...state, game: newGame(state.game.seed) }
  }

  return state
}

export function reducer(state, action) {
  const top = topOf(state)

  // Game timer: only does something on the game screen.
  if (action === 'TICK') {
    if (top.id !== 'game' || !state.game) return state
    const game = tick(state.game)
    return game === state.game ? state : { ...state, game }
  }

  // Konami code: the last A starts the game instead of opening a menu item.
  const count = nextKonami(state, action, top.id)
  if (count === KONAMI.length) return startGame(state)

  const next = reduce(state, action)
  return (next.konami ?? 0) === count ? next : { ...next, konami: count }
}
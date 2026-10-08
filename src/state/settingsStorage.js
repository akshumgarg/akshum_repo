// Load and save settings in localStorage.
// localStorage can fail (private mode, blocked storage), so everything is in try/catch.
import { initialState, PALETTES } from './initialState.js'

const KEY = 'retro-portfolio-settings'

export function loadSettings() {
  const settings = { ...initialState.settings }
  try {
    const saved = JSON.parse(localStorage.getItem(KEY))
    if (saved && PALETTES.includes(saved.palette)) settings.palette = saved.palette
    if (saved && typeof saved.sound === 'boolean') settings.sound = saved.sound
  } catch {
    // Empty or broken storage: use the defaults.
  }
  return settings
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(KEY, JSON.stringify(settings))
  } catch {
    // Ignore. The app works without saving.
  }
}
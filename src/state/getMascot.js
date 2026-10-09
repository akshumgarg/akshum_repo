// Decides which mood and line to show. Pure function: no React, no window.
// Order: the current page / highlighted item  ->  the screen's default  ->  idle.
import { screenRules } from './screenRules'

export function getMascot(top, page, cursor, settings) { // NEW: settings
  const rule = screenRules[top.id]
  if (!rule || rule.mascot === false) return null // mascot hidden on this screen

  const base = rule.mascot ?? {}
  let item = null
  if (rule.kind === 'pages') item = rule.getPages(top.params)[page]
  if (rule.kind === 'list') item = rule.getItems(top.params, settings)[cursor] // NEW: settings

  return {
    mood: item?.mood ?? base.mood ?? 'idle',
    say: item?.say ?? base.say ?? '',
    bubble: item?.bubble ?? base.bubble, // undefined = the mood decides
  }
}
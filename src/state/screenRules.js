// The registry: what kind each screen is and what A does on it.
// Never import components in this file.
import { portfolio } from '../data/portfolio.js'

export const MENU_ITEMS = [
  { label: 'ABOUT', target: 'about' },
  { label: 'PROJECTS', target: 'projects' },
  { label: 'SKILLS', target: 'skills' },
  { label: 'EXPERIENCE', target: 'experience' },
  { label: 'CONTACT', target: 'contact' },
  { label: 'OPTIONS', target: 'options' },
]

// The Options rows change with the settings, so they are built from settings.
function optionItems(settings) {
  return [
    { label: `SOUND: ${settings.sound ? 'ON' : 'OFF'}`, effect: { toggle: 'sound' } },
    { label: `PALETTE: ${settings.palette.toUpperCase()}`, effect: { cycle: 'palette' } },
    { label: 'PLAIN VIEW', effect: { plain: true } },
  ]
}

// getItems and getPages always return an array, even for bad data or a bad index.
// mascot = the default mood and line for the screen. A page or item in portfolio.js can override it.
export const screenRules = {
  boot: { kind: 'boot' },
  menu: {
    kind: 'list',
    title: 'MAIN MENU',
    mascot: { mood: 'idle', say: 'WHERE TO?' }, // NEW
    getItems: () => MENU_ITEMS,
    onSelect: (i) => ({ push: MENU_ITEMS[i].target }),
  },
  about: {
    kind: 'pages',
    title: 'ABOUT',
    mascot: { mood: 'wave', say: 'HI! NICE TO MEET YOU.' }, // NEW
    getPages: () => portfolio.about ?? [],
  },
  skills: {
    kind: 'pages',
    title: 'SKILLS',
    mascot: { mood: 'proud', say: 'WHAT I USE.' }, // NEW
    getPages: () => portfolio.skills ?? [],
  },

  projects: {
    kind: 'list',
    title: 'PROJECTS',
    mascot: { mood: 'excited', say: 'PICK A PROJECT!' }, // NEW
    getItems: () => portfolio.projects ?? [],
    onSelect: (i) => ({ push: 'projectDetail', params: { index: i } }),
  },
  projectDetail: {
    kind: 'pages',
    title: 'PROJECT',
    mascot: { mood: 'happy' }, // NEW
    getPages: (p) => portfolio.projects?.[p?.index]?.pages ?? [],
  },

  experience: {
    kind: 'list',
    title: 'EXPERIENCE',
    mascot: { mood: 'idle', say: 'MY WORK SO FAR.' }, // NEW
    getItems: () => portfolio.experience ?? [],
    onSelect: (i) => ({ push: 'experienceDetail', params: { index: i } }),
  },
  experienceDetail: {
    kind: 'pages',
    title: 'EXPERIENCE',
    mascot: { mood: 'idle' }, // NEW
    getPages: (p) => portfolio.experience?.[p?.index]?.pages ?? [],
  },

  contact: {
    kind: 'list',
    title: 'CONTACT',
    mascot: { mood: 'wave', say: 'SAY HELLO!' }, // NEW
    getItems: () => portfolio.contact ?? [],
    getLink: (i) => portfolio.contact?.[i]?.url ?? null,
    onSelect: () => null, // App.press opens the link before the reducer runs
  },

  options: {
    kind: 'list',
    title: 'OPTIONS',
    mascot: { mood: 'thinking', say: 'TWEAK ME.' }, // NEW
    getItems: (params, settings) => optionItems(settings),
    onSelect: (i, settings) => optionItems(settings)[i]?.effect ?? null,
  },
}

// Returns a url if A should open a link on this screen, else null.
export function linkForA(state) {
  const top = state.stack[state.stack.length - 1]
  const rule = screenRules[top.id]
  if (!rule) return null

  if (rule.kind === 'list' && rule.getLink) {
    const cursor = state.cursors[top.id] ?? 0
    return rule.getLink(cursor, top.params)
  }

  if (rule.kind === 'pages') {
    const pages = rule.getPages(top.params)
    return pages[state.page]?.link?.url ?? null
  }

  return null
}
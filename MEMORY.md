# Project Memory: Retro Console Portfolio

Owner: Akshum
Plan file: PLAN.md (the source of truth for the design)
Stack: React + Vite, JavaScript, plain CSS. No router, no extra libraries.
Last updated: Phase 3 done

---

## How to resume (paste into a new chat)

"I am building the retro console portfolio from PLAN.md. memory.md says
which phases are done. Continue with the next phase. Give full code for
every file you create or replace, no zip."

---

## Status

- [x] Phase 0: Setup
- [x] Phase 1: Console shell (looks only)
- [x] Phase 2: Input (keys + on-screen buttons, pressed look)
- [x] Phase 3: Screen manager and menu
- [ ] Phase 4: Data and simple screens (About, Skills, Contact)
- [ ] Phase 5: Projects and Experience
- [ ] Phase 6: Polish and Options
- [ ] Phase 7: Phones, Plain View, SEO, deploy

Git tags: phase-3-done (add earlier ones if made)

---

## Current file structure

src/
  main.jsx
  App.jsx                   useReducer, press(), pressed look, renders Console > ScreenView
  data/
    portfolio.js            ALL content (about, skills, contact; projects/experience empty)
  components/
    Console.jsx  ScreenFrame.jsx  Dpad.jsx  RoundButton.jsx  PillButton.jsx
    ScreenView.jsx          picks Boot / ListScreen / PagesScreen / COMING SOON
    Hint.jsx                footer hint line, optional centered counter
  screens/
    Boot.jsx
    ListScreen.jsx          generic list, windowing (10 rows, ▲ ▼), NO DATA fallback
    PagesScreen.jsx         generic pages, shows one page, NO DATA fallback
  state/
    initialState.js  reducer.js
    screenRules.js          registry + linkForA (list getLink, pages link)
  hooks/
    useInput.js  useScale.js
    useOverflowGuard.js     dev-only warning if a page is too tall
  styles/
    reset.css  console.css  screen.css  palettes.css
    screens.css             center-screen, footer-row, list, pages
  audio/sound.js            Web Audio beeps (move, select, back, boot), context created on first beep
  state/settingsStorage.js  load/save settings in localStorage, try/catch
  hooks/useHoldRepeat.js    pointer handlers: press, then repeat after 400ms every 100ms
  screens/Boot.jsx          waits for document.fonts.ready, drop-in + blink

Not created yet: data/portfolio.js, ListScreen.jsx, PagesScreen.jsx,
Options.jsx, PlainView.jsx, audio/sound.js

---

## How it works now

Key/click -> useInput or button -> App.press(action)
  -> (A on a link? open it and stop; no links yet)
  -> dispatch(action) -> reducer -> new state -> ScreenView redraws

State shape:
  stack:    [{ id, params? }]  last item = visible screen
  cursors:  { menu: 2 }        remembered cursor per list
  page:     0                  for pages screens (Phase 4)
  settings: { palette, sound }
  view:     'console' | 'plain'

Reducer rules:
- START: go to menu, clear stack
- SELECT: cycle palette (green, grey, amber)
- B: pop, never removes the last screen (B on menu does nothing)
- A on boot: go to menu
- List: UP/DOWN wrap around; A runs onSelect(cursor) -> effect
- Effects: { push, params } | { cycle: 'palette' } | { toggle: 'sound' } | { plain: true }
- Unknown screen id: shows "NO DATA"
- 'blank' screens show COMING SOON

---

## Decisions made

- Screen is HTML/CSS, not canvas (sharp text, accessible).
- Own screen stack instead of a router.
- Reducer and screenRules never import components (no circular imports).
- Console branding is my own: "AKSHUM SYSTEM". No Nintendo names or logos.
- Screens only draw; all logic is in the reducer.
- Press Start 2P font with a monospace fallback.

## Known issues / notes

- ▶ may fall back to another font.
- linkForA always returns null until Phase 4.
- Boot animation, sound, saved settings and the drop-in effect are Phase 6.

---

## Next: Phase 4

Files: data/portfolio.js, PagesScreen.jsx, ListScreen.jsx, screenRules.js (update)
- Write real content in portfolio.js (limits: 14 lines/page, ~33 chars/line)
- PagesScreen: title, lines, "< 1/3 >" footer, LEFT/RIGHT in the reducer
- ListScreen: windowing (10 rows, ▲ ▼); Contact uses it
- linkForA opens Contact links
- Dev-only overflow guard

---

## Change log

- Phase 0-2: project setup, console shell, input and pressed look.
- Phase 3: added reducer, screenRules, initialState, ScreenView, Boot, Menu,
  Hint, screens.css. App.jsx now uses useReducer. Fake "LAST: UP" screen removed.

  - [x] Phase 4: Data and simple screens (About, Skills, Contact)

  - Phase 4: added portfolio.js, ListScreen, PagesScreen, useOverflowGuard.
  Reducer now handles LEFT/RIGHT on pages. linkForA works for Contact and
  page links. Menu.jsx deleted; the menu uses ListScreen. Sample text in
  portfolio.js still needs my real details (EDIT ME lines, contact links).

  ## Next: Phase 5
Projects and Experience: add data, set projects/experience/*Detail rules to
list + pages, params carry the item index, test with 12+ items, links open
on the Links page.

- [x] Phase 5: Projects and Experience

- Phase 5: only portfolio.js and screenRules.js changed. Added projects,
  projectDetail, experience, experienceDetail rules. Reducer unchanged
  (params, page reset and cursor memory were already built in Phase 3/4).
  Getters use ?. and ?? [] so a bad index shows NO DATA instead of crashing.
  Tested windowing with 12 fake items, then removed them.

  ## Next: Phase 6
Polish and Options: Boot animation (wait for document.fonts.ready), sound.js
(Web Audio beeps, off by default), real Options screen (sound, palette, plain view),
save settings in localStorage with try/catch, hold-to-repeat on on-screen D-pad,
reduced-motion CSS.

- [x] Phase 6: Polish and Options (hold-to-repeat on the on-screen D-pad still pending)

- Phase 6: Boot animation, sound.js, Options screen (SOUND, PALETTE),
  settings saved in localStorage (loaded in useReducer init, saved in a useEffect).
  getItems/onSelect now receive settings as a second argument. press() computes
  next = reducer(state, action) to decide the beep (uses the NEW sound setting,
  silent when nothing changed). Reduced-motion media query added.
  PLAIN VIEW option intentionally left for Phase 7. Typewriter effect skipped.
  useHoldRepeat.js written but not yet connected to Dpad.jsx.

  ## Next: Phase 7
Phone landscape overlay, 100dvh, PlainView.jsx + Options item + link under the
console, index.html meta/OG/noscript, build, deploy on Vercel, final checklist.
# Retro Console Portfolio: Architecture and Build Plan

Owner: Akshum
Status: Planning (nothing built yet)

---

## 0. How to use this file

1. Build **one phase at a time**. Do not start the next phase until every line in "Done when" is true.
2. After each phase, make a git commit and a tag, for example `phase-3-done`.
3. If something breaks, read **Section 11 (Known problems)** first. Most problems are listed there.
4. Keep this file in the project root as `PLAN.md`. Tick the boxes in **Section 14** as you go.
5. Code rules:
   - One file does one job.
   - Keep files short (aim for under 120 lines).
   - Use simple names. No clever tricks.
   - You must be able to explain every line yourself.

---

## 1. Goal and scope

**Goal:** A portfolio website that looks like an old handheld game console (a rectangle with a screen and buttons). The screen shows a menu. The buttons move around the menu and open my info: About, Projects, Skills, Experience, Contact.

**In version 1:**
- Console look (body, screen, D-pad, A, B, START, SELECT)
- Keyboard controls and click/touch controls
- Boot screen, main menu, 5 content sections, an Options screen
- Works on desktop and on a phone held upright
- A "plain view" for people who just want to read (recruiters, screen readers, search engines)
- Live on the internet

**Not in version 1** (maybe later, see Section 15):
- Mini-games, achievements, project screenshots, URL routing

**Assumptions I made (change them now if you disagree):**
- Classic green four-shade screen (Section 4.3)
- React + plain CSS, no extra libraries
- JavaScript, not TypeScript

---

## 2. Words used in this file

Each word is explained once, here.

- **Component:** A React function that returns a piece of the page. Example: `Dpad` draws the D-pad.
- **Props:** The inputs you give to a component, like arguments to a function.
- **State:** Data the app remembers. When state changes, the screen redraws.
- **Action:** A short word that says what the player just did. Example: `UP`, `A`, `B`.
- **Reducer:** One function that takes the old state and an action, and returns the new state. All button logic lives here.
- **Dispatch:** Sending an action to the reducer.
- **Stack:** A pile. You add on top and remove from the top. Our screens are a stack: opening a screen adds it on top, going back removes it.
- **Hook:** A function whose name starts with `use` (like `useState`). A custom hook is one we write ourselves, like `useInput`.
- **Effect (`useEffect`):** Code that runs after the screen draws. We use it to add and remove keyboard listeners.
- **Event listener:** Code that waits for something to happen (a key press, a click).
- **Pointer event:** One event type that covers mouse, finger and pen.
- **CSS variable:** A named value in CSS, like `--c0`. Change it once and everything using it changes.
- **Palette:** The set of colors used. Ours has 4 shades for the screen.
- **Scanlines:** Thin dark horizontal lines over the screen to look like an old display.
- **Windowing:** Showing only a few rows of a long list at a time, and moving the visible part as the cursor moves.
- **Registry (screen rules):** One file that lists every screen and its rules (is it a list or pages, how many items, what happens on A).
- **Build:** Turning your source code into the final files that a web server can send.
- **Deploy:** Putting the built files on the internet.
- **Vite:** The tool that runs our dev server and does the build.

---

## 3. Technology choices

| Topic | Decision | Why |
|---|---|---|
| Framework | React + Vite | You already know React. Vite starts fast. |
| Language | JavaScript | Less to explain. |
| Styling | Plain CSS files + CSS variables | No extra library. Easy to explain. |
| Screen drawing | HTML and CSS, **not** canvas | Text stays sharp, can be selected, and can be read by screen readers and search engines. |
| Moving between screens | Our own screen stack in state | A router library is too much for this. Matches how a console works. |
| State | `useReducer` | All button logic is in one place. |
| Content | One data file | Edit once, every screen updates. |
| Sound | Web Audio beeps, **off by default** | No audio files. Browsers block sound until the user interacts. |
| Font | Press Start 2P (Google Fonts), fallback `monospace` | Classic pixel look. |
| Hosting | Vercel (GitHub Pages also works, see Section 11) | Free. |

---

## 4. What the user sees

### 4.1 Layout

```
+----------------------------------+
|  o  (power light)                |
|  +----------------------------+  |
|  |                            |  |
|  |          SCREEN            |  |
|  |       280 x 252 px         |  |
|  |                            |  |
|  +----------------------------+  |
|   AKSHUM SYSTEM                  |
|                                  |
|     [  D-PAD  ]        (B) (A)   |
|                                  |
|          (SELECT) (START)        |
|                          /////   |  <- speaker lines
+----------------------------------+
        console: 380 x 640 px
```

Use your own name and labels on the console. **Do not copy Nintendo names, logos or text.** The shape is inspired by old handhelds, but the branding must be yours.

### 4.2 Sizes (all are "logical" pixels, the whole console is scaled later)

| Thing | Size |
|---|---|
| Console body | 380 x 640 |
| Screen | 280 x 252 (about 10:9) |
| Screen padding | 8 |
| Font size | 8 px (Press Start 2P looks best at multiples of 8) |
| Line height | 12 px |
| List row height | 16 px |
| Header row / footer row | 20 px each |
| Text columns | about 33 characters per line |
| Body lines per page | at most 14 |
| Visible list rows | 10 |

**Scaling:** A hook called `useScale` works out one number: `Math.min(window.innerWidth / 420, window.innerHeight / 700, 1.5)`. The console gets `transform: scale(number)` and sits in the middle of a full-screen box with `overflow: hidden`. This keeps everything sharp and avoids scrollbars.

### 4.3 Colors

Defined as CSS variables on the console element. `c0` is the lightest, `c3` is the darkest.

| Palette name | c0 | c1 | c2 | c3 |
|---|---|---|---|---|
| green (default) | `#9bbc0f` | `#8bac0f` | `#306230` | `#0f380f` |
| grey | `#e0e0e0` | `#a0a0a0` | `#606060` | `#101010` |
| amber | `#ffe08a` | `#f2b84b` | `#8a5a12` | `#2a1800` |

How the screen uses them:
- Screen background: `c0`
- Normal text: `c3`
- Dim text (hints): `c2`
- Selected row: background `c3`, text `c0` (inverted)

Console body colors (not part of the palette): body `#cfcab8`, bezel `#4a4a55`, A/B buttons `#9b2b57`, D-pad `#2b2b2b`.

### 4.4 Screen effects

- **Scanlines:** a `::after` layer with `repeating-linear-gradient`. It must have `pointer-events: none`, or it will block clicks.
- **Slight inner shadow** on the screen edge for depth.
- **Blinking cursor and blinking "PRESS START"** with a CSS animation. Turned off when the user prefers reduced motion.

### 4.5 Text rules for content

- Words longer than 30 characters (links!) must wrap: `overflow-wrap: anywhere`.
- Titles are uppercase (use CSS `text-transform`, keep the data normal).
- Maximum 14 lines per page after wrapping. A dev-only "overflow guard" will warn if a page is too long (Phase 4).

---

## 5. Controls

### 5.1 Actions

Everything the player can do becomes one of 8 actions:
`UP`, `DOWN`, `LEFT`, `RIGHT`, `A`, `B`, `START`, `SELECT`

| Action | On a list screen | On a pages screen | Anywhere |
|---|---|---|---|
| UP / DOWN | Move cursor (wraps around) | Nothing | |
| LEFT / RIGHT | Nothing | Previous / next page | |
| A | Open the selected item (or open a link) | Open the page's link, if it has one | |
| B | Go back one screen | Go back one screen | Never goes below the menu |
| START | | | Go to main menu (clears the stack) |
| SELECT | | | Change the palette |

### 5.2 Keyboard map

| Action | Keys |
|---|---|
| UP | Arrow Up, W |
| DOWN | Arrow Down, S |
| LEFT | Arrow Left, A |
| RIGHT | Arrow Right, D |
| A button | Enter, Z |
| B button | Backspace, Escape, X |
| START | Space |
| SELECT | Q |

Rules:
- Call `preventDefault()` for these keys, so the page does not scroll.
- Ignore the key if Ctrl, Cmd or Alt is held (so browser shortcuts still work).
- If a key is **held down** (`event.repeat` is true): allow repeat for UP and DOWN only. Ignore repeat for everything else.
- Show a small key hint line under the console on desktop.

### 5.3 Touch and mouse

- On-screen buttons use `onPointerDown` (faster than click on phones).
- Buttons have `touch-action: manipulation`, `user-select: none`, and `onContextMenu` is prevented (stops the long-press menu on phones).
- On-screen buttons are real `<button>` elements with `aria-label`s and `tabIndex={-1}`. Keyboard users use the key map. Screen reader users use the Plain View (Section 12).

---

## 6. Architecture

### 6.1 The five layers

1. **Console shell:** body, screen frame, buttons. Draws only. No logic.
2. **Input layer:** turns key presses and button presses into actions.
3. **Screen manager:** the reducer and the stack. Decides which screen shows and what each action does.
4. **Screens:** one component per page (Boot, Menu, About, ...). They only draw what they are given.
5. **Data:** one file with all my text, projects and links.

### 6.2 What happens on one button press

```
Key or click
   -> useInput turns it into an action ("DOWN")
   -> App.press("DOWN")
        -> (special case: A on a link? open it and stop)
        -> dispatch("DOWN")
   -> reducer(oldState, "DOWN") returns newState
   -> React redraws the current screen with newState
```

### 6.3 Folder layout and the one job of each file

```
retro-portfolio/
  PLAN.md                      this file
  index.html                   page title, font link, meta tags
  public/
    favicon.png                pixel icon
    resume.pdf                 for the Contact screen
  src/
    main.jsx                   starts React
    App.jsx                    holds state, defines press(), shows Console or PlainView
    data/
      portfolio.js             ALL content (the only file you edit to change text)
    state/
      reducer.js               pure function: (state, action) -> new state
      screenRules.js           registry: what kind each screen is, item counts, what A does
      initialState.js          starting state
    hooks/
      useInput.js              keyboard + keymap -> press(action)
      useScale.js              works out the scale number
    components/
      Console.jsx              the whole console body
      ScreenFrame.jsx          screen glass, scanlines, header/footer rows
      ScreenView.jsx           picks which screen component to show
      Dpad.jsx                 D-pad buttons
      RoundButton.jsx          A and B
      PillButton.jsx           START and SELECT
      Hint.jsx                 footer hint line ("A OPEN  B BACK")
      PlainView.jsx            normal readable page with all content
    screens/
      Boot.jsx
      Menu.jsx
      ListScreen.jsx           generic list (used by Projects, Experience, Contact, Options)
      PagesScreen.jsx          generic pages (used by About, Skills, details)
      Options.jsx
    audio/
      sound.js                 beep function
    styles/
      reset.css
      console.css              body, buttons, scale
      screen.css               screen, text, scanlines, animations
      palettes.css             the CSS variables
```

**Import rule:** `reducer.js` and `screenRules.js` must **never** import from `components/` or `screens/`. Components can import data, but never the reducer. This prevents circular imports and keeps the reducer easy to test.

---

## 7. State and logic

### 7.1 State shape

```js
// state/initialState.js
export const initialState = {
  stack: [{ id: 'boot' }],   // last item is the screen you see. params is optional.
  cursors: {},               // remembered cursor per list, example: { menu: 2, projects: 1 }
  page: 0,                   // current page on a pages screen
  settings: { palette: 'green', sound: false },
  view: 'console',           // 'console' or 'plain'
}
```

A stack entry looks like `{ id: 'projectDetail', params: { index: 2 } }`.

### 7.2 Screen rules (registry)

```js
// state/screenRules.js  (sketch)
import { portfolio } from '../data/portfolio'

export const MENU_ITEMS = [
  { label: 'ABOUT',      target: 'about' },
  { label: 'PROJECTS',   target: 'projects' },
  { label: 'SKILLS',     target: 'skills' },
  { label: 'EXPERIENCE', target: 'experience' },
  { label: 'CONTACT',    target: 'contact' },
  { label: 'OPTIONS',    target: 'options' },
]

export const screenRules = {
  boot:          { kind: 'boot' },
  menu:          { kind: 'list',  getItems: () => MENU_ITEMS,
                   onSelect: (i) => ({ push: MENU_ITEMS[i].target }) },
  about:         { kind: 'pages', getPages: () => portfolio.about },
  skills:        { kind: 'pages', getPages: () => portfolio.skills },
  projects:      { kind: 'list',  getItems: () => portfolio.projects,
                   onSelect: (i) => ({ push: 'projectDetail', params: { index: i } }) },
  projectDetail: { kind: 'pages', getPages: (p) => portfolio.projects[p.index].pages },
  experience:    { kind: 'list',  getItems: () => portfolio.experience,
                   onSelect: (i) => ({ push: 'experienceDetail', params: { index: i } }) },
  experienceDetail: { kind: 'pages', getPages: (p) => portfolio.experience[p.index].pages },
  contact:       { kind: 'list',  getItems: () => portfolio.contact, onSelect: () => null },
  options:       { kind: 'list',  getItems: () => OPTION_ITEMS,
                   onSelect: (i) => OPTION_ITEMS[i].effect },   // { toggle: 'sound' } etc.
}
```

`onSelect` returns a small description: `{ push, params }`, `{ toggle: 'sound' }`, `{ cycle: 'palette' }`, `{ plain: true }`, or `null`.

### 7.3 Reducer (sketch)

```js
// state/reducer.js  (sketch, no side effects, no window.* calls)
export function reducer(state, action) {
  const top = state.stack[state.stack.length - 1]
  const rule = screenRules[top.id]

  if (action === 'START')  return { ...state, stack: [{ id: 'menu' }], page: 0 }
  if (action === 'SELECT') return cyclePalette(state)
  if (action === 'B')      return pop(state)            // never removes the last screen

  if (top.id === 'boot' && action === 'A') return { ...state, stack: [{ id: 'menu' }] }

  if (rule.kind === 'list') {
    const count  = rule.getItems(top.params).length
    const cursor = state.cursors[top.id] ?? 0
    if (action === 'UP')   return setCursor(state, top.id, (cursor - 1 + count) % count)
    if (action === 'DOWN') return setCursor(state, top.id, (cursor + 1) % count)
    if (action === 'A')    return applyEffect(state, rule.onSelect(cursor))
  }

  if (rule.kind === 'pages') {
    const count = rule.getPages(top.params).length
    if (action === 'LEFT')  return { ...state, page: Math.max(state.page - 1, 0) }
    if (action === 'RIGHT') return { ...state, page: Math.min(state.page + 1, count - 1) }
  }

  return state
}
```

Notes:
- `push` and `pop` set `page` back to 0.
- `pop` keeps `cursors`, so going back puts the cursor where it was.
- On the boot screen, pressing START also goes to the menu (the START rule above).
- The reducer is **pure**: same input, same output, nothing else happens.

### 7.4 Side effects (opening links)

A reducer must not call `window.open`. So `App.press` checks first:

```js
function press(action) {
  const url = linkForA(state)           // from screenRules.js, returns a url or null
  if (action === 'A' && url) {
    window.open(url, '_blank', 'noopener,noreferrer')   // mailto: links use window.location.href
    return
  }
  dispatch(action)
}
```

`window.open` only works reliably inside a real user event (key press or click). That is the case here.

### 7.5 List windowing

```js
const VISIBLE = 10
const start = Math.max(0, Math.min(cursor - Math.floor(VISIBLE / 2), items.length - VISIBLE))
const rows  = items.slice(start, start + VISIBLE)
```

If the list is shorter than 10 items, `start` becomes 0. Show small arrows `▲` and `▼` when there are hidden rows above or below.

### 7.6 Input hook (sketch)

```js
// hooks/useInput.js
const KEY_TO_ACTION = {
  arrowup: 'UP', w: 'UP', arrowdown: 'DOWN', s: 'DOWN',
  arrowleft: 'LEFT', a: 'LEFT', arrowright: 'RIGHT', d: 'RIGHT',
  enter: 'A', z: 'A', backspace: 'B', escape: 'B', x: 'B',
  ' ': 'START', q: 'SELECT',
}

export function useInput(press) {
  useEffect(() => {
    function onKeyDown(e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const action = KEY_TO_ACTION[e.key.toLowerCase()]
      if (!action) return
      e.preventDefault()
      if (e.repeat && action !== 'UP' && action !== 'DOWN') return
      press(action)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)   // cleanup is required
  }, [press])
}
```

---

## 8. Data file

All content is in `src/data/portfolio.js`. Placeholders below; real text is written in Phase 4.

```js
export const portfolio = {
  name: 'YOUR NAME',
  title: 'YOUR TITLE',

  // each page: { title, lines: [...], link?: { label, url } }
  about: [
    { title: 'WHO AM I',  lines: ['...', '...'] },
    { title: 'EDUCATION', lines: ['...', '...'] },
    { title: 'GOALS',     lines: ['...', '...'] },
  ],

  skills: [
    { title: 'LANGUAGES', lines: ['...'] },
    { title: 'FRONTEND',  lines: ['...'] },
    { title: 'BACKEND',   lines: ['...'] },
    { title: 'TOOLS',     lines: ['...'] },
  ],

  projects: [
    { label: 'PROJECT ONE',            // shown in the list
      pages: [
        { title: 'SUMMARY', lines: ['...'] },
        { title: 'TECH',    lines: ['...'] },
        { title: 'WHAT I DID', lines: ['...'] },
        { title: 'LINKS',   lines: ['A = open GitHub'], link: { label: 'GitHub', url: 'https://...' } },
      ] },
  ],

  experience: [
    { label: 'ROLE @ PLACE', pages: [ { title: 'DETAILS', lines: ['...'] } ] },
  ],

  contact: [
    { label: 'EMAIL',    url: 'mailto:you@example.com' },
    { label: 'GITHUB',   url: 'https://github.com/...' },
    { label: 'LINKEDIN', url: 'https://linkedin.com/in/...' },
    { label: 'RESUME',   url: '/resume.pdf' },
  ],
}
```

Rules:
- Every list item has a `label`. Every pages item has `title` and `lines`.
- Be honest and specific in the text. Say what you built and what you did yourself.
- The Plain View (Phase 7) reads this same file, so the content is written once.

---

## 9. Screen-by-screen spec

Every screen has: a **header row** (title), a **body**, and a **footer row** (hints). Footer hints are small and in the dim color.

| Screen | Kind | What it shows | Controls |
|---|---|---|---|
| **Boot** | boot | Name drops from the top (1 s), then "PORTFOLIO SYSTEM", then blinking "PRESS START". Waits for fonts to load first. | START or A: go to menu |
| **Menu** | list | 6 items with a `▶` cursor on the selected one (row inverted) | UP/DOWN move, A open |
| **About** | pages | Who I am, Education, Goals | LEFT/RIGHT pages, B back |
| **Projects** | list | One row per project | UP/DOWN, A open detail, B back |
| **Project detail** | pages | Summary, Tech, What I did, Links | LEFT/RIGHT pages, A opens link on the Links page |
| **Skills** | pages | One page per group | LEFT/RIGHT pages |
| **Experience** | list | One row per role | same as Projects |
| **Experience detail** | pages | Details of one role | LEFT/RIGHT pages |
| **Contact** | list | EMAIL, GITHUB, LINKEDIN, RESUME | A opens the link |
| **Options** | list | `SOUND: OFF/ON` (A toggles), `PALETTE: GREEN` (A cycles), `PLAIN VIEW` (A switches view) | UP/DOWN, A |

Pages footer: `< 1/3 >` in the middle, plus the hint text.
Lists with more than 10 rows show `▲` / `▼`.

---

## 10. Build phases

Effort: S = small, M = medium.

### Phase 0: Setup (S)

**Goal:** An empty project that runs, in git.

**Steps**
1. Check Node: `node -v` (needs 18 or newer).
2. `npm create vite@latest retro-portfolio -- --template react`
3. `cd retro-portfolio`, `npm install`, `npm run dev`.
4. Delete the demo: `App.css`, `assets/react.svg`, the counter code in `App.jsx`.
5. Create the folders from Section 6.3 (empty is fine).
6. Add the Press Start 2P font link in `index.html`, set the `<title>`.
7. Add `reset.css` (box-sizing, margin 0, dark page background, `height: 100dvh`).
8. Add this file as `PLAN.md`. `git init`, first commit. Create a GitHub repo and push.

**Done when**
- The browser shows a dark empty page with the right tab title.
- No errors in the browser console.
- The code is on GitHub.

---

### Phase 1: Console shell, look only (M)

**Goal:** The console looks right. Nothing works yet.

**Files:** `Console.jsx`, `ScreenFrame.jsx`, `Dpad.jsx`, `RoundButton.jsx`, `PillButton.jsx`, `useScale.js`, `console.css`, `screen.css`, `palettes.css`, `App.jsx`

**Steps**
1. Build the body with CSS (rounded corners, bigger bottom-right curve, bezel, power light, speaker lines).
2. Build the screen frame with fake text "HELLO" and the scanlines layer.
3. D-pad from two crossed rectangles. A/B as circles. START/SELECT as tilted pills.
4. Add `palettes.css` with the variables. Screen uses only the variables.
5. Add `useScale` and the full-screen centering box.

**Done when**
- Looks right at 1440x900, 1280x720 and 390x844 (use browser dev tools).
- No scrollbars at any of these sizes.
- Text is sharp.
- Changing `data-palette` in dev tools changes the colors.
- Clicking scanlines area does nothing weird (it is `pointer-events: none`).

---

### Phase 2: Input (S to M)

**Goal:** Every key and button produces the right action.

**Files:** `useInput.js`, button components, `App.jsx`

**Steps**
1. Add the key map from Section 5.2 and the hook from Section 7.6.
2. Buttons call `onPress(action)` on `onPointerDown`.
3. In `App.jsx`, keep `lastAction` in state and show `LAST: UP` on the fake screen.
4. Add a pressed look: when an action fires, the matching on-screen button shows pressed for about 120 ms (also for keyboard presses).

**Done when**
- All 8 actions work from keyboard **and** from clicks.
- Holding Up repeats. Holding A fires only once.
- Arrow keys and Space do not scroll the page.
- Ctrl+R, Ctrl+W and similar still work.
- One press gives one action (no doubles), checked on a real phone.

---

### Phase 3: Screen manager and menu (M)

**Goal:** Navigate Boot -> Menu -> blank screens and back.

**Files:** `initialState.js`, `reducer.js`, `screenRules.js`, `ScreenView.jsx`, `Boot.jsx`, `Menu.jsx`, `Hint.jsx`

**Steps**
1. Add the state shape and reducer from Section 7.
2. Use `useReducer` in `App.jsx`. `press` calls `dispatch`.
3. `ScreenView` reads the top of the stack and shows the right component. Unfinished screens show "COMING SOON".
4. Menu with the `▶` cursor and inverted selected row.
5. Footer hints.

**Done when**
- Boot -> START -> Menu works.
- Cursor wraps from top to bottom and back.
- A opens a screen, B returns, and the menu cursor is where you left it.
- START from anywhere goes to the menu.
- B on the menu does nothing.
- `reducer.js` has no `window` or `document` in it.

*Optional:* Add a few Vitest tests for the reducer. Not required.

---

### Phase 4: Data and simple screens (M)

**Goal:** About, Skills and Contact show real content.

**Files:** `portfolio.js`, `PagesScreen.jsx`, `ListScreen.jsx`, small updates to `screenRules.js`

**Steps**
1. Write the real text in `portfolio.js` (stay inside the limits in Section 4).
2. Build `PagesScreen` (title, lines, `< 1/3 >` footer). It is generic so other screens can reuse it.
3. Build `ListScreen` with windowing from Section 7.5. It is generic too.
4. Contact uses `ListScreen`. `linkForA` and `press` open the links.
5. Add the dev-only overflow guard: after drawing, if the page body is taller than its box, `console.warn` with the page title.

**Done when**
- About and Skills page through with LEFT/RIGHT, and the page counter is right.
- Contact opens email, GitHub, LinkedIn and the resume.
- No overflow warnings in the console.
- Changing text in `portfolio.js` changes the screen with no other edits.

---

### Phase 5: Projects and Experience (M)

**Goal:** Lists with detail screens.

**Files:** `screenRules.js`, `reducer.js` (params support), content in `portfolio.js`

**Steps**
1. Add `projects` and `experience` lists and their detail screens (Section 7.2).
2. `push` carries `params` (the index).
3. Make sure `page` resets to 0 when you open or leave a detail.
4. Test with at least 12 fake items to prove windowing works, then remove the extras.
5. *Optional:* clicking or tapping a row on the screen moves the cursor there and selects it.

**Done when**
- A list with 12+ items scrolls correctly with `▲` / `▼`.
- Opening a project shows its pages. The Links page opens the right URL with A.
- B returns to the list with the same row selected.
- No overflow warnings.

---

### Phase 6: Polish and Options (M)

**Goal:** It feels like a real old game.

**Files:** `Boot.jsx`, `Options.jsx`, `sound.js`, CSS animations

**Steps**
1. Boot animation (name drops in, blinking "PRESS START"). Wait for `document.fonts.ready` first.
2. `sound.js`: one function that plays a short square-wave beep using the Web Audio API. Create the audio context only after the first button press. Sounds: move (high short), select (higher), back (lower), boot (3 notes).
3. Options screen: sound on/off, palette cycle. SELECT also cycles the palette.
4. Save settings in `localStorage`, wrapped in `try/catch` (it can fail in private mode). Load them at start.
5. Hold-to-repeat on the on-screen D-pad buttons (start after 400 ms, repeat every 100 ms, stop on pointer up and on pointer leave).
6. `@media (prefers-reduced-motion: reduce)`: no drop-in, no blinking.
7. *Optional:* typewriter text effect on About (skips when A is pressed).

**Done when**
- Sound is off at first load and works after you turn it on.
- Palette and sound choices survive a page refresh.
- Reduced-motion setting removes the animations.
- Nothing plays or crashes before the first button press.

---

### Phase 7: Phones, Plain View, SEO, deploy (M)

**Goal:** Ready for real visitors.

**Files:** `PlainView.jsx`, `index.html`, CSS, `vite.config.js`

**Steps**
1. Phone landscape: if the window is wider than tall and under 500 px high, show an overlay "TURN YOUR PHONE UPRIGHT".
2. Use `100dvh` (not `100vh`) so mobile browser bars do not cut the console.
3. `PlainView`: a normal page that reads `portfolio.js` and shows all sections as headings, paragraphs and links. Add a visible link "Skip game: plain view" under the console and an Options item that does the same. Add a link back to the console.
4. In `index.html`: `<title>`, meta description, Open Graph tags (title, description, image), favicon, and a `<noscript>` message with a short bio and links.
5. `npm run build`, then `npm run preview`, and click through everything.
6. Deploy on Vercel: connect the GitHub repo, framework "Vite", build `npm run build`, output `dist`.
   (GitHub Pages instead: set `base: '/your-repo-name/'` in `vite.config.js`.)
7. Test the live link on a real phone and on a second browser.
8. Put the link on your resume, GitHub and LinkedIn.

**Done when**
- The final checklist (Section 13) passes on the live site.

---

## 11. Known problems and how to prevent them

| # | Problem | Prevention |
|---|---|---|
| 1 | Arrow keys or Space scroll the page | `preventDefault()` for mapped keys only. Skip when Ctrl/Cmd/Alt is held. |
| 2 | Holding a key fires many A presses | Ignore `event.repeat` except for UP and DOWN. |
| 3 | Button fires twice on phones | Use only `onPointerDown`. No extra `onClick`. Add `touch-action: manipulation`. |
| 4 | Long-press shows a phone menu | Prevent `onContextMenu` on buttons. Add `user-select: none`. |
| 5 | Keyboard listener sees old state | `useInput` only calls `press`. Put `press` in the effect dependency list and always remove the listener in the cleanup. |
| 6 | Listener added twice in dev | React dev mode runs effects twice. Cleanup must remove the listener. |
| 7 | Font not loaded, layout jumps | Wait for `document.fonts.ready` on the boot screen. Keep a `monospace` fallback. |
| 8 | Text looks blurry after scaling | Scale with CSS `transform` on real DOM (not canvas). Use `image-rendering: pixelated` for any pixel images. |
| 9 | Text too long for the screen | Content limits (Section 4), `overflow-wrap: anywhere`, and the dev overflow guard. |
| 10 | Scanlines block clicks | `pointer-events: none` on the overlay. |
| 11 | Circular imports | `reducer.js` and `screenRules.js` never import components. Components never import the reducer. |
| 12 | Works on my PC, breaks on the server | File names are case-sensitive on Linux hosts. Import `./Boot.jsx` exactly as the file is named (Windows hides this problem). |
| 13 | Blank page on GitHub Pages | Set `base` in `vite.config.js` to `'/repo-name/'`. |
| 14 | Link does not open | Only call `window.open` inside a key or click handler. Use `noopener,noreferrer`. |
| 15 | Sound blocked or surprising | Off by default. Create the audio context only after a button press. |
| 16 | `localStorage` fails | Wrap in `try/catch`. App must work with empty storage. |
| 17 | Mobile browser bar cuts the console | Use `100dvh`. Test on a real phone. |
| 18 | Back button of the browser leaves the site | Known limit of v1 (no URL routing). The B button is the back button. See Section 15. |
| 19 | Search engines and recruiters cannot read it | Plain View, meta tags, `<noscript>` text. |
| 20 | Copyright or trademark trouble | Own name and labels. No Nintendo logos, names or text. |
| 21 | Code grows too complex | One job per file. Files under about 120 lines. Generic `ListScreen` and `PagesScreen` instead of many copies. |
| 22 | Window resize leaks listeners | Remove the resize listener in the `useScale` cleanup. |
| 23 | Missing data crashes the screen | `getItems` and `getPages` must handle a bad index (return an empty array) and the screen must show "NO DATA". |

---

## 12. Accessibility, search and speed

- **Screen readers:** The screen area has `aria-live="polite"`, so changes are announced. The on-screen buttons have `aria-label`s. The best experience for screen reader users is the Plain View, and the link to it is real text, easy to find.
- **Keyboard only:** All controls work from the key map in Section 5.2. A key hint line is visible on desktop.
- **Motion:** Respect `prefers-reduced-motion`.
- **Contrast:** Check the grey palette and the dim text color with a contrast checker. If hints are too faint, make them darker.
- **Search:** Plain View and meta tags give search engines real text. Add `lang="en"` on `<html>`.
- **Speed:** No images in v1 except the favicon and the Open Graph image. The built site should be well under 300 KB. Run Lighthouse in Chrome dev tools (aim for 90+).

---

## 13. Final checklist (run on the live site)

**Looks**
- [ ] Console looks right on desktop and on an upright phone
- [ ] No scrollbars, no blurry text
- [ ] All 3 palettes look fine

**Controls**
- [ ] All 8 actions work from keyboard and from touch
- [ ] No double presses on a real phone
- [ ] Page never scrolls from game keys

**Screens**
- [ ] Boot, Menu, About, Projects, Skills, Experience, Contact, Options all open
- [ ] B always goes back, START always goes to the menu
- [ ] Cursor position is remembered when going back
- [ ] Every link opens the right place (email, GitHub, LinkedIn, resume, each project)
- [ ] No text is cut off on any page

**Extras**
- [ ] Sound off by default, works when turned on
- [ ] Settings survive refresh
- [ ] Reduced motion removes animations
- [ ] Plain View shows all content and links back
- [ ] Landscape phone shows the "turn upright" message
- [ ] Link preview looks right when shared (Open Graph)
- [ ] Lighthouse score checked

**Content**
- [ ] Text is my own simple writing and honest about what I built
- [ ] No placeholder text left (`...`, `YOUR NAME`)

---

## 14. Status tracker

- [ ] Phase 0: Setup
- [ ] Phase 1: Console shell
- [ ] Phase 2: Input
- [ ] Phase 3: Screen manager and menu
- [ ] Phase 4: Data and simple screens
- [ ] Phase 5: Projects and Experience
- [ ] Phase 6: Polish and Options
- [ ] Phase 7: Phones, Plain View, SEO, deploy

---

## 15. Ideas for later (not in version 1)

- A small hidden game (like Snake) on the menu
- Project screenshots drawn as 4-color pixel images
- URL routing so the browser Back button and shareable links work (for example `#/projects/2`)
- Konami code easter egg
- Light "save file" feel: remember the last screen the visitor was on

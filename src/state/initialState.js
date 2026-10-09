// The starting state of the whole app.
export const PALETTES = ['green', 'grey', 'amber']

export const initialState = {
  stack: [{ id: 'boot' }], // last item = the screen you see
  cursors: {},             // remembered cursor per list, e.g. { menu: 2 }
  page: 0,                 // current page on a pages screen (Phase 4)
  settings: { palette: 'green', sound: false },
  view: 'console',         // 'console' or 'plain'
  konami: 0,               // how many Konami code presses in a row are right so far
  game: null,              // the Snake game (see state/snake.js)
}
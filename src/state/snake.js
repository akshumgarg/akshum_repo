// Snake logic. Pure functions, no React, no window, no Math.random.
export const COLS = 22
export const ROWS = 16

const STEP = { UP: [0, -1], DOWN: [0, 1], LEFT: [-1, 0], RIGHT: [1, 0] }
const OPPOSITE = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' }

// Small seeded random number generator: same seed = same numbers, so the reducer stays pure.
function nextSeed(seed) {
  return (seed * 1664525 + 1013904223) >>> 0
}

function placeFood(snake, seed) {
  const taken = new Set(snake.map(([x, y]) => y * COLS + x))
  if (taken.size >= COLS * ROWS) return { food: null, seed } // board is full
  let s = seed
  for (;;) {
    s = nextSeed(s)
    const cell = Math.floor((s / 4294967296) * COLS * ROWS)
    if (!taken.has(cell)) return { food: [cell % COLS, Math.floor(cell / COLS)], seed: s }
  }
}

export function newGame(seed = 1) {
  const snake = [[11, 8], [10, 8], [9, 8]] // head first
  const placed = placeFood(snake, seed)
  return { snake, dir: 'RIGHT', nextDir: 'RIGHT', food: placed.food, seed: placed.seed, score: 0, over: false }
}

// A turn is used at the next tick. Turning straight back is ignored.
export function turn(game, dir) {
  if (game.over || dir === OPPOSITE[game.dir]) return game
  if (dir === game.nextDir) return game
  return { ...game, nextDir: dir }
}

export function tick(game) {
  if (game.over) return game
  const dir = game.nextDir
  const [dx, dy] = STEP[dir]
  const [hx, hy] = game.snake[0]
  const head = [hx + dx, hy + dy]
  const eats = game.food !== null && head[0] === game.food[0] && head[1] === game.food[1]

  // the tail moves away this step, unless we eat
  const body = eats ? game.snake : game.snake.slice(0, -1)
  const hitWall = head[0] < 0 || head[0] >= COLS || head[1] < 0 || head[1] >= ROWS
  const hitSelf = body.some(([x, y]) => x === head[0] && y === head[1])
  if (hitWall || hitSelf) return { ...game, dir, over: true }

  const snake = [head, ...body]
  if (!eats) return { ...game, snake, dir }

  const placed = placeFood(snake, game.seed)
  return { ...game, snake, dir, food: placed.food, seed: placed.seed, score: game.score + 1, over: placed.food === null }
}

// Milliseconds per step: gets faster as the score grows.
export function snakeSpeed(score) {
  return Math.max(70, 150 - score * 4)
}
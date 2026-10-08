// Short square-wave beeps with the Web Audio API. No audio files.
// The audio context is created on the first beep, which only happens
// after a button press, so browsers never block it.
let ctx = null

function getContext() {
  if (!ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return null
    ctx = new AudioCtx()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function beep(frequency, delay, length) {
  const c = getContext()
  if (!c) return
  const osc = c.createOscillator()
  const gain = c.createGain()
  const t = c.currentTime + delay
  osc.type = 'square'
  osc.frequency.value = frequency
  gain.gain.setValueAtTime(0.04, t)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + length)
  osc.connect(gain)
  gain.connect(c.destination)
  osc.start(t)
  osc.stop(t + length)
}

// Each sound is a list of [frequency, delay in seconds, length in seconds].
const SOUNDS = {
  move: [[660, 0, 0.05]],
  select: [[990, 0, 0.08]],
  back: [[330, 0, 0.08]],
  boot: [[523, 0, 0.1], [659, 0.1, 0.1], [784, 0.2, 0.2]],
}

export function playSound(name) {
  try {
    ;(SOUNDS[name] || []).forEach(([f, d, l]) => beep(f, d, l))
  } catch {
    // Sound must never crash the app.
  }
}

// Which beep belongs to which button.
export function soundForAction(action) {
  if (action === 'A' || action === 'START') return 'select'
  if (action === 'B') return 'back'
  return 'move'
}
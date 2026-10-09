// Each mood = a list of steps (which frame, for how many milliseconds) + a default bubble kind.
// Keep these lists as module constants so React sees the same list every time.
export const moods = {
  // Boot screen: bow down, hold, rise, stand for a while, repeat (about 2.8 s)
  bow: {
    bubble: 'speech',
    steps: [
      { frame: 'stand', ms: 1200 },
      { frame: 'bow15', ms: 200 },
      { frame: 'bow30', ms: 200 },
      { frame: 'bow45', ms: 600 },
      { frame: 'bow30', ms: 200 },
      { frame: 'bow15', ms: 200 },
    ],
  },
  idle: {
    bubble: 'speech',
    steps: [
      { frame: 'stand', ms: 2200 }, { frame: 'blink', ms: 150 },
      { frame: 'stand', ms: 1600 }, { frame: 'bob', ms: 400 },
      { frame: 'stand', ms: 1200 }, { frame: 'blink', ms: 150 },
    ],
  },
  wave: {
    bubble: 'speech',
    steps: [
      { frame: 'wave1', ms: 250 }, { frame: 'wave2', ms: 250 },
      { frame: 'wave3', ms: 250 }, { frame: 'wave2', ms: 250 },
    ],
  },
  happy:   { bubble: 'speech', steps: [{ frame: 'happy1', ms: 700 }, { frame: 'happy2', ms: 300 }] },
  excited: { bubble: 'shout',  steps: [{ frame: 'excited1', ms: 250 }, { frame: 'excited2', ms: 250 }, { frame: 'excited3', ms: 250 }, { frame: 'excited2', ms: 250 }] },
  proud:   { bubble: 'speech', steps: [{ frame: 'proud1', ms: 800 }, { frame: 'proud2', ms: 400 }] },
  thinking: { bubble: 'thought', steps: [{ frame: 'think1', ms: 900 }, { frame: 'think2', ms: 900 }] },
  point:   { bubble: 'speech', steps: [{ frame: 'point1', ms: 450 }, { frame: 'point2', ms: 450 }] },
  meh:     { bubble: 'mutter', steps: [{ frame: 'meh1', ms: 900 }, { frame: 'meh2', ms: 900 }] },
}

export const moodNames = Object.keys(moods)

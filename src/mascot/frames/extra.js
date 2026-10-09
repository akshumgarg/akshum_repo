// Extra frames for the idle mascot (yawn and sleep). Same format as character.js.
// They are built from the stand and bob frames by replacing a few rows.
import { frames } from './character'

function withRows(base, changes) {
  const rows = [...base]
  for (const [i, text] of Object.entries(changes)) rows[i] = text
  return rows
}

// A face row: 7 clear pixels, 18 face pixels, 7 clear pixels = 32
const row = (inner) => '.......' + inner + '.......'

const FACE = row('300000000000000003')
const EYES_CLOSED = row('300003330003330003')
const MOUTH_SMALL = row('300000033330000003')
const MOUTH_BIG = row('300000333333000003')

export const extraFrames = {
  yawn1: withRows(frames.stand, { 11: FACE, 12: EYES_CLOSED, 13: FACE, 14: FACE, 15: MOUTH_SMALL, 16: FACE }),
  yawn2: withRows(frames.stand, { 11: FACE, 12: EYES_CLOSED, 13: FACE, 14: MOUTH_SMALL, 15: MOUTH_BIG, 16: MOUTH_BIG }),
  sleep2: withRows(frames.bob, { 12: FACE, 13: EYES_CLOSED, 14: FACE }),
}
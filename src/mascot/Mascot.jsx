// The character + its speech bubble.
// layout 'boot'  = big character in the middle, bubble above it
// layout 'strip' = small character at the left, bubble at its right
import PixelSprite from './PixelSprite'
import SpeechBubble from './SpeechBubble'
import { moods } from './moods'
import { useFrameLoop } from './useFrameLoop'

export default function Mascot({ mood = 'idle', say = '', bubble, layout = 'strip' }) {
  const info = moods[mood] ?? moods.idle
  const frame = useFrameLoop(info.steps)
  const isBoot = layout === 'boot'

  return (
    <div className={`mascot mascot--${layout}`}>
      {say && (
        <SpeechBubble
          key={mood + say}                       // new mood or text = bubble pops in again
          text={say}
          kind={bubble ?? info.bubble}
          tail={isBoot ? 'down' : 'left'}
          typing={isBoot}
        />
      )}
      <PixelSprite frame={frame} className="mascot__sprite" />
    </div>
  )
}

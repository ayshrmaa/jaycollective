import { DockIcon } from './DockIcon'

interface DockBarProps {
  onOpenAbout: () => void
  onOpenNotes: () => void
  onOpenGame: () => void
}

// Dark tile with a white T-rex — opens the offline dino game.
const DINO_ICON =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
      <rect width="48" height="48" fill="#1f1f1f"/>
      <g fill="#f5f5f5">
        <rect x="6" y="22" width="9" height="5"/>
        <rect x="11" y="17" width="16" height="15"/>
        <rect x="27" y="10" width="13" height="12"/>
        <rect x="30" y="24" width="6" height="3"/>
        <rect x="14" y="32" width="5" height="9"/>
        <rect x="22" y="32" width="5" height="9"/>
      </g>
      <rect x="35" y="13" width="3" height="3" fill="#1f1f1f"/>
    </svg>`,
  )

export function DockBar({ onOpenAbout, onOpenNotes, onOpenGame }: DockBarProps) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 64,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 4,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        padding: 12,
        borderRadius: 24,
        background: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
      }}
    >
      <DockIcon label="About Me" icon="/dock-me.jpg" onClick={onOpenAbout} />
      <DockIcon
        label="Notes"
        icon="https://framerusercontent.com/images/4ar8CL6aUtjymV8jTsXrcPzXCM.svg"
        onClick={onOpenNotes}
      />
      {/* Vertical divider */}
      <div
        style={{
          width: 1,
          height: 48,
          background: 'rgba(255,255,255,0.2)',
          borderRadius: 64,
        }}
      />
      <DockIcon
        label="Instagram"
        icon="https://framerusercontent.com/images/Q0Z0p8LOZhN2hJ2arLjEtkqQD0.png"
        href="https://www.instagram.com/evobrad/"
      />
      <DockIcon
        label="X"
        icon="https://framerusercontent.com/images/vjmmhizcqEgw5ZT5SNFQMpxD00.png"
        href="https://x.com/EvoBradley"
      />
      <DockIcon label="Dino Game" icon={DINO_ICON} onClick={onOpenGame} />
    </div>
  )
}

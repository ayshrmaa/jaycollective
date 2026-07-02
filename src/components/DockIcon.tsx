import { useState } from 'react'

interface DockIconProps {
  label: string
  icon: string
  onClick?: () => void
  href?: string
}

export function DockIcon({ label, icon, onClick, href }: DockIconProps) {
  const [hover, setHover] = useState(false)

  const button = (
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: '28%',
        overflow: 'hidden',
        transform: hover ? 'scale(1.12)' : 'scale(1)',
        transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1)',
      }}
    >
      <img
        src={icon}
        alt={label}
        draggable={false}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </div>
  )

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
      }}
    >
      {/* Tooltip */}
      <div
        style={{
          position: 'absolute',
          bottom: 'calc(100% + 12px)',
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: hover ? 1 : 0,
          transition: 'opacity 0.15s ease',
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            padding: '6px 12px',
            borderRadius: 64,
            background: 'white',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          }}
        >
          <span
            style={{
              fontFamily: "'Inter',sans-serif",
              fontWeight: 500,
              fontSize: 12,
              letterSpacing: '-0.04em',
              color: 'black',
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </span>
        </div>
        {/* White triangle pointing down */}
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: '8px solid white',
          }}
        />
      </div>

      {href ? (
        <a href={href} target="_blank" rel="noreferrer" style={{ display: 'block' }}>
          {button}
        </a>
      ) : (
        button
      )}
    </div>
  )
}

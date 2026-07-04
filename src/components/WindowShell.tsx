import { useEffect, useState, type ReactNode } from 'react'
import { useDraggable } from '../hooks/useDraggable'
import { useIsMobile } from '../hooks/useIsMobile'

interface WindowShellProps {
  title: string
  wide?: boolean
  onClose: () => void
  children: ReactNode
}

const TRAFFIC_LIGHTS = ['rgb(253,93,92)', 'rgb(250,201,0)', 'rgb(52,199,90)']

export function WindowShell({ title, wide, onClose, children }: WindowShellProps) {
  const [shown, setShown] = useState(false)
  const { pos, onMouseDown } = useDraggable()
  const isMobile = useIsMobile()

  // Spring-in: toggle on next frame so the transition runs from the mounted state.
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        pointerEvents: 'none',
      }}
    >
      {/* Spring wrapper — owns the scale/opacity transition so dragging stays snappy */}
      <div
        style={{
          pointerEvents: 'all',
          transform: shown ? 'scale(1)' : 'scale(0.8)',
          opacity: shown ? 1 : 0,
          transition: 'transform 0.4s cubic-bezier(0.34,1.28,0.64,1), opacity 0.3s ease',
        }}
      >
        {/* Panel — owns the drag translate (no transition, so it tracks the cursor) */}
        <div
          style={{
            transform: `translate(${pos.x}px, ${pos.y}px)`,
            width: isMobile ? '92vw' : wide ? '70vw' : '60vw',
            maxWidth: wide ? 840 : 720,
            maxHeight: '70vh',
            borderRadius: 24,
            background: 'white',
            boxShadow: '0 32px 80px rgba(0,0,0,0.28)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Title bar (draggable) */}
          <div
            onPointerDown={onMouseDown}
            style={{
              height: 40,
              flexShrink: 0,
              padding: '0 16px',
              borderBottom: '1px solid rgb(229,229,234)',
              cursor: 'grab',
              touchAction: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {TRAFFIC_LIGHTS.map((color) => (
                <div
                  key={color}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={onClose}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: color,
                    cursor: 'pointer',
                  }}
                />
              ))}
            </div>
            <span
              style={{
                fontFamily: "'Inter',sans-serif",
                fontWeight: 400,
                fontSize: 16,
                color: 'rgb(134,134,139)',
                letterSpacing: '-0.04em',
              }}
            >
              {title}
            </span>
          </div>

          {/* Scrollable body */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

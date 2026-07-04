import { useState } from 'react'
import { mobileAnchors, type Project } from '../data/projects'
import { useDraggable } from '../hooks/useDraggable'
import { useIsMobile } from '../hooks/useIsMobile'

interface ProjectCardProps {
  project: Project
  onOpen: (project: Project) => void
}

export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const { pos, onMouseDown, isDraggingRef } = useDraggable()
  const [rawHover, setHover] = useState(false)
  const isMobile = useIsMobile()
  // Cards without a description (in stealth) aren't clickable and don't light up
  const clickable = Boolean(project.description)
  const hover = rawHover && clickable

  const anchor = isMobile
    ? (mobileAnchors[project.id] ?? { x: project.anchorX, y: project.anchorY })
    : { x: project.anchorX, y: project.anchorY }
  const thumbWidth = isMobile ? 60 : 80
  const halfWidth = isMobile ? 42 : 52

  return (
    <div
      onPointerDown={onMouseDown}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => {
        if (clickable && !isDraggingRef.current) onOpen(project)
      }}
      style={{
        position: 'absolute',
        left: `calc(${anchor.x}% - ${halfWidth}px)`,
        top: `calc(${anchor.y}% - 64px)`,
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        zIndex: 2,
        cursor: clickable ? 'pointer' : 'inherit',
        userSelect: 'none',
        touchAction: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <div
        style={{
          padding: 12,
          borderRadius: 8,
          border: hover ? '2px solid rgba(255,255,255,0.2)' : '2px solid transparent',
          background: hover ? 'rgba(0,0,0,0.16)' : 'transparent',
          transition: 'background 0.18s ease, border-color 0.18s ease',
        }}
      >
        <img
          src={project.thumbnail}
          alt={project.title}
          draggable={false}
          style={{
            width: thumbWidth,
            height: 'auto',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0px 1px 6px 0px rgba(0,0,0,0.08)',
            display: 'block',
          }}
        />
      </div>
      <div
        style={{
          background: hover ? 'rgb(0,102,221)' : 'transparent',
          padding: hover ? '4px 8px' : '4px 0',
          borderRadius: 4,
          transition: 'background 0.18s ease, padding 0.18s ease',
        }}
      >
        <span
          style={{
            fontFamily: "'Inter',sans-serif",
            fontWeight: 400,
            fontSize: isMobile ? 14 : 16,
            lineHeight: '1.4em',
            letterSpacing: '-0.04em',
            color: 'rgb(247,247,247)',
            whiteSpace: 'nowrap',
          }}
        >
          {project.title}
        </span>
      </div>
    </div>
  )
}

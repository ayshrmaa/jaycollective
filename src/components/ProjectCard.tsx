import { useState } from 'react'
import type { Project } from '../data/projects'
import { useDraggable } from '../hooks/useDraggable'

interface ProjectCardProps {
  project: Project
  onOpen: (project: Project) => void
}

export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const { pos, onMouseDown, isDraggingRef } = useDraggable()
  const [hover, setHover] = useState(false)

  return (
    <div
      onMouseDown={onMouseDown}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => {
        if (!isDraggingRef.current) onOpen(project)
      }}
      style={{
        position: 'absolute',
        left: `calc(${project.anchorX}% - 52px)`,
        top: `calc(${project.anchorY}% - 64px)`,
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        zIndex: 2,
        cursor: 'pointer',
        userSelect: 'none',
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
            width: 80,
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
            fontSize: 16,
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

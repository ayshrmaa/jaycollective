import { useState } from 'react'
import { CornerFrame } from './components/CornerFrame'
import { DinoGame } from './components/DinoGame'
import { DockBar } from './components/DockBar'
import { ProjectCard } from './components/ProjectCard'
import { StarLogo } from './components/StarLogo'
import { WindowShell } from './components/WindowShell'
import { projects, type Project } from './data/projects'

const BACKGROUND_VIDEO = '/hero-bg.mp4'

const bodyText: React.CSSProperties = {
  fontFamily: "'Inter',sans-serif",
  fontWeight: 400,
  fontSize: 15,
  lineHeight: '1.6em',
  letterSpacing: '-0.02em',
  color: 'rgb(60,60,67)',
  margin: 0,
}

const archiveLabel: React.CSSProperties = {
  position: 'fixed',
  top: 32,
  left: 32,
  zIndex: 3,
  pointerEvents: 'none',
  userSelect: 'none',
  display: 'flex',
  alignItems: 'flex-start',
  gap: 12,
  mixBlendMode: 'exclusion',
  color: '#fff',
}

const archiveTitle: React.CSSProperties = {
  fontFamily: "'Inter Tight', 'Inter', sans-serif",
  fontWeight: 500,
  fontSize: 'clamp(48px, 10vw, 132px)',
  lineHeight: 0.86,
  letterSpacing: '-0.06em',
  textTransform: 'uppercase',
}

const registeredMark: React.CSSProperties = {
  width: 'clamp(28px, 4vw, 52px)',
  height: 'clamp(28px, 4vw, 52px)',
  border: '3px solid currentColor',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: "'Inter Tight', 'Inter', sans-serif",
  fontWeight: 500,
  fontSize: 'clamp(16px, 2.4vw, 30px)',
  lineHeight: 1,
  letterSpacing: '-0.04em',
  marginTop: 'clamp(4px, 1vw, 12px)',
}

function App() {
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [notesOpen, setNotesOpen] = useState(false)
  const [gameOpen, setGameOpen] = useState(false)

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        background: 'white',
      }}
    >
      {/* 1. Background video */}
      <video
        src={BACKGROUND_VIDEO}
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />

      <CornerFrame />

      <header style={archiveLabel} aria-label="Jay Collective">
        <span style={archiveTitle}>
          JAY
          <br />
          COLLECTIVE
        </span>
        <span style={registeredMark} aria-hidden="true">
          R
        </span>
      </header>

      {/* 2. Gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(84,84,84,0) 0%, rgb(0,0,0) 100%)',
          opacity: 0.4,
        }}
      />

      {/* 3. Bottom blur layer */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          height: '47.375%',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 40%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 40%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Interactive 3D star (grab to spin) */}
      <StarLogo />

      {/* 4. Draggable project cards */}
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} onOpen={setActiveProject} />
      ))}

      {/* 5. Dock bar */}
      <DockBar
        onOpenAbout={() => setAboutOpen(true)}
        onOpenNotes={() => setNotesOpen(true)}
        onOpenGame={() => setGameOpen(true)}
      />

      {/* Modals */}
      {activeProject && (
        <WindowShell
          key={activeProject.id}
          title={activeProject.title}
          wide
          onClose={() => setActiveProject(null)}
        >
          <img
            src={activeProject.thumbnail}
            alt={activeProject.title}
            style={{
              width: '100%',
              maxWidth: 200,
              height: 'auto',
              borderRadius: 16,
              display: 'block',
              alignSelf: 'center',
            }}
          />
          <p style={bodyText}>
            {activeProject.description ??
              `${activeProject.title} — a study in light, stillness, and the quiet edges of the landscape. Shot on location and printed in limited edition.`}
          </p>
        </WindowShell>
      )}

      {aboutOpen && (
        <WindowShell title="Jay Collective" onClose={() => setAboutOpen(false)}>
          <p style={bodyText}>
            Jay Collective is an archive-minded studio working between the natural and the imagined.
            The work lingers on thresholds — where water meets shore, where silence meets motion.
          </p>
          <p style={bodyText}>
            This portfolio is a living surface: drag the frames, rearrange them, and find your own
            order in the work.
          </p>
        </WindowShell>
      )}

      {notesOpen && (
        <WindowShell title="Notes" onClose={() => setNotesOpen(false)}>
          <p style={bodyText}>
            Field notes, process fragments, and thoughts collected between sessions. New entries
            appear here as the body of work grows.
          </p>
        </WindowShell>
      )}

      {gameOpen && (
        <WindowShell title="Dino Game" wide onClose={() => setGameOpen(false)}>
          <DinoGame />
        </WindowShell>
      )}
    </div>
  )
}

export default App

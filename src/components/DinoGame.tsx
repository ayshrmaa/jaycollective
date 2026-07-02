import { useEffect, useRef, useState } from 'react'

// Internal canvas resolution (the canvas scales to its container via CSS).
const W = 600
const H = 160
const GROUND = 138
const FG = '#535353'

const DINO_W = 44
const DINO_H = 47
const DINO_X = 30
const REST = GROUND - DINO_H

const GRAVITY = 0.7
const JUMP_V = -12
const BASE_SPEED = 6

type Obstacle = { x: number; w: number; h: number }

const CACTI: Array<{ w: number; h: number }> = [
  { w: 16, h: 34 },
  { w: 26, h: 34 },
  { w: 14, h: 46 },
]

interface GameState {
  dinoTop: number
  vy: number
  jumping: boolean
  obstacles: Obstacle[]
  speed: number
  spawnTimer: number
  frame: number
  scoreF: number
  over: boolean
  running: boolean
  raf: number
}

function drawDino(ctx: CanvasRenderingContext2D, top: number, frame: number, jumping: boolean) {
  ctx.fillStyle = FG
  const x = DINO_X
  // tail, body, head
  ctx.fillRect(x + 0, top + 18, 12, 8)
  ctx.fillRect(x + 8, top + 12, 22, 22)
  ctx.fillRect(x + 26, top + 2, 18, 16)
  // arm
  ctx.fillRect(x + 30, top + 20, 7, 4)
  // legs (animate when running on the ground)
  if (jumping) {
    ctx.fillRect(x + 12, top + 34, 7, 13)
    ctx.fillRect(x + 24, top + 34, 7, 13)
  } else if (Math.floor(frame / 6) % 2 === 0) {
    ctx.fillRect(x + 12, top + 34, 7, 13)
    ctx.fillRect(x + 24, top + 34, 7, 7)
  } else {
    ctx.fillRect(x + 12, top + 34, 7, 7)
    ctx.fillRect(x + 24, top + 34, 7, 13)
  }
  // eye (cut out of the head)
  ctx.fillStyle = '#fff'
  ctx.fillRect(x + 38, top + 6, 4, 4)
}

function drawCactus(ctx: CanvasRenderingContext2D, o: Obstacle) {
  ctx.fillStyle = FG
  const top = GROUND - o.h
  const stalk = 6
  // main stalk
  ctx.fillRect(o.x + o.w / 2 - stalk / 2, top, stalk, o.h)
  if (o.w > 18) {
    // side arms
    ctx.fillRect(o.x, top + o.h * 0.45, stalk, o.h * 0.4)
    ctx.fillRect(o.x, top + o.h * 0.45, o.w / 2, stalk)
    ctx.fillRect(o.x + o.w - stalk, top + o.h * 0.3, stalk, o.h * 0.5)
    ctx.fillRect(o.x + o.w / 2, top + o.h * 0.3, o.w / 2, stalk)
  }
}

export function DinoGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef<GameState>({
    dinoTop: REST,
    vy: 0,
    jumping: false,
    obstacles: [],
    speed: BASE_SPEED,
    spawnTimer: 50,
    frame: 0,
    scoreF: 0,
    over: false,
    running: false,
    raf: 0,
  })
  const highRef = useRef(0)
  const [score, setScore] = useState(0)
  const [high, setHigh] = useState(0)
  const [over, setOver] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const s = stateRef.current

    const reset = () => {
      s.dinoTop = REST
      s.vy = 0
      s.jumping = false
      s.obstacles = []
      s.speed = BASE_SPEED
      s.spawnTimer = 50
      s.frame = 0
      s.scoreF = 0
      s.over = false
      s.running = true
      setOver(false)
      setScore(0)
    }

    const jump = () => {
      if (!s.jumping) {
        s.vy = JUMP_V
        s.jumping = true
      }
    }

    const update = () => {
      s.frame += 1
      s.speed += 0.0015
      // physics
      s.vy += GRAVITY
      s.dinoTop += s.vy
      if (s.dinoTop >= REST) {
        s.dinoTop = REST
        s.vy = 0
        s.jumping = false
      }
      // spawn
      s.spawnTimer -= 1
      if (s.spawnTimer <= 0) {
        const c = CACTI[Math.floor(s.frame * 7) % CACTI.length]
        s.obstacles.push({ x: W, w: c.w, h: c.h })
        const gap = 60 + (Math.floor(s.frame * 13) % 70)
        s.spawnTimer = gap
      }
      // move + cull
      for (const o of s.obstacles) o.x -= s.speed
      s.obstacles = s.obstacles.filter((o) => o.x + o.w > 0)
      // score
      s.scoreF += s.speed * 0.02
      const sc = Math.floor(s.scoreF)
      if (sc !== score) setScore(sc)
      // collision (with a little forgiveness padding)
      const pad = 5
      const dl = DINO_X + pad
      const dr = DINO_X + DINO_W - pad
      const db = s.dinoTop + DINO_H
      for (const o of s.obstacles) {
        const ol = o.x + 2
        const or = o.x + o.w - 2
        const ot = GROUND - o.h + 2
        if (dr > ol && dl < or && db > ot) {
          s.over = true
          s.running = false
          if (sc > highRef.current) {
            highRef.current = sc
            setHigh(sc)
          }
          setOver(true)
          break
        }
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      // ground
      ctx.fillStyle = FG
      ctx.fillRect(0, GROUND, W, 2)
      drawDino(ctx, s.dinoTop, s.frame, s.jumping)
      for (const o of s.obstacles) drawCactus(ctx, o)
    }

    const loop = () => {
      if (!s.running) return
      update()
      draw()
      if (s.running) s.raf = requestAnimationFrame(loop)
    }

    const input = (e?: Event) => {
      e?.preventDefault()
      if (s.over) {
        reset()
        loop()
      } else {
        jump()
      }
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') input(e)
    }

    reset()
    draw()
    loop()

    window.addEventListener('keydown', onKey)
    canvas.addEventListener('pointerdown', input)
    return () => {
      s.running = false
      cancelAnimationFrame(s.raf)
      window.removeEventListener('keydown', onKey)
      canvas.removeEventListener('pointerdown', input)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: "'Inter',sans-serif",
          fontWeight: 500,
          fontSize: 13,
          letterSpacing: '-0.02em',
          color: 'rgb(83,83,83)',
        }}
      >
        <span>{over ? 'GAME OVER — press space or tap to restart' : 'Press space or tap to jump'}</span>
        <span>
          HI {String(high).padStart(5, '0')} &nbsp; {String(score).padStart(5, '0')}
        </span>
      </div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          background: '#fff',
          borderRadius: 12,
          border: '1px solid rgb(229,229,234)',
          touchAction: 'none',
          cursor: 'pointer',
        }}
      />
    </div>
  )
}

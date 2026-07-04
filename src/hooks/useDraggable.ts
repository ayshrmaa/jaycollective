import { useCallback, useRef, useState } from 'react'

const DRAG_THRESHOLD = 5

/**
 * Pointer drag-to-reposition (mouse + touch). Stores transient drag bookkeeping
 * in a ref so move handlers stay referentially stable, while exposing the
 * resolved offset as state so consumers re-render on movement.
 */
export function useDraggable() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  // dragging flag + drag start (sx,sy), offset at grab time (ox,oy), current offset (cx,cy)
  const drag = useRef({ dragging: false, sx: 0, sy: 0, ox: 0, oy: 0, cx: 0, cy: 0 })
  const isDraggingRef = useRef(false)

  const onPointerMove = useCallback((e: PointerEvent) => {
    const d = drag.current
    if (!d.dragging) return
    const dx = e.clientX - d.sx
    const dy = e.clientY - d.sy
    if (Math.hypot(dx, dy) > DRAG_THRESHOLD) isDraggingRef.current = true
    d.cx = d.ox + dx
    d.cy = d.oy + dy
    setPos({ x: d.cx, y: d.cy })
  }, [])

  const onPointerUp = useCallback(() => {
    drag.current.dragging = false
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
    window.removeEventListener('pointercancel', onPointerUp)
  }, [onPointerMove])

  const onMouseDown = useCallback(
    (e: React.PointerEvent) => {
      const d = drag.current
      d.dragging = true
      d.sx = e.clientX
      d.sy = e.clientY
      d.ox = d.cx
      d.oy = d.cy
      isDraggingRef.current = false
      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerup', onPointerUp)
      window.addEventListener('pointercancel', onPointerUp)
    },
    [onPointerMove, onPointerUp],
  )

  return { pos, onMouseDown, isDraggingRef }
}

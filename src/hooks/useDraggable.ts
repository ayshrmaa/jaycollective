import { useCallback, useRef, useState } from 'react'

const DRAG_THRESHOLD = 5

/**
 * Pointer drag-to-reposition. Stores transient drag bookkeeping in a ref so
 * mousemove handlers stay referentially stable, while exposing the resolved
 * offset as state so consumers re-render on movement.
 */
export function useDraggable() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  // dragging flag + drag start (sx,sy), offset at grab time (ox,oy), current offset (cx,cy)
  const drag = useRef({ dragging: false, sx: 0, sy: 0, ox: 0, oy: 0, cx: 0, cy: 0 })
  const isDraggingRef = useRef(false)

  const onMouseMove = useCallback((e: MouseEvent) => {
    const d = drag.current
    if (!d.dragging) return
    const dx = e.clientX - d.sx
    const dy = e.clientY - d.sy
    if (Math.hypot(dx, dy) > DRAG_THRESHOLD) isDraggingRef.current = true
    d.cx = d.ox + dx
    d.cy = d.oy + dy
    setPos({ x: d.cx, y: d.cy })
  }, [])

  const onMouseUp = useCallback(() => {
    drag.current.dragging = false
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }, [onMouseMove])

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const d = drag.current
      d.dragging = true
      d.sx = e.clientX
      d.sy = e.clientY
      d.ox = d.cx
      d.oy = d.cy
      isDraggingRef.current = false
      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', onMouseUp)
    },
    [onMouseMove, onMouseUp],
  )

  return { pos, onMouseDown, isDraggingRef }
}

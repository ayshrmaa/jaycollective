import '@google/model-viewer'
import { useEffect, useRef } from 'react'

export function StarLogo() {
  const modelViewerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const modelViewer = modelViewerRef.current
    if (!modelViewer) return

    const preventDragGhost = (event: DragEvent) => {
      event.preventDefault()
      event.stopPropagation()
    }

    // React 19 assigns these as JS properties on the custom element, which the
    // not-yet-upgraded element drops — set them as attributes (model-viewer's
    // canonical API) so they reliably land.
    modelViewer.setAttribute('src', '/star.glb')
    modelViewer.setAttribute('alt', 'JayCollective star logo')
    // pitch +45° vs 10x's original so the star reads upright (tips N/S/E/W)
    modelViewer.setAttribute('orientation', '0deg 45deg 90deg')
    modelViewer.setAttribute('exposure', '1')
    modelViewer.draggable = false
    modelViewer.setAttribute('draggable', 'false')
    modelViewer.addEventListener('dragstart', preventDragGhost, true)

    return () => {
      modelViewer.removeEventListener('dragstart', preventDragGhost, true)
    }
  }, [])

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%,-50%)',
        width: 240,
        height: 240,
        zIndex: 2,
      }}
    >
      <model-viewer
        ref={modelViewerRef}
        auto-rotate=""
        auto-rotate-delay="0"
        rotation-per-second="18deg"
        camera-orbit="0deg 90deg 5m"
        camera-target="auto auto auto"
        field-of-view="30deg"
        min-camera-orbit="auto auto 5m"
        max-camera-orbit="auto auto 5m"
        camera-controls=""
        disable-zoom=""
        disable-pan=""
        shadow-intensity="0"
        interaction-prompt="none"
        bounds="tight"
        style={{
          width: '100%',
          height: '100%',
          background: 'transparent',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
      />
    </div>
  )
}

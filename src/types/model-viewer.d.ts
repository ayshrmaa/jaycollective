import type React from 'react'

type ModelViewerElementProps =
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> &
    Record<string, unknown>

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': ModelViewerElementProps
    }
  }

  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'model-viewer': ModelViewerElementProps
      }
    }
  }
}

export {}

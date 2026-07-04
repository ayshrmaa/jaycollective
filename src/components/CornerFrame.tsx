import { useIsMobile } from '../hooks/useIsMobile'

// Camera-viewfinder L-brackets in each corner — measured off 10x.so:
// 4px stroke, 16px arms, 24px inset on desktop / 32px on mobile.
const LEN = 16
const THICK = 4
const COLOR = '#fff'

export function CornerFrame() {
  const isMobile = useIsMobile()
  const inset = isMobile ? 32 : 24

  const base: React.CSSProperties = {
    position: 'fixed',
    width: LEN,
    height: LEN,
    zIndex: 6,
    pointerEvents: 'none',
  }

  return (
    <>
      <div
        style={{
          ...base,
          top: inset,
          left: inset,
          borderTop: `${THICK}px solid ${COLOR}`,
          borderLeft: `${THICK}px solid ${COLOR}`,
        }}
      />
      <div
        style={{
          ...base,
          top: inset,
          right: inset,
          borderTop: `${THICK}px solid ${COLOR}`,
          borderRight: `${THICK}px solid ${COLOR}`,
        }}
      />
      <div
        style={{
          ...base,
          bottom: inset,
          left: inset,
          borderBottom: `${THICK}px solid ${COLOR}`,
          borderLeft: `${THICK}px solid ${COLOR}`,
        }}
      />
      <div
        style={{
          ...base,
          bottom: inset,
          right: inset,
          borderBottom: `${THICK}px solid ${COLOR}`,
          borderRight: `${THICK}px solid ${COLOR}`,
        }}
      />
    </>
  )
}

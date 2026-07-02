// Camera-viewfinder L-brackets in each corner (measured to match 10x.so exactly).
const INSET = 24
const LEN = 16
const THICK = 2.5
const COLOR = '#fff'

const base: React.CSSProperties = {
  position: 'fixed',
  width: LEN,
  height: LEN,
  zIndex: 6,
  pointerEvents: 'none',
}

export function CornerFrame() {
  return (
    <>
      <div
        style={{
          ...base,
          top: INSET,
          left: INSET,
          borderTop: `${THICK}px solid ${COLOR}`,
          borderLeft: `${THICK}px solid ${COLOR}`,
        }}
      />
      <div
        style={{
          ...base,
          top: INSET,
          right: INSET,
          borderTop: `${THICK}px solid ${COLOR}`,
          borderRight: `${THICK}px solid ${COLOR}`,
        }}
      />
      <div
        style={{
          ...base,
          bottom: INSET,
          left: INSET,
          borderBottom: `${THICK}px solid ${COLOR}`,
          borderLeft: `${THICK}px solid ${COLOR}`,
        }}
      />
      <div
        style={{
          ...base,
          bottom: INSET,
          right: INSET,
          borderBottom: `${THICK}px solid ${COLOR}`,
          borderRight: `${THICK}px solid ${COLOR}`,
        }}
      />
    </>
  )
}

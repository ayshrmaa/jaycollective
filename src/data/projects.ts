import cardLogo from '../assets/card-logo.png'

export interface Project {
  id: number
  title: string
  anchorX: number
  anchorY: number
  thumbnail: string
  description?: string
}

// "Coming soon" placeholder — red italic serif on black (inline SVG, no network).
const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="400" viewBox="0 0 320 400">
      <rect width="320" height="400" fill="#000000"/>
      <g fill="#e10600" font-family="Georgia, 'Times New Roman', serif" font-style="italic" text-anchor="middle" letter-spacing="2">
        <text x="160" y="205" font-size="56">COMING</text>
        <text x="160" y="270" font-size="56">SOON</text>
      </g>
    </svg>`,
  )

export const projects: Project[] = [
  {
    id: 1,
    title: 'Strat app',
    anchorX: 42.75,
    anchorY: 48.5,
    thumbnail: cardLogo,
    description:
      'Strat is a mobile-first strategy app built for UGC creators. It brings video scanning, AI chat with Strat Cat, hook and script tools, a searchable creator library, and gamified daily progress into one place.',
  },
  {
    id: 2,
    title: 'In stealth',
    anchorX: 26,
    anchorY: 29.5,
    thumbnail: PLACEHOLDER,
  },
  {
    id: 3,
    title: 'In stealth',
    anchorX: 23.33,
    anchorY: 60.88,
    thumbnail: PLACEHOLDER,
  },
  {
    id: 4,
    title: 'In stealth',
    anchorX: 68,
    anchorY: 62.13,
    thumbnail: PLACEHOLDER,
  },
  {
    id: 5,
    title: 'In stealth',
    anchorX: 66.08,
    anchorY: 19.63,
    thumbnail: PLACEHOLDER,
  },
  {
    id: 6,
    title: 'In stealth',
    anchorX: 73.92,
    anchorY: 40.75,
    thumbnail: PLACEHOLDER,
  },
]

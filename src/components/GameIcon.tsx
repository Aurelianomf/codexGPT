import { iconCategoryMap, type IconName } from '../data/iconMap'
import type { ThemeMode } from '../types'

const categoryTokens: Record<ThemeMode, Record<string, string>> = {
  festival: {
    positive: 'bg-emerald-100 text-emerald-700 ring-emerald-300',
    negative: 'bg-rose-100 text-rose-700 ring-purple-300',
    neutral: 'bg-sky-100 text-sky-700 ring-slate-300',
  },
  night: {
    positive: 'bg-emerald-900/60 text-emerald-200 ring-amber-300/50',
    negative: 'bg-fuchsia-950/70 text-rose-200 ring-purple-400/60',
    neutral: 'bg-slate-800 text-sky-200 ring-slate-500',
  },
}

interface GameIconProps {
  icon: IconName
  theme: ThemeMode
  className?: string
}

function iconPath(icon: IconName) {
  switch (icon) {
    case 'spark': return <path d="M12 3l2.4 5.4L20 10l-5.6 1.6L12 17l-2.4-5.4L4 10l5.6-1.6L12 3z" />
    case 'trap': return <path d="M4 14h16v5H4zm2-8h12l2 8H4l2-8zm2 0V4h8v2" />
    case 'lock': return <path d="M7 10V8a5 5 0 0110 0v2h1v11H6V10h1zm2 0h6V8a3 3 0 00-6 0v2z" />
    case 'card': return <path d="M4 6h16v12H4zM7 9h4v4H7zm6 0h4v1h-4zm0 3h4v1h-4z" />
    case 'bolt': return <path d="M13 2L6 13h5l-1 9 8-12h-5l0-8z" />
    case 'swap': return <path d="M5 8h10l-2-2 1.4-1.4L19 9l-4.6 4.4L13 12l2-2H5V8zm14 8H9l2 2-1.4 1.4L5 15l4.6-4.4L11 12l-2 2h10v2z" />
    case 'shield': return <path d="M12 3l7 3v5c0 4.6-2.9 8.6-7 10-4.1-1.4-7-5.4-7-10V6l7-3zm-1 6h2v6h-2zm0 7h2v2h-2z" />
    case 'clover': return <path d="M12 12c-1-2-4-1.7-4-4a2.5 2.5 0 115 0 2.5 2.5 0 115 0c0 2.3-3 2-4 4zM11 12h2v7h-2z" />
    case 'skull': return <path d="M12 4a7 7 0 00-4 12v4h3v-2h2v2h3v-4a7 7 0 00-4-12zm-3 8h2v2H9zm4 0h2v2h-2z" />
    case 'portal': return <path d="M12 3a9 9 0 100 18 9 9 0 000-18zm0 3l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4z" />
    case 'target': return <path d="M12 3a9 9 0 100 18 9 9 0 000-18zm0 3a6 6 0 110 12 6 6 0 010-12zm0 3a3 3 0 100 6 3 3 0 000-6z" />
    case 'terrain': return <path d="M3 18l5-8 3 4 4-7 6 11H3zm2-1h14l-4-7-4 7-3-4-3 4z" />
    case 'rocket': return <path d="M14 3c3 1 5 3 7 7l-5 2-4 6-2-5-5-2c1-4 3-6 7-8h2zM7 14l3 3-4 4H3v-3l4-4z" />
    case 'hand': return <path d="M7 21a4 4 0 01-4-4v-3h2v3a2 2 0 002 2h6a4 4 0 004-4v-4h2v4a6 6 0 01-6 6H7zM9 3h2v9H9zm4 2h2v7h-2zm-8 4h2v5H5zm12 1h2v5h-2z" />
    case 'rest': return <path d="M4 12c0-4 3-7 7-7 2 0 3.7.7 5 2A5 5 0 0112 16H4v-4zm0 6h16v2H4z" />
    case 'flag': return <path d="M6 3h2v18H6zM8 4h10l-2 3 2 3H8z" />
    case 'crown': return <path d="M3 18h18l-2-9-5 4-2-6-2 6-5-4-2 9zm2 2h14v1H5z" />
    case 'dice': return <path d="M5 5h14v14H5zM8 8h2v2H8zm6 0h2v2h-2zm-3 3h2v2h-2zm-3 3h2v2H8zm6 0h2v2h-2z" />
  }
}

export function GameIcon({ icon, theme, className = '' }: GameIconProps) {
  const category = iconCategoryMap[icon]
  return (
    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-md ring-1 ${categoryTokens[theme][category]} ${className}`}>
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        {iconPath(icon)}
      </svg>
    </span>
  )
}

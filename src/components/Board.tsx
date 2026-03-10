import { characters } from '../data/characters'
import { tileTypeIconMap } from '../data/iconMap'
import type { GameState } from '../types'
import { GameIcon } from './GameIcon'

interface BoardProps {
  state: GameState
}

export function Board({ state }: BoardProps) {
  const boardShell = state.theme === 'night' ? 'bg-slate-900/70' : 'bg-white/70'
  const tileBase = state.theme === 'night' ? 'border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100' : 'border-slate-200 bg-gradient-to-br from-white to-slate-50'
  const tileText = state.theme === 'night' ? 'text-slate-200' : 'text-slate-700'

  return (
    <div className={`grid grid-cols-10 gap-2 rounded-2xl p-3 shadow-inner backdrop-blur ${boardShell}`}>
      {state.tiles.map((tile) => {
        const localPlayers = state.players.filter((p) => p.position === tile.id)
        const char = (id: string) => characters.find((c) => c.id === id)
        return (
          <div
            key={tile.id}
            className={`min-h-16 rounded-xl border p-1 text-[10px] sm:text-xs ${tileBase} ${
              state.highlightedTile === tile.id ? 'border-fuchsia-500 ring-2 ring-fuchsia-300 animate-pulseSoft' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold">{tile.id}</span>
              <GameIcon icon={tileTypeIconMap[tile.type]} theme={state.theme} className="h-5 w-5" />
            </div>
            <div className={`truncate font-semibold ${tileText}`}>{tile.label}</div>
            <div className="mt-1 flex flex-wrap gap-1">
              {localPlayers.map((p) => (
                <span key={p.id} style={{ backgroundColor: p.color }} className="rounded px-1 text-white" title={p.name}>
                  {char(p.characterId)?.emoji ?? '🙂'}
                </span>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

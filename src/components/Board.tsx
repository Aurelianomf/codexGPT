import { characters } from '../data/characters'
import type { GameState } from '../types'

interface BoardProps {
  state: GameState
}

export function Board({ state }: BoardProps) {
  const cols = 10
  return (
    <div className="grid grid-cols-10 gap-2 rounded-2xl bg-white/70 p-3 shadow-inner backdrop-blur">
      {state.tiles.map((tile) => {
        const localPlayers = state.players.filter((p) => p.position === tile.id)
        const char = (id: string) => characters.find((c) => c.id === id)
        return (
          <div
            key={tile.id}
            className={`min-h-16 rounded-xl border p-1 text-[10px] sm:text-xs ${
              state.highlightedTile === tile.id ? 'border-fuchsia-500 ring-2 ring-fuchsia-300 animate-pulseSoft' : 'border-slate-200'
            } bg-gradient-to-br from-white to-slate-50`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold">{tile.id}</span>
              <span>{tile.type === 'surprise' ? '🃏' : tile.type === 'trap' ? '🪤' : tile.type === 'bonus' ? '✨' : '•'}</span>
            </div>
            <div className="truncate font-semibold text-slate-700">{tile.label}</div>
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

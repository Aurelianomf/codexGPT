import { characters } from '../data/characters'
import type { Player } from '../types'

export function PlayerCard({ player, active }: { player: Player; active: boolean }) {
  const ch = characters.find((c) => c.id === player.characterId)
  return (
    <div className={`rounded-xl border p-3 ${active ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white'}`}>
      <div className="flex items-center justify-between text-sm font-bold">
        <span>
          {ch?.emoji} {player.name}
        </span>
        <span>{player.type === 'bot' ? 'BOT' : 'HUM'}</span>
      </div>
      <div className="mt-2 space-y-1 text-xs text-slate-700">
        <div>Posição: {player.position}</div>
        <div>Pontos: {player.score}</div>
        <div>Escudo: {player.shield}</div>
        <div>Preso: {player.skipTurns > 0 ? `${player.skipTurns} turno(s)` : 'não'}</div>
      </div>
    </div>
  )
}

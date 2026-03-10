import { tileTypeIconMap } from '../data/iconMap'
import type { ThemeMode, TileType } from '../types'
import { GameIcon } from './GameIcon'

interface TutorialPanelProps {
  theme?: ThemeMode
}

const legendItems: Array<{ type: TileType; label: string }> = [
  { type: 'bonus', label: 'Bônus: avanço ou vantagem' },
  { type: 'trap', label: 'Armadilha: perda de casas' },
  { type: 'surprise', label: 'Surpresa: compra de carta' },
  { type: 'shield', label: 'Escudo: protege de efeito ruim' },
  { type: 'portal', label: 'Portal: teleporte no tabuleiro' },
  { type: 'checkpoint', label: 'Checkpoint: salva progresso' },
  { type: 'impulse', label: 'Impulso: dobra próximo dado' },
  { type: 'prison', label: 'Prisão: perde turno' },
]

export function TutorialPanel({ theme = 'festival' }: TutorialPanelProps) {
  const textColor = theme === 'night' ? 'text-slate-200' : 'text-slate-700'
  const panelColor = theme === 'night' ? 'bg-slate-900/70 border-slate-700' : 'bg-slate-50 border-slate-200'

  return (
    <div className={`space-y-3 text-sm ${textColor}`}>
      <p><strong>Objetivo:</strong> chegar à última casa primeiro (ultrapassar também vence).</p>
      <p><strong>Turno:</strong> veja o jogador da vez → role o dado → peão anda → efeito da casa/carta aplica.</p>
      <p><strong>Status:</strong> escudo bloqueia um efeito ruim, prisão remove turno, impulso dobra próximo dado.</p>
      <div className={`rounded-xl border p-3 ${panelColor}`}>
        <p className="mb-2 font-semibold">Legenda visual rápida</p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {legendItems.map((item) => (
            <li key={item.type} className="flex items-center gap-2">
              <GameIcon icon={tileTypeIconMap[item.type]} theme={theme} />
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
      <p><strong>Dica:</strong> checkpoints salvam progresso e cartas surpresa podem mudar tudo!</p>
    </div>
  )
}

import { cardEffectIconMap } from '../data/iconMap'
import type { CardDefinition, ThemeMode } from '../types'
import { GameIcon } from './GameIcon'

interface CardPopupProps {
  card?: CardDefinition
  theme: ThemeMode
}

const effectLabel: Record<CardDefinition['effectType'], string> = {
  move: 'Movimento',
  skip: 'Perder turno',
  extraTurn: 'Turno extra',
  swap: 'Troca',
  shieldTurns: 'Escudo',
  targetBack: 'Alvo para trás',
  everyoneBack: 'Todos para trás',
  rollAndAdd: 'Rolar e somar',
  toCheckpoint: 'Retorno ao checkpoint',
  drawAgain: 'Comprar novamente',
  immunityTrap: 'Imunidade de armadilha',
  stuckUntilEven: 'Preso até par',
  nextBonus: 'Próximo bônus',
}

export function CardPopup({ card, theme }: CardPopupProps) {
  if (!card) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-xl bg-slate-100/80 p-3 text-slate-800">
        <GameIcon icon={cardEffectIconMap[card.effectType]} theme={theme} />
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Efeito</p>
          <p className="font-semibold">{effectLabel[card.effectType]}</p>
        </div>
      </div>
      <p className="text-base font-semibold">{card.text}</p>
    </div>
  )
}

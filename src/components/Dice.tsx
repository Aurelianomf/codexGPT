interface DiceProps {
  value: number | null
  rolling: boolean
  onRoll: () => void
  disabled?: boolean
}

export function Dice({ value, rolling, onRoll, disabled }: DiceProps) {
  return (
    <button
      onClick={onRoll}
      disabled={disabled}
      className="w-full rounded-2xl bg-amber-300 p-4 text-slate-900 shadow transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <div className="mb-2 text-xs font-bold uppercase">Dado mágico</div>
      <div className={`mx-auto grid h-16 w-16 place-items-center rounded-xl bg-white text-2xl font-black ${rolling ? 'animate-diceRoll' : ''}`}>
        {value ?? '🎲'}
      </div>
      <div className="mt-2 text-sm font-semibold">{rolling ? 'Rolando...' : 'Rolar dado'}</div>
    </button>
  )
}

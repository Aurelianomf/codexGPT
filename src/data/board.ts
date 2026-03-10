import type { GameMode, Tile, TileType } from '../types'

const typeInfo: Record<TileType, { label: string; desc: string }> = {
  neutral: { label: 'Neutra', desc: 'Respire fundo. Nada acontece.' },
  bonus: { label: 'Bônus', desc: 'Avance de 1 a 3 casas.' },
  trap: { label: 'Armadilha', desc: 'Volte de 1 a 3 casas.' },
  prison: { label: 'Prisão', desc: 'Perca 1 turno.' },
  surprise: { label: 'Surpresa', desc: 'Compre uma carta.' },
  turbo: { label: 'Turbo', desc: 'Você joga novamente.' },
  swap: { label: 'Troca', desc: 'Troca de posição com outro jogador.' },
  shield: { label: 'Escudo', desc: 'Ganhe proteção contra efeito negativo.' },
  luck: { label: 'Sorte', desc: 'Receba efeito bom aleatório.' },
  badLuck: { label: 'Azar', desc: 'Receba efeito ruim aleatório.' },
  portal: { label: 'Portal', desc: 'Teleporte para um ponto do caminho.' },
  challenge: { label: 'Desafio', desc: 'Mini evento de sorte.' },
  terrain: { label: 'Terreno', desc: 'No próximo turno, seu dado perde 1.' },
  impulse: { label: 'Impulso', desc: 'Próximo dado é dobrado.' },
  steal: { label: 'Roubo Divertido', desc: 'Pega bônus de um rival.' },
  rest: { label: 'Descanso', desc: 'Remove penalidades.' },
  checkpoint: { label: 'Checkpoint', desc: 'Marca progresso seguro.' },
  finale: { label: 'Final Especial', desc: 'Etapa final com bônus de pontos.' },
}

const modePattern: Record<GameMode, TileType[]> = {
  quick: ['neutral', 'bonus', 'surprise', 'trap', 'turbo', 'checkpoint', 'terrain', 'luck'],
  normal: ['neutral', 'bonus', 'trap', 'surprise', 'turbo', 'swap', 'shield', 'luck', 'badLuck', 'portal', 'challenge', 'terrain', 'impulse', 'steal', 'rest', 'checkpoint'],
  chaotic: ['trap', 'badLuck', 'surprise', 'prison', 'trap', 'swap', 'portal', 'challenge', 'steal', 'terrain', 'neutral', 'bonus', 'impulse'],
}

const themes = ['Vila Solar', 'Bosque Encantado', 'Montanhas de Açúcar', 'Pântano Brilhante', 'Ruínas do Reino', 'Praia de Cristal', 'Castelo Celeste']

export function buildBoard(mode: GameMode): Tile[] {
  const size = mode === 'quick' ? 60 : 80
  const pattern = modePattern[mode]
  const tiles: Tile[] = []

  for (let i = 0; i < size; i += 1) {
    if (i === 0) {
      tiles.push({ id: i, type: 'neutral', label: 'Início', description: 'Largada da trilha.', theme: themes[0] })
      continue
    }

    if (i === size - 1) {
      tiles.push({ id: i, type: 'finale', label: 'Chegada', description: 'Casa final da aventura!', theme: 'Portal da Vitória' })
      continue
    }

    const type = pattern[i % pattern.length]
    const data = typeInfo[type]

    const tile: Tile = {
      id: i,
      type,
      label: data.label,
      description: data.desc,
      theme: themes[Math.floor(i / Math.max(1, Math.floor(size / themes.length)))] ?? themes[themes.length - 1],
    }

    if (type === 'portal') {
      tile.portalTo = Math.min(size - 2, i + (i % 2 === 0 ? 8 : 6))
    }

    if (type === 'terrain') {
      tile.terrainKind = ['mud', 'ice', 'sand'][i % 3] as 'mud' | 'ice' | 'sand'
    }

    if (i % 17 === 0) {
      tile.type = 'checkpoint'
      tile.label = 'Checkpoint'
      tile.description = 'Salva seu progresso.'
    }

    tiles.push(tile)
  }

  return tiles
}

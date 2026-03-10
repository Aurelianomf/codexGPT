import type { CardDefinition, Player, Tile } from '../types'

export const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max))

export const shuffle = <T,>(items: T[]): T[] => {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export const byPositionDesc = (a: Player, b: Player) => b.position - a.position || b.score - a.score

export const findNextBonus = (tiles: Tile[], current: number): number => {
  for (let i = current + 1; i < tiles.length; i += 1) {
    if (tiles[i].type === 'bonus') return i
  }
  return tiles.length - 1
}

export const drawCard = (deck: CardDefinition[], discard: CardDefinition[]): { card: CardDefinition; deck: CardDefinition[]; discard: CardDefinition[] } => {
  if (deck.length === 0) {
    const newDeck = shuffle(discard)
    const [first, ...rest] = newDeck
    return { card: first, deck: rest, discard: [] }
  }
  const [card, ...rest] = deck
  return { card, deck: rest, discard }
}

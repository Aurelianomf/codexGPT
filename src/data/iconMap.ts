import type { CardEffectType, TileType } from '../types'

export type IconName =
  | 'spark'
  | 'trap'
  | 'lock'
  | 'card'
  | 'bolt'
  | 'swap'
  | 'shield'
  | 'clover'
  | 'skull'
  | 'portal'
  | 'target'
  | 'terrain'
  | 'rocket'
  | 'hand'
  | 'rest'
  | 'flag'
  | 'crown'
  | 'dice'

export type VisualCategory = 'positive' | 'negative' | 'neutral'

export const tileTypeIconMap: Record<TileType, IconName> = {
  neutral: 'flag',
  bonus: 'spark',
  trap: 'trap',
  prison: 'lock',
  surprise: 'card',
  turbo: 'bolt',
  swap: 'swap',
  shield: 'shield',
  luck: 'clover',
  badLuck: 'skull',
  portal: 'portal',
  challenge: 'target',
  terrain: 'terrain',
  impulse: 'rocket',
  steal: 'hand',
  rest: 'rest',
  checkpoint: 'flag',
  finale: 'crown',
}

export const cardEffectIconMap: Record<CardEffectType, IconName> = {
  move: 'rocket',
  skip: 'lock',
  extraTurn: 'bolt',
  swap: 'swap',
  shieldTurns: 'shield',
  targetBack: 'target',
  everyoneBack: 'skull',
  rollAndAdd: 'dice',
  toCheckpoint: 'flag',
  drawAgain: 'card',
  immunityTrap: 'shield',
  stuckUntilEven: 'lock',
  nextBonus: 'spark',
}

export const iconCategoryMap: Record<IconName, VisualCategory> = {
  spark: 'positive',
  trap: 'negative',
  lock: 'negative',
  card: 'neutral',
  bolt: 'positive',
  swap: 'neutral',
  shield: 'positive',
  clover: 'positive',
  skull: 'negative',
  portal: 'neutral',
  target: 'neutral',
  terrain: 'negative',
  rocket: 'positive',
  hand: 'neutral',
  rest: 'positive',
  flag: 'neutral',
  crown: 'positive',
  dice: 'neutral',
}

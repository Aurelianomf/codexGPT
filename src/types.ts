export type GameScreen = 'home' | 'setup' | 'game' | 'tutorial' | 'result'

export type GameMode = 'quick' | 'normal' | 'chaotic'
export type ThemeMode = 'festival' | 'night'

export type TileType =
  | 'neutral'
  | 'bonus'
  | 'trap'
  | 'prison'
  | 'surprise'
  | 'turbo'
  | 'swap'
  | 'shield'
  | 'luck'
  | 'badLuck'
  | 'portal'
  | 'challenge'
  | 'terrain'
  | 'impulse'
  | 'steal'
  | 'rest'
  | 'checkpoint'
  | 'finale'

export type TerrainKind = 'mud' | 'ice' | 'sand'

export interface Tile {
  id: number
  type: TileType
  label: string
  description: string
  theme: string
  portalTo?: number
  terrainKind?: TerrainKind
}

export type CardRarity = 'common' | 'rare' | 'epic' | 'curse'

export type CardEffectType =
  | 'move'
  | 'skip'
  | 'extraTurn'
  | 'swap'
  | 'shieldTurns'
  | 'targetBack'
  | 'everyoneBack'
  | 'rollAndAdd'
  | 'toCheckpoint'
  | 'drawAgain'
  | 'immunityTrap'
  | 'stuckUntilEven'
  | 'nextBonus'

export interface CardDefinition {
  id: string
  title: string
  text: string
  effectType: CardEffectType
  value?: number
  rarity: CardRarity
}

export interface CharacterDef {
  id: string
  name: string
  emoji: string
  color: string
  ability: {
    id: 'reroll' | 'ignoreTrap' | 'plusOne' | 'escapePrison' | 'shieldStart' | 'dash' | 'luckBoost' | 'steady'
    label: string
    description: string
  }
}

export type PlayerType = 'human' | 'bot'

export interface Player {
  id: string
  name: string
  color: string
  characterId: string
  type: PlayerType
  position: number
  score: number
  skipTurns: number
  shield: number
  immunityTrapTurns: number
  terrainPenalty: number
  nextRollBoost: number
  nextRollDouble: boolean
  extraTurn: boolean
  stuckUntilEven: boolean
  usedAbility: boolean
  checkpoint: number
}

export interface GameSettings {
  mode: GameMode
  totalPlayers: number
  theme: ThemeMode
}

export interface GameState {
  id: string
  status: 'playing' | 'finished'
  mode: GameMode
  theme: ThemeMode
  tiles: Tile[]
  deck: CardDefinition[]
  discard: CardDefinition[]
  players: Player[]
  turnIndex: number
  round: number
  diceValue: number | null
  rolling: boolean
  winnerId?: string
  eventLog: string[]
  highlightedTile: number
  modalMessage?: string
  currentCard?: CardDefinition
}

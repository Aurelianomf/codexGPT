import { buildBoard } from '../data/board'
import { cardDeck } from '../data/cards'
import { characters } from '../data/characters'
import type { CardDefinition, GameMode, GameSettings, GameState, Player, Tile } from '../types'
import { byPositionDesc, clamp, drawCard, findNextBonus, shuffle } from './utils'

const botDelayMs = 1200

export interface NewPlayerInput {
  name: string
  characterId: string
  color: string
  type: 'human' | 'bot'
}

const randomRoll = () => Math.floor(Math.random() * 6) + 1

const withLog = (state: GameState, text: string) => ({ ...state, eventLog: [text, ...state.eventLog].slice(0, 8) })

export function createGame(settings: GameSettings, playersInput: NewPlayerInput[]): GameState {
  const tiles = buildBoard(settings.mode)
  const deck = shuffle(cardDeck)
  const players: Player[] = playersInput.map((input, idx) => {
    const char = characters.find((c) => c.id === input.characterId) ?? characters[idx % characters.length]
    return {
      id: `p-${idx}-${Date.now()}`,
      name: input.name,
      color: input.color,
      characterId: char.id,
      type: input.type,
      position: 0,
      score: 0,
      skipTurns: 0,
      shield: char.ability.id === 'shieldStart' ? 1 : 0,
      immunityTrapTurns: 0,
      terrainPenalty: 0,
      nextRollBoost: 0,
      nextRollDouble: false,
      extraTurn: false,
      stuckUntilEven: false,
      usedAbility: false,
      checkpoint: 0,
    }
  })

  return {
    id: crypto.randomUUID(),
    status: 'playing',
    mode: settings.mode,
    theme: settings.theme,
    tiles,
    deck,
    discard: [],
    players,
    turnIndex: 0,
    round: 1,
    diceValue: null,
    rolling: false,
    highlightedTile: 0,
    eventLog: ['A aventura começou!'],
  }
}

function applyMovement(player: Player, amount: number, tiles: Tile[]) {
  const destination = clamp(player.position + amount, 0, tiles.length - 1)
  const moved = destination - player.position
  return {
    ...player,
    position: destination,
    score: player.score + Math.max(0, moved) + (destination === tiles.length - 1 ? 30 : 0),
  }
}

function applyCard(state: GameState, player: Player, card: CardDefinition): { state: GameState; player: Player; message: string } {
  let nextPlayer = { ...player }
  let message = `${player.name} puxou carta: ${card.title}.`
  let nextState = state

  switch (card.effectType) {
    case 'move':
      nextPlayer = applyMovement(nextPlayer, card.value ?? 0, state.tiles)
      message += ` Movimento de ${card.value}.`
      break
    case 'skip':
      nextPlayer.skipTurns += card.value ?? 1
      message += ' Vai perder turno.'
      break
    case 'extraTurn':
      nextPlayer.extraTurn = true
      message += ' Jogará novamente!'
      break
    case 'swap': {
      const sorted = [...state.players].sort(byPositionDesc)
      const target = card.value === -1 ? sorted[sorted.length - 1] : sorted[0]
      if (target && target.id !== nextPlayer.id) {
        const targetPos = target.position
        nextState = {
          ...nextState,
          players: nextState.players.map((p) => {
            if (p.id === nextPlayer.id) return { ...p, position: targetPos }
            if (p.id === target.id) return { ...p, position: nextPlayer.position }
            return p
          }),
        }
        nextPlayer.position = targetPos
        message += ` Trocou com ${target.name}.`
      }
      break
    }
    case 'shieldTurns':
      nextPlayer.shield += card.value ?? 1
      message += ` Escudo +${card.value ?? 1}.`
      break
    case 'targetBack': {
      const targets = state.players.filter((p) => p.id !== nextPlayer.id).sort(byPositionDesc)
      const target = targets[0]
      if (target) {
        nextState = {
          ...nextState,
          players: nextState.players.map((p) => (p.id === target.id ? applyMovement(p, -(card.value ?? 2), state.tiles) : p)),
        }
        message += ` ${target.name} voltou ${card.value ?? 2}.`
      }
      break
    }
    case 'everyoneBack':
      nextState = {
        ...nextState,
        players: nextState.players.map((p) => (p.id === nextPlayer.id ? p : applyMovement(p, -(card.value ?? 1), state.tiles))),
      }
      message += ' Todos os rivais recuaram.'
      break
    case 'rollAndAdd': {
      const plus = randomRoll()
      nextPlayer = applyMovement(nextPlayer, plus, state.tiles)
      message += ` Rolou ${plus} extra.`
      break
    }
    case 'toCheckpoint':
      nextPlayer.position = nextPlayer.checkpoint
      message += ` Voltou ao checkpoint ${nextPlayer.checkpoint}.`
      break
    case 'drawAgain': {
      const result = drawCard(nextState.deck, nextState.discard)
      nextState = { ...nextState, deck: result.deck, discard: [...nextState.discard, card] }
      return applyCard(nextState, nextPlayer, result.card)
    }
    case 'immunityTrap':
      nextPlayer.immunityTrapTurns += card.value ?? 2
      message += ' Imune a armadilhas.'
      break
    case 'stuckUntilEven':
      nextPlayer.stuckUntilEven = true
      message += ' Ficou preso até sair par.'
      break
    case 'nextBonus': {
      const idx = findNextBonus(state.tiles, nextPlayer.position)
      nextPlayer.position = idx
      nextPlayer.score += 4
      message += ` Avançou até bônus (${idx}).`
      break
    }
  }

  return { state: nextState, player: nextPlayer, message }
}

function applyTile(state: GameState, player: Player): { state: GameState; player: Player; message: string } {
  const tile = state.tiles[player.position]
  let nextPlayer = { ...player }
  let nextState = state
  let message = `${player.name} caiu em ${tile.label}.`

  const negativeBlocked = (effect: () => void) => {
    if (nextPlayer.shield > 0) {
      nextPlayer.shield -= 1
      message += ' Escudo bloqueou efeito negativo.'
      return
    }
    effect()
  }

  switch (tile.type) {
    case 'bonus':
      nextPlayer = applyMovement(nextPlayer, (player.position % 3) + 1, state.tiles)
      message += ' Ganhou avanço bônus.'
      break
    case 'trap':
      if (nextPlayer.immunityTrapTurns > 0) {
        message += ' Imune à armadilha.'
      } else {
        negativeBlocked(() => {
          nextPlayer = applyMovement(nextPlayer, -((player.position % 3) + 1), state.tiles)
          message += ' Recuou com armadilha.'
        })
      }
      break
    case 'prison':
      negativeBlocked(() => {
        nextPlayer.skipTurns += 1
        message += ' Perde 1 turno.'
      })
      break
    case 'surprise': {
      const result = drawCard(state.deck, state.discard)
      nextState = { ...nextState, deck: result.deck, currentCard: result.card }
      const applied = applyCard(nextState, nextPlayer, result.card)
      nextState = { ...applied.state, discard: [...applied.state.discard, result.card] }
      nextPlayer = applied.player
      message += ` ${applied.message}`
      break
    }
    case 'turbo':
      nextPlayer.extraTurn = true
      message += ' Ganhou turno extra.'
      break
    case 'swap': {
      const candidates = state.players.filter((p) => p.id !== player.id)
      const target = candidates[Math.floor(Math.random() * candidates.length)]
      if (target) {
        const targetPos = target.position
        nextState = {
          ...nextState,
          players: nextState.players.map((p) => {
            if (p.id === player.id) return { ...p, position: targetPos }
            if (p.id === target.id) return { ...p, position: player.position }
            return p
          }),
        }
        nextPlayer.position = targetPos
        message += ` Trocou com ${target.name}.`
      }
      break
    }
    case 'shield':
      nextPlayer.shield += 1
      message += ' Ganhou escudo.'
      break
    case 'luck':
      nextPlayer = applyMovement(nextPlayer, 2, state.tiles)
      nextPlayer.score += 3
      message += ' Sorte: avançou e pontuou.'
      break
    case 'badLuck':
      negativeBlocked(() => {
        nextPlayer = applyMovement(nextPlayer, -2, state.tiles)
        nextPlayer.skipTurns += 1
        message += ' Azar: voltou e perde turno.'
      })
      break
    case 'portal':
      nextPlayer.position = tile.portalTo ?? nextPlayer.position
      nextPlayer.score += 2
      message += ` Teleportou para ${nextPlayer.position}.`
      break
    case 'challenge': {
      const win = Math.random() > 0.5
      if (win) {
        nextPlayer = applyMovement(nextPlayer, 2, state.tiles)
        message += ' Desafio vencido, +2 casas.'
      } else {
        negativeBlocked(() => {
          nextPlayer = applyMovement(nextPlayer, -1, state.tiles)
          message += ' Desafio perdido, -1 casa.'
        })
      }
      break
    }
    case 'terrain':
      nextPlayer.terrainPenalty = Math.max(nextPlayer.terrainPenalty, 1)
      message += ` Terreno ${tile.terrainKind}: próximo dado -1.`
      break
    case 'impulse':
      nextPlayer.nextRollDouble = true
      message += ' Próximo dado em dobro.'
      break
    case 'steal': {
      const candidates = state.players.filter((p) => p.id !== player.id).sort(byPositionDesc)
      const target = candidates[0]
      if (target) {
        nextState = {
          ...nextState,
          players: nextState.players.map((p) => {
            if (p.id === target.id) return { ...p, shield: Math.max(0, p.shield - 1), score: Math.max(0, p.score - 3) }
            return p
          }),
        }
        nextPlayer.shield += 1
        nextPlayer.score += 3
        message += ` Roubou bônus de ${target.name}.`
      }
      break
    }
    case 'rest':
      nextPlayer.skipTurns = 0
      nextPlayer.terrainPenalty = 0
      nextPlayer.stuckUntilEven = false
      message += ' Descansou e removeu penalidades.'
      break
    case 'checkpoint':
      nextPlayer.checkpoint = Math.max(nextPlayer.checkpoint, nextPlayer.position)
      nextPlayer.score += 2
      message += ' Checkpoint salvo.'
      break
    case 'finale':
      nextPlayer.score += 15
      message += ' Casa final especial!'
      break
    default:
      break
  }

  return { state: nextState, player: nextPlayer, message }
}

export function playTurn(state: GameState, forcedRoll?: number): GameState {
  if (state.status !== 'playing') return state
  const current = state.players[state.turnIndex]

  if (current.skipTurns > 0) {
    const updated = { ...current, skipTurns: current.skipTurns - 1 }
    return endTurn({
      ...withLog(state, `${current.name} perdeu o turno.`),
      players: state.players.map((p) => (p.id === current.id ? updated : p)),
    })
  }

  const rollRaw = forcedRoll ?? randomRoll()
  if (current.stuckUntilEven && rollRaw % 2 !== 0) {
    return endTurn(withLog(state, `${current.name} precisa de par para sair da prisão mágica.`))
  }

  let roll = rollRaw
  let currentPlayer = { ...current }

  if (currentPlayer.nextRollBoost) {
    roll += currentPlayer.nextRollBoost
    currentPlayer.nextRollBoost = 0
  }

  if (currentPlayer.terrainPenalty > 0) {
    roll = Math.max(1, roll - currentPlayer.terrainPenalty)
    currentPlayer.terrainPenalty = 0
  }

  if (currentPlayer.nextRollDouble) {
    roll *= 2
    currentPlayer.nextRollDouble = false
  }

  if (currentPlayer.stuckUntilEven && rollRaw % 2 === 0) {
    currentPlayer.stuckUntilEven = false
  }

  currentPlayer = applyMovement(currentPlayer, roll, state.tiles)
  const tileApplied = applyTile({ ...state, diceValue: rollRaw }, currentPlayer)
  currentPlayer = tileApplied.player
  let nextState: GameState = {
    ...tileApplied.state,
    diceValue: rollRaw,
    highlightedTile: currentPlayer.position,
    players: tileApplied.state.players.map((p) => (p.id === currentPlayer.id ? currentPlayer : p)),
  }

  if (currentPlayer.immunityTrapTurns > 0) {
    nextState = {
      ...nextState,
      players: nextState.players.map((p) => (p.id === currentPlayer.id ? { ...p, immunityTrapTurns: p.immunityTrapTurns - 1 } : p)),
    }
  }

  nextState = withLog(nextState, `${tileApplied.message} (dado ${rollRaw})`)

  const winner = nextState.players.find((p) => p.position >= nextState.tiles.length - 1)
  if (winner) {
    return {
      ...nextState,
      status: 'finished',
      winnerId: winner.id,
      modalMessage: `${winner.name} chegou ao fim da trilha e venceu!`,
    }
  }

  return endTurn(nextState)
}

function endTurn(state: GameState): GameState {
  const player = state.players[state.turnIndex]
  if (player.extraTurn) {
    return {
      ...state,
      players: state.players.map((p) => (p.id === player.id ? { ...p, extraTurn: false } : p)),
      modalMessage: `${player.name} ganhou turno extra!`,
    }
  }

  const nextTurn = (state.turnIndex + 1) % state.players.length
  const newRound = nextTurn === 0 ? state.round + 1 : state.round

  return {
    ...state,
    turnIndex: nextTurn,
    round: newRound,
  }
}

export const isBotTurn = (state: GameState) => state.players[state.turnIndex]?.type === 'bot'
export const getBotDelay = () => botDelayMs

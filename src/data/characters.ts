import type { CharacterDef } from '../types'

export const characters: CharacterDef[] = [
  {
    id: 'avent',
    name: 'Aventureiro Leo',
    emoji: '🧭',
    color: '#3b82f6',
    ability: { id: 'reroll', label: 'Segunda Chance', description: 'Uma vez por partida, pode rolar novamente.' },
  },
  {
    id: 'mage',
    name: 'Maga Luma',
    emoji: '🪄',
    color: '#a855f7',
    ability: { id: 'shieldStart', label: 'Barreira Mística', description: 'Começa com 1 escudo.' },
  },
  {
    id: 'robot',
    name: 'Robô Bolt',
    emoji: '🤖',
    color: '#0ea5e9',
    ability: { id: 'plusOne', label: 'Turbo de Precisão', description: 'Uma vez por partida ganha +1 no dado.' },
  },
  {
    id: 'dino',
    name: 'Dino Rexito',
    emoji: '🦖',
    color: '#16a34a',
    ability: { id: 'ignoreTrap', label: 'Casco Resistente', description: 'Ignora uma armadilha uma vez.' },
  },
  {
    id: 'fox',
    name: 'Raposa Faísca',
    emoji: '🦊',
    color: '#f97316',
    ability: { id: 'dash', label: 'Corrida Relâmpago', description: 'Uma vez por partida avança +2 após mover.' },
  },
  {
    id: 'knight',
    name: 'Cavaleiro Theo',
    emoji: '🛡️',
    color: '#64748b',
    ability: { id: 'escapePrison', label: 'Chave de Aço', description: 'Escapa de uma prisão uma vez.' },
  },
  {
    id: 'explorer',
    name: 'Exploradora Bia',
    emoji: '🥾',
    color: '#ec4899',
    ability: { id: 'luckBoost', label: 'Sorte do Horizonte', description: 'Na primeira carta surpresa compra 2 e escolhe a melhor.' },
  },
  {
    id: 'pirate',
    name: 'Pirata Kiko',
    emoji: '🏴‍☠️',
    color: '#ef4444',
    ability: { id: 'steady', label: 'Mar Calmo', description: 'Reduz a primeira penalidade de terreno para 0.' },
  },
]

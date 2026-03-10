# Trilha dos Reinos em Festa

Jogo de tabuleiro digital em React + TypeScript + Vite + Tailwind para 2 a 4 jogadores locais (modo passa a vez), com bots opcionais, cartas surpresa, casas especiais, ranking e salvamento local.

## Stack
- React
- TypeScript
- Vite
- Tailwind CSS
- Persistência em `localStorage`
- Sem backend / sem internet durante a partida

## Como rodar
```bash
npm install
npm run dev
```

> Se o ambiente bloquear o acesso ao npm registry, rode em uma máquina com internet para instalar dependências.

## Modos de jogo
- **Rápida**: 60 casas
- **Normal**: 80 casas
- **Caótica**: 80 casas com mais efeitos negativos/cartas extremas

## Recursos implementados
- Tela inicial com tutorial
- Setup completo de jogadores (nome, cor, personagem, humano/bot)
- 8 personagens jogáveis
- Tabuleiro de trilha com progressão visual
- +12 tipos de casas
- 40 cartas de surpresa
- Dado animado
- Turnos com efeitos acumuláveis (escudo, prisão, imunidade, terreno etc.)
- Bots com atraso para parecer natural
- Ranking parcial e final
- Modal de efeitos e carta
- Salvamento automático da partida no `localStorage`
- Tema visual alternativo (Festival / Noite Mágica)

## Regra de vitória
- Vence quem chegar à última casa.
- É permitido ultrapassar a casa final (regra mais intuitiva/divertida para jogo em família).

## Estrutura principal
- `src/types.ts`: tipos centrais do jogo
- `src/data/`: personagens, cartas e gerador de tabuleiro
- `src/engine/`: motor de jogo, turnos e efeitos
- `src/components/`: componentes reutilizáveis da UI
- `src/hooks/usePersistentState.ts`: persistência local
- `src/App.tsx`: telas e fluxo principal

## Como jogar (resumo)
1. Configure jogadores e modo de partida.
2. Na vez do jogador, clique em **Rolar dado**.
3. O peão anda automaticamente.
4. O efeito da casa é aplicado.
5. Se cair em surpresa, uma carta é comprada e resolvida.
6. O turno passa para o próximo jogador (ou repete se houve turno extra).
7. Vence quem alcançar a chegada.

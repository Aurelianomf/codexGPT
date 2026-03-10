import { useEffect, useMemo, useState } from 'react'
import { Board } from './components/Board'
import { Dice } from './components/Dice'
import { Modal } from './components/Modal'
import { PlayerCard } from './components/PlayerCard'
import { TutorialPanel } from './components/TutorialPanel'
import { CardPopup } from './components/CardPopup'
import { characters } from './data/characters'
import { createGame, getBotDelay, isBotTurn, type NewPlayerInput, playTurn } from './engine/gameEngine'
import { usePersistentState } from './hooks/usePersistentState'
import type { GameMode, GameScreen, GameSettings, GameState, ThemeMode } from './types'

const gameNames = ['Trilha dos Reinos em Festa', 'Corrida Encantada da Família', 'Aventura da Trilha Mágica', 'Passos do Tesouro Feliz', 'Caminho das Mil Surpresas']

const defaultSettings: GameSettings = { mode: 'normal', totalPlayers: 2, theme: 'festival' }

function App() {
  const [screen, setScreen] = usePersistentState<GameScreen>('trail-screen', 'home')
  const [settings, setSettings] = usePersistentState<GameSettings>('trail-settings', defaultSettings)
  const [draftPlayers, setDraftPlayers] = usePersistentState<NewPlayerInput[]>('trail-draft', [
    { name: 'Jogador 1', characterId: characters[0].id, color: '#ef4444', type: 'human' },
    { name: 'Jogador 2', characterId: characters[1].id, color: '#3b82f6', type: 'human' },
  ])
  const [state, setState] = usePersistentState<GameState | null>('trail-save', null)
  const [tutorialOpen, setTutorialOpen] = useState(false)
  const [cardOpen, setCardOpen] = useState(false)

  const ranking = useMemo(() => [...(state?.players ?? [])].sort((a, b) => b.position - a.position || b.score - a.score), [state])

  const resetDraft = (totalPlayers: number) => {
    const defaults = Array.from({ length: totalPlayers }, (_, i) => ({
      name: `Jogador ${i + 1}`,
      characterId: characters[i % characters.length].id,
      color: ['#ef4444', '#3b82f6', '#22c55e', '#f97316'][i % 4],
      type: i < 2 ? 'human' : 'bot' as const,
    }))
    setDraftPlayers(defaults)
  }

  const startGame = () => {
    const game = createGame(settings, draftPlayers.slice(0, settings.totalPlayers))
    setState(game)
    setScreen('game')
  }

  const onRoll = () => {
    if (!state || state.status !== 'playing') return
    setState({ ...state, rolling: true })
    setTimeout(() => {
      const next = playTurn({ ...state, rolling: false })
      setState(next)
      if (next.currentCard) setCardOpen(true)
      if (next.modalMessage) setTimeout(() => setState((prev) => (prev ? { ...prev, modalMessage: undefined } : prev)), 1800)
      if (next.status === 'finished') setScreen('result')
    }, 850)
  }

  useEffect(() => {
    if (!state || state.status !== 'playing') return
    if (isBotTurn(state) && !state.rolling) {
      const t = setTimeout(() => onRoll(), getBotDelay())
      return () => clearTimeout(t)
    }
  }, [state])

  const themeClass = settings.theme === 'festival' ? 'from-cyan-200 via-fuchsia-100 to-amber-100' : 'from-slate-800 via-indigo-900 to-slate-700 text-white'

  if (screen === 'home') {
    return (
      <main className={`min-h-screen bg-gradient-to-br ${themeClass} p-6`}>
        <div className="mx-auto max-w-4xl rounded-3xl bg-white/80 p-8 text-center shadow-2xl">
          <h1 className="text-4xl font-black text-fuchsia-700">{gameNames[0]}</h1>
          <p className="mt-3 text-slate-700">Jogo de trilha familiar, local e por turnos (passa a vez).</p>
          <div className="mt-4 rounded-xl bg-fuchsia-50 p-4 text-left text-sm text-slate-700">
            <p><strong>5 nomes criativos:</strong> {gameNames.join(' • ')}</p>
            <p className="mt-1"><strong>Nome escolhido:</strong> {gameNames[0]}</p>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button onClick={() => setScreen('setup')} className="rounded-xl bg-fuchsia-600 px-5 py-3 font-bold text-white">Nova Partida</button>
            {state && <button onClick={() => setScreen('game')} className="rounded-xl bg-slate-900 px-5 py-3 font-bold text-white">Continuar</button>}
            <button onClick={() => setTutorialOpen(true)} className="rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white">Tutorial</button>
          </div>
        </div>
        <Modal open={tutorialOpen} title="Como Jogar" onClose={() => setTutorialOpen(false)}><TutorialPanel theme={settings.theme} /></Modal>
      </main>
    )
  }

  if (screen === 'setup') {
    return (
      <main className={`min-h-screen bg-gradient-to-br ${themeClass} p-6`}>
        <div className="mx-auto max-w-5xl rounded-3xl bg-white/90 p-6 shadow-2xl">
          <h2 className="text-2xl font-black text-slate-800">Configurar Partida</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <label className="text-sm">Jogadores
              <select value={settings.totalPlayers} onChange={(e) => { const total = Number(e.target.value); setSettings({ ...settings, totalPlayers: total }); resetDraft(total) }} className="mt-1 w-full rounded border p-2">
                {[2,3,4].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
            <label className="text-sm">Modo
              <select value={settings.mode} onChange={(e) => setSettings({ ...settings, mode: e.target.value as GameMode })} className="mt-1 w-full rounded border p-2">
                <option value="quick">Partida rápida (60 casas)</option>
                <option value="normal">Partida normal (80 casas)</option>
                <option value="chaotic">Partida caótica (80 casas difíceis)</option>
              </select>
            </label>
            <label className="text-sm">Tema Visual
              <select value={settings.theme} onChange={(e) => setSettings({ ...settings, theme: e.target.value as ThemeMode })} className="mt-1 w-full rounded border p-2">
                <option value="festival">Festival colorido</option>
                <option value="night">Noite mágica</option>
              </select>
            </label>
          </div>

          <div className="mt-5 space-y-3">
            {draftPlayers.slice(0, settings.totalPlayers).map((p, idx) => (
              <div key={idx} className="grid gap-2 rounded-xl border p-3 sm:grid-cols-4">
                <input value={p.name} onChange={(e) => setDraftPlayers(draftPlayers.map((d, i) => i === idx ? { ...d, name: e.target.value } : d))} className="rounded border p-2 text-sm" />
                <select value={p.characterId} onChange={(e) => setDraftPlayers(draftPlayers.map((d, i) => i === idx ? { ...d, characterId: e.target.value } : d))} className="rounded border p-2 text-sm">
                  {characters.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
                </select>
                <input type="color" value={p.color} onChange={(e) => setDraftPlayers(draftPlayers.map((d, i) => i === idx ? { ...d, color: e.target.value } : d))} className="h-10 rounded border p-1" />
                <select value={p.type} onChange={(e) => setDraftPlayers(draftPlayers.map((d, i) => i === idx ? { ...d, type: e.target.value as 'human' | 'bot' } : d))} className="rounded border p-2 text-sm">
                  <option value="human">Humano</option>
                  <option value="bot">Bot</option>
                </select>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={startGame} className="rounded-xl bg-fuchsia-600 px-5 py-3 font-bold text-white">Começar</button>
            <button onClick={() => setScreen('home')} className="rounded-xl bg-slate-700 px-5 py-3 font-bold text-white">Voltar</button>
          </div>
        </div>
      </main>
    )
  }

  if (screen === 'result' && state) {
    const winner = state.players.find((p) => p.id === state.winnerId)
    return (
      <main className={`min-h-screen bg-gradient-to-br ${themeClass} p-6`}>
        <div className="mx-auto max-w-3xl rounded-3xl bg-white/90 p-8 shadow-2xl text-center">
          <h2 className="text-3xl font-black text-emerald-700">🏆 Fim de Jogo</h2>
          <p className="mt-2 text-lg font-semibold">Vencedor: {winner?.name}</p>
          <div className="mt-5 space-y-2 text-left">
            {ranking.map((p, i) => <div key={p.id} className="rounded-lg bg-slate-100 p-2 text-sm">#{i + 1} {p.name} — posição {p.position} — {p.score} pts</div>)}
          </div>
          <div className="mt-6 flex justify-center gap-3">
            <button onClick={() => setScreen('setup')} className="rounded-xl bg-fuchsia-600 px-5 py-3 font-bold text-white">Nova partida</button>
            <button onClick={() => { setState(null); setScreen('home') }} className="rounded-xl bg-slate-900 px-5 py-3 font-bold text-white">Reset total</button>
          </div>
        </div>
      </main>
    )
  }

  if (!state) {
    setScreen('home')
    return null
  }

  const current = state.players[state.turnIndex]

  return (
    <main className={`min-h-screen bg-gradient-to-br ${themeClass} p-3 sm:p-6`}>
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[1fr_320px]">
        <section className="rounded-3xl bg-white/80 p-3 shadow-2xl">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-xl font-black text-slate-800">Rodada {state.round}</h3>
              <p className="text-sm text-slate-700">Vez de <strong>{current.name}</strong> {current.type === 'bot' ? '(bot pensando...)' : ''}</p>
            </div>
            <button onClick={() => setScreen('home')} className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white">Menu</button>
          </div>
          <Board state={state} />
        </section>

        <aside className="space-y-3">
          <Dice value={state.diceValue} rolling={state.rolling} onRoll={onRoll} disabled={state.rolling || (current.type === 'bot')} />
          <div className="rounded-2xl bg-white/90 p-3 shadow">
            <h4 className="font-bold">Ranking parcial</h4>
            <div className="mt-2 space-y-2">
              {ranking.map((p) => <PlayerCard key={p.id} player={p} active={p.id === current.id} />)}
            </div>
          </div>
          <div className="rounded-2xl bg-white/90 p-3 shadow">
            <h4 className="font-bold">Últimos eventos</h4>
            <ul className="mt-2 space-y-1 text-xs text-slate-700">
              {state.eventLog.map((e, i) => <li key={i}>• {e}</li>)}
            </ul>
          </div>
          <button onClick={() => setTutorialOpen(true)} className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white">Regras rápidas</button>
        </aside>
      </div>

      <Modal open={tutorialOpen} title="Tutorial" onClose={() => setTutorialOpen(false)}><TutorialPanel theme={settings.theme} /></Modal>
      <Modal open={Boolean(state.modalMessage)} title="Efeito da Casa" onClose={() => setState({ ...state, modalMessage: undefined })}>{state.modalMessage}</Modal>
      <Modal open={cardOpen && Boolean(state.currentCard)} title={`Carta: ${state.currentCard?.title ?? ''}`} onClose={() => { setCardOpen(false); setState({ ...state, currentCard: undefined }) }}>
        <CardPopup card={state.currentCard} theme={settings.theme} />
      </Modal>
    </main>
  )
}

export default App

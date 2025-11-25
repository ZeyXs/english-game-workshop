'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Game, Player, Round, Brand } from './types'

interface GameStore {
  // Current game state
  currentGameId: string | null
  players: Player[]
  currentRound: Round | null
  gameStatus: Game['status']
  currentPlayerRevealIndex: number
  
  // Actions
  setGameId: (id: string | null) => void
  setPlayers: (players: Player[]) => void
  setCurrentRound: (round: Round | null) => void
  setGameStatus: (status: Game['status']) => void
  setCurrentPlayerRevealIndex: (index: number) => void
  incrementRevealIndex: () => void
  resetGame: () => void
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      currentGameId: null,
      players: [],
      currentRound: null,
      gameStatus: 'SETUP',
      currentPlayerRevealIndex: 0,
      
      setGameId: (id) => set({ currentGameId: id }),
      setPlayers: (players) => set({ players }),
      setCurrentRound: (round) => set({ currentRound: round }),
      setGameStatus: (status) => set({ gameStatus: status }),
      setCurrentPlayerRevealIndex: (index) => set({ currentPlayerRevealIndex: index }),
      incrementRevealIndex: () => set((state) => ({ 
        currentPlayerRevealIndex: state.currentPlayerRevealIndex + 1 
      })),
      resetGame: () => set({
        currentGameId: null,
        players: [],
        currentRound: null,
        gameStatus: 'SETUP',
        currentPlayerRevealIndex: 0,
      }),
    }),
    {
      name: 'brand-architect-game',
    }
  )
)

interface BrandStore {
  brands: Brand[]
  setBrands: (brands: Brand[]) => void
  getRandomBrand: (usedBrandIds: string[]) => Brand | null
}

export const useBrandStore = create<BrandStore>((set, get) => ({
  brands: [],
  setBrands: (brands) => set({ brands }),
  getRandomBrand: (usedBrandIds) => {
    const { brands } = get()
    const availableBrands = brands.filter(b => !usedBrandIds.includes(b.id))
    if (availableBrands.length === 0) return null
    return availableBrands[Math.floor(Math.random() * availableBrands.length)]
  },
}))


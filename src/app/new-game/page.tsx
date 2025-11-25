'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronLeft, Rocket, Landmark, Eye, Drama } from 'lucide-react'
import PlayerInput from '@/components/PlayerInput'
import { useGameStore } from '@/lib/store'

export default function NewGamePage() {
  const router = useRouter()
  const [players, setPlayers] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { setGameId, setPlayers: setStorePlayers, setGameStatus } = useGameStore()
  
  const MIN_PLAYERS = 4
  const MAX_PLAYERS = 10
  
  const handleStartGame = async () => {
    if (players.length < MIN_PLAYERS) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const gameResponse = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerNames: players })
      })
      
      if (!gameResponse.ok) {
        throw new Error('Error creating game')
      }
      
      const game = await gameResponse.json()
      
      const roundResponse = await fetch('/api/rounds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId: game.id })
      })
      
      if (!roundResponse.ok) {
        throw new Error('Error creating round')
      }
      
      setGameId(game.id)
      setStorePlayers(game.players)
      setGameStatus('REVEAL_ROLES')
      
      router.push(`/game/${game.id}/reveal`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-lg mx-auto">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-brand-gray 
                       hover:text-brand-secondary transition-colors mb-8 font-body"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </Link>
        </motion.div>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-6 sm:mb-10"
        >
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-brand-dark mb-2 sm:mb-3">
            New Game
          </h1>
          <p className="text-brand-gray font-body text-sm sm:text-base">
            Add players ({MIN_PLAYERS}-{MAX_PLAYERS} players)
          </p>
        </motion.div>
        
        {/* Player input card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6 mb-8"
        >
          <PlayerInput 
            players={players}
            onPlayersChange={(newPlayers) => {
              if (newPlayers.length <= MAX_PLAYERS) {
                setPlayers(newPlayers)
              }
            }}
            minPlayers={MIN_PLAYERS}
          />
        </motion.div>
        
        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-red-500 text-center font-body"
          >
            {error}
          </motion.div>
        )}
        
        {/* Start button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            onClick={handleStartGame}
            disabled={players.length < MIN_PLAYERS || isLoading}
            className="btn-primary w-full text-lg py-5 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            whileHover={{ scale: players.length >= MIN_PLAYERS ? 1.02 : 1 }}
            whileTap={{ scale: players.length >= MIN_PLAYERS ? 0.98 : 1 }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-3">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-brand-dark/30 border-t-brand-dark rounded-full"
                />
                Creating...
              </span>
            ) : (
              <>
                <Rocket className="w-5 h-5" />
                Start Game ({players.length} player{players.length > 1 ? 's' : ''})
              </>
            )}
          </motion.button>
        </motion.div>
        
        {/* Info cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 grid gap-4"
        >
          <div className="p-4 bg-brand-secondary/5 rounded-2xl border border-brand-secondary/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-secondary/20 flex items-center justify-center">
                <Landmark className="w-5 h-5 text-brand-secondary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-brand-secondary mb-1">Architect</h3>
                <p className="text-sm text-brand-dark/60 font-body">
                  Builds the brand logo with shapes
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Eye className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-emerald-600 mb-1">Players</h3>
                <p className="text-sm text-brand-dark/60 font-body">
                  Must guess the represented brand
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-red-50 rounded-2xl border border-red-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <Drama className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-red-500 mb-1">Saboteur</h3>
                <p className="text-sm text-brand-dark/60 font-body">
                  Tries to mislead other players
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

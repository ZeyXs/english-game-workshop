'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Trophy, Drama, Gamepad2, Home, Users, RotateCcw } from 'lucide-react'
import Confetti from '@/components/Confetti'
import type { Game } from '@/lib/types'

function EndContent() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const gameId = params.gameId as string
  const winner = searchParams.get('winner')
  
  const [game, setGame] = useState<Game | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  const playersWon = winner === 'players'
  
  const fetchGame = useCallback(async () => {
    try {
      const response = await fetch(`/api/games?id=${gameId}`)
      if (!response.ok) throw new Error('Game not found')
      const data = await response.json()
      setGame(data)
    } catch (error) {
      console.error('Error fetching game:', error)
    } finally {
      setIsLoading(false)
    }
  }, [gameId])
  
  useEffect(() => {
    fetchGame()
  }, [fetchGame])
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-light">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-brand-primary/30 border-t-brand-primary rounded-full"
        />
      </div>
    )
  }
  
  return (
    <div className="min-h-screen pt-12 pb-8 px-4">
      {playersWon && <Confetti />}
      
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`card p-8 text-center border-2 ${
            playersWon ? 'border-emerald-200' : 'border-red-200'
          }`}
        >
          {/* Trophy/Result icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
            className={`w-28 h-28 mx-auto mb-6 rounded-3xl flex items-center justify-center ${
              playersWon ? 'bg-brand-primary' : 'bg-red-100'
            }`}
          >
            {playersWon 
              ? <Trophy className="w-14 h-14 text-brand-dark" />
              : <Drama className="w-14 h-14 text-red-500" />
            }
          </motion.div>
          
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`font-display text-4xl font-bold mb-4 ${
              playersWon ? 'text-emerald-500' : 'text-red-500'
            }`}
          >
            {playersWon ? 'Players Win!' : 'Saboteur Triumphs!'}
          </motion.h1>
          
          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-brand-dark/80 mb-8 font-body"
          >
            {playersWon 
              ? 'The players successfully identified all brands despite the saboteur!'
              : 'The saboteur successfully misled the players on a brand!'
            }
          </motion.p>
          
          {/* Stats */}
          {game && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-2 gap-4 mb-8"
            >
              <div className="bg-brand-light rounded-2xl p-4 border border-brand-gray/20">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Users className="w-5 h-5 text-brand-secondary" />
                </div>
                <p className="text-3xl font-display font-bold text-brand-secondary">
                  {game.players.length}
                </p>
                <p className="text-sm text-brand-gray font-body">Players</p>
              </div>
              <div className="bg-brand-light rounded-2xl p-4 border border-brand-gray/20">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <RotateCcw className="w-5 h-5 text-brand-primary" />
                </div>
                <p className="text-3xl font-display font-bold text-brand-primary">
                  {game.rounds.length}
                </p>
                <p className="text-sm text-brand-gray font-body">Rounds Played</p>
              </div>
            </motion.div>
          )}
          
          {/* Saboteur reveal */}
          {game && game.saboteur && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
              className="mb-8"
            >
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Drama className="w-6 h-6 text-red-500" />
                  <h3 className="font-display text-lg font-semibold text-red-500">
                    The Saboteur was...
                  </h3>
                </div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 }}
                  className="text-2xl font-display font-bold text-red-600"
                >
                  {game.saboteur.name}
                </motion.p>
              </div>
            </motion.div>
          )}

          {/* Player list */}
          {game && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="mb-8"
            >
              <h3 className="font-display text-lg font-semibold text-brand-gray mb-3">
                Team
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {game.players.map((player, index) => {
                  const isSaboteur = game.saboteur?.id === player.id
                  return (
                    <motion.span
                      key={player.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.5 + index * 0.1 }}
                      className={`px-4 py-2 rounded-full text-sm font-display font-medium ${
                        isSaboteur 
                          ? 'bg-red-100 text-red-600 border-2 border-red-300' 
                          : 'bg-brand-secondary/10 text-brand-secondary'
                      }`}
                    >
                        {player.name}
                      {isSaboteur && <Drama className="w-4 h-4 ml-1 inline" />}
                    </motion.span>
                  )
                })}
              </div>
            </motion.div>
          )}
          
          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="space-y-4"
          >
            <button
              onClick={() => router.push('/new-game')}
              className="btn-primary w-full text-lg py-5 flex items-center justify-center gap-3"
            >
              <Gamepad2 className="w-5 h-5" />
              New Game
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="btn-secondary w-full flex items-center justify-center gap-3"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default function EndPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-brand-light">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-brand-primary/30 border-t-brand-primary rounded-full"
        />
      </div>
    }>
      <EndContent />
    </Suspense>
  )
}

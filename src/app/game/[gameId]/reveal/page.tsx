'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Smartphone } from 'lucide-react'
import RoleRevealCard from '@/components/RoleRevealCard'
import GameHeader from '@/components/GameHeader'
import type { Game, RoundRole, Brand } from '@/lib/types'

export default function RevealPage() {
  const params = useParams()
  const router = useRouter()
  const gameId = params.gameId as string
  
  const [game, setGame] = useState<Game | null>(null)
  const [currentRoles, setCurrentRoles] = useState<RoundRole[]>([])
  const [currentBrand, setCurrentBrand] = useState<Brand | null>(null)
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isRevealing, setIsRevealing] = useState(false)
  const [showPassPhone, setShowPassPhone] = useState(false)
  
  const fetchGame = useCallback(async () => {
    try {
      const response = await fetch(`/api/games?id=${gameId}`)
      if (!response.ok) throw new Error('Game not found')
      const data = await response.json()
      setGame(data)
      
      const currentRound = data.rounds[data.currentRound]
      if (currentRound) {
        const sortedRoles = [...currentRound.roles].sort((a, b) => 
          a.player.order - b.player.order
        )
        setCurrentRoles(sortedRoles)
        
        const firstUnrevealed = sortedRoles.findIndex(r => !r.revealed)
        if (firstUnrevealed !== -1) {
          setCurrentPlayerIndex(firstUnrevealed)
          if (firstUnrevealed > 0) {
            setShowPassPhone(true)
          }
        }
        
        const brandsResponse = await fetch('/api/brands')
        if (brandsResponse.ok) {
          const brands = await brandsResponse.json()
          const brand = brands.find((b: Brand) => b.id === currentRound.brandId)
          setCurrentBrand(brand || null)
        }
      }
    } catch (error) {
      console.error('Error fetching game:', error)
      router.push('/')
    } finally {
      setIsLoading(false)
    }
  }, [gameId, router])
  
  useEffect(() => {
    fetchGame()
  }, [fetchGame])
  
  const handleRoleRevealed = async () => {
    if (!currentRoles[currentPlayerIndex]) return
    
    setIsRevealing(true)
    
    try {
      const response = await fetch('/api/rounds/reveal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          roundRoleId: currentRoles[currentPlayerIndex].id 
        })
      })
      
      if (!response.ok) throw new Error('Failed to reveal role')
      
      const { allRevealed } = await response.json()
      
      if (allRevealed) {
        router.push(`/game/${gameId}/play`)
      } else {
        setCurrentPlayerIndex(prev => prev + 1)
        setShowPassPhone(true)
      }
    } catch (error) {
      console.error('Error revealing role:', error)
    } finally {
      setIsRevealing(false)
    }
  }
  
  const handleCancel = async () => {
    if (confirm('Are you sure you want to cancel the game?')) {
      try {
        await fetch(`/api/games?id=${gameId}`, { method: 'DELETE' })
      } catch (error) {
        console.error('Error deleting game:', error)
      }
      router.push('/')
    }
  }
  
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
  
  if (!game || currentRoles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card p-8 text-center">
          <p className="text-brand-gray mb-4 font-body">Game not found</p>
          <button onClick={() => router.push('/')} className="btn-secondary">
            Back to Home
          </button>
        </div>
      </div>
    )
  }
  
  const currentRole = currentRoles[currentPlayerIndex]
  const canSeeBrand = currentRole && (currentRole.role === 'ARCHITECT' || currentRole.role === 'SABOTEUR')
  const progress = ((currentPlayerIndex) / currentRoles.length) * 100
  
  return (
    <>
      <GameHeader 
        roundNumber={game.currentRound}
        totalRounds={game.players.length}
        onCancel={handleCancel}
      />
      
      <div className="min-h-screen pt-24 pb-8 px-4">
        <div className="max-w-lg mx-auto">
          {/* Progress bar */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex justify-between text-sm text-brand-gray mb-2 font-body">
              <span>Role Reveal</span>
              <span>{currentPlayerIndex}/{currentRoles.length}</span>
            </div>
            <div className="h-3 bg-white rounded-full overflow-hidden shadow-inner border border-brand-gray/20">
              <motion.div 
                className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
          
          <AnimatePresence mode="wait">
            {showPassPhone ? (
              <motion.div
                key="pass-phone"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="card p-8 text-center"
              >
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, 0, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  className="w-24 h-24 mx-auto mb-8 bg-brand-primary/20 rounded-3xl flex items-center justify-center"
                >
                  <Smartphone className="w-12 h-12 text-brand-primary" />
                </motion.div>
                
                <h2 className="font-display text-2xl font-bold text-brand-dark mb-4">
                  Pass the phone to
                </h2>
                
                <div className="bg-brand-primary/20 border-2 border-brand-primary rounded-2xl p-4 mb-8">
                  <span className="font-display text-3xl font-bold text-brand-dark">
                    {currentRole.player.name}
                  </span>
                </div>
                
                <p className="text-brand-gray mb-8 font-body">
                  Don&apos;t look! It&apos;s their turn to discover their role.
                </p>
                
                <motion.button
                  onClick={() => setShowPassPhone(false)}
                  className="btn-primary w-full"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  I am {currentRole.player.name}
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key={`reveal-${currentPlayerIndex}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <RoleRevealCard
                  playerName={currentRole.player.name}
                  role={currentRole.role}
                  brandName={canSeeBrand ? currentBrand?.name : undefined}
                  brandDescription={canSeeBrand ? currentBrand?.description ?? undefined : undefined}
                  brandDomain={canSeeBrand ? currentBrand?.domain ?? undefined : undefined}
                  onRevealed={handleRoleRevealed}
                  isRevealing={isRevealing}
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Player list indicator */}
          <div className="mt-8 flex justify-center gap-2">
            {currentRoles.map((role, index) => (
              <motion.div
                key={role.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index < currentPlayerIndex 
                    ? 'bg-brand-secondary' 
                    : index === currentPlayerIndex 
                      ? 'bg-brand-primary animate-pulse' 
                      : 'bg-brand-gray/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

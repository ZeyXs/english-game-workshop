'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Drama, PartyPopper, Gamepad2, Home, ArrowRight, Trophy, Landmark } from 'lucide-react'
import GameHeader from '@/components/GameHeader'
import BrandLogo from '@/components/BrandLogo'
import type { Game, Round, Brand } from '@/lib/types'

function ResultContent() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const gameId = params.gameId as string
  const saboteurWon = searchParams.get('saboteurWon') === 'true'
  
  const [game, setGame] = useState<Game | null>(null)
  const [currentRound, setCurrentRound] = useState<Round | null>(null)
  const [currentBrand, setCurrentBrand] = useState<Brand | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  
  const fetchGame = useCallback(async () => {
    try {
      const response = await fetch(`/api/games?id=${gameId}`)
      if (!response.ok) throw new Error('Game not found')
      const data = await response.json()
      setGame(data)
      
      const round = data.rounds[data.currentRound]
      setCurrentRound(round)
      
      // Fetch brand data for logo
      const brandsResponse = await fetch('/api/brands')
      if (brandsResponse.ok) {
        const brands = await brandsResponse.json()
        const brand = brands.find((b: Brand) => b.id === round.brandId)
        setCurrentBrand(brand || null)
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
  
  useEffect(() => {
    const updateRound = async () => {
      if (!currentRound) return
      
      try {
        await fetch('/api/rounds', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roundId: currentRound.id,
            status: 'COMPLETED',
            saboteurWon
          })
        })
      } catch (error) {
        console.error('Error updating round:', error)
      }
    }
    
    if (currentRound && !isLoading) {
      updateRound()
    }
  }, [currentRound, saboteurWon, isLoading])
  
  const handleNextRound = async () => {
    if (!game) return
    
    setIsProcessing(true)
    
    try {
      const isLastRound = game.currentRound >= game.players.length - 1
      
      if (isLastRound) {
        await fetch('/api/games?id=' + gameId, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'FINISHED' })
        })
        router.push(`/game/${gameId}/end?winner=players`)
      } else {
        const response = await fetch('/api/rounds', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gameId })
        })
        
        if (!response.ok) throw new Error('Failed to create round')
        
        router.push(`/game/${gameId}/reveal`)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsProcessing(false)
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
  
  if (!game || !currentRound) {
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
  
  const saboteur = currentRound.roles.find(r => r.role === 'SABOTEUR')
  const architect = currentRound.roles.find(r => r.role === 'ARCHITECT')
  const isLastRound = game.currentRound >= game.players.length - 1
  
  if (saboteurWon) {
    return (
      <>
        <GameHeader 
          roundNumber={game.currentRound}
          totalRounds={game.players.length}
          showCancel={false}
        />
        
        <div className="min-h-screen pt-24 pb-8 px-4">
          <div className="max-w-lg mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card p-8 text-center border-2 border-red-200"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-3xl flex items-center justify-center"
              >
                <Drama className="w-12 h-12 text-red-500" />
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="font-display text-4xl font-bold text-red-500 mb-4"
              >
                Saboteur Wins!
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="space-y-4 mb-8"
              >
                <p className="text-xl text-brand-dark font-body">
                  {saboteur?.player.name} fooled everyone!
                </p>
                
                <div className="bg-brand-light rounded-2xl p-5 border border-brand-gray/20">
                  <p className="text-sm text-brand-gray mb-3 font-body">The brand was</p>
                  <BrandLogo 
                    domain={currentBrand?.domain} 
                    brandName={currentRound.brandName}
                    size="lg"
                    className="mb-3"
                  />
                  <p className="font-display text-2xl font-bold text-brand-dark">
                    {currentRound.brandName}
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="space-y-4"
              >
                <button
                  onClick={() => router.push('/new-game')}
                  className="btn-primary w-full flex items-center justify-center gap-3"
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
      </>
    )
  }
  
  return (
    <>
      <GameHeader 
        roundNumber={game.currentRound}
        totalRounds={game.players.length}
        onCancel={handleCancel}
      />
      
      <div className="min-h-screen pt-24 pb-8 px-4">
        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card p-8 text-center border-2 border-emerald-200"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-24 h-24 mx-auto mb-6 bg-emerald-100 rounded-3xl flex items-center justify-center"
            >
              <PartyPopper className="w-12 h-12 text-emerald-500" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="font-display text-4xl font-bold text-emerald-500 mb-4"
            >
              Well Done!
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-4 mb-8"
            >
              <p className="text-xl text-brand-dark font-body">
                Players found the brand!
              </p>
              
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-5">
                <p className="text-sm text-emerald-600 mb-3 font-body">The brand was</p>
                <BrandLogo 
                  domain={currentBrand?.domain} 
                  brandName={currentRound.brandName}
                  size="lg"
                  className="mb-3"
                />
                <p className="font-display text-2xl font-bold text-brand-dark">
                  {currentRound.brandName}
                </p>
              </div>
              
              <div className="bg-brand-light rounded-2xl px-5 py-3 border border-brand-gray/20 inline-block">
                <div className="flex items-center gap-2 mb-1">
                  <Landmark className="w-4 h-4 text-brand-secondary" />
                  <p className="text-xs text-brand-gray font-body">Architect</p>
                </div>
                <p className="font-display font-semibold text-brand-secondary">
                  {architect?.player.name}
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <button
                onClick={handleNextRound}
                disabled={isProcessing}
                className="btn-primary w-full text-lg py-5 flex items-center justify-center gap-3"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-3">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-brand-dark/30 border-t-brand-dark rounded-full"
                    />
                    Loading...
                  </span>
                ) : isLastRound ? (
                  <>
                    <Trophy className="w-5 h-5" />
                    See Final Results
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-5 h-5" />
                    Next Round ({game.currentRound + 2}/{game.players.length})
                  </>
                )}
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default function ResultPage() {
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
      <ResultContent />
    </Suspense>
  )
}

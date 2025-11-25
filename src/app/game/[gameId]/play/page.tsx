'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Landmark, Eye, EyeOff, Check, X, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react'
import GameHeader from '@/components/GameHeader'
import BrandLogo from '@/components/BrandLogo'
import type { Game, Round, Brand } from '@/lib/types'

export default function PlayPage() {
  const params = useParams()
  const router = useRouter()
  const gameId = params.gameId as string
  
  const [game, setGame] = useState<Game | null>(null)
  const [currentRound, setCurrentRound] = useState<Round | null>(null)
  const [currentBrand, setCurrentBrand] = useState<Brand | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showBrand, setShowBrand] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [hintRevealed, setHintRevealed] = useState(false)
  
  const fetchGame = useCallback(async () => {
    try {
      const response = await fetch(`/api/games?id=${gameId}`)
      if (!response.ok) throw new Error('Game not found')
      const data = await response.json()
      setGame(data)
      
      const round = data.rounds[data.currentRound]
      setCurrentRound(round)
      
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
  
  const handleRoundEnd = (saboteurWon: boolean) => {
    router.push(`/game/${gameId}/result?saboteurWon=${saboteurWon}`)
  }
  
  const handleRevealHint = () => {
    setHintRevealed(true)
    setShowHint(true)
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
  
  const architect = currentRound.roles.find(r => r.role === 'ARCHITECT')
  
  return (
    <>
      <GameHeader 
        roundNumber={game.currentRound}
        totalRounds={game.players.length}
        onCancel={handleCancel}
      />
      
      <div className="min-h-screen pt-24 pb-8 px-4">
        <div className="max-w-lg mx-auto">
          {/* Round info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 
                           bg-brand-secondary/10 border border-brand-secondary/20 rounded-full mb-4">
              <Landmark className="w-5 h-5 text-brand-secondary" />
              <span className="text-brand-secondary font-display font-semibold">
                {architect?.player.name} is the Architect
              </span>
            </div>
            
            <h1 className="font-display text-3xl font-bold text-brand-dark mb-2">
              Building Phase
            </h1>
            <p className="text-brand-gray font-body">
              The architect builds the logo with geometric shapes
            </p>
          </motion.div>
          
          {/* Brand card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold text-brand-dark">
                Brand to Build
              </h2>
              <motion.button
                onClick={() => setShowBrand(!showBrand)}
                className={`px-4 py-2 rounded-xl font-display font-medium text-sm transition-all flex items-center gap-2
                          ${showBrand 
                            ? 'bg-brand-secondary text-white' 
                            : 'bg-brand-primary/20 text-brand-dark border border-brand-primary/40 hover:bg-brand-primary/30'
                          }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {showBrand ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showBrand ? 'Hide' : 'Show'}
              </motion.button>
            </div>
            
            <motion.div
              initial={false}
              animate={{ 
                height: showBrand ? 'auto' : 0,
                opacity: showBrand ? 1 : 0
              }}
              className="overflow-hidden"
            >
              <div className="bg-brand-secondary/5 border-2 border-brand-secondary/20 rounded-2xl p-6 text-center">
                <BrandLogo 
                  domain={currentBrand?.domain} 
                  brandName={currentBrand?.name || currentRound.brandName}
                  size="lg"
                  className="mb-4"
                />
                <span className="text-4xl font-display font-bold text-brand-dark">
                  {currentBrand?.name || currentRound.brandName}
                </span>
                {currentBrand?.description && (
                  <p className="mt-2 text-sm text-brand-gray italic font-body">
                    {currentBrand.description}
                  </p>
                )}
              </div>
            </motion.div>
            
            {!showBrand && (
              <div className="bg-brand-light rounded-2xl p-6 text-center border border-brand-gray/20">
                <span className="text-brand-gray font-body">
                  Only the architect can see
                </span>
              </div>
            )}
          </motion.div>
          
          {/* Hint card */}
          {currentBrand?.hint && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="card p-4 mb-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/20 flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-brand-dark">Need a hint?</h3>
                    <p className="text-xs text-brand-gray font-body">Learn something about this brand</p>
                  </div>
                </div>
                
                {!hintRevealed ? (
                  <motion.button
                    onClick={handleRevealHint}
                    className="px-4 py-2 bg-brand-primary text-brand-dark rounded-xl font-display font-medium text-sm
                               hover:shadow-primary transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Reveal
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={() => setShowHint(!showHint)}
                    className="p-2 text-brand-gray hover:text-brand-dark transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {showHint ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </motion.button>
                )}
              </div>
              
              <AnimatePresence>
                {hintRevealed && showHint && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-4 border-t border-brand-gray/20">
                      <p className="text-brand-dark/80 font-body text-sm leading-relaxed">
                        {currentBrand.hint}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
          
          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3 mb-10"
          >
            {[
              { num: '1', text: 'The architect builds the logo with shapes' },
              { num: '2', text: 'Players discuss and propose brands' },
              { num: '3', text: 'Watch out for the saboteur trying to mislead you!' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-brand-gray/20">
                <span className="w-8 h-8 flex items-center justify-center bg-brand-primary/20 
                               text-brand-dark font-display font-bold rounded-xl text-sm">
                  {item.num}
                </span>
                <span className="text-brand-dark/80 font-body">{item.text}</span>
              </div>
            ))}
          </motion.div>
          
          {/* End round buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h3 className="text-center text-brand-gray font-display mb-4">
              When voting is complete...
            </h3>
            
            <motion.button
              onClick={() => handleRoundEnd(false)}
              className="w-full py-4 sm:py-5 bg-emerald-50 border-2 border-emerald-400 
                        text-emerald-600 font-display font-bold text-base sm:text-lg rounded-2xl
                        hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all
                        flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Check className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
              Players found the correct brand!
            </motion.button>
            
            <motion.button
              onClick={() => handleRoundEnd(true)}
              className="w-full py-4 sm:py-5 bg-red-50 border-2 border-red-400 
                        text-red-500 font-display font-bold text-base sm:text-lg rounded-2xl
                        hover:bg-red-500 hover:text-white hover:border-red-500 transition-all
                        flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
              The saboteur fooled them!
            </motion.button>
          </motion.div>
        </div>
      </div>
    </>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HelpCircle, Hand, Landmark, Eye, Drama } from 'lucide-react'
import Image from 'next/image'
import type { Role } from '@/lib/types'

interface RoleRevealCardProps {
  playerName: string
  role: Role
  brandName?: string
  brandDescription?: string
  brandDomain?: string
  onRevealed: () => void
  isRevealing?: boolean
}

export default function RoleRevealCard({ 
  playerName, 
  role, 
  brandName,
  brandDescription,
  brandDomain,
  onRevealed,
  isRevealing = false
}: RoleRevealCardProps) {
  const [revealed, setRevealed] = useState(false)
  const [holding, setHolding] = useState(false)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [logoError, setLogoError] = useState(false)
  const canSeeBrandInfo = (role === 'ARCHITECT' || role === 'SABOTEUR') && !!brandName
  
  // Fetch logo URL when card is revealed for architect/saboteur
  useEffect(() => {
    if (revealed && canSeeBrandInfo && brandDomain) {
      fetch(`/api/logo?domain=${encodeURIComponent(brandDomain)}`)
        .then(res => res.json())
        .then(data => {
          if (data.logoUrl) {
            setLogoUrl(data.logoUrl)
          }
        })
        .catch(() => setLogoError(true))
    }
  }, [revealed, canSeeBrandInfo, brandDomain])
  
  const roleConfig = {
    ARCHITECT: {
      title: 'Architect',
      description: 'You must build the brand logo using geometric shapes. The others have to guess!',
      Icon: Landmark,
      bgColor: 'bg-brand-secondary/10',
      borderColor: 'border-brand-secondary',
      textColor: 'text-brand-secondary',
      accentBg: 'bg-brand-secondary',
    },
    PLAYER: {
      title: 'Player',
      description: 'Watch the construction carefully and try to guess the brand. Beware of the saboteur!',
      Icon: Eye,
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-500',
      textColor: 'text-emerald-600',
      accentBg: 'bg-emerald-500',
    },
    SABOTEUR: {
      title: 'Saboteur',
      description: 'You must convince others it\'s a different brand. Be subtle and persuasive!',
      Icon: Drama,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-400',
      textColor: 'text-red-500',
      accentBg: 'bg-red-500',
    },
  }
  
  const config = roleConfig[role]
  const RoleIcon = config.Icon
  
  const handleReveal = async () => {
    if (revealed || isRevealing) return
    setRevealed(true)
  }
  
  const handleContinue = () => {
    onRevealed()
  }
  
  const cardHeight = canSeeBrandInfo ? '600px' : '480px'

  return (
    <div 
      className="w-full max-w-sm mx-auto"
      style={{ perspective: '1200px' }}
    >
      <motion.div 
        className="relative w-full"
        style={{ 
          transformStyle: 'preserve-3d',
          height: cardHeight
        }}
        animate={{ rotateY: revealed ? 180 : 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Front - Hidden role */}
        <div 
          className="absolute inset-0 card flex flex-col items-center justify-center p-8 cursor-pointer"
          onClick={handleReveal}
          onTouchStart={() => setHolding(true)}
          onTouchEnd={() => setHolding(false)}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <motion.div
            animate={{ scale: holding ? 1.05 : 1 }}
            transition={{ duration: 0.2 }}
            className="text-center"
          >
            <div className="w-28 h-28 mx-auto mb-8 rounded-3xl bg-brand-primary/20 
                            flex items-center justify-center border-2 border-brand-primary/40">
              <HelpCircle className="w-14 h-14 text-brand-primary" />
            </div>
            
            <h2 className="font-display text-3xl font-bold text-brand-dark mb-3">
              {playerName}
            </h2>
            
            <p className="text-brand-gray text-lg mb-10 font-body">
              Tap to reveal your role
            </p>
            
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="w-20 h-20 mx-auto bg-brand-primary/20 rounded-2xl
                         flex items-center justify-center border-2 border-brand-primary/30"
            >
              <Hand className="w-10 h-10 text-brand-primary" />
            </motion.div>
          </motion.div>
        </div>
        
        {/* Back - Revealed role */}
        <div 
          className={`absolute inset-0 card overflow-hidden ${config.borderColor} border-2`}
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          {/* Gradient background */}
          <div className={`absolute inset-0 ${config.bgColor}`} />
          
          <div className="relative h-full flex flex-col items-center justify-between p-6">
            {/* Role icon and title */}
            <div className="text-center flex-shrink-0 pt-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: revealed ? 1 : 0 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                className={`w-20 h-20 mx-auto mb-4 rounded-2xl ${config.accentBg} 
                            flex items-center justify-center shadow-lg`}
              >
                <RoleIcon className="w-10 h-10 text-white" />
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 20 }}
                transition={{ delay: 0.35 }}
                className={`font-display text-3xl font-bold ${config.textColor}`}
              >
                {config.title}
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: revealed ? 1 : 0 }}
                transition={{ delay: 0.4 }}
                className="text-brand-dark/70 mt-3 text-base leading-relaxed font-body max-w-xs mx-auto"
              >
                {config.description}
              </motion.p>
            </div>
            
            {/* Brand info for architect & saboteur */}
            {canSeeBrandInfo && brandName && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 20 }}
                transition={{ delay: 0.45 }}
                className="w-full bg-white rounded-2xl p-4 text-center border-2 border-brand-secondary/20 shadow-soft flex-shrink-0"
              >
                <p className="text-xs text-brand-secondary mb-2 font-display font-medium uppercase tracking-wide">
                  {role === 'ARCHITECT' ? 'You must build' : 'Secret target brand'}
                </p>
                
                {/* Logo display */}
                {logoUrl && !logoError && (
                  <div className="w-20 h-20 mx-auto mb-2 relative">
                    <Image
                      src={logoUrl}
                      alt={brandName}
                      fill
                      className="object-contain"
                      onError={() => setLogoError(true)}
                      unoptimized
                    />
                  </div>
                )}
                
                <h3 className="font-display text-xl font-bold text-brand-dark mb-1">
                  {brandName}
                </h3>
                {brandDescription && (
                  <p className="text-sm text-brand-gray italic font-body line-clamp-2">
                    {brandDescription}
                  </p>
                )}
              </motion.div>
            )}
            
            {/* Continue button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: revealed ? 1 : 0 }}
              transition={{ delay: 0.5 }}
              onClick={handleContinue}
              disabled={isRevealing}
              className="btn-primary w-full flex-shrink-0 mb-2"
            >
              {isRevealing ? 'Loading...' : 'Got it, next player!'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

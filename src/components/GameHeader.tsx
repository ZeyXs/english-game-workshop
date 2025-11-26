'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { X } from 'lucide-react'

interface GameHeaderProps {
  roundNumber?: number
  totalRounds?: number
  showCancel?: boolean
  onCancel?: () => void
}

export default function GameHeader({ 
  roundNumber, 
  totalRounds,
  showCancel = true,
  onCancel 
}: GameHeaderProps) {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 
                 bg-white/80 backdrop-blur-xl border-b border-brand-gray/20 shadow-soft"
    >
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo - icon only */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/brandarchitect-logo-squared.svg"
            alt="BrandArchitect"
            width={36}
            height={36}
            className="flex-shrink-0"
            priority
          />
        </Link>
        
        {/* Round counter */}
        {roundNumber !== undefined && totalRounds !== undefined && (
          <div className="flex items-center gap-2 badge badge-secondary">
            <span className="text-brand-dark/60 text-sm">Round</span>
            <span className="font-display font-bold text-brand-secondary">
              {roundNumber + 1}/{totalRounds}
            </span>
          </div>
        )}
        
        {/* Cancel button */}
        {showCancel && (
          <motion.button
            onClick={onCancel}
            className="w-9 h-9 flex items-center justify-center 
                       text-brand-gray hover:text-red-500 
                       hover:bg-red-50 rounded-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="w-5 h-5" />
          </motion.button>
        )}
      </div>
    </motion.header>
  )
}

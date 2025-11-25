'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
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
          <div className="w-9 h-9 relative flex-shrink-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 
                           border-l-[6px] border-r-[6px] border-b-[12px] 
                           border-l-transparent border-r-transparent border-b-brand-primary" />
            <div className="absolute bottom-0 left-0 w-3.5 h-3.5 rounded-full bg-brand-secondary" />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-brand-gray rounded rotate-12" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-brand-primary" />
          </div>
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

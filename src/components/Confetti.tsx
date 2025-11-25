'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface ConfettiPiece {
  id: number
  x: number
  color: string
  delay: number
  duration: number
  rotation: number
  size: number
  shape: 'circle' | 'square' | 'triangle'
}

export default function Confetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])
  
  useEffect(() => {
    // Using brand colors
    const colors = ['#f2c94c', '#1f4e79', '#bdbdbd', '#10b981', '#ef4444', '#8b5cf6']
    const shapes: ConfettiPiece['shape'][] = ['circle', 'square', 'triangle']
    
    const newPieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
      rotation: Math.random() * 360,
      size: 8 + Math.random() * 12,
      shape: shapes[Math.floor(Math.random() * shapes.length)]
    }))
    
    setPieces(newPieces)
    
    const timer = setTimeout(() => setPieces([]), 5000)
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{ 
            y: -20,
            x: `${piece.x}vw`,
            rotate: 0,
            opacity: 1
          }}
          animate={{ 
            y: '110vh',
            rotate: piece.rotation + 720,
            opacity: [1, 1, 0]
          }}
          transition={{ 
            duration: piece.duration,
            delay: piece.delay,
            ease: 'easeIn'
          }}
          className="absolute top-0"
          style={{
            width: piece.size,
            height: piece.size,
          }}
        >
          {piece.shape === 'circle' && (
            <div 
              className="w-full h-full rounded-full"
              style={{ backgroundColor: piece.color }}
            />
          )}
          {piece.shape === 'square' && (
            <div 
              className="w-full h-full rounded-md"
              style={{ backgroundColor: piece.color }}
            />
          )}
          {piece.shape === 'triangle' && (
            <div 
              className="w-0 h-0"
              style={{ 
                borderLeft: `${piece.size / 2}px solid transparent`,
                borderRight: `${piece.size / 2}px solid transparent`,
                borderBottom: `${piece.size}px solid ${piece.color}`,
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  )
}

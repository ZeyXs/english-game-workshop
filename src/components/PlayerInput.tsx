'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, X } from 'lucide-react'

interface PlayerInputProps {
  players: string[]
  onPlayersChange: (players: string[]) => void
  minPlayers?: number
}

export default function PlayerInput({ 
  players, 
  onPlayersChange, 
  minPlayers = 3 
}: PlayerInputProps) {
  const [newPlayer, setNewPlayer] = useState('')
  
  const addPlayer = () => {
    const trimmed = newPlayer.trim()
    if (trimmed && !players.includes(trimmed)) {
      onPlayersChange([...players, trimmed])
      setNewPlayer('')
    }
  }
  
  const removePlayer = (index: number) => {
    onPlayersChange(players.filter((_, i) => i !== index))
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addPlayer()
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="flex gap-3">
        <input
          type="text"
          value={newPlayer}
          onChange={(e) => setNewPlayer(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Player name..."
          className="input flex-1"
          maxLength={20}
        />
        <motion.button
          onClick={addPlayer}
          disabled={!newPlayer.trim()}
          className="w-14 h-14 flex items-center justify-center bg-brand-primary text-brand-dark 
                     rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed
                     transition-all duration-300 hover:shadow-primary"
          whileHover={{ scale: newPlayer.trim() ? 1.05 : 1 }}
          whileTap={{ scale: newPlayer.trim() ? 0.95 : 1 }}
        >
          <Plus className="w-6 h-6" strokeWidth={2.5} />
        </motion.button>
      </div>
      
      {/* Player list */}
      <div className="space-y-2">
        {players.map((player, index) => (
          <div
            key={`${player}-${index}`}
            className="flex items-center justify-between p-4 
                       bg-brand-light rounded-2xl border border-brand-gray/20
                       group hover:border-brand-primary/50 hover:shadow-soft transition-all"
          >
            <div className="flex items-center gap-4">
              <span className="w-9 h-9 flex items-center justify-center 
                               bg-brand-secondary text-white font-display font-bold 
                               rounded-xl text-sm">
                {index + 1}
              </span>
              <span className="font-display text-lg text-brand-dark font-medium">
                {player}
              </span>
            </div>
            <button
              onClick={() => removePlayer(index)}
              className="w-9 h-9 flex items-center justify-center 
                         text-brand-gray hover:text-red-500 
                         hover:bg-red-50 rounded-xl
                         opacity-0 group-hover:opacity-100 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      
      {/* Status */}
      {players.length < minPlayers && (
        <p className="text-center text-brand-gray text-sm font-body">
          Add {minPlayers - players.length} more player{minPlayers - players.length > 1 ? 's' : ''} minimum
        </p>
      )}
    </div>
  )
}

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Gamepad2, BookOpen } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-6 sm:py-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center w-full max-w-lg mx-auto"
      >
        {/* Logo Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            type: 'spring',
            stiffness: 100,
            delay: 0.2
          }}
          className="mb-6 sm:mb-8 flex justify-center"
        >
          {/* Full logo with text */}
          <Image
            src="/brandarchitect-logo.svg"
            alt="BrandArchitect"
            width={400}
            height={140}
            className="w-[280px] sm:w-[400px] h-auto"
            priority
          />
        </motion.div>
        
        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-base sm:text-xl text-brand-dark/70 mb-8 sm:mb-12 leading-relaxed font-body px-2"
        >
          Build logos with geometric shapes.<br />
          <span className="text-brand-secondary font-semibold">Find the saboteur.</span>
        </motion.p>
        
        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col gap-3 sm:gap-4 px-2"
        >
          <Link href="/new-game">
            <motion.button
              className="btn-primary w-full text-lg sm:text-xl py-4 sm:py-5 flex items-center justify-center gap-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6" />
              New Game
            </motion.button>
          </Link>
          
          <Link href="/rules">
            <motion.button
              className="btn-secondary w-full flex items-center justify-center gap-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <BookOpen className="w-5 h-5" />
              How to Play
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
      
      {/* Decorative shapes */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-4 opacity-40">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0 }}
          className="w-4 h-4 bg-brand-primary rounded-full"
        />
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          className="w-4 h-4 bg-brand-secondary rounded-lg rotate-45"
        />
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
          className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[14px] 
                     border-l-transparent border-r-transparent border-b-brand-gray"
        />
      </div>
    </div>
  )
}

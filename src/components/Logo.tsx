'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  animated?: boolean
  variant?: 'full' | 'squared'
}

export default function Logo({ size = 'md', animated = true, variant = 'squared' }: LogoProps) {
  const sizes = {
    sm: { width: 48, height: variant === 'full' ? 40 : 48 },
    md: { width: 96, height: variant === 'full' ? 80 : 96 },
    lg: { width: 128, height: variant === 'full' ? 107 : 128 },
    xl: { width: 192, height: variant === 'full' ? 160 : 192 },
  }
  
  const logoSrc = variant === 'full' 
    ? '/brandarchitect-logo.svg' 
    : '/brandarchitect-logo-squared.svg'
  
  const Container = animated ? motion.div : 'div'
  
  return (
    <Container 
      className="relative flex items-center justify-center"
      style={{ width: sizes[size].width, height: sizes[size].height }}
      initial={animated ? { opacity: 0, scale: 0.8 } : undefined}
      animate={animated ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.5 }}
    >
      <Image
        src={logoSrc}
        alt="BrandArchitect"
        width={sizes[size].width}
        height={sizes[size].height}
        className="object-contain"
        priority
      />
    </Container>
  )
}

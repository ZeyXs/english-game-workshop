'use client'

import { motion } from 'framer-motion'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  animated?: boolean
}

export default function Logo({ size = 'md', animated = true }: LogoProps) {
  const sizes = {
    sm: { container: 'w-12 h-12', shapes: 'scale-50' },
    md: { container: 'w-24 h-24', shapes: 'scale-75' },
    lg: { container: 'w-32 h-32', shapes: 'scale-100' },
    xl: { container: 'w-48 h-48', shapes: 'scale-150' },
  }
  
  const shapeVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { scale: 1, rotate: 0 },
  }
  
  const Container = animated ? motion.div : 'div'
  const Shape = animated ? motion.div : 'div'
  
  return (
    <Container 
      className={`relative ${sizes[size].container} ${sizes[size].shapes}`}
      initial={animated ? { opacity: 0 } : undefined}
      animate={animated ? { opacity: 1 } : undefined}
      transition={{ duration: 0.5 }}
    >
      {/* Triangle - Primary color */}
      <Shape
        className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 
                   border-l-[20px] border-r-[20px] border-b-[35px] 
                   border-l-transparent border-r-transparent border-b-brand-primary"
        variants={animated ? shapeVariants : undefined}
        initial={animated ? "initial" : undefined}
        animate={animated ? "animate" : undefined}
        transition={{ duration: 0.6, delay: 0.1 }}
      />
      
      {/* Circle - Secondary color */}
      <Shape
        className="absolute top-1/2 left-0 -translate-y-1/2 w-10 h-10 
                   rounded-full bg-brand-secondary"
        variants={animated ? shapeVariants : undefined}
        initial={animated ? "initial" : undefined}
        animate={animated ? "animate" : undefined}
        transition={{ duration: 0.6, delay: 0.2 }}
      />
      
      {/* Square - Gray */}
      <Shape
        className="absolute top-1/2 right-0 -translate-y-1/2 w-8 h-8 
                   bg-brand-gray rounded-lg rotate-12"
        variants={animated ? shapeVariants : undefined}
        initial={animated ? "initial" : undefined}
        animate={animated ? "animate" : undefined}
        transition={{ duration: 0.6, delay: 0.3 }}
      />
      
      {/* Small circle - Primary */}
      <Shape
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 
                   rounded-full bg-brand-primary"
        variants={animated ? shapeVariants : undefined}
        initial={animated ? "initial" : undefined}
        animate={animated ? "animate" : undefined}
        transition={{ duration: 0.6, delay: 0.4 }}
      />
    </Container>
  )
}

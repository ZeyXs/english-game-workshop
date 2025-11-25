'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface BrandLogoProps {
  domain: string | null | undefined
  brandName: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function BrandLogo({ 
  domain, 
  brandName, 
  size = 'md',
  className = ''
}: BrandLogoProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [logoError, setLogoError] = useState(false)
  
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28'
  }
  
  useEffect(() => {
    if (domain) {
      fetch(`/api/logo?domain=${encodeURIComponent(domain)}`)
        .then(res => res.json())
        .then(data => {
          if (data.logoUrl) {
            setLogoUrl(data.logoUrl)
          }
        })
        .catch(() => setLogoError(true))
    }
  }, [domain])
  
  if (!domain || logoError || !logoUrl) {
    return null
  }
  
  return (
    <div className={`${sizeClasses[size]} relative mx-auto ${className}`}>
      <Image
        src={logoUrl}
        alt={brandName}
        fill
        className="object-contain"
        onError={() => setLogoError(true)}
        unoptimized
      />
    </div>
  )
}


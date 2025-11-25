import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering (no pre-render at build time)
export const dynamic = 'force-dynamic'

// GET - Récupérer toutes les marques
export async function GET() {
  const brands = await prisma.brand.findMany({
    orderBy: [
      { difficulty: 'asc' },
      { name: 'asc' }
    ]
  })
  
  return NextResponse.json(brands)
}


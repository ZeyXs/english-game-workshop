import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering (no pre-render at build time)
export const dynamic = 'force-dynamic'

// GET - Récupérer une partie par ID (via query param)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const gameId = searchParams.get('id')
  
  if (!gameId) {
    return NextResponse.json({ error: 'Game ID required' }, { status: 400 })
  }
  
  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: {
      players: {
        orderBy: { order: 'asc' }
      },
      saboteur: true,
      rounds: {
        include: {
          roles: {
            include: {
              player: true
            }
          }
        },
        orderBy: { roundNumber: 'asc' }
      }
    }
  })
  
  if (!game) {
    return NextResponse.json({ error: 'Game not found' }, { status: 404 })
  }
  
  return NextResponse.json(game)
}

// POST - Créer une nouvelle partie
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { playerNames } = body as { playerNames: string[] }
  
  if (!playerNames || playerNames.length < 4) {
    return NextResponse.json(
      { error: 'At least 4 players are required' },
      { status: 400 }
    )
  }
  
  // Créer la partie avec les joueurs
  const game = await prisma.game.create({
    data: {
      status: 'SETUP',
      players: {
        create: playerNames.map((name, index) => ({
          name,
          order: index
        }))
      }
    },
    include: {
      players: {
        orderBy: { order: 'asc' }
      }
    }
  })
  
  return NextResponse.json(game)
}

// DELETE - Supprimer une partie
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const gameId = searchParams.get('id')
  
  if (!gameId) {
    return NextResponse.json({ error: 'Game ID required' }, { status: 400 })
  }
  
  await prisma.game.delete({
    where: { id: gameId }
  })
  
  return NextResponse.json({ success: true })
}


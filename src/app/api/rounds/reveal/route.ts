import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST - Révéler le rôle d'un joueur
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { roundRoleId } = body as { roundRoleId: string }
  
  if (!roundRoleId) {
    return NextResponse.json({ error: 'RoundRole ID required' }, { status: 400 })
  }
  
  // Mettre à jour le rôle comme révélé
  const roundRole = await prisma.roundRole.update({
    where: { id: roundRoleId },
    data: { revealed: true },
    include: {
      player: true,
      round: {
        include: {
          roles: {
            include: { player: true }
          }
        }
      }
    }
  })
  
  // Vérifier si tous les rôles sont révélés
  const allRevealed = roundRole.round.roles.every(r => r.revealed)
  
  if (allRevealed) {
    // Passer au statut DRAWING
    await prisma.round.update({
      where: { id: roundRole.round.id },
      data: { status: 'DRAWING' }
    })
    
    await prisma.game.update({
      where: { id: roundRole.round.gameId },
      data: { status: 'PLAYING' }
    })
  }
  
  return NextResponse.json({
    roundRole,
    allRevealed
  })
}


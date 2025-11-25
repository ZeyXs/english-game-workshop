import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Role } from '@prisma/client'
import { randomInt } from 'crypto'

// POST - Create a new round
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { gameId } = body as { gameId: string }
  
  if (!gameId) {
    return NextResponse.json({ error: 'Game ID required' }, { status: 400 })
  }
  
  // Get the game and players
  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: {
      players: { orderBy: { order: 'asc' } },
      rounds: { select: { id: true, brandId: true } }
    }
  })
  
  if (!game) {
    return NextResponse.json({ error: 'Game not found' }, { status: 404 })
  }
  
  // Get a random brand (not already used)
  const usedBrandIds = game.rounds.map(r => r.brandId)
  const availableBrands = await prisma.brand.findMany({
    where: {
      id: { notIn: usedBrandIds.length > 0 ? usedBrandIds : undefined }
    }
  })
  
  if (availableBrands.length === 0) {
    return NextResponse.json({ error: 'No brands available' }, { status: 400 })
  }
  
  const randomBrand = availableBrands[randomInt(availableBrands.length)]
  
  // Determine round number and architect
  const roundNumber = game.rounds.length
  const architectIndex = roundNumber % game.players.length
  const architect = game.players[architectIndex]
  
  // Determine the saboteur
  // On first round: pick a random saboteur and save to game
  // On subsequent rounds: use the same saboteur from the game
  let saboteurId = game.saboteurId
  
  if (!saboteurId) {
    // First round: pick a random saboteur from all players using crypto for true randomness
    const randomSaboteurIndex = randomInt(game.players.length)
    saboteurId = game.players[randomSaboteurIndex].id
    
    // Save saboteur to game
    await prisma.game.update({
      where: { id: gameId },
      data: { saboteurId }
    })
  }
  
  // Create the round with roles
  // If the saboteur is also the architect this round, they are ARCHITECT (not SABOTEUR)
  // The other players are all PLAYER this round
  const round = await prisma.round.create({
    data: {
      gameId,
      roundNumber,
      brandId: randomBrand.id,
      brandName: randomBrand.name,
      status: 'REVEAL_ROLES',
      roles: {
        create: game.players.map(player => {
          let role: Role
          
          if (player.id === architect.id) {
            // Architect role takes priority
            role = Role.ARCHITECT
          } else if (player.id === saboteurId) {
            // Saboteur (unless they are the architect)
            role = Role.SABOTEUR
          } else {
            // Regular player
            role = Role.PLAYER
          }
          
          return {
            playerId: player.id,
            role,
            revealed: false
          }
        })
      }
    },
    include: {
      roles: {
        include: { player: true }
      }
    }
  })
  
  // Update game status
  await prisma.game.update({
    where: { id: gameId },
    data: {
      status: 'REVEAL_ROLES',
      currentRound: roundNumber
    }
  })
  
  return NextResponse.json({
    round,
    brand: randomBrand
  })
}

// PATCH - Update a round
export async function PATCH(request: NextRequest) {
  const body = await request.json()
  const { roundId, status, saboteurWon } = body as {
    roundId: string
    status?: string
    saboteurWon?: boolean
  }
  
  if (!roundId) {
    return NextResponse.json({ error: 'Round ID required' }, { status: 400 })
  }
  
  const updateData: Record<string, unknown> = {}
  if (status) updateData.status = status
  if (saboteurWon !== undefined) updateData.saboteurWon = saboteurWon
  
  const round = await prisma.round.update({
    where: { id: roundId },
    data: updateData,
    include: {
      roles: {
        include: { player: true }
      }
    }
  })
  
  // If saboteur won, end the game
  if (saboteurWon === true) {
    await prisma.game.update({
      where: { id: round.gameId },
      data: {
        status: 'FINISHED',
        saboteurWins: { increment: 1 }
      }
    })
  }
  
  return NextResponse.json(round)
}

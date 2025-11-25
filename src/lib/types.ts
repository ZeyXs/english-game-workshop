export type Role = 'ARCHITECT' | 'PLAYER' | 'SABOTEUR'

export type GameStatus = 'SETUP' | 'REVEAL_ROLES' | 'PLAYING' | 'VOTING' | 'ROUND_END' | 'FINISHED'

export type RoundStatus = 'REVEAL_ROLES' | 'DRAWING' | 'VOTING' | 'COMPLETED'

export interface Player {
  id: string
  name: string
  order: number
}

export interface RoundRole {
  id: string
  role: Role
  revealed: boolean
  playerId: string
  player: Player
}

export interface Round {
  id: string
  roundNumber: number
  brandId: string
  brandName: string
  status: RoundStatus
  saboteurWon: boolean | null
  roles: RoundRole[]
}

export interface Game {
  id: string
  status: GameStatus
  currentRound: number
  saboteurWins: number
  saboteurId: string | null
  saboteur: Player | null
  players: Player[]
  rounds: Round[]
}

export interface Brand {
  id: string
  name: string
  domain: string | null
  category: string
  difficulty: number
  description: string | null
  hint: string | null
}

export interface GameWithDetails extends Game {
  currentRoundData?: Round
}


export interface Team {
  id: string;
  name: string;
  color?: string;
  imageUrl?: string;
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  number?: string;
}

export interface Match {
  id: string;
  round: number;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number | null;
  awayScore: number | null;
  status: 'scheduled' | 'finished';
  date: string;
}

export interface LeaderboardEntry {
  teamId: string;
  teamName: string;
  color?: string;
  imageUrl?: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

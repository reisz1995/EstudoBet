
export enum SportType {
  FOOTBALL = 'Futebol',
  BASKETBALL = 'Basquete'
}

export interface StudySession {
  sport: SportType;
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamLogo?: string; // Novo campo
  awayTeamLogo?: string; // Novo campo
  date: string;
}

export interface NewsNote {
  id: string;
  text: string;
  isAiGenerated: boolean;
}

export interface BetOpportunity {
  id: string;
  market: string; // ex: "Vitória Casa", "Over 2.5 Gols"
  odds: number;
  bookmaker?: string;
  reasoning?: string;
}

export interface Game {
  id: string;
  sport: SportType;
  league: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  status: string;
  score?: {
    home: number;
    away: number;
  };
  odds: {
    home: number;
    draw?: number;
    away: number;
  };
  valueBet: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  timeAgo: string;
  imageUrl: string;
  relatedGameId: string;
}

export interface SavedSession {
  id: string;
  savedAt: number;
  session: StudySession;
  news: NewsNote[];
  bets: BetOpportunity[];
}

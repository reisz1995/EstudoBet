
import { Game, NewsItem, SportType } from './types';

export const MOCK_GAMES: Game[] = [
  {
    id: '1',
    sport: SportType.FOOTBALL,
    league: 'Premier League',
    homeTeam: 'Manchester City',
    awayTeam: 'Liverpool',
    date: new Date().toISOString().split('T')[0],
    time: '16:00',
    status: 'Scheduled',
    odds: { home: 2.10, draw: 3.50, away: 3.20 },
    valueBet: true
  },
  {
    id: '2',
    sport: SportType.FOOTBALL,
    league: 'La Liga',
    homeTeam: 'Real Madrid',
    awayTeam: 'Barcelona',
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    status: 'Live',
    score: { home: 1, away: 1 },
    odds: { home: 2.50, draw: 3.10, away: 2.80 },
    valueBet: false
  },
  {
    id: '3',
    sport: SportType.BASKETBALL,
    league: 'NBA',
    homeTeam: 'Lakers',
    awayTeam: 'Warriors',
    date: new Date().toISOString().split('T')[0],
    time: '23:30',
    status: 'Scheduled',
    odds: { home: 1.85, away: 1.95 },
    valueBet: true
  },
  {
    id: '4',
    sport: SportType.BASKETBALL,
    league: 'EuroLeague',
    homeTeam: 'Real Madrid',
    awayTeam: 'Fenerbahçe',
    date: new Date().toISOString().split('T')[0],
    time: '14:45',
    status: 'Finished',
    score: { home: 88, away: 92 },
    odds: { home: 1.40, away: 2.90 },
    valueBet: false
  },
  {
    id: '5',
    sport: SportType.FOOTBALL,
    league: 'Brasileirão',
    homeTeam: 'Flamengo',
    awayTeam: 'Palmeiras',
    date: new Date().toISOString().split('T')[0],
    time: '21:30',
    status: 'Scheduled',
    odds: { home: 2.05, draw: 3.30, away: 3.60 },
    valueBet: true
  },
  {
    id: '6',
    sport: SportType.FOOTBALL,
    league: 'Bundesliga',
    homeTeam: 'Bayern München',
    awayTeam: 'Borussia Dortmund',
    date: new Date().toISOString().split('T')[0],
    time: '14:30',
    status: 'Scheduled',
    odds: { home: 1.65, draw: 4.20, away: 4.80 },
    valueBet: false
  },
  {
    id: '7',
    sport: SportType.BASKETBALL,
    league: 'NBA',
    homeTeam: 'Boston Celtics',
    awayTeam: 'Miami Heat',
    date: new Date().toISOString().split('T')[0],
    time: '21:00',
    status: 'Scheduled',
    odds: { home: 1.35, away: 3.20 },
    valueBet: true
  },
  {
    id: '8',
    sport: SportType.FOOTBALL,
    league: 'Serie A',
    homeTeam: 'Inter Milan',
    awayTeam: 'Juventus',
    date: new Date().toISOString().split('T')[0],
    time: '16:45',
    status: 'Scheduled',
    odds: { home: 2.20, draw: 3.10, away: 3.40 },
    valueBet: true
  },
  {
    id: '9',
    sport: SportType.FOOTBALL,
    league: 'Libertadores',
    homeTeam: 'Boca Juniors',
    awayTeam: 'River Plate',
    date: new Date().toISOString().split('T')[0],
    time: '21:30',
    status: 'Scheduled',
    odds: { home: 2.80, draw: 3.00, away: 2.70 },
    valueBet: false
  },
  {
    id: '10',
    sport: SportType.BASKETBALL,
    league: 'NBB',
    homeTeam: 'Sesi Franca',
    awayTeam: 'Flamengo',
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    status: 'Live',
    score: { home: 45, away: 42 },
    odds: { home: 1.75, away: 2.05 },
    valueBet: true
  }
];

export const MOCK_NEWS: NewsItem[] = [
  {
    id: '101',
    title: 'De Bruyne retorna aos treinos e pode ser titular',
    summary: 'O meio-campista belga participou de todas as atividades nesta manhã e aumenta as chances do City.',
    source: 'Globo Esporte',
    timeAgo: '2h atrás',
    imageUrl: 'https://picsum.photos/400/200?random=1',
    relatedGameId: '1'
  },
  {
    id: '102',
    title: 'LeBron James questionável para o clássico contra Warriors',
    summary: 'Dores no tornozelo podem tirar o astro da partida decisiva desta noite em Los Angeles.',
    source: 'ESPN',
    timeAgo: '4h atrás',
    imageUrl: 'https://picsum.photos/400/200?random=2',
    relatedGameId: '3'
  },
  {
    id: '103',
    title: 'Análise de mercado: Odds do Flamengo subestimadas?',
    summary: 'Especialistas apontam valor na vitória do Rubro-Negro devido ao retrospecto recente em casa.',
    source: 'BetInside',
    timeAgo: '5h atrás',
    imageUrl: 'https://picsum.photos/400/200?random=3',
    relatedGameId: '5'
  },
  {
    id: '104',
    title: 'Tatum brilha em vitória sobre o Heat',
    summary: 'Celtics buscam consolidar liderança no leste com elenco completo.',
    source: 'NBA.com',
    timeAgo: '1h atrás',
    imageUrl: 'https://picsum.photos/400/200?random=4',
    relatedGameId: '7'
  },
  {
    id: '105',
    title: 'Derby d\'Italia: Defesas devem prevalecer',
    summary: 'Estatísticas mostram que os últimos 5 confrontos tiveram menos de 2.5 gols.',
    source: 'Gazzetta',
    timeAgo: '3h atrás',
    imageUrl: 'https://picsum.photos/400/200?random=5',
    relatedGameId: '8'
  }
];

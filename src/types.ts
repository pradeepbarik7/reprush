export type ScreenType = 
  | 'home' 
  | 'matchmaking' 
  | 'pre-match' 
  | 'live-battle' 
  | 'result' 
  | 'profile' 
  | 'leaderboard';

export interface Player {
  id: string;
  name: string;
  username: string;
  rating: number;
  division: 'Gold' | 'Diamond' | 'Platinum' | 'Silver';
  avatar: string;
  color: 'red' | 'blue';
  country?: string;
}

export interface MatchHistoryItem {
  id: string;
  opponentName: string;
  opponentUsername: string;
  userScore: number;
  opponentScore: number;
  result: 'win' | 'loss';
  date: string;
  ratingDelta: number;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  rating: number;
  previousRating: number;
  division: 'Gold' | 'Diamond' | 'Platinum' | 'Silver';
  avatar: string;
  wins: number;
  losses: number;
  winRate: number;
  totalReps: number;
  personalRecords: {
    twoMinPushUps: number;
    oneMinPushUps: number;
    longestWinStreak: number;
  };
  recentBattles: MatchHistoryItem[];
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  username: string;
  rating: number;
  division: string;
  wins: number;
  losses: number;
  streak: number;
  isCurrentUser?: boolean;
}

export interface BattleResultData {
  userReps: number;
  opponentReps: number;
  winner: 'user' | 'opponent' | 'tie';
  ratingDelta: number;
  newRating: number;
  previousRating: number;
  isPersonalBest: boolean;
  maxCombo: number;
  opponent: Player;
}

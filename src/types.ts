export type ScreenType = 
  | 'home' 
  | 'matchmaking' 
  | 'pre-match' 
  | 'live-battle' 
  | 'result' 
  | 'profile' 
  | 'leaderboard'
  | 'wallet'
  | 'no-mercy'
  | 'tournament-bracket'
  | 'legal';

export type LegalDocType = 
  | 'privacy' 
  | 'terms' 
  | 'responsible-play' 
  | 'community' 
  | 'cookies' 
  | 'about-aitia' 
  | 'contact';

export interface DemoTransaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  label: string;
  category: 'welcome' | 'battle_entry' | 'battle_reward' | 'tournament_entry' | 'tournament_reward' | 'refund';
  date: string;
  balanceAfter: number;
}

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
  result: 'win' | 'loss' | 'draw';
  date: string;
  ratingDelta: number;
  stake?: number;
  reward?: number;
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
  demoBattles: number;
  demoWinnings: number;
  noMercyTitles: number;
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
  reps?: number;
  noMercyTitles?: number;
  isCurrentUser?: boolean;
}

export interface BattleResultData {
  userReps: number;
  opponentReps: number;
  winner: 'user' | 'opponent' | 'tie' | 'draw';
  ratingDelta: number;
  newRating: number;
  previousRating: number;
  isPersonalBest: boolean;
  maxCombo: number;
  opponent: Player;
  // Demo wallet simulation fields
  stakeAmount: number;
  winnerReward: number;
  platformFee: number;
  netResult: number;
  prevBalance: number;
  newBalance: number;
  isTournamentMatch?: boolean;
  tournamentRound?: 'Quarterfinal' | 'Semifinal' | 'Final';
}

export interface TournamentMatch {
  id: string;
  player1: Player;
  player2: Player;
  p1Score?: number;
  p2Score?: number;
  winnerId?: string;
  isUserMatch: boolean;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface TournamentRound {
  name: 'Quarterfinal' | 'Semifinal' | 'Final';
  matches: TournamentMatch[];
}

export interface TournamentBracket {
  id: string;
  status: 'lobby' | 'quarterfinals' | 'semifinals' | 'final' | 'champion' | 'eliminated';
  currentRoundIndex: number;
  rounds: TournamentRound[];
  userEliminated: boolean;
  userChampion: boolean;
}

export type PoseState = 
  | 'READY' 
  | 'TOP' 
  | 'GOING_DOWN' 
  | 'BOTTOM' 
  | 'GOING_UP';

export type CameraStatus = 
  | 'IDLE' 
  | 'REQUESTING' 
  | 'ACTIVE' 
  | 'DENIED' 
  | 'ERROR' 
  | 'UNAVAILABLE';

export interface PushUpMetrics {
  elbowAngle: number;
  smoothedElbowAngle: number;
  activeSide: 'left' | 'right';
  bodyAlignmentAngle: number;
  confidence: number;
  isPlankHorizontal: boolean;
  lastRepDurationMs: number;
  fps: number;
}

export interface FormFeedback {
  text: string;
  type: 'neutral' | 'good' | 'warning' | 'action';
}


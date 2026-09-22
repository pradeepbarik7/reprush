import { Player, UserProfile, LeaderboardUser } from '../types';

export const INITIAL_USER: Player = {
  id: 'user-1',
  name: 'Onkar',
  username: '@you',
  rating: 1342,
  division: 'Gold',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  color: 'red',
  country: 'US',
};

export const INITIAL_OPPONENT: Player = {
  id: 'opp-1',
  name: 'Alex Morgan',
  username: '@alexm',
  rating: 1287,
  division: 'Gold',
  avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80',
  color: 'blue',
  country: 'CA',
};

export const INITIAL_PROFILE: UserProfile = {
  id: 'user-1',
  name: 'Onkar',
  username: '@you',
  rating: 1342,
  previousRating: 1324,
  division: 'Gold',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  wins: 42,
  losses: 24,
  winRate: 63.6,
  totalReps: 2481,
  personalRecords: {
    twoMinPushUps: 73,
    oneMinPushUps: 41,
    longestWinStreak: 7,
  },
  recentBattles: [
    {
      id: 'b-1',
      opponentName: 'Alex Morgan',
      opponentUsername: '@alexm',
      userScore: 57,
      opponentScore: 51,
      result: 'win',
      date: 'Today, 10:24 AM',
      ratingDelta: +18,
    },
    {
      id: 'b-2',
      opponentName: 'Chris Walker',
      opponentUsername: '@chrisw',
      userScore: 43,
      opponentScore: 48,
      result: 'loss',
      date: 'Yesterday',
      ratingDelta: -12,
    },
    {
      id: 'b-3',
      opponentName: 'Ryan Lee',
      opponentUsername: '@ryanl',
      userScore: 62,
      opponentScore: 55,
      result: 'win',
      date: 'Sep 19',
      ratingDelta: +21,
    },
    {
      id: 'b-4',
      opponentName: 'Sam Patel',
      opponentUsername: '@samp',
      userScore: 39,
      opponentScore: 37,
      result: 'win',
      date: 'Sep 17',
      ratingDelta: +15,
    },
  ],
};

export const INITIAL_LEADERBOARD: Record<'global' | 'friends' | 'weekly', LeaderboardUser[]> = {
  global: [
    { rank: 1, name: 'Alex Morgan', username: '@alexm', rating: 1842, division: 'Diamond', wins: 148, losses: 32, streak: 12 },
    { rank: 2, name: 'Ryan Lee', username: '@ryanl', rating: 1791, division: 'Diamond', wins: 132, losses: 41, streak: 8 },
    { rank: 3, name: 'Chris Walker', username: '@chrisw', rating: 1734, division: 'Platinum', wins: 119, losses: 49, streak: 4 },
    { rank: 4, name: 'Onkar (You)', username: '@you', rating: 1360, division: 'Gold', wins: 43, losses: 24, streak: 8, isCurrentUser: true },
    { rank: 5, name: 'Sam Patel', username: '@samp', rating: 1342, division: 'Gold', wins: 64, losses: 42, streak: 2 },
    { rank: 6, name: 'Jordan Smith', username: '@jordans', rating: 1290, division: 'Gold', wins: 51, losses: 38, streak: 1 },
    { rank: 7, name: 'Elena Rostova', username: '@elenar', rating: 1245, division: 'Silver', wins: 44, losses: 39, streak: 3 },
    { rank: 8, name: 'Marcus Vance', username: '@marcusv', rating: 1190, division: 'Silver', wins: 38, losses: 45, streak: 0 },
  ],
  friends: [
    { rank: 1, name: 'Ryan Lee', username: '@ryanl', rating: 1791, division: 'Diamond', wins: 132, losses: 41, streak: 8 },
    { rank: 2, name: 'Onkar (You)', username: '@you', rating: 1360, division: 'Gold', wins: 43, losses: 24, streak: 8, isCurrentUser: true },
    { rank: 3, name: 'Sam Patel', username: '@samp', rating: 1342, division: 'Gold', wins: 64, losses: 42, streak: 2 },
    { rank: 4, name: 'Jordan Smith', username: '@jordans', rating: 1290, division: 'Gold', wins: 51, losses: 38, streak: 1 },
  ],
  weekly: [
    { rank: 1, name: 'Onkar (You)', username: '@you', rating: 1360, division: 'Gold', wins: 14, losses: 3, streak: 8, isCurrentUser: true },
    { rank: 2, name: 'Alex Morgan', username: '@alexm', rating: 1842, division: 'Diamond', wins: 12, losses: 4, streak: 5 },
    { rank: 3, name: 'Chris Walker', username: '@chrisw', rating: 1734, division: 'Platinum', wins: 10, losses: 6, streak: 2 },
    { rank: 4, name: 'Elena Rostova', username: '@elenar', rating: 1245, division: 'Silver', wins: 8, losses: 5, streak: 3 },
  ],
};

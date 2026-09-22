import { Player, TournamentBracket, TournamentMatch, TournamentRound } from '../types';

export const MOCK_TOURNAMENT_ROSTER: Player[] = [
  {
    id: 't-user',
    name: 'You',
    username: '@onkar',
    rating: 1360,
    division: 'Gold',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    color: 'red',
  },
  {
    id: 't-alex',
    name: 'Alex Morgan',
    username: '@alex_m',
    rating: 1345,
    division: 'Gold',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    color: 'blue',
  },
  {
    id: 't-ryan',
    name: 'Ryan Lee',
    username: '@ryan_speed',
    rating: 1380,
    division: 'Platinum',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    color: 'blue',
  },
  {
    id: 't-chris',
    name: 'Chris Walker',
    username: '@chris_w',
    rating: 1320,
    division: 'Gold',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    color: 'blue',
  },
  {
    id: 't-sam',
    name: 'Sam Patel',
    username: '@sam_reps',
    rating: 1395,
    division: 'Platinum',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    color: 'blue',
  },
  {
    id: 't-jordan',
    name: 'Jordan Smith',
    username: '@jordan_fit',
    rating: 1355,
    division: 'Gold',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    color: 'blue',
  },
  {
    id: 't-mike',
    name: 'Mike Ross',
    username: '@mike_iron',
    rating: 1410,
    division: 'Platinum',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    color: 'blue',
  },
  {
    id: 't-david',
    name: 'David Chen',
    username: '@david_c',
    rating: 1330,
    division: 'Gold',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    color: 'blue',
  },
];

const STORAGE_KEY = 'reprush_tournament_bracket';

/**
 * Creates a brand new 8-player tournament bracket
 */
export function initializeTournamentBracket(user: Player): TournamentBracket {
  const userPlayer: Player = { ...user, id: 't-user', name: 'You' };
  const alex = MOCK_TOURNAMENT_ROSTER[1];
  const ryan = MOCK_TOURNAMENT_ROSTER[2];
  const chris = MOCK_TOURNAMENT_ROSTER[3];
  const sam = MOCK_TOURNAMENT_ROSTER[4];
  const jordan = MOCK_TOURNAMENT_ROSTER[5];
  const mike = MOCK_TOURNAMENT_ROSTER[6];
  const david = MOCK_TOURNAMENT_ROSTER[7];

  const qfMatches: TournamentMatch[] = [
    {
      id: 'qf-1',
      player1: userPlayer,
      player2: alex,
      isUserMatch: true,
      status: 'pending',
    },
    {
      id: 'qf-2',
      player1: ryan,
      player2: chris,
      isUserMatch: false,
      status: 'pending',
    },
    {
      id: 'qf-3',
      player1: sam,
      player2: jordan,
      isUserMatch: false,
      status: 'pending',
    },
    {
      id: 'qf-4',
      player1: mike,
      player2: david,
      isUserMatch: false,
      status: 'pending',
    },
  ];

  const sfMatches: TournamentMatch[] = [
    {
      id: 'sf-1',
      player1: { ...userPlayer, name: 'Winner QF 1' },
      player2: { ...ryan, name: 'Winner QF 2' },
      isUserMatch: true,
      status: 'pending',
    },
    {
      id: 'sf-2',
      player1: { ...sam, name: 'Winner QF 3' },
      player2: { ...mike, name: 'Winner QF 4' },
      isUserMatch: false,
      status: 'pending',
    },
  ];

  const finalMatch: TournamentMatch = {
    id: 'fn-1',
    player1: { ...userPlayer, name: 'Finalist 1' },
    player2: { ...mike, name: 'Finalist 2' },
    isUserMatch: true,
    status: 'pending',
  };

  const bracket: TournamentBracket = {
    id: `tourney-${Date.now()}`,
    status: 'quarterfinals',
    currentRoundIndex: 0,
    rounds: [
      { name: 'Quarterfinal', matches: qfMatches },
      { name: 'Semifinal', matches: sfMatches },
      { name: 'Final', matches: [finalMatch] },
    ],
    userEliminated: false,
    userChampion: false,
  };

  saveBracket(bracket);
  return bracket;
}

export function getSavedTournamentBracket(): TournamentBracket | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to read bracket from storage:', e);
  }
  return null;
}

export function saveBracket(bracket: TournamentBracket): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bracket));
  } catch (e) {
    console.warn('Failed to save bracket:', e);
  }
}

/**
 * Simulates AI-vs-AI matches in the given round
 */
export function simulateOtherMatches(round: TournamentRound): TournamentRound {
  const updatedMatches = round.matches.map((m) => {
    if (m.isUserMatch || m.status === 'completed') return m;

    // Simulate plausible reps for simulated players (42 - 58 reps)
    const p1Score = Math.floor(44 + Math.random() * 12);
    let p2Score = Math.floor(44 + Math.random() * 12);
    if (p1Score === p2Score) p2Score += 1;

    const winnerId = p1Score > p2Score ? m.player1.id : m.player2.id;
    return {
      ...m,
      p1Score,
      p2Score,
      winnerId,
      status: 'completed' as const,
    };
  });

  return { ...round, matches: updatedMatches };
}

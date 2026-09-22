export interface StakeRule {
  entry: number;          // e.g. 10 (₹10 Demo)
  prizePool: number;      // e.g. 20 (₹20 Demo)
  winnerReward: number;   // e.g. 15 (₹15 Demo)
  platformFee: number;    // e.g. 5 (₹5 Demo)
  label: string;          // "₹10"
}

export const DEMO_STAKES_CONFIG: StakeRule[] = [
  {
    entry: 1,
    prizePool: 2,
    winnerReward: 1.5,
    platformFee: 0.5,
    label: '₹1',
  },
  {
    entry: 2,
    prizePool: 4,
    winnerReward: 3,
    platformFee: 1,
    label: '₹2',
  },
  {
    entry: 5,
    prizePool: 10,
    winnerReward: 7.5,
    platformFee: 2.5,
    label: '₹5',
  },
  {
    entry: 10,
    prizePool: 20,
    winnerReward: 15,
    platformFee: 5,
    label: '₹10',
  },
];

export const DEFAULT_STAKE = DEMO_STAKES_CONFIG[3]; // ₹10 entry default

export function getBattlePrizeCalculation(entryAmount: number): StakeRule {
  const found = DEMO_STAKES_CONFIG.find((s) => s.entry === entryAmount);
  if (found) return found;
  const prizePool = entryAmount * 2;
  const platformFee = prizePool * 0.25;
  const winnerReward = prizePool - platformFee;
  return {
    entry: entryAmount,
    prizePool,
    winnerReward,
    platformFee,
    label: `₹${entryAmount}`,
  };
}

export const TOURNAMENT_CONFIG = {
  name: 'NO MERCY',
  subtitle: 'Only one survives the bracket.',
  tagline: '8 Player Push-Up Tournament',
  entryFee: 10,           // ₹10 Demo
  prizePool: 70,          // ₹70 Demo
  winnerReward: 50,       // ₹50 Demo
  runnerUpReward: 20,     // ₹20 Demo
  totalPlayers: 8,
  format: 'Single Elimination',
  rounds: ['Quarterfinal', 'Semifinal', 'Final'] as const,
};

export const INITIAL_DEMO_BALANCE = 500;

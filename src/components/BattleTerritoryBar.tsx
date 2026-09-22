import React from 'react';

interface BattleTerritoryBarProps {
  userReps: number;
  opponentReps: number;
  userName?: string;
  opponentName?: string;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
  isFrozen?: boolean;
}

export const BattleTerritoryBar: React.FC<BattleTerritoryBarProps> = ({
  userReps,
  opponentReps,
  userName = 'YOU',
  opponentName = 'ALEX',
  showLabels = true,
  size = 'lg',
  isFrozen = false,
}) => {
  // Calculate territory percentages
  // If 0-0, 50-50.
  // As reps accumulate, smooth weighted delta prevents extreme collapse while clearly reflecting rep advantage.
  let userPct = 50;
  const totalReps = userReps + opponentReps;

  if (totalReps > 0) {
    // 50% base + rep differential scaled
    const diff = userReps - opponentReps;
    // Scale: each rep gives ~2.5% territory shift, bounded between 15% and 85%
    userPct = Math.min(85, Math.max(15, 50 + diff * 2.5));
  }

  const opponentPct = 100 - userPct;
  const repDiff = userReps - opponentReps;

  const barHeight = size === 'sm' ? 'h-6' : size === 'md' ? 'h-9' : 'h-12';
  const labelTextSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className="w-full select-none">
      {showLabels && (
        <div className="flex items-center justify-between mb-2 px-1 text-xs sm:text-sm font-bold tracking-tight">
          {/* Left Player Territory Info */}
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 shadow-xs animate-pulse" />
            <span className="text-gray-900 font-extrabold uppercase tracking-wide">
              {userName}
            </span>
            <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded-md font-mono font-bold text-xs border border-red-100">
              {Math.round(userPct)}% TERRITORY
            </span>
          </div>

          {/* Territory Status Tag */}
          <div className="hidden sm:flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200/60">
            {repDiff > 0 ? (
              <span className="text-red-600 font-bold">
                {userName} taking the lead (+{repDiff})
              </span>
            ) : repDiff < 0 ? (
              <span className="text-blue-600 font-bold">
                {opponentName} leading (+{Math.abs(repDiff)})
              </span>
            ) : (
              <span className="text-gray-500 font-medium">Contested • Even Split</span>
            )}
          </div>

          {/* Right Player Territory Info */}
          <div className="flex items-center gap-2">
            <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md font-mono font-bold text-xs border border-blue-100">
              {Math.round(opponentPct)}% TERRITORY
            </span>
            <span className="text-gray-900 font-extrabold uppercase tracking-wide">
              {opponentName}
            </span>
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500 shadow-xs" />
          </div>
        </div>
      )}

      {/* Main Clash Bar Container */}
      <div
        className={`relative ${barHeight} w-full rounded-2xl p-1 bg-gray-200/90 shadow-inner flex items-center overflow-hidden border border-gray-300/60`}
      >
        {/* User Territory (Red) */}
        <div
          className="h-full rounded-xl transition-all duration-400 ease-out flex items-center justify-between px-3 relative overflow-hidden"
          style={{
            width: `${userPct}%`,
            background: 'linear-gradient(90deg, #DC2626 0%, #EF4444 100%)',
          }}
        >
          {/* Subtle diagonal micro pattern */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 0, transparent 8px)',
            }}
          />

          <span className="relative z-10 text-white font-mono font-extrabold text-xs tracking-wider opacity-90 drop-shadow-xs">
            {userReps} REPS
          </span>
        </div>

        {/* Boundary Clash Marker */}
        <div
          className="absolute top-0 bottom-0 z-20 w-3 -ml-1.5 transition-all duration-400 ease-out flex items-center justify-center pointer-events-none"
          style={{ left: `${userPct}%` }}
        >
          <div className="w-1.5 h-full bg-white rounded-full shadow-md border border-gray-300/40 relative">
            {!isFrozen && (
              <div className="absolute -top-1 -bottom-1 -left-1 -right-1 bg-white/40 rounded-full animate-ping pointer-events-none" />
            )}
          </div>
        </div>

        {/* Opponent Territory (Blue) */}
        <div
          className="h-full rounded-xl transition-all duration-400 ease-out flex items-center justify-between px-3 relative overflow-hidden flex-row-reverse"
          style={{
            width: `${opponentPct}%`,
            background: 'linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)',
          }}
        >
          {/* Subtle diagonal micro pattern */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: 'repeating-linear-gradient(-45deg, #000 0, #000 2px, transparent 0, transparent 8px)',
            }}
          />

          <span className="relative z-10 text-white font-mono font-extrabold text-xs tracking-wider opacity-90 drop-shadow-xs">
            {opponentReps} REPS
          </span>
        </div>
      </div>

      {/* Mobile-only lead badge */}
      {showLabels && (
        <div className="sm:hidden text-center mt-1.5">
          <span className="text-[11px] font-semibold text-gray-500">
            {repDiff > 0 ? (
              <strong className="text-red-600">You lead by +{repDiff} reps</strong>
            ) : repDiff < 0 ? (
              <strong className="text-blue-600">Alex leads by +{Math.abs(repDiff)} reps</strong>
            ) : (
              'Territory is dead even'
            )}
          </span>
        </div>
      )}
    </div>
  );
};

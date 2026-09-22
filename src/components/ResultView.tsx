import React, { useEffect, useState } from 'react';
import { BattleResultData } from '../types';
import { BattleTerritoryBar } from './BattleTerritoryBar';
import { ShareModal } from './ShareModal';
import { playClickSound, playVictorySound, playDefeatSound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Swords, User, Share2, Sparkles, Flame, CheckCircle, ShieldAlert } from 'lucide-react';

interface ResultViewProps {
  result: BattleResultData;
  onRematch: () => void;
  onNewBattle: () => void;
  onViewProfile: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  result,
  onRematch,
  onNewBattle,
  onViewProfile,
}) => {
  const [animatedRating, setAnimatedRating] = useState(result.previousRating);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const isUserWinner = result.winner === 'user';

  // Confetti and Fanfare / Defeat Sound
  useEffect(() => {
    if (isUserWinner) {
      playVictorySound();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#EF4444', '#3B82F6', '#10B981', '#F59E0B'],
        });
      } catch (err) {
        console.log('Confetti triggered', err);
      }
    } else {
      playDefeatSound();
    }

    // Number counting animation for rating (up or down)
    const duration = 1200;
    const delta = Math.abs(result.newRating - result.previousRating);
    const steps = Math.max(delta, 1);
    const stepTime = duration / steps;
    let current = result.previousRating;

    const interval = setInterval(() => {
      if (isUserWinner) {
        current += 1;
        if (current >= result.newRating) {
          setAnimatedRating(result.newRating);
          clearInterval(interval);
        } else {
          setAnimatedRating(current);
        }
      } else {
        current -= 1;
        if (current <= result.newRating) {
          setAnimatedRating(result.newRating);
          clearInterval(interval);
        } else {
          setAnimatedRating(current);
        }
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [result, isUserWinner]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 select-none">
      {/* Result Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/90 shadow-xl text-center relative overflow-hidden">
        {/* Subtle accent glow */}
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full blur-3xl pointer-events-none ${
            isUserWinner ? 'bg-emerald-500/10' : 'bg-blue-500/10'
          }`}
        />

        {/* Match Outcome Header */}
        <div className="relative z-10 mb-8 space-y-2">
          {/* Trophy / Result Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border shadow-xs mb-2 ${
              isUserWinner
                ? 'bg-amber-50 border-amber-200 text-amber-800'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            {isUserWinner ? (
              <Trophy className="w-4 h-4 text-amber-500" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-blue-500" />
            )}
            <span className="text-xs font-extrabold uppercase tracking-wider">
              {isUserWinner ? 'VICTORY SECURED' : 'MATCH COMPLETED • DEFEAT'}
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-gray-950">
            {isUserWinner ? 'YOU WIN' : `${result.opponent.name.toUpperCase()} WINS`}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 font-medium">
            {isUserWinner
              ? 'Great battle. Dominant performance.'
              : `Tough fight! ${result.opponent.name} surged ahead in the final round.`}
          </p>
        </div>

        {/* Rep Scores Breakdown */}
        <div className="relative z-10 grid grid-cols-2 gap-4 sm:gap-8 items-center max-w-xl mx-auto mb-8 bg-gray-50/80 p-6 rounded-2xl border border-gray-100">
          {/* You (Red) */}
          <div className="text-center">
            <div className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-gray-900 mb-1 flex items-center justify-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span>YOU</span>
            </div>
            <div className="font-mono text-5xl sm:text-6xl font-extrabold text-red-600">
              {result.userReps}
            </div>
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              REPS
            </div>
          </div>

          {/* Opponent (Blue) */}
          <div className="text-center">
            <div className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-gray-900 mb-1 flex items-center justify-center gap-1.5">
              <span>{result.opponent.name.toUpperCase()}</span>
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            </div>
            <div className="font-mono text-5xl sm:text-6xl font-extrabold text-blue-600">
              {result.opponentReps}
            </div>
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              REPS
            </div>
          </div>
        </div>

        {/* Frozen Territory Bar */}
        <div className="relative z-10 max-w-2xl mx-auto mb-8">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 text-left">
            FINAL TERRITORIAL SPLIT
          </div>
          <BattleTerritoryBar
            userReps={result.userReps}
            opponentReps={result.opponentReps}
            userName="YOU"
            opponentName={result.opponent.name}
            isFrozen={true}
          />
        </div>

        {/* Rating Adjustment & Accolades */}
        <div className="relative z-10 max-w-lg mx-auto bg-white rounded-2xl p-5 border border-gray-200/90 shadow-2xs mb-8">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Rating Adjustment
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-mono text-3xl font-extrabold text-gray-950">
                  {animatedRating}
                </span>
                <span
                  className={`text-sm font-bold px-2 py-0.5 rounded border ${
                    result.ratingDelta > 0
                      ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
                      : 'text-rose-600 bg-rose-50 border-rose-200'
                  }`}
                >
                  {result.ratingDelta > 0 ? `+${result.ratingDelta}` : result.ratingDelta} Rating
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-gray-400 block">Previous: {result.previousRating}</span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 mt-1">
                Gold Division
              </span>
            </div>
          </div>

          {/* Badges: Personal Best & Max Combo */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-center gap-2">
            {result.isPersonalBest && (
              <span className="inline-flex items-center gap-1 text-xs font-extrabold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                PERSONAL BEST (2-MIN)
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              Peak Combo: x{result.maxCombo || 4}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              100% Rep Validity
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto">
          {/* Rematch */}
          <button
            id="result-rematch-btn"
            onClick={() => {
              playClickSound();
              onRematch();
            }}
            className="w-full sm:w-auto flex-1 py-3.5 px-5 rounded-2xl bg-gray-950 text-white font-extrabold text-sm shadow-md hover:bg-gray-800 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-red-400" />
            <span>REMATCH</span>
          </button>

          {/* New Battle */}
          <button
            id="result-new-battle-btn"
            onClick={() => {
              playClickSound();
              onNewBattle();
            }}
            className="w-full sm:w-auto flex-1 py-3.5 px-5 rounded-2xl bg-white text-gray-900 border border-gray-300 font-extrabold text-sm shadow-xs hover:bg-gray-50 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <Swords className="w-4 h-4 text-gray-700" />
            <span>NEW BATTLE</span>
          </button>

          {/* View Profile */}
          <button
            id="result-view-profile-btn"
            onClick={() => {
              playClickSound();
              onViewProfile();
            }}
            className="w-full sm:w-auto flex-1 py-3.5 px-5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-extrabold text-sm transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <User className="w-4 h-4 text-gray-700" />
            <span>VIEW PROFILE</span>
          </button>

          {/* Share */}
          <button
            id="result-share-btn"
            onClick={() => {
              playClickSound();
              setIsShareModalOpen(true);
            }}
            className="w-full sm:w-auto p-3.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all cursor-pointer flex items-center justify-center"
            title="Share Result"
          >
            <Share2 className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        result={result}
      />
    </div>
  );
};

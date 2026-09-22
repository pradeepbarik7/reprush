import React, { useEffect, useState } from 'react';
import { BattleResultData } from '../types';
import { BattleTerritoryBar } from './BattleTerritoryBar';
import { ShareModal } from './ShareModal';
import { playClickSound, playVictorySound, playDefeatSound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  RotateCcw, 
  Swords, 
  User, 
  Share2, 
  Sparkles, 
  Flame, 
  CheckCircle, 
  ShieldAlert, 
  Wallet, 
  ArrowRight 
} from 'lucide-react';

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
  const isDraw = result.winner === 'tie' || result.winner === 'draw';

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
    } else if (!isDraw) {
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
  }, [result, isUserWinner, isDraw]);

  const stake = result.stakeAmount || 10;
  const reward = result.winnerReward || 0;
  const net = result.netResult || (isUserWinner ? reward - stake : -stake);
  const prevBal = result.prevBalance || 240;
  const newBal = result.newBalance || (prevBal + (isUserWinner ? reward : 0));

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 select-none animate-fade-in">
      {/* Result Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/90 shadow-xl text-center relative overflow-hidden">
        {/* Subtle accent glow */}
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full blur-3xl pointer-events-none ${
            isUserWinner ? 'bg-emerald-500/10' : isDraw ? 'bg-amber-500/10' : 'bg-blue-500/10'
          }`}
        />

        {/* Match Outcome Header */}
        <div className="relative z-10 mb-8 space-y-2">
          {/* Trophy / Result Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border shadow-xs mb-2 ${
              isUserWinner
                ? 'bg-amber-50 border-amber-200 text-amber-800'
                : isDraw
                ? 'bg-gray-100 border-gray-300 text-gray-800'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            {isUserWinner ? (
              <Trophy className="w-4 h-4 text-amber-500" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-blue-500" />
            )}
            <span className="text-xs font-extrabold uppercase tracking-wider font-mono">
              {isUserWinner
                ? 'VICTORY SECURED'
                : isDraw
                ? 'MATCH TIED • STAKE REFUNDED'
                : 'BATTLE LOST'}
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-950">
            {isUserWinner
              ? 'YOU WIN'
              : isDraw
              ? 'DRAW'
              : 'BATTLE LOST'}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 font-medium">
            {isUserWinner
              ? 'Great battle. Dominant push-up performance.'
              : isDraw
              ? 'Exact rep tie! Simulated entry stake refunded to demo balance.'
              : `Tough fight! ${result.opponent.name} edged ahead in the final stretch.`}
          </p>
        </div>

        {/* Rep Scores Breakdown */}
        <div className="relative z-10 grid grid-cols-2 gap-4 sm:gap-8 items-center max-w-xl mx-auto mb-6 bg-gray-50/80 p-6 rounded-2xl border border-gray-100">
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

        {/* DEMO WALLET SIMULATION CARD (Strictly non-monetary prototype) */}
        <div className="relative z-10 max-w-xl mx-auto bg-[#0F172A] border border-gray-800 rounded-2xl p-5 mb-6 text-white text-left shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
                Demo Payout Simulation
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
              SIMULATED ONLY
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 text-xs font-mono">
            <div>
              <span className="text-gray-400 block text-[10px]">Demo Entry:</span>
              <span className="text-white font-extrabold text-sm sm:text-base">
                ₹{stake.toFixed(0)}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Demo Reward:</span>
              <span className={`font-extrabold text-sm sm:text-base ${isUserWinner ? 'text-emerald-400' : 'text-gray-400'}`}>
                ₹{reward.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Net Result:</span>
              <span className={`font-extrabold text-sm sm:text-base ${
                isUserWinner ? 'text-emerald-400' : isDraw ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {isUserWinner ? `+₹${net.toFixed(2)}` : isDraw ? '₹0.00' : `-₹${stake.toFixed(0)}`}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Demo Balance:</span>
              <span className="text-white font-extrabold text-xs sm:text-sm flex items-center gap-1">
                <span>₹{prevBal.toFixed(0)}</span>
                <ArrowRight className="w-3 h-3 text-gray-500" />
                <span className="text-emerald-300">₹{newBal.toFixed(0)}</span>
              </span>
            </div>
          </div>

          <div className="pt-2.5 border-t border-gray-800 text-[10px] text-gray-400 leading-tight">
            No real money is involved. Balances and rewards are simulated for product demonstration only.
          </div>
        </div>

        {/* Frozen Territory Bar */}
        <div className="relative z-10 max-w-xl mx-auto mb-6">
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
        <div className="relative z-10 max-w-xl mx-auto bg-white rounded-2xl p-5 border border-gray-200/90 shadow-2xs mb-8">
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
                      : result.ratingDelta === 0
                      ? 'text-gray-600 bg-gray-50 border-gray-200'
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

          {/* Badges */}
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

        {/* Action Buttons: REMATCH, NEW BATTLE, VIEW PROFILE */}
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

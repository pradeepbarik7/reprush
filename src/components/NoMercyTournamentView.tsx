import React, { useState, useEffect } from 'react';
import { Player, TournamentBracket } from '../types';
import { TOURNAMENT_CONFIG } from '../config/stakesConfig';
import { 
  getSavedTournamentBracket, 
  initializeTournamentBracket, 
  saveBracket, 
  simulateOtherMatches 
} from '../services/tournamentService';
import { getDemoBalance, deductDemoEntry, addDemoCredits } from '../services/demoWalletService';
import { 
  Trophy, 
  Swords, 
  Users, 
  Sparkles, 
  ShieldAlert, 
  ChevronRight, 
  CheckCircle2, 
  Flame, 
  RotateCcw,
  ArrowRight
} from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface NoMercyTournamentViewProps {
  currentUser: Player;
  onStartTournamentMatch: (opponent: Player, roundName: 'Quarterfinal' | 'Semifinal' | 'Final') => void;
  onNavigateHome: () => void;
  onNavigateProfile: () => void;
}

export const NoMercyTournamentView: React.FC<NoMercyTournamentViewProps> = ({
  currentUser,
  onStartTournamentMatch,
  onNavigateHome,
  onNavigateProfile,
}) => {
  const [bracket, setBracket] = useState<TournamentBracket | null>(() => getSavedTournamentBracket());
  const [balance, setBalance] = useState(() => getDemoBalance());
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // If no bracket exists, initialize in lobby state
  const hasActiveTournament = bracket !== null && bracket.status !== 'lobby';

  const handleJoinTournament = () => {
    playClickSound();
    const currentBalance = getDemoBalance();
    if (currentBalance < TOURNAMENT_CONFIG.entryFee) {
      setErrorMsg(`Insufficient demo balance. You need ₹${TOURNAMENT_CONFIG.entryFee} Demo to enter.`);
      return;
    }

    // Deduct simulated tournament entry
    const res = deductDemoEntry(
      TOURNAMENT_CONFIG.entryFee,
      'No Mercy Tournament Entry (₹10 Demo)',
      'tournament_entry'
    );

    if (res.success) {
      setBalance(res.newBalance);
      const newBracket = initializeTournamentBracket(currentUser);
      setBracket(newBracket);
      setErrorMsg(null);
    } else {
      setErrorMsg('Could not deduct tournament entry.');
    }
  };

  const handleStartNextRound = () => {
    playClickSound();
    if (!bracket) return;

    const roundIndex = bracket.currentRoundIndex;
    const currentRound = bracket.rounds[roundIndex];
    if (!currentRound) return;

    // Find the user's match in this round
    const userMatch = currentRound.matches.find((m) => m.isUserMatch);
    if (!userMatch) return;

    // Opponent is player2
    const opponent = userMatch.player2;

    // Simulate other AI matches in this round first so their results appear
    const updatedRound = simulateOtherMatches(currentRound);
    const updatedRounds = [...bracket.rounds];
    updatedRounds[roundIndex] = updatedRound;
    const updatedBracket = { ...bracket, rounds: updatedRounds };
    saveBracket(updatedBracket);
    setBracket(updatedBracket);

    // Launch match
    onStartTournamentMatch(opponent, currentRound.name);
  };

  const handleResetTournament = () => {
    playClickSound();
    localStorage.removeItem('reprush_tournament_bracket');
    setBracket(null);
    setErrorMsg(null);
  };

  // If Champion state
  if (bracket && bracket.userChampion) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-12 select-none text-center animate-fade-in">
        <div className="bg-[#0F172A] border-2 border-amber-500 rounded-3xl p-8 sm:p-10 shadow-2xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Trophy Icon */}
          <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-amber-950/80 border-2 border-amber-500 flex items-center justify-center text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.5)] animate-bounce">
            <Trophy className="w-12 h-12" />
          </div>

          <span className="px-3 py-1 rounded-full bg-amber-950 border border-amber-500/50 text-amber-300 text-xs font-mono font-bold uppercase tracking-widest inline-block mb-3">
            TOURNAMENT VICTOR
          </span>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-2">
            NO MERCY CHAMPION
          </h1>
          <p className="text-base sm:text-lg text-amber-300 font-semibold mb-6">
            🏆 You conquered the 8-player arena.
          </p>

          <div className="bg-gray-950/90 border border-gray-800 rounded-2xl p-5 mb-8 max-w-md mx-auto space-y-3 font-mono">
            <div className="flex justify-between items-center text-gray-400 text-sm">
              <span>Demo Tournament Reward</span>
              <span className="text-emerald-400 font-extrabold text-base">+₹{TOURNAMENT_CONFIG.winnerReward} Demo</span>
            </div>
            <div className="flex justify-between items-center text-gray-400 text-sm pt-2 border-t border-gray-800">
              <span>Current Demo Balance</span>
              <span className="text-white font-extrabold text-base">₹{balance.toFixed(2)} Demo</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleResetTournament}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-extrabold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
            >
              <RotateCcw className="w-4 h-4" />
              <span>PLAY AGAIN</span>
            </button>
            <button
              onClick={onNavigateHome}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm border border-gray-700 transition-colors cursor-pointer"
            >
              BACK TO HOME
            </button>
            <button
              onClick={onNavigateProfile}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-300 font-bold text-sm border border-gray-700 transition-colors cursor-pointer"
            >
              VIEW PROFILE
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If Eliminated state
  if (bracket && bracket.userEliminated) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 py-12 select-none text-center animate-fade-in">
        <div className="bg-[#0F172A] border border-red-900 rounded-3xl p-8 shadow-2xl text-white">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-950/80 border border-red-600 flex items-center justify-center text-red-400 shadow-md">
            <Swords className="w-8 h-8" />
          </div>

          <span className="px-3 py-1 rounded-full bg-red-950 border border-red-500/50 text-red-300 text-xs font-mono font-bold uppercase tracking-widest inline-block mb-3">
            ELIMINATED
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            KNOCKED OUT OF NO MERCY
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            The arena showed no mercy. Rest up, reset your demo balance, and enter the bracket again.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleResetTournament}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>TRY AGAIN (₹10 DEMO)</span>
            </button>
            <button
              onClick={onNavigateHome}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-300 font-bold text-sm border border-gray-700 cursor-pointer"
            >
              BACK TO HOME
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Bracket View
  if (bracket && hasActiveTournament) {
    const currentRound = bracket.rounds[bracket.currentRoundIndex];
    const userMatch = currentRound?.matches.find((m) => m.isUserMatch);
    const opponent = userMatch?.player2;

    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none animate-fade-in">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5 text-red-500" />
              SINGLE ELIMINATION BRACKET
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
              NO MERCY TOURNAMENT
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Survive all 3 rounds with real camera push-up detection to claim the champion title.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 font-mono text-xs font-bold border border-gray-200">
              Demo Balance: ₹{balance.toFixed(2)}
            </span>
            <button
              onClick={handleResetTournament}
              className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
              title="Leave / Reset Tournament"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Current Match Banner Callout */}
        {userMatch && opponent && (
          <div className="bg-[#0F172A] border-2 border-red-500 rounded-3xl p-6 sm:p-7 text-white shadow-xl mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-red-950 border border-red-500/60 text-red-400 text-[10px] font-mono font-bold uppercase tracking-widest inline-block mb-2">
                  ROUND {bracket.currentRoundIndex + 1} OF 3 • {currentRound.name.toUpperCase()}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Next Bout: You vs {opponent.name}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Opponent Division: {opponent.division} (Rating {opponent.rating}). Put phone sideways and battle with full elbow depth.
                </p>
              </div>

              <button
                id="start-tournament-bout-btn"
                onClick={handleStartNextRound}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-base shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 shrink-0"
              >
                <Swords className="w-5 h-5" />
                <span>START {currentRound.name.toUpperCase()} BOUT</span>
              </button>
            </div>
          </div>
        )}

        {/* 3-Round Visual Bracket Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bracket.rounds.map((round, rIdx) => {
            const isCurrentRound = rIdx === bracket.currentRoundIndex;
            const isCompleted = rIdx < bracket.currentRoundIndex;

            return (
              <div
                key={round.name}
                className={`rounded-3xl border p-4 sm:p-5 transition-all ${
                  isCurrentRound
                    ? 'bg-white border-red-400 shadow-md ring-2 ring-red-100'
                    : isCompleted
                    ? 'bg-gray-50/80 border-gray-200'
                    : 'bg-gray-50/40 border-gray-200/60 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-extrabold uppercase tracking-wider text-gray-900 font-mono">
                    {round.name}S
                  </h4>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-700'
                        : isCurrentRound
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {isCompleted ? 'COMPLETED' : isCurrentRound ? 'ACTIVE' : 'UPCOMING'}
                  </span>
                </div>

                <div className="space-y-3">
                  {round.matches.map((match, mIdx) => {
                    const isUserBout = match.isUserMatch;
                    const p1Won = match.winnerId === match.player1.id;
                    const p2Won = match.winnerId === match.player2.id;

                    return (
                      <div
                        key={match.id}
                        className={`rounded-2xl border p-3 text-xs transition-all ${
                          isUserBout
                            ? 'bg-red-50/50 border-red-200 shadow-xs'
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        {/* Player 1 */}
                        <div className="flex items-center justify-between py-1 border-b border-gray-100">
                          <span
                            className={`font-bold flex items-center gap-1.5 ${
                              isUserBout ? 'text-red-700' : 'text-gray-900'
                            }`}
                          >
                            {isUserBout && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                            {match.player1.name}
                          </span>
                          <span className="font-mono font-extrabold text-gray-700">
                            {match.p1Score !== undefined ? `${match.p1Score}` : '—'}
                          </span>
                        </div>

                        {/* Player 2 */}
                        <div className="flex items-center justify-between py-1">
                          <span className="font-bold text-gray-800">
                            {match.player2.name}
                          </span>
                          <span className="font-mono font-extrabold text-gray-700">
                            {match.p2Score !== undefined ? `${match.p2Score}` : '—'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Default: Tournament Lobby Screen
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 select-none animate-fade-in">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-mono font-bold uppercase tracking-wider mb-3">
          <Flame className="w-4 h-4 text-red-600" />
          Major Competitive Arena
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-950 tracking-tight">
          NO MERCY TOURNAMENT
        </h1>
        <p className="text-lg text-gray-600 font-medium mt-2">
          "Only one survives the bracket."
        </p>
      </div>

      {/* Main Tournament Card */}
      <div className="bg-[#0F172A] border border-gray-800 rounded-3xl p-6 sm:p-10 shadow-2xl text-white relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-72 h-72 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider">
                8 PLAYER TOURNAMENT
              </span>
              <span className="px-3 py-1 rounded-full bg-gray-800 text-gray-300 font-mono text-xs font-bold uppercase">
                Push-Up Battle
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
              Survive 3 Single-Elimination Rounds
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6">
              Compete through Quarterfinals, Semifinals, and the Final using real-time camera rep detection. All payouts are simulated demo credits.
            </p>

            {/* Structure Breakdown */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono mb-6">
              <div className="bg-gray-900/90 border border-gray-800 p-3 rounded-2xl">
                <span className="text-gray-400 block text-[11px]">ENTRY STAKE</span>
                <strong className="text-white text-base">₹10 Demo</strong>
              </div>
              <div className="bg-gray-900/90 border border-gray-800 p-3 rounded-2xl">
                <span className="text-gray-400 block text-[11px]">PRIZE POOL</span>
                <strong className="text-amber-400 text-base">₹70 Demo</strong>
              </div>
              <div className="bg-gray-900/90 border border-gray-800 p-3 rounded-2xl">
                <span className="text-emerald-400 block text-[11px]">WINNER REWARD</span>
                <strong className="text-emerald-400 text-base">₹50 Demo</strong>
              </div>
              <div className="bg-gray-900/90 border border-gray-800 p-3 rounded-2xl">
                <span className="text-blue-400 block text-[11px]">RUNNER-UP</span>
                <strong className="text-blue-400 text-base">₹20 Demo</strong>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/80 text-rose-300 text-xs">
                {errorMsg}
              </div>
            )}

            <button
              id="join-tournament-btn"
              onClick={handleJoinTournament}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-base shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
            >
              <Trophy className="w-5 h-5 text-amber-300" />
              <span>JOIN TOURNAMENT (₹10 DEMO)</span>
            </button>
          </div>

          {/* Roster & Pool Preview */}
          <div className="bg-gray-950/90 border border-gray-800 rounded-3xl p-5 text-xs font-mono">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-800">
              <span className="text-gray-400 uppercase font-bold flex items-center gap-1.5">
                <Users className="w-4 h-4 text-gray-500" />
                8/8 PLAYERS READY
              </span>
              <span className="text-emerald-400 font-bold">LOBBY FULL</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center bg-red-950/40 border border-red-500/40 p-2 rounded-xl text-red-300">
                <span className="font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  1. You (Seed 1)
                </span>
                <span className="text-gray-400">Rating 1360</span>
              </div>
              <div className="flex justify-between items-center bg-gray-900/60 p-2 rounded-xl text-gray-300">
                <span>2. Alex Morgan</span>
                <span className="text-gray-500">Rating 1345</span>
              </div>
              <div className="flex justify-between items-center bg-gray-900/60 p-2 rounded-xl text-gray-300">
                <span>3. Ryan Lee</span>
                <span className="text-gray-500">Rating 1380</span>
              </div>
              <div className="flex justify-between items-center bg-gray-900/60 p-2 rounded-xl text-gray-300">
                <span>4. Chris Walker</span>
                <span className="text-gray-500">Rating 1320</span>
              </div>
              <div className="flex justify-between items-center bg-gray-900/60 p-2 rounded-xl text-gray-300">
                <span>5. Sam Patel</span>
                <span className="text-gray-500">Rating 1395</span>
              </div>
              <div className="flex justify-between items-center bg-gray-900/60 p-2 rounded-xl text-gray-300">
                <span>6. Jordan Smith</span>
                <span className="text-gray-500">Rating 1355</span>
              </div>
              <div className="flex justify-between items-center bg-gray-900/60 p-2 rounded-xl text-gray-300">
                <span>7. Mike Ross</span>
                <span className="text-gray-500">Rating 1410</span>
              </div>
              <div className="flex justify-between items-center bg-gray-900/60 p-2 rounded-xl text-gray-300">
                <span>8. David Chen</span>
                <span className="text-gray-500">Rating 1330</span>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 pt-4 border-t border-gray-800 flex items-start gap-2.5 text-xs text-gray-400">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            Prototype Simulation: All tournament rewards and entry stakes are virtual demo credits. No actual monetary payout or deposit is supported.
          </span>
        </div>
      </div>
    </div>
  );
};

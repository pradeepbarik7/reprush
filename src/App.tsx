/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ScreenType, 
  Player, 
  BattleResultData, 
  UserProfile, 
  LeaderboardUser, 
  LegalDocType 
} from './types';
import { INITIAL_USER, INITIAL_OPPONENT, INITIAL_PROFILE } from './data/mockData';
import { Navbar } from './components/Navbar';
import { LandingView } from './components/LandingView';
import { MatchmakingView } from './components/MatchmakingView';
import { PreMatchView } from './components/PreMatchView';
import { LiveBattleView } from './components/LiveBattleView';
import { ResultView } from './components/ResultView';
import { ProfileView } from './components/ProfileView';
import { LeaderboardView } from './components/LeaderboardView';
import { WalletView } from './components/WalletView';
import { NoMercyTournamentView } from './components/NoMercyTournamentView';
import { StakeSelectorModal } from './components/StakeSelectorModal';
import { LegalPagesModal } from './components/LegalPagesModal';
import { Footer } from './components/Footer';
import { StakeRule, DEFAULT_STAKE, getBattlePrizeCalculation } from './config/stakesConfig';
import { 
  getDemoBalance, 
  addDemoCredits, 
  refundDemoEntry,
  deductDemoEntry 
} from './services/demoWalletService';
import { 
  getSavedTournamentBracket, 
  saveBracket, 
  simulateOtherMatches 
} from './services/tournamentService';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [currentUser, setCurrentUser] = useState<Player>(INITIAL_USER);
  const [currentOpponent, setCurrentOpponent] = useState<Player>(INITIAL_OPPONENT);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [lastBattleResult, setLastBattleResult] = useState<BattleResultData | null>(null);

  // Simulated stakes state
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);
  const [currentStakeRule, setCurrentStakeRule] = useState<StakeRule>(DEFAULT_STAKE);
  const [pendingCustomOpponent, setPendingCustomOpponent] = useState<Player | null>(null);

  // Tournament context
  const [isTournamentMatch, setIsTournamentMatch] = useState(false);
  const [tournamentRoundName, setTournamentRoundName] = useState<'Quarterfinal' | 'Semifinal' | 'Final' | null>(null);

  // Legal modal state
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [activeLegalDoc, setActiveLegalDoc] = useState<LegalDocType>('terms');

  // Trigger 1v1 battle flow with stake selector
  const handleStartBattle = (customOpponent?: Player) => {
    setIsTournamentMatch(false);
    setTournamentRoundName(null);
    if (customOpponent) {
      setPendingCustomOpponent(customOpponent);
    } else {
      setPendingCustomOpponent(null);
    }
    setIsStakeModalOpen(true);
  };

  // Called when user selects & confirms demo stake in StakeSelectorModal
  const handleConfirmStake = (stakeRule: StakeRule) => {
    setCurrentStakeRule(stakeRule);
    setIsStakeModalOpen(false);

    if (pendingCustomOpponent) {
      setCurrentOpponent(pendingCustomOpponent);
    } else {
      setCurrentOpponent(INITIAL_OPPONENT);
    }

    setCurrentScreen('matchmaking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Matchmaking found opponent -> Pre-Match VS screen
  const handleOpponentFound = (opponent: Player) => {
    setCurrentOpponent(opponent);
    setCurrentScreen('pre-match');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // User confirmed Ready in Pre-Match -> Live Battle
  const handleReadyForBattle = () => {
    setCurrentScreen('live-battle');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Start a tournament match round
  const handleStartTournamentMatch = (
    opponent: Player, 
    roundName: 'Quarterfinal' | 'Semifinal' | 'Final'
  ) => {
    setIsTournamentMatch(true);
    setTournamentRoundName(roundName);
    setCurrentOpponent(opponent);
    setCurrentScreen('pre-match');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Live Battle Ended
  const handleBattleEnd = (userReps: number, opponentReps: number, maxCombo: number) => {
    const isWinner = userReps > opponentReps;
    const isDraw = userReps === opponentReps;
    const winnerType = isWinner ? 'user' : isDraw ? 'draw' : 'opponent';

    const ratingDelta = isWinner ? +18 : isDraw ? 0 : -14;
    const prevRating = currentUser.rating;
    const newRating = Math.max(1000, prevRating + ratingDelta);

    const stakeAmount = isTournamentMatch ? 10 : currentStakeRule.entry;
    const calculation = getBattlePrizeCalculation(stakeAmount);
    const prevBalance = getDemoBalance();
    let winnerReward = 0;
    let netResult = -stakeAmount;
    let newBalance = prevBalance;

    if (!isTournamentMatch) {
      if (isWinner) {
        winnerReward = calculation.winnerReward;
        netResult = winnerReward - stakeAmount;
        newBalance = addDemoCredits(
          winnerReward, 
          `1v1 Battle Victory (${currentStakeRule.label} Demo)`, 
          'battle_reward'
        );
      } else if (isDraw) {
        winnerReward = stakeAmount;
        netResult = 0;
        newBalance = refundDemoEntry(
          stakeAmount, 
          `1v1 Battle Tie Refund (${currentStakeRule.label} Demo)`
        );
      } else {
        winnerReward = 0;
        netResult = -stakeAmount;
        newBalance = prevBalance;
      }
    } else {
      // Tournament match resolution
      const bracket = getSavedTournamentBracket();
      if (bracket && tournamentRoundName) {
        const roundIndex = tournamentRoundName === 'Quarterfinal' ? 0 : tournamentRoundName === 'Semifinal' ? 1 : 2;
        const currentRound = bracket.rounds[roundIndex];
        const userMatch = currentRound?.matches.find((m) => m.isUserMatch);

        if (userMatch) {
          userMatch.p1Score = userReps;
          userMatch.p2Score = opponentReps;
          userMatch.status = 'completed';
          userMatch.winnerId = isWinner ? userMatch.player1.id : userMatch.player2.id;

          if (isWinner) {
            if (tournamentRoundName === 'Final') {
              bracket.status = 'champion';
              bracket.userChampion = true;
              winnerReward = 50; // ₹50 No Mercy champion reward
              netResult = +40;
              newBalance = addDemoCredits(50, 'No Mercy Tournament Champion (Demo)', 'tournament_reward');
            } else {
              // Advance to next round index
              bracket.currentRoundIndex = roundIndex + 1;
              const nextRound = bracket.rounds[roundIndex + 1];
              if (nextRound) {
                const nextUserMatch = nextRound.matches.find((m) => m.isUserMatch);
                if (nextUserMatch) {
                  nextUserMatch.player1 = currentUser;
                }
              }
            }
          } else {
            bracket.status = 'eliminated';
            bracket.userEliminated = true;
            winnerReward = 0;
            netResult = -10;
          }
          saveBracket(bracket);
        }
      }
    }

    const resultData: BattleResultData = {
      userReps,
      opponentReps,
      winner: winnerType,
      ratingDelta,
      newRating,
      previousRating: prevRating,
      isPersonalBest: userReps >= 57,
      maxCombo,
      opponent: currentOpponent,
      stakeAmount,
      winnerReward,
      platformFee: calculation.platformFee,
      netResult,
      prevBalance,
      newBalance,
      isTournamentMatch,
      tournamentRound: tournamentRoundName || undefined,
    };

    setLastBattleResult(resultData);

    // Update user state
    setCurrentUser((prev) => ({
      ...prev,
      rating: newRating,
    }));

    // Update profile stats
    setUserProfile((prev) => {
      const newWins = isWinner ? prev.wins + 1 : prev.wins;
      const newLosses = !isWinner && !isDraw ? prev.losses + 1 : prev.losses;
      const newTotal = newWins + newLosses;
      const newWinRate = Number(((newWins / Math.max(1, newTotal)) * 100).toFixed(1));
      const addedWinnings = isWinner ? Math.round(winnerReward) : 0;

      return {
        ...prev,
        rating: newRating,
        previousRating: prevRating,
        wins: newWins,
        losses: newLosses,
        winRate: newWinRate,
        totalReps: prev.totalReps + userReps,
        demoBattles: (prev.demoBattles || 18) + 1,
        demoWinnings: (prev.demoWinnings || 125) + addedWinnings,
        noMercyTitles: (prev.noMercyTitles || 1) + (isTournamentMatch && isWinner && tournamentRoundName === 'Final' ? 1 : 0),
        recentBattles: [
          {
            id: `b-${Date.now()}`,
            opponentName: currentOpponent.name,
            opponentUsername: currentOpponent.username,
            userScore: userReps,
            opponentScore: opponentReps,
            result: isWinner ? 'win' : isDraw ? 'draw' : 'loss',
            date: 'Just now',
            ratingDelta,
            stake: stakeAmount,
            reward: winnerReward,
          },
          ...prev.recentBattles.slice(0, 3),
        ],
      };
    });

    setCurrentScreen('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Rematch action
  const handleRematch = () => {
    // Deduct stake again for rematch
    const res = deductDemoEntry(
      currentStakeRule.entry,
      `1v1 Battle Rematch (${currentStakeRule.label} Demo)`,
      'battle_entry'
    );
    if (!res.success) {
      setIsStakeModalOpen(true);
      return;
    }
    setCurrentScreen('pre-match');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Direct challenge from leaderboard
  const handleChallengePlayer = (player: LeaderboardUser) => {
    const opp: Player = {
      id: `opp-${player.username}`,
      name: player.name,
      username: player.username,
      rating: player.rating,
      division: (player.division as 'Gold' | 'Diamond' | 'Platinum' | 'Silver') || 'Gold',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      color: 'blue',
    };
    handleStartBattle(opp);
  };

  const handleOpenLegal = (doc: LegalDocType) => {
    setActiveLegalDoc(doc);
    setIsLegalModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111827] flex flex-col selection:bg-red-500 selection:text-white">
      {/* Universal Navigation Header */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={(screen) => {
          setCurrentScreen(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onStartBattle={() => handleStartBattle()}
        userRating={currentUser.rating}
      />

      {/* Main View Switcher */}
      <main className="flex-1">
        {currentScreen === 'home' && (
          <LandingView
            onStartBattle={() => handleStartBattle()}
            onEnterTournament={() => {
              setCurrentScreen('no-mercy');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onExploreLeaderboard={() => {
              setCurrentScreen('leaderboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentScreen === 'matchmaking' && (
          <MatchmakingView
            opponent={currentOpponent}
            onOpponentFound={handleOpponentFound}
            onCancel={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'pre-match' && (
          <PreMatchView
            user={currentUser}
            opponent={currentOpponent}
            onStartBattle={handleReadyForBattle}
          />
        )}

        {currentScreen === 'live-battle' && (
          <LiveBattleView
            user={currentUser}
            opponent={currentOpponent}
            onBattleEnd={handleBattleEnd}
          />
        )}

        {currentScreen === 'result' && lastBattleResult && (
          <ResultView
            result={lastBattleResult}
            onRematch={handleRematch}
            onNewBattle={() => handleStartBattle()}
            onViewProfile={() => {
              setCurrentScreen('profile');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentScreen === 'profile' && (
          <ProfileView
            profile={userProfile}
            onStartBattle={() => handleStartBattle()}
            onEnterTournament={() => {
              setCurrentScreen('no-mercy');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentScreen === 'leaderboard' && (
          <LeaderboardView
            currentUserRating={currentUser.rating}
            onChallengePlayer={handleChallengePlayer}
          />
        )}

        {currentScreen === 'wallet' && (
          <WalletView
            onStartBattle={() => handleStartBattle()}
            onEnterTournament={() => {
              setCurrentScreen('no-mercy');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentScreen === 'no-mercy' && (
          <NoMercyTournamentView
            currentUser={currentUser}
            onStartTournamentMatch={handleStartTournamentMatch}
            onNavigateHome={() => {
              setCurrentScreen('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateProfile={() => {
              setCurrentScreen('profile');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Stake Selection Modal for 1v1 Battle Entry */}
      <StakeSelectorModal
        isOpen={isStakeModalOpen}
        onClose={() => setIsStakeModalOpen(false)}
        onConfirmEntry={handleConfirmStake}
      />

      {/* Legal & Compliance Modal */}
      <LegalPagesModal
        isOpen={isLegalModalOpen}
        docType={activeLegalDoc}
        onClose={() => setIsLegalModalOpen(false)}
        onSelectDoc={(doc) => setActiveLegalDoc(doc)}
      />

      {/* Universal Footer with Brand and Compliance Attribution */}
      <Footer onOpenLegal={handleOpenLegal} />
    </div>
  );
}

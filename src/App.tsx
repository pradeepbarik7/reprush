/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScreenType, Player, BattleResultData, UserProfile, LeaderboardUser } from './types';
import { INITIAL_USER, INITIAL_OPPONENT, INITIAL_PROFILE } from './data/mockData';
import { Navbar } from './components/Navbar';
import { LandingView } from './components/LandingView';
import { MatchmakingView } from './components/MatchmakingView';
import { PreMatchView } from './components/PreMatchView';
import { LiveBattleView } from './components/LiveBattleView';
import { ResultView } from './components/ResultView';
import { ProfileView } from './components/ProfileView';
import { LeaderboardView } from './components/LeaderboardView';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [currentUser, setCurrentUser] = useState<Player>(INITIAL_USER);
  const [currentOpponent, setCurrentOpponent] = useState<Player>(INITIAL_OPPONENT);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [lastBattleResult, setLastBattleResult] = useState<BattleResultData | null>(null);

  // Start matchmaking flow
  const handleStartBattle = (customOpponent?: Player) => {
    if (customOpponent) {
      setCurrentOpponent(customOpponent);
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

  // Live Battle Ended
  const handleBattleEnd = (userReps: number, opponentReps: number, maxCombo: number) => {
    const isWinner = userReps >= opponentReps;
    const ratingDelta = isWinner ? +18 : -14;
    const prevRating = currentUser.rating;
    const newRating = Math.max(1000, prevRating + ratingDelta);

    const resultData: BattleResultData = {
      userReps,
      opponentReps,
      winner: isWinner ? 'user' : 'opponent',
      ratingDelta,
      newRating,
      previousRating: prevRating,
      isPersonalBest: userReps >= 57,
      maxCombo,
      opponent: currentOpponent,
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
      const newLosses = !isWinner ? prev.losses + 1 : prev.losses;
      const newTotal = newWins + newLosses;
      const newWinRate = Number(((newWins / newTotal) * 100).toFixed(1));

      return {
        ...prev,
        rating: newRating,
        previousRating: prevRating,
        wins: newWins,
        losses: newLosses,
        winRate: newWinRate,
        totalReps: prev.totalReps + userReps,
        recentBattles: [
          {
            id: `b-${Date.now()}`,
            opponentName: currentOpponent.name,
            opponentUsername: currentOpponent.username,
            userScore: userReps,
            opponentScore: opponentReps,
            result: isWinner ? 'win' : 'loss',
            date: 'Just now',
            ratingDelta,
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
          />
        )}

        {currentScreen === 'leaderboard' && (
          <LeaderboardView
            currentUserRating={currentUser.rating}
            onChallengePlayer={handleChallengePlayer}
          />
        )}
      </main>

      {/* Subtle Apple-style clean footer */}
      <footer className="w-full py-8 border-t border-gray-200/80 bg-white/70 backdrop-blur-sm text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-gray-950">Rep Rush</span>
            <span className="text-gray-400">•</span>
            <span className="font-medium text-gray-600">Fitness. Competition. Glory.</span>
          </div>

          <div className="flex items-center gap-4 text-gray-400">
            <span>Turn every rep into a battle</span>
            <span>•</span>
            <span className="text-gray-500 font-semibold">1v1 Push-Up Arena</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

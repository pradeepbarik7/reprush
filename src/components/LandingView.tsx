import React from 'react';
import { Swords, Zap, Eye, Trophy, ArrowRight, Play, Flame, Users, Sparkles } from 'lucide-react';
import { playClickSound } from '../utils/audio';
import { RepRushLogo } from './RepRushLogo';

interface LandingViewProps {
  onStartBattle: () => void;
  onEnterTournament: () => void;
  onExploreLeaderboard: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onStartBattle,
  onEnterTournament,
  onExploreLeaderboard,
}) => {
  const scrollToHowItWorks = () => {
    playClickSound();
    const el = document.getElementById('how-it-works-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full pb-20 select-none">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-10 sm:pb-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-5">
          {/* Brand Icon Emblem */}
          <div className="flex flex-col items-center gap-3.5">
            <div className="relative group">
              <RepRushLogo className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-md hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50/80 border border-red-200/60 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-red-700">
                1v1 Fitness Battles
              </span>
            </div>
          </div>

          {/* Large Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-950 leading-[1.08]">
            Turn every rep into a battle.
          </h1>

          {/* Supporting Text */}
          <p className="text-lg sm:text-xl text-gray-600 font-medium max-w-xl mx-auto">
            Challenge someone. Move. Compete. Win.
          </p>

          {/* CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              id="hero-start-battle-btn"
              onClick={() => {
                playClickSound();
                onStartBattle();
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gray-950 text-white font-bold text-base shadow-md hover:bg-gray-800 hover:shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-3 cursor-pointer group"
            >
              <Swords className="w-5 h-5 text-red-400 group-hover:rotate-12 transition-transform" />
              <span>Start a Battle</span>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="hero-how-it-works-btn"
              onClick={scrollToHowItWorks}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white text-gray-800 font-semibold text-base border border-gray-200 shadow-xs hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 text-gray-500" />
              <span>See How It Works</span>
            </button>
          </div>
        </div>
      </section>

      {/* TWO MAJOR GAME CARDS (1V1 BATTLE & NO MERCY TOURNAMENT) */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CARD 1: 1V1 BATTLE */}
          <div className="bg-white rounded-3xl p-7 sm:p-8 border border-gray-200/90 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-44 h-44 bg-red-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-red-500/10 transition-colors" />
            
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-red-50 border border-red-200/60 text-red-700 text-xs font-mono font-bold uppercase tracking-wider">
                Ranked Head-to-Head
              </span>
              <span className="text-xs font-mono font-bold text-gray-400">
                ₹1 – ₹10 Demo Stakes
              </span>
            </div>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-xs">
                <Swords className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-gray-950 tracking-tight">
                  1V1 BATTLE
                </h3>
                <p className="text-sm text-gray-600 font-medium">
                  Challenge one opponent.
                </p>
              </div>
            </div>

            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed my-5">
              Live synchronous 2-minute push-up duel with real-time pose camera tracking. Every valid rep expands your territory bar.
            </p>

            <button
              id="card-play-1v1-btn"
              onClick={() => {
                playClickSound();
                onStartBattle();
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gray-950 hover:bg-gray-800 text-white font-extrabold text-sm tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 shadow-sm"
            >
              <span>PLAY</span>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* CARD 2: NO MERCY */}
          <div className="bg-[#0F172A] rounded-3xl p-7 sm:p-8 border border-gray-800 text-white shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/15 transition-colors" />

            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Tournament
              </span>
              <span className="text-xs font-mono font-bold text-amber-400">
                ₹70 Demo Pool
              </span>
            </div>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-gray-950 flex items-center justify-center shadow-xs">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-white tracking-tight">
                  NO MERCY
                </h3>
                <p className="text-sm text-amber-300 font-medium">
                  Survive the bracket.
                </p>
              </div>
            </div>

            <div className="my-5 flex items-center gap-4 text-xs font-mono text-gray-300">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-gray-400" />
                8 players
              </span>
              <span className="text-gray-500">•</span>
              <span>Single elimination</span>
              <span className="text-gray-500">•</span>
              <span className="text-emerald-400 font-bold">₹50 Winner</span>
            </div>

            <button
              id="card-enter-tournament-btn"
              onClick={() => {
                playClickSound();
                onEnterTournament();
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-sm tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 shadow-md"
            >
              <span>ENTER TOURNAMENT</span>
              <ArrowRight className="w-4 h-4 text-red-200 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: REAL-TIME */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-5 border border-red-100">
              <Zap className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h3 className="text-xl font-bold text-gray-950 mb-2">
              REAL-TIME
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Compete head-to-head. Watch the signature territory bar expand with every push-up rep in high-stakes synchronous battles.
            </p>
          </div>

          {/* Card 2: AI VERIFIED */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 border border-emerald-100">
              <Eye className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h3 className="text-xl font-bold text-gray-950 mb-2">
              AI VERIFIED
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your reps are counted through local movement detection. Chest depth and full elbow lockouts ensure only legitimate reps score.
            </p>
          </div>

          {/* Card 3: RANKED */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 border border-blue-100">
              <Trophy className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h3 className="text-xl font-bold text-gray-950 mb-2">
              RANKED
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Every battle contributes to your competitive rating. Climb from Silver to Gold and Diamond on the global and friend leaderboards.
            </p>
          </div>
        </div>
      </section>

      {/* How Rep Rush Works Section */}
      <section
        id="how-it-works-section"
        className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 font-mono">
            SIMPLE. COMPETITIVE. ADDICTIVE.
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950">
            How Rep Rush Works
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Three simple steps to test your endurance against athletes worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-xs relative">
            <span className="text-3xl font-extrabold font-mono text-red-500/80 block mb-3">
              01
            </span>
            <h4 className="text-lg font-bold text-gray-900 mb-2">
              Find an opponent
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Choose your demo stake (₹1 - ₹10) and queue into matchmaking. Get paired with an evenly matched competitor in seconds.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-xs relative">
            <span className="text-3xl font-extrabold font-mono text-gray-900 block mb-3">
              02
            </span>
            <h4 className="text-lg font-bold text-gray-900 mb-2">
              Start moving
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Set up your camera sideways and drop down. When the countdown strikes GO, complete strict push-ups with full elbow extension.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-xs relative">
            <span className="text-3xl font-extrabold font-mono text-blue-500/80 block mb-3">
              03
            </span>
            <h4 className="text-lg font-bold text-gray-900 mb-2">
              Capture the bar
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Every rep steals territory from your opponent. Out-rep them to win simulated demo rewards and climb the global ladder.
            </p>
          </div>
        </div>
      </section>

      {/* Ready to battle CTA Section */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-gradient-to-b from-gray-950 to-gray-900 rounded-3xl p-8 sm:p-12 text-center text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-48 h-48 bg-red-600/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-600/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to battle?
            </h3>
            <p className="text-gray-300 text-sm sm:text-base">
              Test your stamina against real athletes in the RepRush push-up arena.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                id="cta-start-first-battle"
                onClick={() => {
                  playClickSound();
                  onStartBattle();
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-gray-950 font-extrabold text-base shadow-lg hover:bg-gray-100 transition-all duration-200 active:scale-95 cursor-pointer inline-flex items-center justify-center gap-3"
              >
                <Swords className="w-5 h-5 text-red-600" />
                <span>1v1 Push-Up Battle</span>
              </button>
              <button
                id="cta-enter-tournament-bottom"
                onClick={() => {
                  playClickSound();
                  onEnterTournament();
                }}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gray-900 border border-amber-500/50 text-amber-300 font-extrabold text-base shadow-lg hover:bg-gray-800 transition-all duration-200 active:scale-95 cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <Flame className="w-5 h-5 text-amber-400" />
                <span>Enter No Mercy (₹10 Demo)</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

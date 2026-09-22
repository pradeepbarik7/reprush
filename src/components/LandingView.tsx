import React from 'react';
import { Swords, Zap, Eye, Trophy, ArrowRight, ShieldCheck, Play } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface LandingViewProps {
  onStartBattle: () => void;
  onExploreLeaderboard: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onStartBattle,
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
    <div className="w-full pb-20">
      {/* Hero Section */}
      <section className="relative pt-16 sm:pt-24 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50/80 border border-red-200/60 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-red-700">
              1v1 Fitness Battles
            </span>
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
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
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

      {/* Feature Cards Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
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
              Your reps are designed to be counted through movement detection. Chest-to-floor depth and full elbow lockouts ensure only legitimate reps score.
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
        className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
            SIMPLE. COMPETITIVE. ADDICTIVE.
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950">
            How Rep Rush Works
          </h2>
          <p className="text-gray-600">
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
              Queue into instant matchmaking. Get matched with an evenly ranked competitor in your division in under 2 seconds.
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
              Set up your camera and drop down. When the 3-2-1 countdown strikes GO, complete strict push-ups at maximum speed.
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
              Every rep physically steals territory from your opponent. Out-rep them before the 30-second timer expires to claim the victory.
            </p>
          </div>
        </div>
      </section>

      {/* Ready to battle CTA Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-gradient-to-b from-gray-950 to-gray-900 rounded-3xl p-8 sm:p-12 text-center text-white shadow-xl relative overflow-hidden">
          {/* Subtle red & blue corner accents */}
          <div className="absolute top-0 left-0 w-48 h-48 bg-red-600/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-600/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to battle?
            </h3>
            <p className="text-gray-300 text-sm sm:text-base">
              Test your stamina against Alex Morgan in the Gold Division push-up arena.
            </p>
            <div className="pt-2">
              <button
                id="cta-start-first-battle"
                onClick={() => {
                  playClickSound();
                  onStartBattle();
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-gray-950 font-extrabold text-base shadow-lg hover:bg-gray-100 transition-all duration-200 active:scale-95 cursor-pointer inline-flex items-center justify-center gap-3"
              >
                <Swords className="w-5 h-5 text-red-600" />
                <span>Start Your First Battle</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

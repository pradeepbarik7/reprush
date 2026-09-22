import React, { useState, useEffect } from 'react';
import { Player } from '../types';
import { playClickSound, playCountdownBeep } from '../utils/audio';
import { Shield, Check, Flame, Clock, Swords } from 'lucide-react';

interface PreMatchViewProps {
  user: Player;
  opponent: Player;
  onStartBattle: () => void;
}

export const PreMatchView: React.FC<PreMatchViewProps> = ({
  user,
  opponent,
  onStartBattle,
}) => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [countdownText, setCountdownText] = useState<string>('3');

  const handleReadyClick = () => {
    playClickSound();
    setCountdown(3);
    setCountdownText('3');
    playCountdownBeep(false);
  };

  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 1) {
      const timer = setTimeout(() => {
        const nextVal = countdown - 1;
        setCountdown(nextVal);
        setCountdownText(nextVal.toString());
        playCountdownBeep(false);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 1) {
      const timer = setTimeout(() => {
        setCountdown(0);
        setCountdownText('GO!');
        playCountdownBeep(true);

        const battleTimer = setTimeout(() => {
          onStartBattle();
        }, 700);
        return () => clearTimeout(battleTimer);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, onStartBattle]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8 max-w-4xl mx-auto">
      {/* Countdown Fullscreen Overlay if active */}
      {countdown !== null && (
        <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center select-none">
          <div className="text-center space-y-4">
            <span className="text-xs uppercase tracking-widest font-extrabold text-red-600 block">
              Match Commencing
            </span>
            <div
              key={countdownText}
              className="text-8xl sm:text-9xl font-extrabold font-mono text-gray-950 transition-all scale-110 animate-pulse tracking-tight"
            >
              {countdownText}
            </div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              Get down in push-up position
            </p>
          </div>
        </div>
      )}

      {/* Main VS Container */}
      <div className="w-full bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/90 shadow-xl relative overflow-hidden">
        {/* Top Header Tag */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Swords className="w-3.5 h-3.5 text-gray-900" />
            Ranked Push-Up Clash
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
            1v1 Battle Confirmation
          </h2>
        </div>

        {/* Players VS Grid */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-10">
          {/* Center VS Circle */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gray-950 text-white font-extrabold text-lg flex items-center justify-center shadow-xl border-4 border-white tracking-wider">
              VS
            </div>
          </div>

          {/* Left: YOU (Red) */}
          <div className="bg-red-50/50 rounded-2xl p-6 border-2 border-red-200 text-center relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-red-600 text-white font-bold text-[10px] uppercase tracking-wider">
              RED CORNER
            </div>

            <div className="pt-6 pb-4">
              <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden shadow-md border-2 border-red-500 mb-4 bg-red-600 flex items-center justify-center text-white font-extrabold text-3xl">
                YOU
              </div>
              <h3 className="text-xl font-extrabold text-gray-950">
                {user.name} (YOU)
              </h3>
              <p className="text-xs font-semibold text-gray-500 mb-3">
                {user.username}
              </p>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white border border-red-100 shadow-2xs">
                <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  {user.division}
                </span>
                <span className="text-sm font-mono font-extrabold text-red-600">
                  {user.rating} Rating
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-red-100 flex items-center justify-around text-xs text-gray-600">
              <span>Avg Pace: <strong>26/min</strong></span>
              <span>Win Rate: <strong>63.6%</strong></span>
            </div>
          </div>

          {/* Mobile VS divider */}
          <div className="md:hidden text-center my-[-10px] z-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-gray-950 text-white font-extrabold text-xs">
              VS
            </span>
          </div>

          {/* Right: ALEX MORGAN (Blue) */}
          <div className="bg-blue-50/50 rounded-2xl p-6 border-2 border-blue-200 text-center relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-bold text-[10px] uppercase tracking-wider">
              BLUE CORNER
            </div>

            <div className="pt-6 pb-4">
              <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden shadow-md border-2 border-blue-500 mb-4 bg-blue-600 flex items-center justify-center text-white font-extrabold text-3xl">
                AM
              </div>
              <h3 className="text-xl font-extrabold text-gray-950">
                {opponent.name}
              </h3>
              <p className="text-xs font-semibold text-gray-500 mb-3">
                {opponent.username}
              </p>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white border border-blue-100 shadow-2xs">
                <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  {opponent.division}
                </span>
                <span className="text-sm font-mono font-extrabold text-blue-600">
                  {opponent.rating} Rating
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-blue-100 flex items-center justify-around text-xs text-gray-600">
              <span>Avg Pace: <strong>24/min</strong></span>
              <span>Win Rate: <strong>61.2%</strong></span>
            </div>
          </div>
        </div>

        {/* Rules & Battle specs */}
        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200/80 mb-8">
          <div className="text-center font-extrabold text-sm text-gray-900 tracking-wider uppercase mb-3">
            PUSH-UP BATTLE RULES
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="bg-white p-3 rounded-xl border border-gray-200/60 shadow-2xs flex flex-col items-center justify-center">
              <Clock className="w-4 h-4 text-gray-700 mb-1" />
              <span className="font-extrabold text-sm text-gray-950">30 SECONDS</span>
              <span className="text-[11px] text-gray-500">Fast-Paced Sprint Clash</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-gray-200/60 shadow-2xs flex flex-col items-center justify-center">
              <Check className="w-4 h-4 text-emerald-600 mb-1" />
              <span className="font-extrabold text-sm text-gray-950">VALID REPS ONLY</span>
              <span className="text-[11px] text-gray-500">Chest to floor & lockout</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-gray-200/60 shadow-2xs flex flex-col items-center justify-center">
              <Flame className="w-4 h-4 text-red-500 mb-1" />
              <span className="font-extrabold text-sm text-gray-950">1V1 TERRITORY</span>
              <span className="text-[11px] text-gray-500">Steal the bar with each rep</span>
            </div>
          </div>
        </div>

        {/* Ready Action Button */}
        <div className="text-center">
          <button
            id="pre-match-ready-btn"
            onClick={handleReadyClick}
            disabled={countdown !== null}
            className="w-full sm:w-80 py-4 px-8 rounded-2xl bg-gray-950 text-white font-extrabold text-lg shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all duration-200 active:scale-95 cursor-pointer inline-flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <Check className="w-6 h-6 text-emerald-400 stroke-[3]" />
            <span>READY TO BATTLE</span>
          </button>
          <p className="text-xs text-gray-400 font-medium mt-3">
            Pressing Ready initiates a 3-second countdown
          </p>
        </div>
      </div>
    </div>
  );
};

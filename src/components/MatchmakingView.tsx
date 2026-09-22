import React, { useEffect, useState } from 'react';
import { Player } from '../types';
import { playClickSound } from '../utils/audio';
import { X, Search, Shield, Zap } from 'lucide-react';

interface MatchmakingViewProps {
  onOpponentFound: (opponent: Player) => void;
  onCancel: () => void;
  opponent: Player;
}

export const MatchmakingView: React.FC<MatchmakingViewProps> = ({
  onOpponentFound,
  onCancel,
  opponent,
}) => {
  const [statusText, setStatusText] = useState('Searching in Gold Division...');
  const [found, setFound] = useState(false);
  const [searchTime, setSearchTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSearchTime((prev) => prev + 1);
    }, 1000);

    // After 1.7 seconds, trigger opponent found
    const timeout = setTimeout(() => {
      setStatusText('Opponent found!');
      setFound(true);

      // Brief transition delay to show the found card
      const nextTimeout = setTimeout(() => {
        onOpponentFound(opponent);
      }, 900);

      return () => clearTimeout(nextTimeout);
    }, 1800);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, [onOpponentFound, opponent]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-gray-200/90 shadow-xl text-center relative overflow-hidden">
        {/* Subtle top indicator */}
        <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-6">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            1v1 Ranked Matchmaking
          </span>
          <span className="font-mono">00:0{searchTime}</span>
        </div>

        {/* Animated Radar Pulse Searching Indicator */}
        <div className="relative w-36 h-36 mx-auto mb-8 flex items-center justify-center">
          {/* Concentric expanding ripples */}
          <div className="absolute inset-0 rounded-full border-2 border-red-500/20 animate-ping opacity-60 pointer-events-none" />
          <div className="absolute -inset-4 rounded-full border border-blue-500/20 animate-pulse pointer-events-none" />
          <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-red-50 to-blue-50 flex items-center justify-center border border-gray-100" />

          {/* Center avatar or search icon */}
          {!found ? (
            <div className="relative z-10 w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center border border-gray-200">
              <Search className="w-8 h-8 text-gray-700 animate-spin" style={{ animationDuration: '4s' }} />
            </div>
          ) : (
            <div className="relative z-10 w-20 h-20 rounded-full overflow-hidden shadow-lg border-2 border-emerald-500 transition-all scale-105">
              <img
                src={opponent.avatar}
                alt={opponent.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback avatar if unsplash image is restricted
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white font-extrabold text-xl">
                AM
              </div>
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-extrabold text-gray-950 mb-1 tracking-tight">
          {found ? 'Opponent Found' : 'Finding your opponent'}
        </h2>

        {/* Status subtext */}
        <p className="text-sm text-gray-500 font-medium mb-6">
          {statusText}
        </p>

        {/* Opponent Card Preview when found */}
        {found && (
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/80 mb-6 flex items-center justify-between text-left transition-all animate-float-rep">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                AM
              </div>
              <div>
                <h4 className="font-extrabold text-gray-900 text-sm">{opponent.name}</h4>
                <p className="text-xs text-gray-500">{opponent.username}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 mb-0.5">
                <Shield className="w-3 h-3 text-amber-600" />
                {opponent.division}
              </span>
              <div className="text-xs font-mono font-bold text-gray-700">
                {opponent.rating} Elo
              </div>
            </div>
          </div>
        )}

        {/* Match specs */}
        <div className="grid grid-cols-2 gap-3 py-3 border-t border-gray-100 text-xs text-gray-500 mb-6">
          <div className="flex items-center justify-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-red-500" />
            <span>Mode: Push-Up 1v1</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-blue-500" />
            <span>Time: 2 Minutes</span>
          </div>
        </div>

        {/* Cancel button */}
        {!found && (
          <button
            id="cancel-matchmaking-btn"
            onClick={() => {
              playClickSound();
              onCancel();
            }}
            className="w-full py-3 px-4 rounded-xl text-xs font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 border border-gray-200/80 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            <span>Cancel Matchmaking</span>
          </button>
        )}
      </div>
    </div>
  );
};

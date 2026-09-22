import React, { useState } from 'react';
import { LeaderboardUser } from '../types';
import { INITIAL_LEADERBOARD } from '../data/mockData';
import { Trophy, Flame, Swords, Shield, Users, Calendar, Globe } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface LeaderboardViewProps {
  onChallengePlayer: (player: LeaderboardUser) => void;
  currentUserRating: number;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  onChallengePlayer,
  currentUserRating,
}) => {
  const [activeTab, setActiveTab] = useState<'global' | 'friends' | 'weekly'>('global');

  // Dynamically update the current user's rating in the list
  const currentList = INITIAL_LEADERBOARD[activeTab].map((u) => {
    if (u.isCurrentUser) {
      return { ...u, rating: currentUserRating };
    }
    return u;
  });

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="w-7 h-7 rounded-xl bg-amber-400 text-amber-950 font-extrabold text-xs flex items-center justify-center shadow-xs">
          1
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="w-7 h-7 rounded-xl bg-slate-300 text-slate-800 font-extrabold text-xs flex items-center justify-center shadow-xs">
          2
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="w-7 h-7 rounded-xl bg-amber-700/80 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
          3
        </span>
      );
    }
    return (
      <span className="w-7 h-7 rounded-xl bg-gray-100 text-gray-500 font-mono font-bold text-xs flex items-center justify-center">
        {rank}
      </span>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12 select-none">
      {/* Title & Description */}
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
          <Trophy className="w-3.5 h-3.5 text-blue-600" />
          Competitive Push-Up Rankings
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
          Global Leaderboard
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          Compete against players worldwide and climb from Gold to Diamond tier.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 p-1.5 rounded-2xl flex items-center gap-1 border border-gray-200/80">
          <button
            id="tab-global"
            onClick={() => {
              playClickSound();
              setActiveTab('global');
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'global'
                ? 'bg-white text-gray-950 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Global</span>
          </button>

          <button
            id="tab-friends"
            onClick={() => {
              playClickSound();
              setActiveTab('friends');
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'friends'
                ? 'bg-white text-gray-950 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Friends</span>
          </button>

          <button
            id="tab-weekly"
            onClick={() => {
              playClickSound();
              setActiveTab('weekly');
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'weekly'
                ? 'bg-white text-gray-950 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Weekly</span>
          </button>
        </div>
      </div>

      {/* Leaderboard Table Card */}
      <div className="bg-white rounded-3xl border border-gray-200/90 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50/80 border-b border-gray-200/70 text-xs font-bold uppercase tracking-wider text-gray-500">
          <div className="col-span-1 text-center">Rank</div>
          <div className="col-span-5">Competitor</div>
          <div className="col-span-2 text-center">Division</div>
          <div className="col-span-2 text-right">Rating</div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-100">
          {currentList.map((user) => {
            const isUser = user.isCurrentUser;
            return (
              <div
                key={user.username}
                className={`grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 px-4 sm:px-6 py-4 items-center transition-colors ${
                  isUser ? 'bg-red-50/40 hover:bg-red-50/60' : 'hover:bg-gray-50/80'
                }`}
              >
                {/* Rank & User Info */}
                <div className="flex sm:col-span-6 items-center gap-3">
                  <div className="shrink-0">{getRankBadge(user.rank)}</div>

                  <div className="w-10 h-10 rounded-xl bg-gray-900 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                    {user.name.slice(0, 2).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-gray-950 truncate">
                        {user.name}
                      </span>
                      {isUser && (
                        <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-red-600 text-white">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 font-medium">
                      {user.username} • {user.wins}W - {user.losses}L
                    </div>
                  </div>
                </div>

                {/* Division Badge */}
                <div className="hidden sm:flex sm:col-span-2 justify-center">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg border ${
                      user.division === 'Diamond'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : user.division === 'Platinum'
                        ? 'bg-slate-100 text-slate-700 border-slate-300'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    <Shield className="w-3 h-3" />
                    {user.division}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex sm:col-span-2 justify-between sm:justify-end items-center">
                  <span className="sm:hidden text-xs text-gray-400 font-semibold">Rating:</span>
                  <div className="text-right">
                    <span className="font-mono text-base font-extrabold text-gray-950">
                      {user.rating}
                    </span>
                    <div className="text-[10px] text-emerald-600 font-bold flex items-center justify-end gap-0.5">
                      <Flame className="w-2.5 h-2.5" />
                      {user.streak} streak
                    </div>
                  </div>
                </div>

                {/* Action: Challenge */}
                <div className="flex sm:col-span-2 justify-end">
                  {!isUser ? (
                    <button
                      id={`challenge-user-${user.username.replace('@', '')}`}
                      onClick={() => {
                        playClickSound();
                        onChallengePlayer(user);
                      }}
                      className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 active:scale-95 text-white text-xs font-bold shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Swords className="w-3.5 h-3.5 text-red-400" />
                      <span>Challenge</span>
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-gray-400 px-3 py-1.5">
                      Current Rank
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

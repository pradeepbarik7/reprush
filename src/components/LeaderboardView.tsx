import React, { useState } from 'react';
import { LeaderboardUser } from '../types';
import { INITIAL_LEADERBOARD } from '../data/mockData';
import { Trophy, Flame, Swords, Shield, Users, Calendar, Globe, Medal, Dumbbell, ShieldCheck } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface LeaderboardViewProps {
  onChallengePlayer: (player: LeaderboardUser) => void;
  currentUserRating: number;
}

type TabType = 'global' | 'friends' | 'weekly' | 'no_mercy';
type SortField = 'rating' | 'wins' | 'reps' | 'titles';

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  onChallengePlayer,
  currentUserRating,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('global');
  const [sortBy, setSortBy] = useState<SortField>('rating');

  // Dynamically update the current user's rating in the list and sort accordingly
  const rawList = (INITIAL_LEADERBOARD[activeTab] || INITIAL_LEADERBOARD.global).map((u) => {
    if (u.isCurrentUser) {
      return { ...u, rating: currentUserRating };
    }
    return u;
  });

  const sortedList = [...rawList].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'wins') return b.wins - a.wins;
    if (sortBy === 'reps') return (b.reps || 0) - (a.reps || 0);
    if (sortBy === 'titles') return (b.noMercyTitles || 0) - (a.noMercyTitles || 0);
    return 0;
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
    <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12 select-none animate-fade-in">
      {/* Title & Description */}
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
          <Trophy className="w-3.5 h-3.5 text-blue-600" />
          Competitive Push-Up Rankings
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
          RepRush Leaderboards
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          Standings are strictly determined by movement performance: Rating, Wins, Total Reps, and No Mercy Tournament Titles.
        </p>
      </div>

      {/* Tabs Filter Bar (GLOBAL, FRIENDS, WEEKLY, NO MERCY) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="bg-gray-100 p-1.5 rounded-2xl flex flex-wrap items-center gap-1 border border-gray-200/80">
          <button
            id="tab-global"
            onClick={() => {
              playClickSound();
              setActiveTab('global');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'global'
                ? 'bg-white text-gray-950 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>GLOBAL</span>
          </button>

          <button
            id="tab-friends"
            onClick={() => {
              playClickSound();
              setActiveTab('friends');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'friends'
                ? 'bg-white text-gray-950 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>FRIENDS</span>
          </button>

          <button
            id="tab-weekly"
            onClick={() => {
              playClickSound();
              setActiveTab('weekly');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'weekly'
                ? 'bg-white text-gray-950 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>WEEKLY</span>
          </button>

          <button
            id="tab-no-mercy"
            onClick={() => {
              playClickSound();
              setActiveTab('no_mercy');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'no_mercy'
                ? 'bg-gray-950 text-amber-400 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-500" />
            <span>NO MERCY</span>
          </button>
        </div>

        {/* Metric Sorting Pill */}
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold bg-white p-1 rounded-xl border border-gray-200">
          <span className="text-gray-400 px-2 uppercase text-[10px]">Rank By:</span>
          {(['rating', 'wins', 'reps', 'titles'] as SortField[]).map((field) => (
            <button
              key={field}
              onClick={() => {
                playClickSound();
                setSortBy(field);
              }}
              className={`px-2.5 py-1 rounded-lg uppercase tracking-wider text-[11px] transition-all cursor-pointer ${
                sortBy === field
                  ? 'bg-gray-900 text-white shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {field === 'titles' ? 'TITLES' : field}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Table Card */}
      <div className="bg-white rounded-3xl border border-gray-200/90 shadow-sm overflow-hidden mb-4">
        {/* Table Header */}
        <div className="hidden sm:grid grid-cols-12 gap-3 px-6 py-4 bg-gray-50/80 border-b border-gray-200/70 text-xs font-mono font-bold uppercase tracking-wider text-gray-500">
          <div className="col-span-1 text-center">Rank</div>
          <div className="col-span-4">Competitor</div>
          <div className="col-span-2 text-center">Division</div>
          <div className="col-span-1 text-center">Wins</div>
          <div className="col-span-1 text-center">Reps</div>
          <div className="col-span-1 text-center">Titles</div>
          <div className="col-span-2 text-right">Rating</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-100">
          {sortedList.map((user, idx) => {
            const isUser = user.isCurrentUser;
            const rank = idx + 1;
            return (
              <div
                key={user.username}
                className={`grid grid-cols-1 sm:grid-cols-12 gap-3 px-4 sm:px-6 py-3.5 items-center transition-colors ${
                  isUser ? 'bg-red-50/40 hover:bg-red-50/60' : 'hover:bg-gray-50/80'
                }`}
              >
                {/* Rank & User Info */}
                <div className="flex sm:col-span-5 items-center gap-3">
                  <div className="shrink-0">{getRankBadge(rank)}</div>

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
                      {user.username}
                    </div>
                  </div>
                </div>

                {/* Division Badge */}
                <div className="hidden sm:flex sm:col-span-2 justify-center">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-lg border ${
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

                {/* Wins */}
                <div className="hidden sm:block sm:col-span-1 text-center font-mono text-xs font-bold text-gray-700">
                  {user.wins}
                </div>

                {/* Total Reps */}
                <div className="hidden sm:block sm:col-span-1 text-center font-mono text-xs font-bold text-red-600">
                  {user.reps?.toLocaleString() || 1400}
                </div>

                {/* No Mercy Titles */}
                <div className="hidden sm:flex sm:col-span-1 justify-center items-center gap-1 font-mono text-xs font-extrabold text-amber-700">
                  <Trophy className="w-3 h-3 text-amber-500" />
                  <span>{user.noMercyTitles || 0}</span>
                </div>

                {/* Rating & Action */}
                <div className="flex sm:col-span-2 justify-between sm:justify-end items-center gap-3">
                  <div className="text-right">
                    <span className="font-mono text-base font-extrabold text-gray-950">
                      {user.rating}
                    </span>
                    <div className="text-[10px] text-emerald-600 font-bold flex items-center justify-end gap-0.5">
                      <Flame className="w-2.5 h-2.5" />
                      {user.streak} streak
                    </div>
                  </div>

                  {!isUser ? (
                    <button
                      id={`challenge-user-${user.username.replace('@', '')}`}
                      onClick={() => {
                        playClickSound();
                        onChallengePlayer(user);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-gray-900 hover:bg-gray-800 active:scale-95 text-white text-xs font-bold shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-1"
                      title="Challenge player"
                    >
                      <Swords className="w-3 h-3 text-red-400" />
                      <span className="hidden md:inline">Fight</span>
                    </button>
                  ) : (
                    <span className="text-[11px] font-mono font-bold text-gray-400 px-2">
                      Active
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Non-monetary disclaimer note */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-400 font-medium text-center">
        <ShieldCheck className="w-4 h-4 text-gray-400" />
        <span>
          Leaderboards are based purely on athletic merit and movement verification. No monetary rank is supported.
        </span>
      </div>
    </div>
  );
};

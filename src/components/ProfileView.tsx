import React from 'react';
import { UserProfile } from '../types';
import { Swords, Trophy, Flame, Shield, ArrowUpRight, CheckCircle2, XCircle } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface ProfileViewProps {
  profile: UserProfile;
  onStartBattle: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onStartBattle,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12 select-none">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-sm mb-6 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          {/* Avatar with Division border */}
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-red-600 text-white font-extrabold text-3xl flex items-center justify-center shadow-md border-2 border-red-500 overflow-hidden">
              YOU
            </div>
            <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-amber-500 text-white font-bold text-[10px] uppercase tracking-wider shadow-xs border-2 border-white">
              {profile.division}
            </div>
          </div>

          {/* User Details */}
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
                {profile.name}
              </h1>
              <span className="text-xs font-semibold text-gray-500">{profile.username}</span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              1v1 Push-Up Competitor • Member since 2026
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-3 mt-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gray-50 border border-gray-200/80">
                <Shield className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-xs font-bold text-gray-700">Division:</span>
                <span className="text-xs font-extrabold text-gray-900">{profile.division}</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-50 border border-red-100">
                <Trophy className="w-3.5 h-3.5 text-red-600" />
                <span className="text-xs font-bold text-red-700">Competitive Rating:</span>
                <span className="text-xs font-mono font-extrabold text-red-600">{profile.rating}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Start Battle Quick Action */}
        <button
          id="profile-start-battle-btn"
          onClick={() => {
            playClickSound();
            onStartBattle();
          }}
          className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-gray-950 text-white font-extrabold text-sm shadow-md hover:bg-gray-800 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 group"
        >
          <Swords className="w-4 h-4 text-red-400 group-hover:rotate-12 transition-transform" />
          <span>Queue For Battle</span>
        </button>
      </div>

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Wins */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            Victories
          </div>
          <div className="text-3xl font-extrabold text-gray-950 font-mono">
            {profile.wins}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Ranked wins
          </div>
        </div>

        {/* Losses */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            Defeats
          </div>
          <div className="text-3xl font-extrabold text-gray-950 font-mono">
            {profile.losses}
          </div>
          <div className="text-[11px] text-gray-500 font-semibold mt-1 flex items-center gap-1">
            <XCircle className="w-3 h-3 text-gray-400" />
            Ranked losses
          </div>
        </div>

        {/* Win Rate */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            Win Rate
          </div>
          <div className="text-3xl font-extrabold text-gray-950 font-mono">
            {profile.winRate.toFixed(1)}%
          </div>
          <div className="text-[11px] text-gray-500 font-semibold mt-1">
            Top 15% in Gold Division
          </div>
        </div>

        {/* Total Reps */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            Total Reps
          </div>
          <div className="text-3xl font-extrabold text-red-600 font-mono">
            {profile.totalReps.toLocaleString()}
          </div>
          <div className="text-[11px] text-gray-500 font-semibold mt-1">
            Verified movement reps
          </div>
        </div>
      </div>

      {/* Personal Records & Recent Battles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Records Column */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <Flame className="w-4.5 h-4.5 text-amber-500" />
            <h3 className="font-extrabold text-base text-gray-950">Personal Records</h3>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-gray-500 block">2-Min Push-Ups</span>
                <span className="font-mono text-2xl font-extrabold text-gray-950">
                  {profile.personalRecords.twoMinPushUps}
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase ml-1">REPS</span>
              </div>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                MAX 2-MIN
              </span>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-gray-500 block">1-Min Push-Ups</span>
                <span className="font-mono text-2xl font-extrabold text-gray-950">
                  {profile.personalRecords.oneMinPushUps}
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase ml-1">REPS</span>
              </div>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                SPRINT
              </span>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-gray-500 block">Longest Win Streak</span>
                <span className="font-mono text-2xl font-extrabold text-gray-950">
                  {profile.personalRecords.longestWinStreak}
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase ml-1">GAMES</span>
              </div>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* Recent Battles Column */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Swords className="w-4.5 h-4.5 text-gray-900" />
              <h3 className="font-extrabold text-base text-gray-950">Recent Battles</h3>
            </div>
            <span className="text-xs text-gray-400 font-medium">Last 4 matches</span>
          </div>

          <div className="space-y-3">
            {profile.recentBattles.map((battle) => {
              const isWin = battle.result === 'win';
              return (
                <div
                  key={battle.id}
                  className="bg-gray-50/70 hover:bg-gray-50 transition-colors rounded-2xl p-4 border border-gray-200/70 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-extrabold text-white shadow-2xs ${
                        isWin ? 'bg-emerald-600' : 'bg-gray-400'
                      }`}
                    >
                      {isWin ? 'W' : 'L'}
                    </div>

                    <div>
                      <div className="text-sm font-extrabold text-gray-950">
                        You {battle.userScore} — {battle.opponentScore} {battle.opponentName.split(' ')[0]}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">
                        vs {battle.opponentUsername} • {battle.date}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs font-mono font-extrabold px-2 py-0.5 rounded ${
                        isWin
                          ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                          : 'text-gray-600 bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {battle.ratingDelta > 0 ? `+${battle.ratingDelta}` : battle.ratingDelta}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

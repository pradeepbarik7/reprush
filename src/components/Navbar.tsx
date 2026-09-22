import React, { useState } from 'react';
import { ScreenType } from '../types';
import { Swords, Volume2, VolumeX, Menu, X, Shield, Trophy, User as UserIcon } from 'lucide-react';
import { isSoundEnabled, toggleSound, playClickSound } from '../utils/audio';

interface NavbarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  onStartBattle: () => void;
  userRating: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  onStartBattle,
  userRating,
}) => {
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSoundToggle = () => {
    const newState = toggleSound();
    setSoundOn(newState);
    playClickSound();
  };

  const navItem = (screen: ScreenType, label: string, icon: React.ReactNode) => {
    const isActive = currentScreen === screen;
    return (
      <button
        id={`nav-link-${screen}`}
        onClick={() => {
          playClickSound();
          onNavigate(screen);
          setMobileMenuOpen(false);
        }}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
          isActive
            ? 'text-gray-900 bg-gray-100 shadow-xs'
            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        {icon}
        <span>{label}</span>
      </button>
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md border-b border-gray-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          id="brand-logo"
          onClick={() => {
            playClickSound();
            onNavigate('home');
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-10 h-10 rounded-2xl bg-gray-900 flex items-center justify-center shadow-xs overflow-hidden group-hover:scale-105 transition-transform duration-200">
            {/* Red & Blue dynamic split indicator */}
            <div className="absolute inset-0 flex">
              <div className="w-1/2 h-full bg-[#EF4444]/90" />
              <div className="w-1/2 h-full bg-[#3B82F6]/90" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
            <Swords className="relative w-5 h-5 text-white stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-gray-950">
                Rep Rush
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100">
                1v1 BETA
              </span>
            </div>
          </div>
        </div>

        {/* Center / Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-gray-50/80 p-1 rounded-2xl border border-gray-100">
          {navItem('home', 'How It Works', <Shield className="w-4 h-4" />)}
          {navItem('leaderboard', 'Leaderboard', <Trophy className="w-4 h-4" />)}
          {navItem('profile', 'Profile', <UserIcon className="w-4 h-4" />)}
        </nav>

        {/* Right CTA and utilities */}
        <div className="flex items-center gap-2.5">
          {/* Audio toggle button */}
          <button
            id="audio-toggle-btn"
            onClick={handleSoundToggle}
            title={soundOn ? 'Mute SFX' : 'Enable SFX'}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 border border-gray-200/60 transition-colors cursor-pointer"
          >
            {soundOn ? <Volume2 className="w-4.5 h-4.5" /> : <VolumeX className="w-4.5 h-4.5 text-gray-400" />}
          </button>

          {/* User rating pill */}
          <div
            onClick={() => onNavigate('profile')}
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200/70 text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Rating: <strong className="text-gray-900 font-bold">{userRating}</strong></span>
          </div>

          {/* Mobile hamburger */}
          <button
            id="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center text-gray-700 hover:bg-gray-100 border border-gray-200/60"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-gray-200 bg-white/95 px-4 pt-3 pb-5 space-y-2 backdrop-blur-lg">
          <div className="flex flex-col space-y-1">
            {navItem('home', 'How It Works', <Shield className="w-4 h-4" />)}
            {navItem('leaderboard', 'Leaderboard', <Trophy className="w-4 h-4" />)}
            {navItem('profile', 'Profile', <UserIcon className="w-4 h-4" />)}
          </div>
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Signed in as @you</span>
            <span className="font-bold text-gray-900">Rating: {userRating}</span>
          </div>
        </div>
      )}
    </header>
  );
};

import React, { useState, useEffect } from 'react';
import { ScreenType } from '../types';
import { RepRushLogo } from './RepRushLogo';
import { 
  Swords, 
  Volume2, 
  VolumeX, 
  Menu, 
  X, 
  Home, 
  Trophy, 
  User as UserIcon, 
  Wallet, 
  Flame 
} from 'lucide-react';
import { isSoundEnabled, toggleSound, playClickSound } from '../utils/audio';
import { getDemoBalance } from '../services/demoWalletService';

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
  const [demoBalance, setDemoBalance] = useState(() => getDemoBalance());

  useEffect(() => {
    const handleWalletUpdate = () => {
      setDemoBalance(getDemoBalance());
    };
    window.addEventListener('reprush_wallet_update', handleWalletUpdate);
    return () => window.removeEventListener('reprush_wallet_update', handleWalletUpdate);
  }, []);

  const handleSoundToggle = () => {
    const newState = toggleSound();
    setSoundOn(newState);
    playClickSound();
  };

  const navItem = (screen: ScreenType, label: string, icon: React.ReactNode, onClickExtra?: () => void) => {
    const isActive = currentScreen === screen;
    return (
      <button
        id={`nav-link-${screen}`}
        onClick={() => {
          playClickSound();
          if (onClickExtra) {
            onClickExtra();
          } else {
            onNavigate(screen);
          }
          setMobileMenuOpen(false);
        }}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
          isActive
            ? 'text-gray-950 bg-gray-100 shadow-xs'
            : 'text-gray-500 hover:text-gray-950 hover:bg-gray-50'
        }`}
      >
        {icon}
        <span>{label}</span>
      </button>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all select-none">
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
            <div className="relative group-hover:scale-105 transition-transform duration-200 shrink-0">
              <RepRushLogo className="w-10 h-10 sm:w-11 sm:h-11 drop-shadow-xs" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-gray-950">
                  RepRush
                </span>
                <span className="hidden sm:inline-block text-[9px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100">
                  1v1 BETA
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-gray-50/80 p-1 rounded-2xl border border-gray-100">
            {navItem('home', 'Home', <Home className="w-4 h-4" />)}
            {navItem('matchmaking', 'Battle', <Swords className="w-4 h-4 text-red-500" />, onStartBattle)}
            {navItem('no-mercy', 'No Mercy', <Flame className="w-4 h-4 text-amber-500" />)}
            {navItem('leaderboard', 'Leaderboard', <Trophy className="w-4 h-4" />)}
            {navItem('profile', 'Profile', <UserIcon className="w-4 h-4" />)}
            {navItem('wallet', 'Wallet', <Wallet className="w-4 h-4 text-emerald-600" />)}
          </nav>

          {/* Right Area: Demo Balance Badge + Audio + Rating */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Demo Balance Nav Pill */}
            <div
              id="nav-wallet-balance-btn"
              onClick={() => {
                playClickSound();
                onNavigate('wallet');
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-emerald-50/80 hover:bg-emerald-100/90 border border-emerald-200/80 cursor-pointer transition-all shadow-xs group"
              title="Click to view Demo Wallet & Transactions"
            >
              <Wallet className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1">
                  <span className="font-mono font-extrabold text-xs sm:text-sm text-emerald-900 leading-tight">
                    ₹{demoBalance.toFixed(0)}
                  </span>
                  <span className="text-[9px] font-mono font-extrabold bg-emerald-200/80 text-emerald-800 px-1 rounded uppercase">
                    DEMO
                  </span>
                </div>
                <span className="text-[8px] font-sans font-semibold text-emerald-700 leading-none hidden sm:block">
                  Demo Balance
                </span>
              </div>
            </div>

            {/* Audio toggle button */}
            <button
              id="audio-toggle-btn"
              onClick={handleSoundToggle}
              title={soundOn ? 'Mute SFX' : 'Enable SFX'}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 border border-gray-200/60 transition-colors cursor-pointer"
            >
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
            </button>

            {/* Mobile hamburger */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-gray-700 hover:bg-gray-100 border border-gray-200/60 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-gray-200 bg-white/95 px-4 pt-2 pb-4 space-y-1.5 backdrop-blur-lg">
            {navItem('home', 'Home', <Home className="w-4 h-4" />)}
            {navItem('matchmaking', '1v1 Battle', <Swords className="w-4 h-4 text-red-500" />, onStartBattle)}
            {navItem('no-mercy', 'No Mercy Tournament', <Flame className="w-4 h-4 text-amber-500" />)}
            {navItem('leaderboard', 'Leaderboard', <Trophy className="w-4 h-4" />)}
            {navItem('profile', 'Profile', <UserIcon className="w-4 h-4" />)}
            {navItem('wallet', 'Wallet & Transactions', <Wallet className="w-4 h-4 text-emerald-600" />)}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 px-1">
              <span>Rating: <strong className="text-gray-900 font-bold">{userRating}</strong></span>
              <span className="font-mono text-emerald-700 font-bold">₹{demoBalance.toFixed(2)} Demo Balance</span>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Fixed Bottom Navigation Bar for rapid one-thumb navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-gray-200 px-2 py-1.5 flex items-center justify-around select-none">
        <button
          onClick={() => {
            playClickSound();
            onNavigate('home');
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-bold ${
            currentScreen === 'home' ? 'text-red-600' : 'text-gray-500'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            onStartBattle();
          }}
          className="flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-bold text-red-600"
        >
          <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xs">
            <Swords className="w-4 h-4" />
          </div>
          <span className="mt-0.5">Battle</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            onNavigate('no-mercy');
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-bold ${
            currentScreen === 'no-mercy' ? 'text-amber-600' : 'text-gray-500'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>No Mercy</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            onNavigate('leaderboard');
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-bold ${
            currentScreen === 'leaderboard' ? 'text-red-600' : 'text-gray-500'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Board</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            onNavigate('wallet');
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-bold ${
            currentScreen === 'wallet' ? 'text-emerald-600' : 'text-gray-500'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Wallet</span>
        </button>
      </nav>
    </>
  );
};

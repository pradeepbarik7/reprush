import React from 'react';
import { LegalDocType } from '../types';
import { RepRushLogo } from './RepRushLogo';
import { playClickSound } from '../utils/audio';

interface FooterProps {
  onOpenLegal: (doc: LegalDocType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal }) => {
  const handleLink = (doc: LegalDocType) => {
    playClickSound();
    onOpenLegal(doc);
  };

  return (
    <footer className="w-full bg-white border-t border-gray-100 mt-auto select-none">
      {/* Subtle Legal Status Banner */}
      <div className="w-full bg-gray-50 border-b border-gray-100/80 py-2.5 px-4 text-center">
        <p className="text-[11px] text-gray-500 font-mono">
          <span className="font-bold text-gray-700">Prototype / Demo Mode</span> — Wallet balances and rewards shown in this version are simulated and have no cash value.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-gray-100">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <RepRushLogo className="w-10 h-10 drop-shadow-xs" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-gray-950">
                  RepRush
                </span>
                <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-red-50 text-red-600 border border-red-100">
                  Prototype
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium">
                Turn every rep into a battle.
              </p>
            </div>
          </div>

          {/* Legal / Information Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-gray-600">
            <button
              onClick={() => handleLink('privacy')}
              className="hover:text-red-600 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => handleLink('terms')}
              className="hover:text-red-600 transition-colors cursor-pointer"
            >
              Terms
            </button>
            <button
              onClick={() => handleLink('responsible-play')}
              className="hover:text-red-600 transition-colors cursor-pointer"
            >
              Responsible Play
            </button>
            <button
              onClick={() => handleLink('community')}
              className="hover:text-red-600 transition-colors cursor-pointer"
            >
              Community Guidelines
            </button>
            <button
              onClick={() => handleLink('cookies')}
              className="hover:text-red-600 transition-colors cursor-pointer"
            >
              Cookie Policy
            </button>
            <button
              onClick={() => handleLink('about-aitia')}
              className="hover:text-red-600 transition-colors cursor-pointer"
            >
              About Aitia Media
            </button>
            <button
              onClick={() => handleLink('contact')}
              className="hover:text-red-600 transition-colors cursor-pointer"
            >
              Contact
            </button>
          </div>
        </div>

        {/* Developer Attribution & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 text-center sm:text-left">
          <p>© 2026 RepRush. Developed by Aitia Media.</p>
          <p className="font-medium text-gray-600">
            RepRush is developed by Aitia Media.
          </p>
        </div>
      </div>
    </footer>
  );
};

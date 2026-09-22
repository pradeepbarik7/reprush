import React, { useState } from 'react';
import { BattleResultData } from '../types';
import { X, Copy, Check, Share2, Swords, Trophy, Shield } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: BattleResultData;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    playClickSound();
    navigator.clipboard?.writeText?.(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-200 relative animate-float-rep">
        {/* Close Button */}
        <button
          onClick={() => {
            playClickSound();
            onClose();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mb-4">
          <Share2 className="w-5 h-5 text-gray-900" />
          <h3 className="font-extrabold text-lg text-gray-950">Share Battle Victory</h3>
        </div>

        {/* Shareable Card Graphic Preview */}
        <div className="rounded-2xl p-6 bg-gradient-to-b from-gray-950 to-gray-900 text-white shadow-xl relative overflow-hidden mb-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-red-600 flex items-center justify-center text-white text-xs font-bold">
                <Swords className="w-3.5 h-3.5" />
              </div>
              <span className="font-extrabold text-sm tracking-tight">Rep Rush 1v1</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
              OFFICIAL RESULT
            </span>
          </div>

          <div className="text-center my-3">
            <div className="text-xs uppercase tracking-widest text-red-400 font-extrabold mb-1">
              PUSH-UP BATTLE
            </div>
            <div className="text-3xl font-extrabold text-white">
              {result.winner === 'user' ? 'VICTORY' : 'RESULT'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-white/5 rounded-xl p-3 text-center my-4 border border-white/10">
            <div>
              <div className="text-[11px] text-gray-400 font-bold">YOU (RED)</div>
              <div className="text-2xl font-mono font-extrabold text-red-400">{result.userReps}</div>
              <div className="text-[9px] text-gray-400">REPS</div>
            </div>
            <div>
              <div className="text-[11px] text-gray-400 font-bold">ALEX (BLUE)</div>
              <div className="text-2xl font-mono font-extrabold text-blue-400">{result.opponentReps}</div>
              <div className="text-[9px] text-gray-400">REPS</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-800">
            <span className="text-emerald-400 font-bold">+{result.ratingDelta} Rating</span>
            <span className="font-mono">New: {result.newRating}</span>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={handleCopyLink}
          className="w-full py-3.5 px-4 rounded-xl bg-gray-950 hover:bg-gray-800 text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Card Link Copied!' : 'Copy Shareable Link'}</span>
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { DEMO_STAKES_CONFIG, StakeRule, DEFAULT_STAKE } from '../config/stakesConfig';
import { getDemoBalance, deductDemoEntry, resetDemoWallet } from '../services/demoWalletService';
import { Swords, ShieldAlert, Sparkles, X, AlertCircle, RefreshCw } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface StakeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmEntry: (stakeRule: StakeRule) => void;
}

export const StakeSelectorModal: React.FC<StakeSelectorModalProps> = ({
  isOpen,
  onClose,
  onConfirmEntry,
}) => {
  const [selectedStake, setSelectedStake] = useState<StakeRule>(DEFAULT_STAKE);
  const [balance, setBalance] = useState(() => getDemoBalance());
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectStake = (rule: StakeRule) => {
    playClickSound();
    setSelectedStake(rule);
    setErrorMessage(null);
  };

  const handleEnterBattle = () => {
    playClickSound();
    const currentBalance = getDemoBalance();
    if (currentBalance < selectedStake.entry) {
      setErrorMessage(`Insufficient demo balance. You need ₹${selectedStake.entry} Demo to enter.`);
      return;
    }

    // Deduct simulated demo stake
    const result = deductDemoEntry(
      selectedStake.entry,
      `1v1 Battle Entry (${selectedStake.label} Demo)`,
      'battle_entry'
    );

    if (result.success) {
      onConfirmEntry(selectedStake);
    } else {
      setErrorMessage('Could not deduct demo entry fee.');
    }
  };

  const handleResetBalance = () => {
    playClickSound();
    const newBal = resetDemoWallet();
    setBalance(newBal);
    setErrorMessage(null);
  };

  const hasEnough = balance >= selectedStake.entry;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm select-none animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0F172A] border border-gray-800 rounded-3xl p-5 sm:p-6 shadow-2xl text-white overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-44 h-44 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => {
            playClickSound();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-red-950/80 border border-red-500/60 flex items-center justify-center text-red-400">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white tracking-tight">
              1V1 PUSH-UP BATTLE
            </h3>
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
              Demo Simulation Mode
            </span>
          </div>
        </div>

        {/* Stake Selector Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">
              CHOOSE YOUR STAKE
            </label>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-500/40 px-2 py-0.5 rounded-full">
              Demo balance only
            </span>
          </div>

          {/* 4 Stake options: ₹1, ₹2, ₹5, ₹10 */}
          <div className="grid grid-cols-4 gap-2">
            {DEMO_STAKES_CONFIG.map((rule) => {
              const isSelected = selectedStake.entry === rule.entry;
              return (
                <button
                  key={rule.entry}
                  onClick={() => handleSelectStake(rule)}
                  className={`py-3 px-2 rounded-2xl border font-mono font-extrabold text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                    isSelected
                      ? 'bg-gradient-to-b from-red-600 to-red-700 border-red-400 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] scale-102'
                      : 'bg-gray-900/90 border-gray-800 text-gray-300 hover:border-gray-700 hover:text-white'
                  }`}
                >
                  <span className="text-base sm:text-lg leading-tight">{rule.label}</span>
                  <span className={`text-[9px] uppercase tracking-wider font-sans mt-0.5 ${isSelected ? 'text-red-200' : 'text-gray-500'}`}>
                    Demo
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Confirmation Breakdown Card */}
        <div className="bg-gray-950/90 border border-gray-800/90 rounded-2xl p-4 mb-4 space-y-2.5 text-xs font-mono">
          <div className="flex items-center justify-between text-gray-400">
            <span>Entry Stake</span>
            <span className="text-white font-bold">{selectedStake.label} Demo</span>
          </div>

          <div className="flex items-center justify-between text-gray-400">
            <span>Simulated Pool</span>
            <span className="text-gray-300 font-bold">₹{selectedStake.prizePool} Demo</span>
          </div>

          <div className="flex items-center justify-between text-gray-400">
            <span className="text-emerald-400 font-semibold">Winner Reward</span>
            <span className="text-emerald-400 font-extrabold">₹{selectedStake.winnerReward} Demo</span>
          </div>

          <div className="flex items-center justify-between text-gray-400">
            <span className="text-gray-500">Platform Fee</span>
            <span className="text-gray-500 font-semibold">₹{selectedStake.platformFee} Demo</span>
          </div>

          <div className="pt-2 border-t border-gray-800 flex items-center justify-between">
            <span className="text-gray-400">Your Demo Balance</span>
            <span className="text-white font-extrabold text-sm">₹{balance.toFixed(2)}</span>
          </div>
        </div>

        {/* Error message if balance insufficient */}
        {errorMessage && (
          <div className="mb-3 p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/80 text-rose-300 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={handleResetBalance}
              className="px-2 py-1 rounded bg-rose-900 hover:bg-rose-800 text-white font-bold text-[10px] shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset ₹500</span>
            </button>
          </div>
        )}

        {/* Disclaimer Notice */}
        <div className="mb-4 flex items-start gap-2 text-[10px] text-gray-400 leading-relaxed bg-gray-900/60 p-2.5 rounded-xl border border-gray-800/80">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            Demo mode — no real money is deposited, wagered, or withdrawn. All balances are virtual demo credits for prototype simulation.
          </span>
        </div>

        {/* Action Button */}
        <button
          id="confirm-enter-battle-btn"
          disabled={!hasEnough}
          onClick={handleEnterBattle}
          className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-sm uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg active:scale-98 ${
            hasEnough
              ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Swords className="w-4 h-4" />
          <span>ENTER BATTLE ({selectedStake.label} DEMO)</span>
        </button>
      </div>
    </div>
  );
};

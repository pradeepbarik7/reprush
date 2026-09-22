import React, { useState, useEffect } from 'react';
import { getDemoBalance, getDemoTransactions, resetDemoWallet } from '../services/demoWalletService';
import { DemoTransaction } from '../types';
import { Wallet, ShieldAlert, ArrowUpRight, ArrowDownLeft, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface WalletViewProps {
  onStartBattle: () => void;
  onEnterTournament: () => void;
}

export const WalletView: React.FC<WalletViewProps> = ({
  onStartBattle,
  onEnterTournament,
}) => {
  const [balance, setBalance] = useState(() => getDemoBalance());
  const [transactions, setTransactions] = useState<DemoTransaction[]>(() => getDemoTransactions());

  // Listen to custom window event for instant balance updates across views
  useEffect(() => {
    const handleWalletUpdate = () => {
      setBalance(getDemoBalance());
      setTransactions(getDemoTransactions());
    };
    window.addEventListener('reprush_wallet_update', handleWalletUpdate);
    return () => window.removeEventListener('reprush_wallet_update', handleWalletUpdate);
  }, []);

  const handleReset = () => {
    playClickSound();
    const newBal = resetDemoWallet();
    setBalance(newBal);
    setTransactions(getDemoTransactions());
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 select-none animate-fade-in">
      {/* Page Title & Breadcrumb */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Simulated Prototype System
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
            Wallet & Demo Balance
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Simulate competitive match stakes and tournament rewards with demo coins.
          </p>
        </div>

        {/* Prototype Reset Tool */}
        <button
          onClick={handleReset}
          className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold border border-gray-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          title="Reset demo credits to initial ₹500"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Demo Balance (₹500)</span>
        </button>
      </div>

      {/* Main Balance Hero Card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] border border-gray-800 p-6 sm:p-8 text-white shadow-2xl overflow-hidden mb-8">
        {/* Glow ambient effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-mono font-extrabold uppercase tracking-widest">
                DEMO BALANCE
              </span>
              <span className="text-[11px] font-mono text-gray-400">
                Non-Monetary Simulation
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-mono text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
                ₹{balance.toFixed(2)}
              </span>
              <span className="text-xl sm:text-2xl font-mono font-bold text-emerald-400">
                DEMO
              </span>
            </div>

            <p className="text-xs text-gray-400 mt-2 max-w-lg leading-relaxed">
              Used strictly to enter simulated 1v1 battles and the 8-player No Mercy tournament.
            </p>
          </div>

          {/* Quick Match CTA */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => {
                playClickSound();
                onStartBattle();
              }}
              className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all cursor-pointer text-center"
            >
              Enter 1v1 Battle
            </button>
            <button
              onClick={() => {
                playClickSound();
                onEnterTournament();
              }}
              className="px-6 py-3 rounded-2xl bg-gray-900 hover:bg-gray-800 text-amber-300 font-extrabold text-sm border border-amber-500/40 transition-colors cursor-pointer text-center"
            >
              Enter No Mercy (₹10)
            </button>
          </div>
        </div>

        {/* Legal Disclaimer Box inside Wallet */}
        <div className="mt-6 pt-5 border-t border-gray-800 flex items-start gap-3 text-xs text-gray-300 bg-black/30 p-3.5 rounded-2xl">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-white block mb-0.5">Simulated Prototype Currency:</strong>
            These balances have no cash value and cannot be deposited or withdrawn. No real money or real-world financial transactions are supported or enabled in this application.
          </div>
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-gray-950 tracking-tight flex items-center gap-2">
              <Wallet className="w-5 h-5 text-gray-700" />
              <span>Demo Transaction History</span>
            </h2>
            <span className="text-xs text-gray-500 font-medium">
              Simulated stake entries and reward distributions
            </span>
          </div>
          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-mono font-bold">
            {transactions.length} Records
          </span>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            No transactions yet. Complete a 1v1 battle or tournament!
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {transactions.map((tx) => {
              const isCredit = tx.type === 'credit';
              return (
                <div
                  key={tx.id}
                  className="py-4 flex items-center justify-between gap-4 hover:bg-gray-50/60 px-3 rounded-2xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isCredit
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          : 'bg-rose-50 text-rose-600 border border-rose-100'
                      }`}
                    >
                      {isCredit ? (
                        <ArrowDownLeft className="w-5 h-5" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-gray-900">
                          {tx.label}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-[9px] font-mono font-bold uppercase tracking-wider">
                          DEMO
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 font-medium">
                        {tx.date} • Balance after: ₹{tx.balanceAfter.toFixed(2)} Demo
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div
                      className={`font-mono text-base font-extrabold ${
                        isCredit ? 'text-emerald-600' : 'text-gray-900'
                      }`}
                    >
                      {isCredit ? '+' : '-'}₹{tx.amount.toFixed(2)}
                    </div>
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-semibold">
                      Demo Credit
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { Camera, ShieldCheck, Smartphone, Eye, Sparkles } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface CameraPermissionModalProps {
  isOpen: boolean;
  onAllow: () => void;
  onContinueWithout: () => void;
}

export const CameraPermissionModal: React.FC<CameraPermissionModalProps> = ({
  isOpen,
  onAllow,
  onContinueWithout,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0F172A] border border-gray-800 rounded-3xl p-6 sm:p-7 shadow-2xl text-white overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Icon */}
        <div className="relative z-10 flex items-center justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border-2 border-emerald-500/80 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Camera className="w-8 h-8 text-emerald-400" />
          </div>
        </div>

        {/* Title */}
        <div className="relative z-10 text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[11px] font-mono font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            AI Computer Vision
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Enable Camera for 1v1 Battle
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed">
            RepRush uses your camera and local pose detection to track strict elbow depth and count valid push-ups in real time.
          </p>
        </div>

        {/* Setup Tip Card */}
        <div className="relative z-10 bg-gray-900/90 border border-gray-800 rounded-2xl p-3.5 mb-5 space-y-2 text-xs">
          <div className="flex items-start gap-2.5">
            <Smartphone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-gray-300 leading-snug">
              <strong className="text-white">Pro Setup: </strong>
              Prop phone on the floor sideways. Ensure your head, shoulders, and hips are clearly visible.
            </div>
          </div>
          <div className="flex items-start gap-2.5 pt-1.5 border-t border-gray-800 text-[11px] text-gray-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              100% Private: All computer vision runs locally in your browser. Video is never saved or transmitted.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 flex flex-col gap-2.5">
          <button
            id="modal-allow-camera-btn"
            onClick={() => {
              playClickSound();
              onAllow();
            }}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-sm shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
          >
            <Camera className="w-4 h-4" />
            <span>ALLOW CAMERA & START</span>
          </button>

          <button
            id="modal-continue-without-camera-btn"
            onClick={() => {
              playClickSound();
              onContinueWithout();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white font-bold text-xs border border-gray-800 transition-colors cursor-pointer text-center"
          >
            Continue Without Camera (Demo Mode)
          </button>
        </div>
      </div>
    </div>
  );
};

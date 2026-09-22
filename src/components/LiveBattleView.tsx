import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Player } from '../types';
import { AthleteSimulation } from './AthleteSimulation';
import { playRepSound, playComboSound, toggleSound, isSoundEnabled } from '../utils/audio';
import { 
  Flame, 
  Clock, 
  Swords, 
  Play, 
  Pause, 
  Camera, 
  CameraOff, 
  Volume2, 
  VolumeX, 
  Activity, 
  Trophy, 
  Zap, 
  Shuffle, 
  Gauge,
  Smartphone,
  Columns2
} from 'lucide-react';

export type BattleScenario = 'auto_easy_win' | 'p1_win' | 'p2_win';

interface LiveBattleViewProps {
  user: Player;
  opponent: Player;
  onBattleEnd: (userReps: number, opponentReps: number, maxCombo: number) => void;
}

export const LiveBattleView: React.FC<LiveBattleViewProps> = ({
  user,
  opponent,
  onBattleEnd,
}) => {
  // Scenario configuration - default is automated easy win for Player 1
  const [scenario, setScenario] = useState<BattleScenario>('auto_easy_win');

  // Battle state: 30-second fixed duration
  const [userReps, setUserReps] = useState(0);
  const [opponentReps, setOpponentReps] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds timer
  const [autoSimulate, setAutoSimulate] = useState(true); // automated reps for easy win
  const [simSpeed, setSimSpeed] = useState<1 | 3>(1); // 1x or 3x turbo pace

  // Layout mode: default is 'split' as requested
  const [layoutMode, setLayoutMode] = useState<'mobile_pip' | 'split'>('split');
  const [activeMainPlayer, setActiveMainPlayer] = useState<'user' | 'opponent'>('user');

  // Audio state
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());

  // Combo system
  const [userCombo, setUserCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [activeComboBanner, setActiveComboBanner] = useState<string | null>(null);

  // Floating +1 animations
  const [userFloats, setUserFloats] = useState<{ id: number; text: string }[]>([]);
  const [opponentFloats, setOpponentFloats] = useState<{ id: number; text: string }[]>([]);

  // AI verification status text
  const [aiStatusUser, setAiStatusUser] = useState('Tracking movement');
  const [aiStatusOpponent, setAiStatusOpponent] = useState('Movement detected');

  // Real webcam feed toggle option
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Refs to allow stable intervals without timer resets
  const timeLeftRef = useRef(30);
  const userRepsRef = useRef(0);
  const opponentRepsRef = useRef(0);
  const maxComboRef = useRef(0);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  useEffect(() => {
    userRepsRef.current = userReps;
  }, [userReps]);

  useEffect(() => {
    opponentRepsRef.current = opponentReps;
  }, [opponentReps]);

  useEffect(() => {
    maxComboRef.current = maxCombo;
  }, [maxCombo]);

  // Handle webcam toggle
  const toggleCamera = async () => {
    if (cameraActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraActive(true);
      } catch (err) {
        console.warn('Camera permission denied or camera unavailable, using simulated video', err);
        setCameraActive(false);
      }
    }
  };

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Sync video element when stream is ready
  useEffect(() => {
    if (cameraActive && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [cameraActive]);

  // Main countdown timer (30s down to 0)
  useEffect(() => {
    const tickInterval = simSpeed === 3 ? 333 : 1000;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, tickInterval);

    return () => clearInterval(timer);
  }, [simSpeed]);

  // When timer hits 0 after 30 seconds, trigger match end
  // The winner is strictly decided on the basis of counted reps (userReps vs opponentReps)
  useEffect(() => {
    if (timeLeft === 0) {
      onBattleEnd(userRepsRef.current, opponentRepsRef.current, maxComboRef.current);
    }
  }, [timeLeft, onBattleEnd]);

  // Periodic AI status text cycling
  useEffect(() => {
    const userStatuses = [
      'Chest-to-floor verified',
      'Lockout angle: 176°',
      'Valid depth detected',
      'Analyzing form...',
      'Cadence: 32 reps/min',
    ];
    const oppStatuses = [
      'Movement detected',
      'Chest-to-floor verified',
      'Pace steady',
      'Analyzing form...',
      'Depth verified',
    ];

    const interval = setInterval(() => {
      setAiStatusUser(userStatuses[Math.floor(Math.random() * userStatuses.length)]);
      setAiStatusOpponent(oppStatuses[Math.floor(Math.random() * oppStatuses.length)]);
    }, 2400);

    return () => clearInterval(interval);
  }, []);

  // Trigger User Rep (used both by automation and manual tap)
  const triggerUserRep = useCallback((isManual = true) => {
    if (timeLeftRef.current <= 0) return;

    playRepSound(true);
    setUserReps((prev) => {
      const updated = prev + 1;
      userRepsRef.current = updated;
      return updated;
    });

    // Combo logic
    setUserCombo((prevCombo) => {
      const newCombo = prevCombo + 1;
      if (newCombo > maxComboRef.current) {
        maxComboRef.current = newCombo;
        setMaxCombo(newCombo);
      }

      if (newCombo === 5) {
        playComboSound(2);
        setActiveComboBanner('🔥 COMBO x2');
        setTimeout(() => setActiveComboBanner(null), 1800);
      } else if (newCombo === 10) {
        playComboSound(3);
        setActiveComboBanner('🔥 COMBO x3');
        setTimeout(() => setActiveComboBanner(null), 2000);
      } else if (newCombo === 15) {
        playComboSound(4);
        setActiveComboBanner('⚡ UNSTOPPABLE x4');
        setTimeout(() => setActiveComboBanner(null), 2200);
      }
      return newCombo;
    });

    // Floating +1 animation
    setUserFloats((floats) => [
      ...floats.slice(-3),
      { id: Date.now() + Math.random(), text: isManual ? '+1 STRICT REP' : '+1' },
    ]);
  }, []);

  // Trigger Opponent Rep
  const triggerOpponentRep = useCallback(() => {
    if (timeLeftRef.current <= 0) return;

    playRepSound(false);
    setOpponentReps((prev) => {
      const updated = prev + 1;
      opponentRepsRef.current = updated;
      return updated;
    });

    setOpponentFloats((floats) => [
      ...floats.slice(-3),
      { id: Date.now() + Math.random(), text: '+1' },
    ]);
  }, []);

  // Automated Simulation Engine tuned for EASY WIN for Player 1
  useEffect(() => {
    if (!autoSimulate) return;

    const speedMultiplier = simSpeed === 3 ? 0.33 : 1.0;

    // In 30 seconds:
    // User pace: ~1.4s per rep -> reaches ~20-22 reps
    // Opponent pace: ~2.3s per rep -> reaches ~12-14 reps
    // Guarantees an easy win for Player 1!
    let userBaseInterval = 1400 * speedMultiplier;
    let oppBaseInterval = 2300 * speedMultiplier;

    if (scenario === 'p2_win') {
      userBaseInterval = 2400 * speedMultiplier;
      oppBaseInterval = 1400 * speedMultiplier;
    }

    // Quick initial reps so counts start increasing right away
    const userInitialTimeout = setTimeout(() => {
      if (timeLeftRef.current > 0) {
        triggerUserRep(false);
      }
    }, 800 * speedMultiplier);

    const oppInitialTimeout = setTimeout(() => {
      if (timeLeftRef.current > 0) {
        triggerOpponentRep();
      }
    }, 1700 * speedMultiplier);

    // Continuous rep interval cadence
    const userTimer = setInterval(() => {
      if (timeLeftRef.current > 0) {
        triggerUserRep(false);
      }
    }, userBaseInterval);

    const oppTimer = setInterval(() => {
      if (timeLeftRef.current > 0) {
        triggerOpponentRep();
      }
    }, oppBaseInterval);

    return () => {
      clearTimeout(userInitialTimeout);
      clearTimeout(oppInitialTimeout);
      clearInterval(userTimer);
      clearInterval(oppTimer);
    };
  }, [autoSimulate, scenario, simSpeed, triggerUserRep, triggerOpponentRep]);

  // Instant finish helper for presentations
  const handleInstantFinish = (forcedWinner: 'user' | 'opponent' = 'user') => {
    if (forcedWinner === 'user') {
      const finalUser = Math.max(userReps + 5, 18);
      const finalOpp = Math.min(finalUser - 6, Math.max(opponentReps, 11));
      onBattleEnd(finalUser, finalOpp, Math.max(maxCombo, 8));
    } else {
      const finalOpp = Math.max(opponentReps + 5, 18);
      const finalUser = Math.min(finalOpp - 6, Math.max(userReps, 11));
      onBattleEnd(finalUser, finalOpp, Math.max(maxCombo, 4));
    }
  };

  // Jump to final 5 seconds of match
  const handleJumpToClimax = () => {
    setTimeLeft(5);
  };

  // Sound toggle handler
  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundOn(newState);
  };

  // Format time as M:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Calculate Territory Bar Split
  const totalReps = userReps + opponentReps;
  let userPct = 50;
  if (totalReps > 0) {
    const diff = userReps - opponentReps;
    userPct = Math.min(88, Math.max(12, 50 + diff * 3.5));
  }
  const oppPct = 100 - userPct;

  const isUrgent = timeLeft <= 10;
  const isCritical = timeLeft <= 5;

  return (
    <div className="w-full max-w-xl mx-auto px-2 sm:px-4 py-2 sm:py-4 select-none flex flex-col items-center">
      {/* Container simulating high-end mobile viral battle viewport */}
      <div className="w-full bg-[#0B0F17] text-white rounded-3xl p-3 sm:p-4 border border-gray-800 shadow-2xl relative overflow-hidden flex flex-col">
        
        {/* Top Header: RANKED MATCH + Controls */}
        <div className="relative z-10 flex items-center justify-between px-1 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-1">
              <Swords className="w-3.5 h-3.5 text-amber-400" />
              RANKED MATCH
            </span>
          </div>

          {/* Quick HUD controls */}
          <div className="flex items-center gap-1.5">
            {/* View Mode Toggle: Mobile PiP vs Dual Split */}
            <button
              onClick={() => setLayoutMode((m) => (m === 'mobile_pip' ? 'split' : 'mobile_pip'))}
              title={layoutMode === 'mobile_pip' ? 'Switch to Split Duel' : 'Switch to Mobile PiP Duel'}
              className="px-2 py-1 rounded-lg bg-gray-900/80 hover:bg-gray-800 text-[10px] font-bold text-gray-300 border border-gray-700/80 flex items-center gap-1 transition-colors cursor-pointer"
            >
              {layoutMode === 'mobile_pip' ? (
                <>
                  <Columns2 className="w-3 h-3 text-cyan-400" />
                  <span className="hidden sm:inline">Split</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3 h-3 text-amber-400" />
                  <span className="hidden sm:inline">PiP</span>
                </>
              )}
            </button>

            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              title={soundOn ? 'Mute SFX' : 'Enable SFX'}
              className="p-1.5 rounded-lg bg-gray-900/80 hover:bg-gray-800 text-gray-300 border border-gray-700/80 transition-colors cursor-pointer"
            >
              {soundOn ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-gray-500" />}
            </button>

            {/* Camera Toggle */}
            <button
              id="mobile-camera-toggle-btn"
              onClick={toggleCamera}
              title={cameraActive ? 'Disable Webcam' : 'Enable Webcam'}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                cameraActive 
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300' 
                  : 'bg-gray-900/80 border-gray-700 text-gray-400 hover:text-white'
              }`}
            >
              {cameraActive ? <Camera className="w-3.5 h-3.5 text-emerald-400" /> : <CameraOff className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Head-to-Head HUD Banner (Directly inspired by Instagram / PUPG battle photo) */}
        <div className="bg-gray-950/90 rounded-2xl p-3 border border-gray-800/90 shadow-inner mb-3">
          {/* 3-Column Profile & Timer Row */}
          <div className="grid grid-cols-3 items-center text-center gap-2 mb-2">
            {/* Player 1 (You) */}
            <div className="flex flex-col items-center">
              <div className="relative mb-1">
                <div className="w-12 h-12 rounded-xl border-2 border-emerald-500 bg-emerald-950/80 flex items-center justify-center font-extrabold text-sm text-emerald-400 overflow-hidden shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <span>YOU</span>
                  )}
                </div>
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-black flex items-center justify-center text-[7px] font-bold">
                  ✓
                </span>
              </div>
              <span className="text-xs font-extrabold text-white truncate max-w-[85px]">
                {user.name}
              </span>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-0.5">
                ★ {user.division}
              </span>
              {/* Massive Rep Counter */}
              <div className="font-mono text-3xl sm:text-4xl font-extrabold text-emerald-400 mt-1 leading-none drop-shadow-[0_2px_8px_rgba(16,185,129,0.4)]">
                {userReps}
              </div>
            </div>

            {/* Center: Match Countdown Timer (30 sec) */}
            <div className="flex flex-col items-center justify-center">
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" />
                TIME
              </span>
              <div
                className={`font-mono text-2xl sm:text-3xl font-extrabold tracking-tight px-3 py-1 rounded-xl border transition-all ${
                  isCritical
                    ? 'text-red-400 bg-red-950/80 border-red-500 animate-pulse scale-105 shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                    : isUrgent
                    ? 'text-amber-400 bg-amber-950/60 border-amber-500'
                    : 'text-white bg-gray-900/90 border-gray-700/80'
                }`}
              >
                {formatTime(timeLeft)}
              </div>
              <span className="text-[9px] font-mono text-gray-500 font-semibold mt-1">
                {isCritical ? 'FINAL SPRINT' : '30S CLASH'}
              </span>
            </div>

            {/* Player 2 (Opponent) */}
            <div className="flex flex-col items-center">
              <div className="relative mb-1">
                <div className="w-12 h-12 rounded-xl border-2 border-rose-500 bg-rose-950/80 flex items-center justify-center font-extrabold text-sm text-rose-400 overflow-hidden shadow-[0_0_12px_rgba(244,63,94,0.3)]">
                  {opponent.avatar ? (
                    <img 
                      src={opponent.avatar} 
                      alt={opponent.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <span>AM</span>
                  )}
                </div>
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-black flex items-center justify-center text-[7px] font-bold">
                  ⚔
                </span>
              </div>
              <span className="text-xs font-extrabold text-white truncate max-w-[85px]">
                {opponent.name}
              </span>
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-0.5">
                ⚔ {opponent.division}
              </span>
              {/* Massive Rep Counter */}
              <div className="font-mono text-3xl sm:text-4xl font-extrabold text-rose-400 mt-1 leading-none drop-shadow-[0_2px_8px_rgba(244,63,94,0.4)]">
                {opponentReps}
              </div>
            </div>
          </div>

          {/* Clash Territory Progress Bar (Green vs Red directly below scores) */}
          <div className="relative w-full h-3 rounded-full bg-gray-900 overflow-hidden flex border border-gray-700/80 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              style={{ width: `${userPct}%` }}
            />
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-rose-700 transition-all duration-300"
              style={{ width: `${oppPct}%` }}
            />
            {/* Center Split Marker */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-md transition-all duration-300 -translate-x-1/2"
              style={{ left: `${userPct}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono font-bold text-gray-400 mt-1 px-1">
            <span className="text-emerald-400">{Math.round(userPct)}% LEAD</span>
            <span className="text-gray-500 font-sans font-medium">Territory Clash</span>
            <span className="text-rose-400">{Math.round(oppPct)}%</span>
          </div>
        </div>

        {/* Main Stage: Mobile PiP View OR Split View */}
        {layoutMode === 'mobile_pip' ? (
          /* Mobile Frame with Opponent Picture-in-Picture */
          <div className="relative w-full rounded-2xl overflow-hidden bg-black border border-gray-800 shadow-xl aspect-[4/3] sm:aspect-[16/11]">
            {/* Primary View (User Feed by default, or opponent if swapped) */}
            {activeMainPlayer === 'user' ? (
              cameraActive ? (
                <div className="relative w-full h-full bg-black">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                  {/* Camera tracking grid HUD */}
                  <div className="absolute inset-0 border-2 border-emerald-500/40 pointer-events-none p-2 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[9px] font-mono text-emerald-400 bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
                      <span>LIVE CAM // COMPUTER VISION</span>
                      <span>FORM: 98% STRICT</span>
                    </div>
                  </div>
                </div>
              ) : (
                <AthleteSimulation
                  playerName={user.name}
                  isUser={true}
                  color="emerald"
                  currentReps={userReps}
                  aiStatus={aiStatusUser}
                  customAspect="h-full"
                />
              )
            ) : (
              <AthleteSimulation
                playerName={opponent.name}
                isUser={false}
                color="blue"
                currentReps={opponentReps}
                aiStatus={aiStatusOpponent}
                customAspect="h-full"
              />
            )}

            {/* Picture-in-Picture (PiP) Window for Opponent Feed */}
            <div
              onClick={() => setActiveMainPlayer((p) => (p === 'user' ? 'opponent' : 'user'))}
              title="Tap to swap primary feed"
              className="absolute top-2 right-2 z-20 w-28 sm:w-36 rounded-xl overflow-hidden bg-gray-950/95 border-2 border-rose-500/80 shadow-2xl cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            >
              <div className="relative">
                {activeMainPlayer === 'user' ? (
                  <AthleteSimulation
                    playerName={opponent.name}
                    isUser={false}
                    color="red"
                    currentReps={opponentReps}
                    aiStatus={aiStatusOpponent}
                    compact={true}
                  />
                ) : (
                  <AthleteSimulation
                    playerName={user.name}
                    isUser={true}
                    color="emerald"
                    currentReps={userReps}
                    aiStatus={aiStatusUser}
                    compact={true}
                  />
                )}
                {/* Rep count badge on PiP */}
                <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 font-mono font-extrabold text-[10px] text-white border border-gray-700">
                  {activeMainPlayer === 'user' ? `${opponentReps} REPS` : `${userReps} REPS`}
                </div>
                {/* Swap Feed Label */}
                <div className="absolute top-1 left-1 px-1 rounded bg-black/70 text-[8px] font-mono font-bold text-gray-300">
                  TAP SWAP
                </div>
              </div>
            </div>

            {/* Floating +1 Animations */}
            {userFloats.map((float) => (
              <div
                key={float.id}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 animate-float-rep"
              >
                <div className="px-3.5 py-1.5 rounded-full bg-emerald-500 text-white font-mono font-extrabold text-sm sm:text-base shadow-xl border border-white/60">
                  {float.text}
                </div>
              </div>
            ))}

            {/* Active Combo Banner */}
            {activeComboBanner && (
              <div className="absolute top-3 left-3 z-20 animate-bounce">
                <div className="px-3 py-1 rounded-full bg-amber-500 text-white font-extrabold text-xs shadow-lg border border-amber-300">
                  {activeComboBanner}
                </div>
              </div>
            )}

            {/* Giant Gold Reps Badge at Bottom Center (Replicating user's viral photo) */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none">
              <div className="font-mono text-4xl sm:text-5xl font-extrabold text-amber-400 drop-shadow-[0_4px_12px_rgba(245,158,11,0.6)] leading-none animate-pulse">
                {userReps}
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 drop-shadow-md">
                PUSH UPS
              </span>
            </div>
          </div>
        ) : (
          /* Dual Split View (Both athletes split / stacked on mobile) */
          <div className="flex flex-col gap-2.5 w-full mb-1">
            {/* User card */}
            <div className="relative rounded-2xl overflow-hidden bg-black border-2 border-emerald-500/80 p-1.5 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <div className="text-[11px] font-mono font-extrabold text-emerald-400 px-2 py-1 flex justify-between items-center bg-gray-950/60 rounded-lg mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {user.name} (YOU)
                </span>
                <span className="bg-emerald-950/80 border border-emerald-500/60 px-2 py-0.5 rounded text-emerald-300 font-mono">
                  {userReps} REPS
                </span>
              </div>
              
              {cameraActive ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                  <div className="absolute inset-0 border border-emerald-500/40 pointer-events-none p-1.5 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[8px] font-mono text-emerald-400 bg-black/60 px-1.5 py-0.5 rounded">
                      <span>LIVE CAM // 1080P</span>
                      <span>FORM 98% STRICT</span>
                    </div>
                  </div>
                </div>
              ) : (
                <AthleteSimulation
                  playerName={user.name}
                  isUser={true}
                  color="emerald"
                  currentReps={userReps}
                  aiStatus={aiStatusUser}
                  compact={true}
                />
              )}

              {/* Floating +1 for User */}
              {userFloats.map((float) => (
                <div
                  key={float.id}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 animate-float-rep"
                >
                  <div className="px-3 py-1 rounded-full bg-emerald-500 text-white font-mono font-extrabold text-xs shadow-xl border border-white/60">
                    {float.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Opponent card */}
            <div className="relative rounded-2xl overflow-hidden bg-black border-2 border-rose-500/80 p-1.5 shadow-[0_0_15px_rgba(244,63,94,0.15)]">
              <div className="text-[11px] font-mono font-extrabold text-rose-400 px-2 py-1 flex justify-between items-center bg-gray-950/60 rounded-lg mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                  {opponent.name}
                </span>
                <span className="bg-rose-950/80 border border-rose-500/60 px-2 py-0.5 rounded text-rose-300 font-mono">
                  {opponentReps} REPS
                </span>
              </div>
              <AthleteSimulation
                playerName={opponent.name}
                isUser={false}
                color="red"
                currentReps={opponentReps}
                aiStatus={aiStatusOpponent}
                compact={true}
              />

              {/* Floating +1 for Opponent */}
              {opponentFloats.map((float) => (
                <div
                  key={float.id}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 animate-float-rep"
                >
                  <div className="px-3 py-1 rounded-full bg-rose-500 text-white font-mono font-extrabold text-xs shadow-xl border border-white/60">
                    {float.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Automation & Demo Controls Bar */}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-400 bg-gray-900/90 rounded-xl p-2 border border-gray-800 gap-1.5 flex-wrap w-full">
          {/* Auto Simulate Toggle */}
          <button
            onClick={() => setAutoSimulate(!autoSimulate)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold cursor-pointer text-[11px]"
          >
            {autoSimulate ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
            <span>{autoSimulate ? 'Auto Reps' : 'Paused'}</span>
          </button>

          {/* 3x Turbo Toggle */}
          <button
            onClick={() => setSimSpeed((s) => (s === 1 ? 3 : 1))}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg font-bold cursor-pointer text-[11px] border ${
              simSpeed === 3 
                ? 'bg-amber-950/80 border-amber-500 text-amber-300' 
                : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
            }`}
          >
            <Gauge className="w-3 h-3" />
            <span>{simSpeed === 3 ? '3x Turbo' : '1x Normal'}</span>
          </button>

          {/* Jump to final 5 seconds */}
          <button
            onClick={handleJumpToClimax}
            className="px-2 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold cursor-pointer text-[11px]"
          >
            ⏩ Final 5s
          </button>

          {/* Instant Finish (Easy Win) */}
          <button
            onClick={() => handleInstantFinish('user')}
            className="px-2.5 py-1 rounded-lg bg-emerald-950/90 border border-emerald-600/80 text-emerald-300 font-extrabold hover:bg-emerald-900 cursor-pointer text-[11px] flex items-center gap-1"
          >
            <Trophy className="w-3 h-3 text-amber-400" />
            <span>Finish Match</span>
          </button>
        </div>

        {/* Live Telemetry Info Footer */}
        <div className="mt-2 text-center text-[10px] font-mono text-gray-500 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>30s Match • Automated AI Form Tracking • Winner by Reps</span>
        </div>
      </div>
    </div>
  );
};

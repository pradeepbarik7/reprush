import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Player, PushUpMetrics } from '../types';
import { AthleteSimulation } from './AthleteSimulation';
import { PoseOverlay } from './PoseOverlay';
import { CameraPermissionModal } from './CameraPermissionModal';
import { usePoseDetection } from '../hooks/usePoseDetection';
import { playRepSound, playComboSound, toggleSound, isSoundEnabled, playClickSound } from '../utils/audio';
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
  Gauge,
  Smartphone,
  Columns2,
  Eye,
  EyeOff,
  PlusCircle,
  HelpCircle,
  CheckCircle2,
  AlertCircle
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
  // Battle state: 2-minute timer (120 seconds) as specified
  const [userReps, setUserReps] = useState(0);
  const [opponentReps, setOpponentReps] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes (120 seconds)
  const [simSpeed, setSimSpeed] = useState<1 | 3>(1); // 1x or 3x turbo pace
  const [autoSimulateOpponent, setAutoSimulateOpponent] = useState(true);
  const [autoSimulateUser, setAutoSimulateUser] = useState(false); // Only used if camera is off and user enables demo auto

  // Layout mode: 'split' or 'mobile_pip'
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

  // Camera permission modal
  const [showPermissionModal, setShowPermissionModal] = useState(true);
  const [showDebug, setShowDebug] = useState(false);

  // Refs for stable intervals and callbacks
  const timeLeftRef = useRef(120);
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

  // Trigger User Rep (from computer vision or manual demo tap)
  const triggerUserRep = useCallback((isManual = false, metrics?: PushUpMetrics) => {
    if (timeLeftRef.current <= 0) return;

    playRepSound(true);
    setUserReps((prev) => {
      const updated = prev + 1;
      userRepsRef.current = updated;
      return updated;
    });

    // Combo system update
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
    const floatText = isManual ? '+1 DEMO REP' : '+1 STRICT REP';
    setUserFloats((floats) => [
      ...floats.slice(-3),
      { id: Date.now() + Math.random(), text: floatText },
    ]);
  }, []);

  // Trigger Opponent Rep (Simulated Athlete)
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

  // Setup Pose Detection Hook
  const {
    videoRef,
    cameraStatus,
    isModelLoading,
    poseState,
    feedback,
    metrics,
    landmarks,
    showSkeleton,
    setShowSkeleton,
    videoDimensions,
    startCamera,
    stopCamera,
  } = usePoseDetection({
    onValidRep: (count, m) => {
      triggerUserRep(false, m);
    },
  });

  // Handle Camera Permission Modal Actions
  const handleAllowCamera = async () => {
    setShowPermissionModal(false);
    const success = await startCamera();
    if (!success) {
      // Graceful fallback to demo mode
      setAutoSimulateUser(true);
    }
  };

  const handleContinueWithoutCamera = () => {
    setShowPermissionModal(false);
    // User chose demo mode without camera
    setAutoSimulateUser(true);
  };

  // Toggle Camera manually from HUD button
  const handleToggleCamera = async () => {
    playClickSound();
    if (cameraStatus === 'ACTIVE') {
      stopCamera();
    } else {
      const ok = await startCamera();
      if (ok) {
        setAutoSimulateUser(false);
      }
    }
  };

  // Main countdown timer (120 seconds down to 0)
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

  // When timer hits 0, stop camera tracks and conclude battle
  useEffect(() => {
    if (timeLeft === 0) {
      stopCamera();
      onBattleEnd(userRepsRef.current, opponentRepsRef.current, maxComboRef.current);
    }
  }, [timeLeft, onBattleEnd, stopCamera]);

  // Opponent Simulated Reps Cadence
  useEffect(() => {
    if (!autoSimulateOpponent) return;

    const speedMultiplier = simSpeed === 3 ? 0.33 : 1.0;
    // Opponent average cadence: 1 rep every ~2.5 - 3.2 seconds
    const oppBaseInterval = 2800 * speedMultiplier;

    // Initial first rep after 2 seconds
    const initialTimer = setTimeout(() => {
      if (timeLeftRef.current > 0) {
        triggerOpponentRep();
      }
    }, 2000 * speedMultiplier);

    const interval = setInterval(() => {
      if (timeLeftRef.current > 0) {
        // Slight organic variation
        const variance = (Math.random() - 0.5) * 600;
        setTimeout(() => {
          if (timeLeftRef.current > 0) {
            triggerOpponentRep();
          }
        }, Math.max(100, variance));
      }
    }, oppBaseInterval);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [autoSimulateOpponent, simSpeed, triggerOpponentRep]);

  // Optional Demo Auto-reps for user when camera is disabled
  useEffect(() => {
    if (!autoSimulateUser || cameraStatus === 'ACTIVE') return;

    const speedMultiplier = simSpeed === 3 ? 0.33 : 1.0;
    const userInterval = setInterval(() => {
      if (timeLeftRef.current > 0) {
        triggerUserRep(true);
      }
    }, 2200 * speedMultiplier);

    return () => clearInterval(userInterval);
  }, [autoSimulateUser, cameraStatus, simSpeed, triggerUserRep]);

  // Presentation / Test Helpers
  const handleJumpToClimax = () => {
    playClickSound();
    setTimeLeft(5);
  };

  const handleInstantFinish = () => {
    playClickSound();
    stopCamera();
    const finalUser = Math.max(userReps + 3, 24);
    const finalOpp = Math.min(finalUser - 4, Math.max(opponentReps, 18));
    onBattleEnd(finalUser, finalOpp, Math.max(maxCombo, 6));
  };

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

  // Dynamic Territory Tug-of-War Split (Smooth Red/Blue territory)
  const totalReps = userReps + opponentReps;
  let userPct = 50;
  if (totalReps > 0) {
    const diff = userReps - opponentReps;
    userPct = Math.min(90, Math.max(10, 50 + diff * 3.2));
  }
  const oppPct = 100 - userPct;

  const isUrgent = timeLeft <= 30;
  const isCritical = timeLeft <= 10;
  const isCameraActive = cameraStatus === 'ACTIVE';

  return (
    <div className="w-full max-w-xl mx-auto px-2 sm:px-4 py-2 sm:py-4 select-none flex flex-col items-center">
      {/* Camera Permission Modal */}
      <CameraPermissionModal
        isOpen={showPermissionModal}
        onAllow={handleAllowCamera}
        onContinueWithout={handleContinueWithoutCamera}
      />

      {/* Main Battle Container */}
      <div className="w-full bg-[#0B0F17] text-white rounded-3xl p-3 sm:p-4 border border-gray-800 shadow-2xl relative overflow-hidden flex flex-col">
        
        {/* Top Header: RANKED MATCH + Real-time Controls */}
        <div className="relative z-10 flex items-center justify-between px-1 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-1">
              <Swords className="w-3.5 h-3.5 text-amber-400" />
              RANKED 1v1 BATTLE
            </span>
          </div>

          {/* Quick HUD controls */}
          <div className="flex items-center gap-1.5">
            {/* View Mode Toggle: Mobile PiP vs Dual Split */}
            <button
              onClick={() => {
                playClickSound();
                setLayoutMode((m) => (m === 'mobile_pip' ? 'split' : 'mobile_pip'));
              }}
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
              id="live-camera-toggle-btn"
              onClick={handleToggleCamera}
              title={isCameraActive ? 'Turn Off Camera (Demo Mode)' : 'Enable AI Camera Tracking'}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer flex items-center gap-1 ${
                isCameraActive 
                  ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                  : 'bg-gray-900/80 border-gray-700 text-gray-400 hover:text-white'
              }`}
            >
              {isCameraActive ? (
                <>
                  <Camera className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px] font-mono font-bold hidden sm:inline">CAM ON</span>
                </>
              ) : (
                <>
                  <CameraOff className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-mono font-bold hidden sm:inline">DEMO</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Head-to-Head HUD Banner */}
        <div className="bg-gray-950/90 rounded-2xl p-3 border border-gray-800/90 shadow-inner mb-3">
          {/* 3-Column Profile & Timer Row */}
          <div className="grid grid-cols-3 items-center text-center gap-2 mb-2">
            {/* Player 1 (You - Red) */}
            <div className="flex flex-col items-center">
              <div className="relative mb-1">
                <div className="w-12 h-12 rounded-xl border-2 border-red-500 bg-red-950/80 flex items-center justify-center font-extrabold text-sm text-red-400 overflow-hidden shadow-[0_0_12px_rgba(239,68,68,0.3)]">
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
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-black flex items-center justify-center text-[7px] font-bold text-white">
                  ✓
                </span>
              </div>
              <span className="text-xs font-extrabold text-white truncate max-w-[85px]">
                {user.name}
              </span>
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-0.5">
                ★ {user.division}
              </span>
              {/* Live Rep Counter */}
              <div className="font-mono text-3xl sm:text-4xl font-extrabold text-red-400 mt-1 leading-none drop-shadow-[0_2px_8px_rgba(239,68,68,0.5)]">
                {userReps}
              </div>
            </div>

            {/* Center: Match Countdown Timer (2-Minute Clash) */}
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
                {isCritical ? 'FINAL SPRINT' : isCameraActive ? 'AI TRACKING' : '2 MIN CLASH'}
              </span>
            </div>

            {/* Player 2 (Opponent - Blue) */}
            <div className="flex flex-col items-center">
              <div className="relative mb-1">
                <div className="w-12 h-12 rounded-xl border-2 border-blue-500 bg-blue-950/80 flex items-center justify-center font-extrabold text-sm text-blue-400 overflow-hidden shadow-[0_0_12px_rgba(59,130,246,0.3)]">
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
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-blue-500 rounded-full border-2 border-black flex items-center justify-center text-[7px] font-bold text-white">
                  ⚔
                </span>
              </div>
              <span className="text-xs font-extrabold text-white truncate max-w-[85px]">
                {opponent.name}
              </span>
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-0.5">
                ⚔ {opponent.division}
              </span>
              {/* Massive Rep Counter */}
              <div className="font-mono text-3xl sm:text-4xl font-extrabold text-blue-400 mt-1 leading-none drop-shadow-[0_2px_8px_rgba(59,130,246,0.5)]">
                {opponentReps}
              </div>
            </div>
          </div>

          {/* Territory Tug-of-War Bar (Red vs Blue Territory) */}
          <div className="relative w-full h-3 rounded-full bg-gray-900 overflow-hidden flex border border-gray-700/80 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-300 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
              style={{ width: `${userPct}%` }}
            />
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
              style={{ width: `${oppPct}%` }}
            />
            {/* Center Split Marker */}
            <div
              className="absolute top-0 bottom-0 w-1.5 bg-white shadow-md transition-all duration-300 -translate-x-1/2"
              style={{ left: `${userPct}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono font-bold text-gray-400 mt-1 px-1">
            <span className="text-red-400">RED TERRITORY {Math.round(userPct)}%</span>
            <span className="text-gray-500 font-sans font-medium">Push-Up Tug of War</span>
            <span className="text-blue-400">BLUE {Math.round(oppPct)}%</span>
          </div>
        </div>

        {/* Live Camera / Arena Stage */}
        {layoutMode === 'mobile_pip' ? (
          /* Mobile Frame with Opponent Picture-in-Picture */
          <div className="relative w-full rounded-2xl overflow-hidden bg-black border border-gray-800 shadow-xl aspect-[4/3] sm:aspect-[16/11]">
            {/* Primary View */}
            {activeMainPlayer === 'user' ? (
              isCameraActive ? (
                <div className="relative w-full h-full bg-black">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                  {/* Subtle Pose Skeleton Canvas Overlay */}
                  <PoseOverlay
                    landmarks={landmarks}
                    metrics={metrics}
                    poseState={poseState}
                    showSkeleton={showSkeleton}
                    videoWidth={videoDimensions.width}
                    videoHeight={videoDimensions.height}
                  />

                  {/* Camera Analysis HUD Overlay */}
                  <div className="absolute inset-0 pointer-events-none p-2 sm:p-3 flex flex-col justify-between z-20">
                    {/* Top Bar: Camera status & Form pill */}
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-black/75 border border-emerald-500/50 backdrop-blur-xs text-[9px] font-mono text-emerald-400 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        <span>● CAMERA ACTIVE // CV POSE</span>
                      </div>
                      <div className="px-2 py-0.5 rounded-lg bg-black/75 border border-amber-500/50 backdrop-blur-xs text-[9px] font-mono text-amber-300 font-bold">
                        STATE: {poseState}
                      </div>
                    </div>

                    {/* Center Feedback Prompt (Real-Time Form Guidance) */}
                    <div className="self-center">
                      <div className={`px-3 py-1 rounded-full text-xs font-extrabold backdrop-blur-md shadow-lg border flex items-center gap-1.5 ${
                        feedback.type === 'good'
                          ? 'bg-emerald-950/85 border-emerald-400 text-emerald-300'
                          : feedback.type === 'action'
                          ? 'bg-amber-950/85 border-amber-400 text-amber-300 animate-pulse'
                          : feedback.type === 'warning'
                          ? 'bg-rose-950/85 border-rose-400 text-rose-300'
                          : 'bg-black/70 border-gray-700 text-gray-300'
                      }`}>
                        {feedback.type === 'good' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                        {feedback.type === 'warning' && <AlertCircle className="w-3.5 h-3.5 text-rose-400" />}
                        <span>{feedback.text}</span>
                      </div>
                    </div>

                    {/* Bottom HUD: Angle & Skeleton Toggle */}
                    <div className="flex items-center justify-between pointer-events-auto">
                      <button
                        onClick={() => setShowSkeleton(!showSkeleton)}
                        className="px-2 py-1 rounded-md bg-black/75 border border-gray-700 text-[9px] font-mono text-gray-300 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        {showSkeleton ? <Eye className="w-3 h-3 text-emerald-400" /> : <EyeOff className="w-3 h-3 text-gray-500" />}
                        <span>{showSkeleton ? 'Pose: ON' : 'Pose: OFF'}</span>
                      </button>

                      {metrics && (
                        <div className="px-2 py-1 rounded-md bg-black/75 border border-gray-700 text-[9px] font-mono text-emerald-400 font-bold">
                          ELBOW: {metrics.smoothedElbowAngle}°
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <AthleteSimulation
                    playerName={user.name}
                    isUser={true}
                    color="red"
                    currentReps={userReps}
                    aiStatus={cameraStatus === 'DENIED' || cameraStatus === 'UNAVAILABLE' ? 'Demo Mode Active' : 'Movement simulation'}
                    customAspect="h-full"
                  />
                  {/* Demo Mode Badge */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 border border-amber-500/60 text-[9px] font-mono text-amber-400 font-bold z-10 flex items-center gap-1">
                    <span>DEMO MODE</span>
                  </div>
                </div>
              )
            ) : (
              <AthleteSimulation
                playerName={opponent.name}
                isUser={false}
                color="blue"
                currentReps={opponentReps}
                aiStatus="Live Cadence • Verified"
                customAspect="h-full"
              />
            )}

            {/* Picture-in-Picture (PiP) Window for Opponent Feed */}
            <div
              onClick={() => setActiveMainPlayer((p) => (p === 'user' ? 'opponent' : 'user'))}
              title="Tap to swap primary feed"
              className="absolute top-2 right-2 z-20 w-28 sm:w-36 rounded-xl overflow-hidden bg-gray-950/95 border-2 border-blue-500/80 shadow-2xl cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            >
              <div className="relative">
                {activeMainPlayer === 'user' ? (
                  <AthleteSimulation
                    playerName={opponent.name}
                    isUser={false}
                    color="blue"
                    currentReps={opponentReps}
                    aiStatus="Live Cadence"
                    compact={true}
                  />
                ) : (
                  <AthleteSimulation
                    playerName={user.name}
                    isUser={true}
                    color="red"
                    currentReps={userReps}
                    aiStatus="Live Telemetry"
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
                <div className="px-3.5 py-1.5 rounded-full bg-red-600 text-white font-mono font-extrabold text-sm sm:text-base shadow-xl border border-white/60">
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
          </div>
        ) : (
          /* Dual Split View (Both athletes split / stacked) */
          <div className="flex flex-col gap-2.5 w-full mb-1">
            {/* User Card / Camera Panel */}
            <div className="relative rounded-2xl overflow-hidden bg-black border-2 border-red-500/80 p-1.5 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <div className="text-[11px] font-mono font-extrabold text-red-400 px-2 py-1 flex justify-between items-center bg-gray-950/60 rounded-lg mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  {user.name} (YOU)
                </span>
                <div className="flex items-center gap-2">
                  {isCameraActive ? (
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-600/60">
                      CV ACTIVE
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono text-amber-400 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-600/60">
                      DEMO MODE
                    </span>
                  )}
                  <span className="bg-red-950/80 border border-red-500/60 px-2 py-0.5 rounded text-red-300 font-mono font-bold">
                    {userReps} REPS
                  </span>
                </div>
              </div>

              {/* Video Panel with Pose Overlay */}
              {isCameraActive ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                  {/* Subtle Pose Skeleton Overlay */}
                  <PoseOverlay
                    landmarks={landmarks}
                    metrics={metrics}
                    poseState={poseState}
                    showSkeleton={showSkeleton}
                    videoWidth={videoDimensions.width}
                    videoHeight={videoDimensions.height}
                  />

                  {/* Live HUD feedback */}
                  <div className="absolute inset-0 pointer-events-none p-2 flex flex-col justify-between z-20">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono text-emerald-400 bg-black/70 px-2 py-0.5 rounded border border-emerald-500/40">
                        ● POSE TRACKER // 720P
                      </span>
                      <span className="text-[9px] font-mono text-amber-300 bg-black/70 px-2 py-0.5 rounded border border-amber-500/40">
                        {poseState}
                      </span>
                    </div>

                    {/* Centered Form Guidance Banner */}
                    <div className="self-center">
                      <div className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold backdrop-blur-md border ${
                        feedback.type === 'good'
                          ? 'bg-emerald-950/85 border-emerald-400 text-emerald-300'
                          : feedback.type === 'action'
                          ? 'bg-amber-950/85 border-amber-400 text-amber-300 animate-pulse'
                          : feedback.type === 'warning'
                          ? 'bg-rose-950/85 border-rose-400 text-rose-300'
                          : 'bg-black/70 border-gray-700 text-gray-300'
                      }`}>
                        {feedback.text}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pointer-events-auto">
                      <button
                        onClick={() => setShowSkeleton(!showSkeleton)}
                        className="px-1.5 py-0.5 rounded bg-black/70 border border-gray-700 text-[8px] font-mono text-gray-300 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        {showSkeleton ? <Eye className="w-2.5 h-2.5 text-emerald-400" /> : <EyeOff className="w-2.5 h-2.5 text-gray-500" />}
                        <span>{showSkeleton ? 'Skeleton: ON' : 'Skeleton: OFF'}</span>
                      </button>

                      {metrics && (
                        <span className="text-[9px] font-mono text-emerald-400 bg-black/70 px-1.5 py-0.5 rounded font-bold">
                          ELBOW: {metrics.smoothedElbowAngle}°
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <AthleteSimulation
                    playerName={user.name}
                    isUser={true}
                    color="red"
                    currentReps={userReps}
                    aiStatus={autoSimulateUser ? 'Demo rep simulation' : 'Tap + COUNT REP below'}
                    compact={true}
                  />
                  {/* Demo mode advice banner */}
                  <div className="absolute bottom-2 left-2 right-2 bg-gray-950/85 border border-gray-800 rounded-lg p-1.5 text-center text-[10px] text-gray-300 flex items-center justify-between">
                    <span className="text-amber-400 font-mono font-bold">Camera off</span>
                    <button
                      onClick={handleToggleCamera}
                      className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/60 text-emerald-300 font-bold hover:bg-emerald-900 cursor-pointer"
                    >
                      Enable Camera
                    </button>
                  </div>
                </div>
              )}

              {/* Floating +1 for User */}
              {userFloats.map((float) => (
                <div
                  key={float.id}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 animate-float-rep"
                >
                  <div className="px-3 py-1 rounded-full bg-red-600 text-white font-mono font-extrabold text-xs shadow-xl border border-white/60">
                    {float.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Opponent Card */}
            <div className="relative rounded-2xl overflow-hidden bg-black border-2 border-blue-500/80 p-1.5 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <div className="text-[11px] font-mono font-extrabold text-blue-400 px-2 py-1 flex justify-between items-center bg-gray-950/60 rounded-lg mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  {opponent.name} (BLUE)
                </span>
                <span className="bg-blue-950/80 border border-blue-500/60 px-2 py-0.5 rounded text-blue-300 font-mono font-bold">
                  {opponentReps} REPS
                </span>
              </div>
              <AthleteSimulation
                playerName={opponent.name}
                isUser={false}
                color="blue"
                currentReps={opponentReps}
                aiStatus="Steady Cadence • Strict Depth"
                compact={true}
              />

              {/* Floating +1 for Opponent */}
              {opponentFloats.map((float) => (
                <div
                  key={float.id}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 animate-float-rep"
                >
                  <div className="px-3 py-1 rounded-full bg-blue-600 text-white font-mono font-extrabold text-xs shadow-xl border border-white/60">
                    {float.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Manual Rep Tap & Quick Automation Bar */}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-400 bg-gray-900/90 rounded-xl p-2 border border-gray-800 gap-1.5 flex-wrap w-full">
          {/* Manual + COUNT REP Button (Crucial fallback for demo or testing) */}
          <button
            id="manual-count-rep-btn"
            onClick={() => triggerUserRep(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-extrabold cursor-pointer text-[11px] shadow-[0_0_12px_rgba(239,68,68,0.4)] active:scale-95 transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ COUNT REP</span>
          </button>

          {/* Auto Reps (Demo simulation) Toggle */}
          <button
            onClick={() => {
              playClickSound();
              setAutoSimulateUser(!autoSimulateUser);
            }}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg font-bold cursor-pointer text-[11px] border ${
              autoSimulateUser
                ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                : 'bg-gray-800 border-gray-700 text-gray-300 hover:text-white'
            }`}
          >
            {autoSimulateUser ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
            <span>{autoSimulateUser ? 'Auto Reps: ON' : 'Auto: OFF'}</span>
          </button>

          {/* 3x Turbo Toggle */}
          <button
            onClick={() => {
              playClickSound();
              setSimSpeed((s) => (s === 1 ? 3 : 1));
            }}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg font-bold cursor-pointer text-[11px] border ${
              simSpeed === 3 
                ? 'bg-amber-950/80 border-amber-500 text-amber-300' 
                : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
            }`}
          >
            <Gauge className="w-3 h-3" />
            <span>{simSpeed === 3 ? '3x Speed' : '1x Normal'}</span>
          </button>

          {/* Jump to final 5 seconds */}
          <button
            onClick={handleJumpToClimax}
            className="px-2 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold cursor-pointer text-[11px]"
          >
            ⏩ Final 5s
          </button>

          {/* Instant Finish */}
          <button
            onClick={handleInstantFinish}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-950/90 border border-emerald-600/80 text-emerald-300 font-extrabold hover:bg-emerald-900 cursor-pointer text-[11px] flex items-center gap-1"
          >
            <Trophy className="w-3 h-3 text-amber-400" />
            <span>Finish Match</span>
          </button>

          {/* Debug panel toggle */}
          <button
            onClick={() => setShowDebug(!showDebug)}
            className={`px-1.5 py-1.5 rounded-lg border text-[10px] font-mono cursor-pointer ${
              showDebug ? 'bg-cyan-950 border-cyan-500 text-cyan-300' : 'bg-gray-800 border-gray-700 text-gray-400'
            }`}
            title="Toggle Pose Debug Telemetry"
          >
            DEBUG
          </button>
        </div>

        {/* Optional Pose Debug Telemetry Panel */}
        {showDebug && (
          <div className="mt-2 p-2.5 rounded-xl bg-gray-950 border border-cyan-800/80 text-[10px] font-mono text-cyan-300 grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <span className="text-gray-500 block">STATUS:</span>
              <strong className="text-white">{cameraStatus}</strong>
            </div>
            <div>
              <span className="text-gray-500 block">STATE:</span>
              <strong className="text-amber-400">{poseState}</strong>
            </div>
            <div>
              <span className="text-gray-500 block">ELBOW ANGLE:</span>
              <strong className="text-white">
                {metrics ? `${metrics.smoothedElbowAngle}° (Raw: ${metrics.elbowAngle}°)` : '0°'}
              </strong>
            </div>
            <div>
              <span className="text-gray-500 block">BODY ALIGN:</span>
              <strong className="text-white">
                {metrics ? `${metrics.bodyAlignmentAngle}°` : '0°'}
              </strong>
            </div>
            <div>
              <span className="text-gray-500 block">SIDE:</span>
              <strong className="text-white">{metrics?.activeSide?.toUpperCase() || 'LEFT'}</strong>
            </div>
            <div>
              <span className="text-gray-500 block">CONFIDENCE:</span>
              <strong className="text-white">{metrics?.confidence ? `${Math.round(metrics.confidence * 100)}%` : '0%'}</strong>
            </div>
            <div>
              <span className="text-gray-500 block">HORIZONTAL:</span>
              <strong className={metrics?.isPlankHorizontal ? 'text-emerald-400' : 'text-rose-400'}>
                {metrics?.isPlankHorizontal ? 'YES' : 'NO'}
              </strong>
            </div>
            <div>
              <span className="text-gray-500 block">FPS:</span>
              <strong className="text-emerald-400">{metrics?.fps || 0}</strong>
            </div>
          </div>
        )}

        {/* Live Telemetry Info Footer */}
        <div className="mt-2 text-center text-[10px] font-mono text-gray-500 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>
            {isCameraActive 
              ? 'Local MediaPipe Tasks Vision • Strict Lockout & Depth • Privacy First' 
              : 'RepRush 1v1 Battle • Real-time Red vs Blue Territory'}
          </span>
        </div>
      </div>
    </div>
  );
};

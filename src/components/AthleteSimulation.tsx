import React, { useEffect, useState } from 'react';

interface AthleteSimulationProps {
  playerName: string;
  isUser?: boolean;
  color: 'red' | 'blue' | 'emerald';
  currentReps: number;
  aiStatus: string;
  compact?: boolean;
  customAspect?: string;
}

export const AthleteSimulation: React.FC<AthleteSimulationProps> = ({
  playerName,
  isUser = false,
  color,
  currentReps,
  aiStatus,
  compact = false,
  customAspect,
}) => {
  // Cycle frame between 0 (top plank) and 1 (bottom chest-down)
  const [phase, setPhase] = useState<number>(0);
  const [repDepthVerified, setRepDepthVerified] = useState(false);

  useEffect(() => {
    // Continuous push-up animation loop (~1.4s per rep)
    const interval = setInterval(() => {
      setPhase((prev) => (prev === 0 ? 1 : 0));
    }, 700);

    return () => clearInterval(interval);
  }, []);

  // When rep count changes, flash verification indicator
  useEffect(() => {
    if (currentReps > 0) {
      setRepDepthVerified(true);
      const t = setTimeout(() => setRepDepthVerified(false), 500);
      return () => clearTimeout(t);
    }
  }, [currentReps]);

  const isDown = phase === 1;
  const accentColor = color === 'emerald' ? '#10B981' : color === 'red' ? '#EF4444' : '#3B82F6';
  const accentBg = color === 'emerald' ? 'bg-emerald-500' : color === 'red' ? 'bg-red-500' : 'bg-blue-500';

  const aspectClass = customAspect || (compact ? 'aspect-video' : 'aspect-4/3');

  return (
    <div className={`relative w-full ${aspectClass} rounded-2xl bg-gray-950 overflow-hidden flex flex-col justify-between ${compact ? 'p-2' : 'p-3'} select-none border border-gray-800`}>
      {/* Subtle tech grid background */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />

      {/* Top HUD: Camera status & AI tracking indicator */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="flex h-2 w-2 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${accentBg} opacity-75`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${accentBg}`} />
          </span>
          <span className="text-[9px] sm:text-[10px] font-mono uppercase font-bold tracking-wider text-gray-300">
            {compact ? playerName : (isUser ? 'LOCAL FEED // CAM-01' : 'REMOTE FEED // 18ms')}
          </span>
        </div>

        {!compact && (
          <div className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/60 border border-gray-700 text-gray-300">
            FPS: 60 • 1080P
          </div>
        )}
      </div>

      {/* Push-up biomechanical skeleton & athlete silhouette */}
      <div className="relative z-10 flex-1 flex items-center justify-center my-1">
        <svg
          viewBox="0 0 320 180"
          className="w-full h-full max-h-48 drop-shadow-lg transition-transform duration-500 ease-in-out"
        >
          {/* Ground Floor Plane */}
          <line
            x1="20"
            y1="150"
            x2="300"
            y2="150"
            stroke="#374151"
            strokeWidth="2"
            strokeDasharray="4 4"
          />

          {/* Depth Target Line */}
          <line
            x1="70"
            y1="130"
            x2="250"
            y2="130"
            stroke={repDepthVerified ? '#10B981' : '#4B5563'}
            strokeWidth="1.5"
            strokeDasharray="2 2"
            className="transition-colors duration-300"
          />
          <text
            x="255"
            y="133"
            fill={repDepthVerified ? '#10B981' : '#6B7280'}
            fontSize="8"
            fontFamily="monospace"
          >
            VALID DEPTH
          </text>

          {/* Biomechanical Joints and Skeleton Coordinates */}
          {/* Top (Plank) vs Down (Chest down) */}
          {/* Feet at (40, 146) */}
          {/* Hips at (130, isDown ? 122 : 98) */}
          {/* Shoulders at (210, isDown ? 120 : 80) */}
          {/* Head at (240, isDown ? 116 : 74) */}
          {/* Hands on ground at (200, 148) */}
          {/* Elbow at (isDown ? 180 : 205, isDown ? 104 : 115) */}

          {/* Leg bone (Feet to Hips) */}
          <line
            x1="45"
            y1="148"
            x2="130"
            y2={isDown ? 124 : 96}
            stroke="#9CA3AF"
            strokeWidth="4"
            strokeLinecap="round"
            className="transition-all duration-500 ease-in-out"
          />

          {/* Torso spine (Hips to Shoulders) */}
          <line
            x1="130"
            y1={isDown ? 124 : 96}
            x2="210"
            y2={isDown ? 120 : 78}
            stroke="#E5E7EB"
            strokeWidth="5"
            strokeLinecap="round"
            className="transition-all duration-500 ease-in-out"
          />

          {/* Arm: Shoulder to Elbow */}
          <line
            x1="210"
            y1={isDown ? 120 : 78}
            x2={isDown ? 185 : 205}
            y2={isDown ? 106 : 115}
            stroke={accentColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            className="transition-all duration-500 ease-in-out"
          />

          {/* Forearm: Elbow to Hand */}
          <line
            x1={isDown ? 185 : 205}
            y1={isDown ? 106 : 115}
            x2="200"
            y2="148"
            stroke={accentColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            className="transition-all duration-500 ease-in-out"
          />

          {/* Head Joint */}
          <circle
            cx="245"
            y={isDown ? 116 : 72}
            r="12"
            fill="#D1D5DB"
            className="transition-all duration-500 ease-in-out"
          />

          {/* Joint Tracking Markers (Computer Vision tracking nodes) */}
          {/* Hand joint */}
          <circle cx="200" cy="148" r="4" fill={accentColor} />
          {/* Elbow joint */}
          <circle
            cx={isDown ? 185 : 205}
            cy={isDown ? 106 : 115}
            r="4.5"
            fill="#F59E0B"
            className="transition-all duration-500 ease-in-out"
          />
          {/* Shoulder joint */}
          <circle
            cx="210"
            cy={isDown ? 120 : 78}
            r="5"
            fill="#10B981"
            className="transition-all duration-500 ease-in-out"
          />
          {/* Hip joint */}
          <circle
            cx="130"
            cy={isDown ? 124 : 96}
            r="4.5"
            fill="#3B82F6"
            className="transition-all duration-500 ease-in-out"
          />
          {/* Foot joint */}
          <circle cx="45" cy="148" r="4" fill="#6B7280" />

          {/* Joint Angle Readout */}
          <text
            x={isDown ? 155 : 215}
            y={isDown ? 98 : 118}
            fill="#F59E0B"
            fontSize="9"
            fontFamily="monospace"
            fontWeight="bold"
            className="transition-all duration-500 ease-in-out"
          >
            {isDown ? '84° [CHEST DOWN]' : '176° [LOCKOUT]'}
          </text>
        </svg>

        {/* Scan line effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-12 w-full pointer-events-none animate-scanLine" />
      </div>

      {/* Bottom HUD bar */}
      <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-gray-300 pt-1.5 border-t border-gray-800">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="truncate max-w-[140px] sm:max-w-none text-emerald-400 font-semibold">
            {repDepthVerified ? 'DEPTH VERIFIED (+1)' : aiStatus}
          </span>
        </div>

        <div className="font-bold text-gray-400">
          FORM: <strong className="text-white">98% STRICT</strong>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useRef } from 'react';
import { NormalizedLandmark } from '../utils/pushupDetector';
import { PushUpMetrics, PoseState } from '../types';

interface PoseOverlayProps {
  landmarks: NormalizedLandmark[] | null;
  metrics: PushUpMetrics | null;
  poseState: PoseState;
  showSkeleton: boolean;
  videoWidth: number;
  videoHeight: number;
}

// MediaPipe Pose connections
const POSE_CONNECTIONS = [
  // Upper body
  [11, 12], // shoulders
  [11, 13], // left shoulder to elbow
  [13, 15], // left elbow to wrist
  [12, 14], // right shoulder to elbow
  [14, 16], // right elbow to wrist
  // Torso
  [11, 23], // left shoulder to hip
  [12, 24], // right shoulder to hip
  [23, 24], // hips
  // Lower body
  [23, 25], // left hip to knee
  [25, 27], // left knee to ankle
  [24, 26], // right hip to knee
  [26, 28], // right knee to ankle
];

export const PoseOverlay: React.FC<PoseOverlayProps> = ({
  landmarks,
  metrics,
  poseState,
  showSkeleton,
  videoWidth,
  videoHeight,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear previous frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!showSkeleton || !landmarks || landmarks.length < 29) {
      return;
    }

    const width = canvas.width;
    const height = canvas.height;

    // Helper to get canvas coordinates
    const getPoint = (idx: number) => {
      const lm = landmarks[idx];
      if (!lm) return null;
      return {
        x: lm.x * width,
        y: lm.y * height,
        visibility: lm.visibility ?? lm.presence ?? 0.8,
      };
    };

    const activeSide = metrics?.activeSide || 'left';
    const isStateBottom = poseState === 'BOTTOM';
    const isStateTop = poseState === 'TOP';

    // Set line styles
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // 1. Draw skeleton connections
    POSE_CONNECTIONS.forEach(([startIdx, endIdx]) => {
      const p1 = getPoint(startIdx);
      const p2 = getPoint(endIdx);
      if (!p1 || !p2 || p1.visibility < 0.3 || p2.visibility < 0.3) return;

      const isArmConnection =
        (activeSide === 'left' && (startIdx === 11 || startIdx === 13) && (endIdx === 13 || endIdx === 15)) ||
        (activeSide === 'right' && (startIdx === 12 || startIdx === 14) && (endIdx === 14 || endIdx === 16));

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);

      if (isArmConnection) {
        // Active working arm
        ctx.strokeStyle = isStateBottom ? '#10B981' : isStateTop ? '#34D399' : '#06B6D4';
        ctx.lineWidth = 3.5;
        ctx.shadowColor = isStateBottom ? 'rgba(16, 185, 129, 0.8)' : 'rgba(6, 182, 212, 0.6)';
        ctx.shadowBlur = 8;
      } else {
        // Subtle body lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 0;
      }
      ctx.stroke();
    });

    // Reset shadow
    ctx.shadowBlur = 0;

    // 2. Draw keypoints
    const keypointIndices = [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28];
    keypointIndices.forEach((idx) => {
      const p = getPoint(idx);
      if (!p || p.visibility < 0.3) return;

      const isActiveArmJoint =
        (activeSide === 'left' && (idx === 11 || idx === 13 || idx === 15)) ||
        (activeSide === 'right' && (idx === 12 || idx === 14 || idx === 16));

      ctx.beginPath();
      ctx.arc(p.x, p.y, isActiveArmJoint ? (idx === (activeSide === 'left' ? 13 : 14) ? 6 : 4.5) : 3, 0, Math.PI * 2);

      if (isActiveArmJoint) {
        ctx.fillStyle = idx === (activeSide === 'left' ? 13 : 14) ? '#F59E0B' : '#10B981';
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fill();
      }
    });

    // 3. Draw elbow angle indicator over the active elbow
    const elbowIdx = activeSide === 'left' ? 13 : 14;
    const elbowPt = getPoint(elbowIdx);
    if (elbowPt && metrics && metrics.smoothedElbowAngle > 0) {
      const angle = metrics.smoothedElbowAngle;
      const angleText = `${angle}°`;

      ctx.save();
      // Draw label pill above elbow
      ctx.font = 'bold 11px monospace';
      const textMetrics = ctx.measureText(angleText);
      const padding = 4;
      const pillWidth = textMetrics.width + padding * 2;
      const pillHeight = 16;
      const pillX = elbowPt.x + 8;
      const pillY = elbowPt.y - 12;

      ctx.fillStyle = isStateBottom ? 'rgba(16, 185, 129, 0.9)' : isStateTop ? 'rgba(52, 211, 153, 0.9)' : 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = isStateBottom ? '#10B981' : '#F59E0B';
      ctx.lineWidth = 1;

      // Rounded rect
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillWidth, pillHeight, 4);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(angleText, pillX + padding, pillY + 12);
      ctx.restore();
    }
  }, [landmarks, metrics, poseState, showSkeleton, videoWidth, videoHeight]);

  return (
    <canvas
      ref={canvasRef}
      width={videoWidth || 640}
      height={videoHeight || 480}
      className="absolute inset-0 w-full h-full object-cover pointer-events-none transform -scale-x-100 z-10"
    />
  );
};

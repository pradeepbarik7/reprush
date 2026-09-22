import { useState, useEffect, useRef, useCallback } from 'react';
import { CameraStatus, PoseState, FormFeedback, PushUpMetrics } from '../types';
import { PushUpDetector, NormalizedLandmark, PushUpConfig } from '../utils/pushupDetector';
import { poseDetectionService } from '../services/poseDetectionService';

interface UsePoseDetectionOptions {
  onValidRep?: (repCount: number, metrics: PushUpMetrics) => void;
  config?: Partial<PushUpConfig>;
  enabled?: boolean;
}

export function usePoseDetection({
  onValidRep,
  config,
  enabled = true,
}: UsePoseDetectionOptions = {}) {
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>('IDLE');
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [poseState, setPoseState] = useState<PoseState>('READY');
  const [feedback, setFeedback] = useState<FormFeedback>({
    text: 'SET UP SIDEWAYS TO CAMERA',
    type: 'neutral',
  });
  const [metrics, setMetrics] = useState<PushUpMetrics | null>(null);
  const [landmarks, setLandmarks] = useState<NormalizedLandmark[] | null>(null);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [videoDimensions, setVideoDimensions] = useState({ width: 640, height: 480 });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const detectorRef = useRef<PushUpDetector | null>(null);
  const isRunningRef = useRef(false);
  const lastFrameTimeRef = useRef<number>(0);
  const fpsCountRef = useRef({ frames: 0, lastTime: performance.now(), currentFps: 30 });

  // Initialize detector instance
  if (!detectorRef.current) {
    detectorRef.current = new PushUpDetector(config);
  }

  // Update callbacks
  useEffect(() => {
    if (detectorRef.current) {
      detectorRef.current.setCallbacks(
        (count, met) => {
          if (onValidRep) onValidRep(count, met);
        },
        (state, fb) => {
          setPoseState(state);
          setFeedback(fb);
        }
      );
    }
  }, [onValidRep]);

  // Main pose estimation frame loop
  const runDetectionLoop = useCallback(() => {
    if (!isRunningRef.current) return;

    const video = videoRef.current;
    if (video && video.readyState >= 2 && !video.paused && !video.ended) {
      const now = performance.now();

      // Measure FPS
      fpsCountRef.current.frames++;
      if (now - fpsCountRef.current.lastTime >= 1000) {
        fpsCountRef.current.currentFps = Math.round(
          (fpsCountRef.current.frames * 1000) / (now - fpsCountRef.current.lastTime)
        );
        fpsCountRef.current.frames = 0;
        fpsCountRef.current.lastTime = now;
      }

      // Check video size updates
      if (
        video.videoWidth > 0 &&
        video.videoHeight > 0 &&
        (video.videoWidth !== videoDimensions.width || video.videoHeight !== videoDimensions.height)
      ) {
        setVideoDimensions({ width: video.videoWidth, height: video.videoHeight });
      }

      // Process video frame with MediaPipe Pose Landmarker
      if (poseDetectionService.isReady()) {
        try {
          const result = poseDetectionService.detectVideo(video, now);
          if (result && result.landmarks && result.landmarks.length > 0) {
            const rawLandmarks = result.landmarks[0] as NormalizedLandmark[];
            setLandmarks(rawLandmarks);

            if (detectorRef.current) {
              const res = detectorRef.current.processLandmarks(rawLandmarks, now);
              res.metrics.fps = fpsCountRef.current.currentFps;
              setMetrics(res.metrics);
              setPoseState(res.state);
              setFeedback(res.feedback);
            }
          } else {
            setLandmarks(null);
            if (detectorRef.current) {
              const res = detectorRef.current.processLandmarks([], now);
              setFeedback(res.feedback);
            }
          }
        } catch (err) {
          console.warn('Pose detection frame error:', err);
        }
      }
    }

    animFrameIdRef.current = requestAnimationFrame(runDetectionLoop);
  }, [videoDimensions.width, videoDimensions.height]);

  // Start Camera and load AI model
  const startCamera = useCallback(async (): Promise<boolean> => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraStatus('UNAVAILABLE');
      setFeedback({ text: 'CAMERA NOT SUPPORTED', type: 'warning' });
      return false;
    }

    try {
      setCameraStatus('REQUESTING');
      setFeedback({ text: 'STARTING CAMERA...', type: 'neutral' });

      // Request media stream (720p ideal with standard mobile fallback)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          facingMode: 'user',
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch((e) => console.warn('Video play interrupted:', e));
      }

      setCameraStatus('ACTIVE');

      // Initialize MediaPipe PoseLandmarker model in background if not already loaded
      if (!poseDetectionService.isReady()) {
        setIsModelLoading(true);
        setFeedback({ text: 'LOADING AI POSE MODEL...', type: 'neutral' });
        try {
          await poseDetectionService.getPoseLandmarker();
          setIsModelLoading(false);
          setFeedback({ text: 'PLACE PHONE SIDEWAYS', type: 'good' });
        } catch (modelErr) {
          console.error('Failed to load MediaPipe model:', modelErr);
          setIsModelLoading(false);
          setFeedback({ text: 'AI MODEL FAILED — DEMO READY', type: 'warning' });
        }
      } else {
        setFeedback({ text: 'PLACE PHONE SIDEWAYS', type: 'good' });
      }

      // Start animation loop
      isRunningRef.current = true;
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = requestAnimationFrame(runDetectionLoop);

      return true;
    } catch (err: any) {
      console.warn('Camera access denied or failed:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraStatus('DENIED');
        setFeedback({ text: 'CAMERA PERMISSION DENIED', type: 'warning' });
      } else {
        setCameraStatus('ERROR');
        setFeedback({ text: 'CAMERA ERROR — DEMO MODE', type: 'warning' });
      }
      return false;
    }
  }, [runDetectionLoop]);

  // Stop camera tracks and loop
  const stopCamera = useCallback(() => {
    isRunningRef.current = false;
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (detectorRef.current) {
      detectorRef.current.reset();
    }

    setCameraStatus('IDLE');
    setLandmarks(null);
    setMetrics(null);
    setPoseState('READY');
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isRunningRef.current = false;
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return {
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
    resetDetector: () => detectorRef.current?.reset(),
  };
}

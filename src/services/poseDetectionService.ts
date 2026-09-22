import { FilesetResolver, PoseLandmarker, PoseLandmarkerResult } from '@mediapipe/tasks-vision';

class PoseDetectionService {
  private poseLandmarker: PoseLandmarker | null = null;
  private isInitializing: boolean = false;
  private initPromise: Promise<PoseLandmarker> | null = null;

  /**
   * Initializes or returns the cached PoseLandmarker instance
   */
  public async getPoseLandmarker(): Promise<PoseLandmarker> {
    if (this.poseLandmarker) {
      return this.poseLandmarker;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.isInitializing = true;
    this.initPromise = (async () => {
      try {
        // Load WebAssembly assets for MediaPipe Tasks Vision
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm'
        );

        // Create PoseLandmarker using the fast and lightweight float16 lite model
        const landmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numPoses: 1,
          minPoseDetectionConfidence: 0.5,
          minPosePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        this.poseLandmarker = landmarker;
        this.isInitializing = false;
        return landmarker;
      } catch (err) {
        this.isInitializing = false;
        this.initPromise = null;
        console.warn('Failed to initialize GPU delegate, falling back to CPU...', err);

        // Fallback to CPU delegate if WebGL/GPU is unavailable
        try {
          const vision = await FilesetResolver.forVisionTasks(
            'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm'
          );
          const landmarker = await PoseLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath:
                'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
              delegate: 'CPU',
            },
            runningMode: 'VIDEO',
            numPoses: 1,
            minPoseDetectionConfidence: 0.5,
            minPosePresenceConfidence: 0.5,
            minTrackingConfidence: 0.5,
          });
          this.poseLandmarker = landmarker;
          return landmarker;
        } catch (cpuErr) {
          console.error('Fatal error loading MediaPipe Pose Landmarker:', cpuErr);
          throw cpuErr;
        }
      }
    })();

    return this.initPromise;
  }

  /**
   * Detect pose landmarks in a video element at a specific timestamp
   */
  public detectVideo(video: HTMLVideoElement, timestampMs: number): PoseLandmarkerResult | null {
    if (!this.poseLandmarker) return null;
    try {
      return this.poseLandmarker.detectForVideo(video, timestampMs);
    } catch (e) {
      console.warn('MediaPipe detectForVideo frame skipped:', e);
      return null;
    }
  }

  public isReady(): boolean {
    return this.poseLandmarker !== null;
  }

  public isLoading(): boolean {
    return this.isInitializing;
  }

  public dispose(): void {
    if (this.poseLandmarker) {
      this.poseLandmarker.close();
      this.poseLandmarker = null;
    }
    this.initPromise = null;
    this.isInitializing = false;
  }
}

export const poseDetectionService = new PoseDetectionService();

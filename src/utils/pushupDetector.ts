import { PoseState, PushUpMetrics, FormFeedback } from '../types';

export interface PushUpConfig {
  topAngle: number;           // Extended lockout angle threshold (deg)
  bottomAngle: number;        // Deep chest-to-floor depth threshold (deg)
  minConfidence: number;      // Minimum landmark confidence
  minimumRepDurationMs: number; // Anti-bounce minimum duration
  maximumRepDurationMs: number; // Max allowed duration for single rep
  minBodyAlignmentAngle: number; // Straight body line (shoulder-hip-ankle)
  repCooldownMs: number;      // Debounce window between reps
  smoothingWindow: number;    // Number of frames for moving average
}

export const DEFAULT_PUSHUP_CONFIG: PushUpConfig = {
  topAngle: 152,
  bottomAngle: 95,
  minConfidence: 0.45,
  minimumRepDurationMs: 380,
  maximumRepDurationMs: 5000,
  minBodyAlignmentAngle: 135,
  repCooldownMs: 350,
  smoothingWindow: 5,
};

export interface NormalizedLandmark {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
  presence?: number;
}

export class PushUpDetector {
  private config: PushUpConfig;
  private state: PoseState = 'READY';
  private angleHistory: number[] = [];
  private repStartTime: number = 0;
  private lastRepTime: number = 0;
  private repCount: number = 0;
  private onValidRepCallback?: (repCount: number, metrics: PushUpMetrics) => void;
  private onStateChangeCallback?: (state: PoseState, feedback: FormFeedback) => void;

  constructor(
    config: Partial<PushUpConfig> = {},
    onValidRep?: (repCount: number, metrics: PushUpMetrics) => void,
    onStateChange?: (state: PoseState, feedback: FormFeedback) => void
  ) {
    this.config = { ...DEFAULT_PUSHUP_CONFIG, ...config };
    this.onValidRepCallback = onValidRep;
    this.onStateChangeCallback = onStateChange;
  }

  public reset(): void {
    this.state = 'READY';
    this.angleHistory = [];
    this.repStartTime = 0;
    this.lastRepTime = 0;
    this.repCount = 0;
  }

  public setCallbacks(
    onValidRep?: (repCount: number, metrics: PushUpMetrics) => void,
    onStateChange?: (state: PoseState, feedback: FormFeedback) => void
  ): void {
    this.onValidRepCallback = onValidRep;
    this.onStateChangeCallback = onStateChange;
  }

  /**
   * Process raw MediaPipe landmarks for single frame
   */
  public processLandmarks(landmarks: NormalizedLandmark[], timestampMs: number): {
    state: PoseState;
    feedback: FormFeedback;
    metrics: PushUpMetrics;
  } {
    if (!landmarks || landmarks.length < 29) {
      const feedback: FormFeedback = { text: 'MOVE INTO FRAME', type: 'warning' };
      this.state = 'READY';
      return {
        state: this.state,
        feedback,
        metrics: this.getEmptyMetrics(),
      };
    }

    // MediaPipe Pose landmark indices:
    // 11: left_shoulder, 12: right_shoulder
    // 13: left_elbow,    14: right_elbow
    // 15: left_wrist,    16: right_wrist
    // 23: left_hip,      24: right_hip
    // 25: left_knee,     26: right_knee
    // 27: left_ankle,    28: right_ankle
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftElbow = landmarks[13];
    const rightElbow = landmarks[14];
    const leftWrist = landmarks[15];
    const rightWrist = landmarks[16];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    const leftKnee = landmarks[25];
    const rightKnee = landmarks[26];
    const leftAnkle = landmarks[27];
    const rightAnkle = landmarks[28];

    // Check visibility confidence on left vs right side
    const leftScore = this.calcSideConfidence([leftShoulder, leftElbow, leftWrist, leftHip]);
    const rightScore = this.calcSideConfidence([rightShoulder, rightElbow, rightWrist, rightHip]);

    const activeSide: 'left' | 'right' = leftScore >= rightScore ? 'left' : 'right';
    const activeScore = Math.max(leftScore, rightScore);

    if (activeScore < this.config.minConfidence) {
      const feedback: FormFeedback = { text: 'MOVE INTO FULL VIEW', type: 'warning' };
      return {
        state: this.state,
        feedback,
        metrics: this.getEmptyMetrics(activeSide, activeScore),
      };
    }

    // Select active side landmarks
    const shoulder = activeSide === 'left' ? leftShoulder : rightShoulder;
    const elbow = activeSide === 'left' ? leftElbow : rightElbow;
    const wrist = activeSide === 'left' ? leftWrist : rightWrist;
    const hip = activeSide === 'left' ? leftHip : rightHip;
    const knee = activeSide === 'left' ? leftKnee : rightKnee;
    const ankle = activeSide === 'left' ? leftAnkle : rightAnkle;

    // Calculate elbow flexion angle: shoulder -> elbow -> wrist
    const rawElbowAngle = this.calculateAngle(shoulder, elbow, wrist);

    // Apply moving average smoothing
    this.angleHistory.push(rawElbowAngle);
    if (this.angleHistory.length > this.config.smoothingWindow) {
      this.angleHistory.shift();
    }
    const smoothedElbowAngle =
      this.angleHistory.reduce((sum, a) => sum + a, 0) / this.angleHistory.length;

    // Calculate body alignment angle: shoulder -> hip -> ankle (fallback to knee if ankle out of frame)
    const lowerPoint = (ankle && (ankle.visibility ?? 1) > 0.3) ? ankle : knee;
    const bodyAlignmentAngle = this.calculateAngle(shoulder, hip, lowerPoint);

    // Check plank horizontality (pushup vs standing upright)
    // In horizontal pushup, torso vector dx is significant compared to dy
    const torsoDx = Math.abs(shoulder.x - hip.x);
    const torsoDy = Math.abs(shoulder.y - hip.y);
    const isPlankHorizontal = torsoDx > torsoDy * 0.45;

    // Check if user is standing upright
    const isStandingUpright = torsoDy > torsoDx * 1.8;

    let feedback: FormFeedback = { text: 'TRACKING POSE', type: 'neutral' };
    const now = timestampMs || Date.now();

    if (isStandingUpright) {
      this.state = 'READY';
      feedback = { text: 'GET INTO PUSH-UP POSITION', type: 'warning' };
    } else if (bodyAlignmentAngle < this.config.minBodyAlignmentAngle) {
      feedback = { text: 'KEEP BODY STRAIGHT', type: 'warning' };
    } else {
      // Execute Push-Up State Machine
      switch (this.state) {
        case 'READY': {
          if (smoothedElbowAngle >= this.config.topAngle && isPlankHorizontal) {
            this.state = 'TOP';
            feedback = { text: 'READY — START PUSH-UP', type: 'good' };
            this.notifyStateChange(feedback);
          } else {
            feedback = { text: 'EXTEND ARMS TO LOCKOUT', type: 'neutral' };
          }
          break;
        }

        case 'TOP': {
          feedback = { text: 'LOCKED OUT — GO DOWN', type: 'neutral' };
          // Begin descent when elbow angle drops noticeably below lockout
          if (smoothedElbowAngle < this.config.topAngle - 15) {
            this.state = 'GOING_DOWN';
            this.repStartTime = now;
            feedback = { text: 'GOING DOWN...', type: 'action' };
            this.notifyStateChange(feedback);
          }
          break;
        }

        case 'GOING_DOWN': {
          feedback = { text: 'LOWER CHEST TO FLOOR', type: 'action' };
          if (smoothedElbowAngle <= this.config.bottomAngle) {
            this.state = 'BOTTOM';
            feedback = { text: 'GREAT DEPTH — PUSH UP!', type: 'good' };
            this.notifyStateChange(feedback);
          } else if (smoothedElbowAngle > this.config.topAngle - 5) {
            // Returned to top without reaching bottom depth
            this.state = 'TOP';
            feedback = { text: 'MORE DEPTH REQUIRED', type: 'warning' };
            this.notifyStateChange(feedback);
          }
          break;
        }

        case 'BOTTOM': {
          feedback = { text: 'BOTTOM REACHED — PUSH!', type: 'good' };
          // Begin ascent
          if (smoothedElbowAngle > this.config.bottomAngle + 15) {
            this.state = 'GOING_UP';
            feedback = { text: 'PUSH TO LOCKOUT', type: 'action' };
            this.notifyStateChange(feedback);
          }
          // Guard against staying at bottom indefinitely
          if (now - this.repStartTime > this.config.maximumRepDurationMs) {
            this.state = 'READY';
            feedback = { text: 'RESETTING POSE', type: 'neutral' };
            this.notifyStateChange(feedback);
          }
          break;
        }

        case 'GOING_UP': {
          feedback = { text: 'EXTEND FULLY', type: 'action' };
          if (smoothedElbowAngle >= this.config.topAngle) {
            const repDuration = now - this.repStartTime;
            const cooldownPassed = now - this.lastRepTime >= this.config.repCooldownMs;

            // Anti-false-positive checks: minimum duration, maximum duration, cooldown
            if (
              repDuration >= this.config.minimumRepDurationMs &&
              repDuration <= this.config.maximumRepDurationMs &&
              cooldownPassed
            ) {
              // VALID STRICT REP CONFIRMED!
              this.repCount += 1;
              this.lastRepTime = now;
              this.state = 'TOP';
              feedback = { text: 'VALID REP! +1', type: 'good' };

              const metricsResult: PushUpMetrics = {
                elbowAngle: Math.round(rawElbowAngle),
                smoothedElbowAngle: Math.round(smoothedElbowAngle),
                activeSide,
                bodyAlignmentAngle: Math.round(bodyAlignmentAngle),
                confidence: Math.round(activeScore * 100) / 100,
                isPlankHorizontal,
                lastRepDurationMs: Math.round(repDuration),
                fps: 0,
              };

              if (this.onValidRepCallback) {
                this.onValidRepCallback(this.repCount, metricsResult);
              }
              this.notifyStateChange(feedback);
            } else if (repDuration < this.config.minimumRepDurationMs) {
              // Too fast / bounce
              this.state = 'TOP';
              feedback = { text: 'TOO FAST — CONTROL REP', type: 'warning' };
              this.notifyStateChange(feedback);
            } else {
              this.state = 'TOP';
              feedback = { text: 'REP TIMED OUT', type: 'warning' };
              this.notifyStateChange(feedback);
            }
          }
          break;
        }
      }
    }

    const metrics: PushUpMetrics = {
      elbowAngle: Math.round(rawElbowAngle),
      smoothedElbowAngle: Math.round(smoothedElbowAngle),
      activeSide,
      bodyAlignmentAngle: Math.round(bodyAlignmentAngle),
      confidence: Math.round(activeScore * 100) / 100,
      isPlankHorizontal,
      lastRepDurationMs: 0,
      fps: 0,
    };

    return {
      state: this.state,
      feedback,
      metrics,
    };
  }

  private notifyStateChange(feedback: FormFeedback): void {
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(this.state, feedback);
    }
  }

  private calcSideConfidence(points: (NormalizedLandmark | undefined)[]): number {
    let sum = 0;
    let count = 0;
    for (const pt of points) {
      if (pt) {
        sum += pt.visibility ?? pt.presence ?? 0.8;
        count++;
      }
    }
    return count > 0 ? sum / count : 0;
  }

  /**
   * Calculate angle in degrees between vectors BA and BC (at vertex B)
   */
  public calculateAngle(
    a: NormalizedLandmark,
    b: NormalizedLandmark,
    c: NormalizedLandmark
  ): number {
    const baX = a.x - b.x;
    const baY = a.y - b.y;
    const bcX = c.x - b.x;
    const bcY = c.y - b.y;

    const dotProduct = baX * bcX + baY * bcY;
    const magBA = Math.sqrt(baX * baX + baY * baY);
    const magBC = Math.sqrt(bcX * bcX + bcY * bcY);

    if (magBA === 0 || magBC === 0) return 180;

    const cosAngle = Math.max(-1, Math.min(1, dotProduct / (magBA * magBC)));
    const angleRad = Math.acos(cosAngle);
    return (angleRad * 180) / Math.PI;
  }

  private getEmptyMetrics(side: 'left' | 'right' = 'left', confidence = 0): PushUpMetrics {
    return {
      elbowAngle: 0,
      smoothedElbowAngle: 0,
      activeSide: side,
      bodyAlignmentAngle: 0,
      confidence,
      isPlankHorizontal: false,
      lastRepDurationMs: 0,
      fps: 0,
    };
  }
}

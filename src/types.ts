export interface SceneSettings {
  recipientName: string;
  dedicationMessage: string;
  timeOfDay: number; // 0 (golden hour sunset) to 1 (deep twilight night)
  windStrength: number; // 0.2 to 2.0
  petalDensity: number; // 30 to 200
  showCard: boolean;
  showFireflies: boolean;
  showStars: boolean;
  audioPlaying: boolean;
}

export interface Petal {
  x: number;
  y: number;
  z: number; // depth 0.4 - 1.2
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  flutterPhase: number;
  flutterSpeed: number;
  size: number;
  color: string;
  opacity: number;
}

export interface Flower {
  x: number;
  baseY: number;
  stemLength: number;
  headRadius: number;
  petalCount: number;
  petalLength: number;
  petalColor: string;
  petalHighlight: string;
  centerColor: string;
  phase: number;
  flexibility: number;
  layer: number; // 0: back, 1: mid, 2: front
  tiltAngle: number;
}

export interface Firefly {
  x: number;
  y: number;
  baseY: number;
  vx: number;
  phase: number;
  pulseSpeed: number;
  size: number;
  hue: number;
}

export interface Star {
  x: number;
  y: number;
  size: number;
  brightness: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

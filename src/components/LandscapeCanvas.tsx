import React, { useEffect, useRef, useCallback } from 'react';
import { Flower, Petal, Firefly, Star, SceneSettings } from '../types';

interface LandscapeCanvasProps {
  settings: SceneSettings;
  onCanvasClick?: (x: number, y: number) => void;
}

export const LandscapeCanvas: React.FC<LandscapeCanvasProps> = ({ settings, onCanvasClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Animation state refs to prevent recreation
  const animationFrameId = useRef<number | null>(null);
  const flowersRef = useRef<Flower[]>([]);
  const petalsRef = useRef<Petal[]>([]);
  const firefliesRef = useRef<Firefly[]>([]);
  const starsRef = useRef<Star[]>([]);
  const burstPetalsRef = useRef<Petal[]>([]);
  const timeRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());
  const dimensionsRef = useRef<{ width: number; height: number }>({ width: 1200, height: 800 });

  // Initialize scene entities
  const initEntities = useCallback((width: number, height: number, density: number) => {
    // 1. Stars (in upper 45% of screen)
    const newStars: Star[] = [];
    const starCount = Math.floor(width * 0.08);
    for (let i = 0; i < starCount; i++) {
      newStars.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.45),
        size: 0.8 + Math.random() * 1.8,
        brightness: 0.3 + Math.random() * 0.7,
        twinkleSpeed: 1.5 + Math.random() * 3.0,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }
    starsRef.current = newStars;

    // 2. Falling Petals
    const newPetals: Petal[] = [];
    const colors = ['#ffd700', '#ffeb3b', '#ffc107', '#ffea00', '#ffe082', '#ffb300'];
    for (let i = 0; i < density; i++) {
      const z = 0.5 + Math.random() * 0.8;
      newPetals.push({
        x: Math.random() * (width + 150),
        y: Math.random() * height,
        z,
        vx: (0.3 + Math.random() * 0.8) * z,
        vy: (1.0 + Math.random() * 1.5) * z,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.04,
        flutterPhase: Math.random() * Math.PI * 2,
        flutterSpeed: 1.8 + Math.random() * 2.2,
        size: (12 + Math.random() * 10) * z,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 0.75 + Math.random() * 0.25,
      });
    }
    petalsRef.current = newPetals;

    // 3. Fireflies
    const newFireflies: Firefly[] = [];
    const fireflyCount = Math.floor(Math.max(25, width * 0.035));
    for (let i = 0; i < fireflyCount; i++) {
      const y = height * 0.48 + Math.random() * (height * 0.45);
      newFireflies.push({
        x: Math.random() * width,
        y,
        baseY: y,
        vx: (Math.random() - 0.5) * 0.8,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 1.6 + Math.random() * 2.4,
        size: 2.5 + Math.random() * 3.0,
        hue: 45 + Math.random() * 15,
      });
    }
    firefliesRef.current = newFireflies;

    // 4. Yellow Flowers Field in 3 Depth Layers
    const newFlowers: Flower[] = [];
    const petalPalettes = [
      { main: '#ffd700', highlight: '#fff176', center: '#4e2608' },
      { main: '#ffca28', highlight: '#fff9c4', center: '#3e1f06' },
      { main: '#ffc107', highlight: '#ffe082', center: '#5d2e0a' },
      { main: '#ffeb3b', highlight: '#ffffff', center: '#4a2507' },
    ];

    // Layer 0: Background distant flowers
    const backCount = Math.floor(width * 0.05);
    for (let i = 0; i < backCount; i++) {
      const pal = petalPalettes[Math.floor(Math.random() * petalPalettes.length)];
      newFlowers.push({
        x: Math.random() * width,
        baseY: height * 0.72 + Math.random() * (height * 0.1),
        stemLength: 50 + Math.random() * 40,
        headRadius: 7 + Math.random() * 4,
        petalCount: 10 + Math.floor(Math.random() * 4),
        petalLength: 16 + Math.random() * 10,
        petalColor: pal.main,
        petalHighlight: pal.highlight,
        centerColor: pal.center,
        phase: Math.random() * Math.PI * 2,
        flexibility: 0.6 + Math.random() * 0.5,
        layer: 0,
        tiltAngle: (Math.random() - 0.5) * 0.3,
      });
    }

    // Layer 1: Midground flowers
    const midCount = Math.floor(width * 0.065);
    for (let i = 0; i < midCount; i++) {
      const pal = petalPalettes[Math.floor(Math.random() * petalPalettes.length)];
      newFlowers.push({
        x: Math.random() * width,
        baseY: height * 0.81 + Math.random() * (height * 0.12),
        stemLength: 85 + Math.random() * 55,
        headRadius: 11 + Math.random() * 5,
        petalCount: 12 + Math.floor(Math.random() * 4),
        petalLength: 25 + Math.random() * 14,
        petalColor: pal.main,
        petalHighlight: pal.highlight,
        centerColor: pal.center,
        phase: Math.random() * Math.PI * 2,
        flexibility: 0.8 + Math.random() * 0.6,
        layer: 1,
        tiltAngle: (Math.random() - 0.5) * 0.35,
      });
    }

    // Layer 2: Foreground prominent sunflowers & wildflowers
    const foreCount = Math.floor(width * 0.038);
    for (let i = 0; i < foreCount; i++) {
      const pal = petalPalettes[Math.floor(Math.random() * petalPalettes.length)];
      newFlowers.push({
        x: Math.random() * width,
        baseY: height * 0.91 + Math.random() * (height * 0.12),
        stemLength: 135 + Math.random() * 75,
        headRadius: 17 + Math.random() * 8,
        petalCount: 14 + Math.floor(Math.random() * 6),
        petalLength: 40 + Math.random() * 22,
        petalColor: pal.main,
        petalHighlight: pal.highlight,
        centerColor: pal.center,
        phase: Math.random() * Math.PI * 2,
        flexibility: 0.9 + Math.random() * 0.7,
        layer: 2,
        tiltAngle: (Math.random() - 0.5) * 0.4,
      });
    }

    // Sort flowers so background layers render first
    newFlowers.sort((a, b) => a.layer - b.layer || a.baseY - b.baseY);
    flowersRef.current = newFlowers;
  }, []);

  // Spawn petal burst on click/touch
  const triggerPetalBurst = useCallback((clickX: number, clickY: number) => {
    const burstCount = 18;
    const colors = ['#ffd700', '#fff59d', '#ffeb3b', '#ffc107'];
    const newBursts: Petal[] = [];

    for (let i = 0; i < burstCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.0 + Math.random() * 4.5;
      newBursts.push({
        x: clickX,
        y: clickY,
        z: 0.8 + Math.random() * 0.5,
        vx: Math.cos(angle) * speed + 1.2,
        vy: Math.sin(angle) * speed - 2.8,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.15,
        flutterPhase: Math.random() * Math.PI * 2,
        flutterSpeed: 3.5 + Math.random() * 2.0,
        size: 14 + Math.random() * 12,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 1.0,
      });
    }

    burstPetalsRef.current = [...burstPetalsRef.current, ...newBursts];
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    triggerPetalBurst(x, y);
    if (onCanvasClick) onCanvasClick(x, y);
  };

  // Resize observer to ensure sharp, responsive canvas
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width <= 0 || height <= 0) continue;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        dimensionsRef.current = { width, height };
        initEntities(width, height, settings.petalDensity);
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [initEntities, settings.petalDensity]);

  // Main Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const render = (now: number) => {
      if (!isRunning) return;

      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;
      timeRef.current += dt;

      const t = timeRef.current;
      const { width, height } = dimensionsRef.current;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const dusk = settings.timeOfDay; // 0 = warm golden dusk, 1 = deep romantic twilight
      const windFactor = settings.windStrength * (0.6 + 0.4 * Math.sin(t * 0.7) + 0.2 * Math.cos(t * 1.5));

      // -------------------------------------------------------------
      // 1. SKY GRADIENT: WARM SUNSET DIP TRANSITIONING INTO TWILIGHT
      // -------------------------------------------------------------
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      
      if (dusk < 0.5) {
        // Golden hour transitioning to early dusk
        const p = dusk * 2;
        skyGrad.addColorStop(0, interpolateColor('#1a1235', '#100a26', p));
        skyGrad.addColorStop(0.35, interpolateColor('#7c2948', '#571c3c', p));
        skyGrad.addColorStop(0.65, interpolateColor('#d85d34', '#a64536', p));
        skyGrad.addColorStop(0.85, interpolateColor('#f79738', '#df782e', p));
        skyGrad.addColorStop(1.0, interpolateColor('#fdd365', '#f8b446', p));
      } else {
        // Early dusk transitioning to romantic deep twilight night
        const p = (dusk - 0.5) * 2;
        skyGrad.addColorStop(0, interpolateColor('#100a26', '#090514', p));
        skyGrad.addColorStop(0.35, interpolateColor('#571c3c', '#2c122c', p));
        skyGrad.addColorStop(0.65, interpolateColor('#a64536', '#592036', p));
        skyGrad.addColorStop(0.85, interpolateColor('#df782e', '#913f2c', p));
        skyGrad.addColorStop(1.0, interpolateColor('#f8b446', '#c46927', p));
      }

      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // -------------------------------------------------------------
      // 2. SUN HORIZON BLOOM / WARM HAZE
      // -------------------------------------------------------------
      const sunY = height * (0.64 + dusk * 0.1);
      const sunX = width * 0.5;
      const sunRadius = Math.max(width * 0.35, 280);
      const sunGrad = ctx.createRadialGradient(sunX, sunY, 15, sunX, sunY, sunRadius);
      const sunAlpha = (1.0 - dusk * 0.5) * 0.55;

      sunGrad.addColorStop(0, `rgba(255, 235, 175, ${sunAlpha})`);
      sunGrad.addColorStop(0.35, `rgba(255, 170, 70, ${sunAlpha * 0.65})`);
      sunGrad.addColorStop(0.7, `rgba(220, 80, 50, ${sunAlpha * 0.25})`);
      sunGrad.addColorStop(1, 'rgba(180, 50, 40, 0)');

      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
      ctx.fill();

      // -------------------------------------------------------------
      // 3. TWILIGHT STARS
      // -------------------------------------------------------------
      if (settings.showStars) {
        ctx.save();
        const starVisibility = Math.min(1.0, 0.35 + dusk * 0.65);
        for (const star of starsRef.current) {
          const twinkle = (Math.sin(t * star.twinkleSpeed + star.twinklePhase) + 1) * 0.5;
          const alpha = star.brightness * (0.4 + twinkle * 0.6) * starVisibility;
          ctx.fillStyle = `rgba(255, 248, 220, ${alpha})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // -------------------------------------------------------------
      // 4. ROLLING HILLS SILHOUETTES (WARM TWILIGHT ATMOSPHERE)
      // -------------------------------------------------------------
      // Distant hill
      ctx.fillStyle = dusk < 0.5 ? '#43263b' : '#27172b';
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width + 30; x += 30) {
        const y = height * 0.57 + Math.sin(x * 0.003 + 0.8) * 40 + Math.cos(x * 0.007) * 16;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      // Mid hill
      ctx.fillStyle = dusk < 0.5 ? '#2b3123' : '#19211a';
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width + 20; x += 20) {
        const y = height * 0.67 + Math.sin(x * 0.004 + 2.5) * 35 + Math.cos(x * 0.009) * 20;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      // Foreground meadow base
      ctx.fillStyle = dusk < 0.5 ? '#1b2314' : '#11170d';
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width + 15; x += 15) {
        const y = height * 0.77 + Math.sin(x * 0.005 + 4.2) * 28;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      // -------------------------------------------------------------
      // 5. SWAYING YELLOW FLOWERS FIELD
      // -------------------------------------------------------------
      for (const flower of flowersRef.current) {
        // Sinusoidal wind sway
        const sway = Math.sin(t * 1.8 + flower.phase) * (18 * flower.flexibility * windFactor);
        const headX = flower.x + sway;
        const headY = flower.baseY - flower.stemLength + Math.abs(sway) * 0.15;
        const ctrlX = flower.x + sway * 0.38;
        const ctrlY = flower.baseY - flower.stemLength * 0.55;

        // Stem color based on layer and dusk
        const stemColor = flower.layer === 2 ? '#3a662e' : flower.layer === 1 ? '#27441f' : '#1c3016';
        ctx.strokeStyle = stemColor;
        ctx.lineWidth = flower.layer === 2 ? 3.5 : flower.layer === 1 ? 2.5 : 1.8;
        ctx.lineCap = 'round';

        // Draw curved stem
        ctx.beginPath();
        ctx.moveTo(flower.x, flower.baseY);
        ctx.quadraticCurveTo(ctrlX, ctrlY, headX, headY);
        ctx.stroke();

        // Little leaf on the stem for mid/foreground flowers
        if (flower.layer > 0) {
          const leafX = (flower.x + ctrlX) * 0.5;
          const leafY = (flower.baseY + ctrlY) * 0.5;
          ctx.fillStyle = stemColor;
          ctx.beginPath();
          ctx.ellipse(leafX + 6, leafY, flower.layer === 2 ? 14 : 9, flower.layer === 2 ? 5 : 3.5, 0.4 + sway * 0.01, 0, Math.PI * 2);
          ctx.fill();
        }

        // Yellow Petals (2 layers: background petals + foreground petals)
        const totalPetals = flower.petalCount;
        const angleStep = (Math.PI * 2) / totalPetals;
        const tilt = flower.tiltAngle + sway * 0.02;

        for (let pass = 0; pass < 2; pass++) {
          const passPetalLength = flower.petalLength * (pass === 0 ? 0.85 : 1.0);
          const passOffset = pass === 0 ? angleStep * 0.5 : 0;
          const petalCol = pass === 0 ? '#ffb300' : flower.petalColor;

          ctx.fillStyle = petalCol;

          for (let pIdx = 0; pIdx < totalPetals; pIdx++) {
            const angle = pIdx * angleStep + passOffset + tilt;
            const cosA = Math.cos(angle);
            const sinA = Math.sin(angle);

            const tipX = headX + cosA * passPetalLength;
            const tipY = headY + sinA * passPetalLength;

            const perpX = -sinA * (flower.headRadius * 0.45);
            const perpY = cosA * (flower.headRadius * 0.45);
            const midX = headX + cosA * (passPetalLength * 0.5);
            const midY = headY + sinA * (passPetalLength * 0.5);

            ctx.beginPath();
            ctx.moveTo(headX, headY);
            ctx.quadraticCurveTo(midX + perpX, midY + perpY, tipX, tipY);
            ctx.quadraticCurveTo(midX - perpX, midY - perpY, headX, headY);
            ctx.closePath();
            ctx.fill();
          }
        }

        // Flower Center (warm textured disc)
        ctx.fillStyle = flower.centerColor;
        ctx.beginPath();
        ctx.arc(headX, headY, flower.headRadius, 0, Math.PI * 2);
        ctx.fill();

        // Center inner warm highlight ring
        ctx.fillStyle = '#7a3e14';
        ctx.beginPath();
        ctx.arc(headX, headY, flower.headRadius * 0.65, 0, Math.PI * 2);
        ctx.fill();

        // Golden center speckles
        if (flower.layer === 2) {
          ctx.fillStyle = '#ffc107';
          ctx.beginPath();
          ctx.arc(headX, headY, flower.headRadius * 0.25, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // -------------------------------------------------------------
      // 6. GLOWING FIREFLIES (WARM DUSK LIGHTS)
      // -------------------------------------------------------------
      if (settings.showFireflies) {
        for (const firefly of firefliesRef.current) {
          firefly.x += firefly.vx;
          firefly.y = firefly.baseY + Math.sin(t * 1.6 + firefly.phase) * 18;

          if (firefly.x < -20) firefly.x = width + 20;
          if (firefly.x > width + 20) firefly.x = -20;

          const pulse = (Math.sin(t * firefly.pulseSpeed + firefly.phase) + 1) * 0.5;
          if (pulse > 0.08) {
            const glowR = firefly.size * (2.2 + pulse * 2.5);
            const gGrad = ctx.createRadialGradient(firefly.x, firefly.y, 0, firefly.x, firefly.y, glowR);
            gGrad.addColorStop(0, `rgba(255, 250, 180, ${pulse * 0.95})`);
            gGrad.addColorStop(0.4, `rgba(255, 215, 64, ${pulse * 0.45})`);
            gGrad.addColorStop(1, 'rgba(255, 215, 64, 0)');

            ctx.fillStyle = gGrad;
            ctx.beginPath();
            ctx.arc(firefly.x, firefly.y, glowR, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // -------------------------------------------------------------
      // 7. FALLING YELLOW PETALS RAIN (LLUVIA DE PÉTALOS SUAVE)
      // -------------------------------------------------------------
      const renderPetal = (p: Petal) => {
        p.flutterPhase += p.flutterSpeed * dt;
        p.rotation += p.vRot;

        const wobbleX = Math.sin(p.flutterPhase) * (1.8 * windFactor);
        p.x += (p.vx + windFactor * 1.4 + wobbleX) * dt * 50;
        p.y += p.vy * dt * 55;

        // Reset if off-screen
        if (p.y > height + 40 || p.x < -100 || p.x > width + 150) {
          p.y = -30 - Math.random() * 40;
          p.x = Math.random() * (width + 100);
        }

        // 3D perspective tumbling width
        const scaleW = Math.max(0.18, Math.abs(Math.cos(p.flutterPhase)));
        const petalW = p.size * 0.5 * scaleW;
        const petalH = p.size;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        // Petal shape
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        ctx.beginPath();
        ctx.ellipse(0, 0, petalW, petalH, 0, 0, Math.PI * 2);
        ctx.fill();

        // Soft highlight curve on petal edge
        ctx.fillStyle = 'rgba(255, 255, 220, 0.4)';
        ctx.beginPath();
        ctx.ellipse(-petalW * 0.2, 0, petalW * 0.5, petalH * 0.75, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      };

      // Render regular falling petals
      for (const petal of petalsRef.current) {
        renderPetal(petal);
      }

      // Render burst petals from user interaction
      if (burstPetalsRef.current.length > 0) {
        const remainingBursts: Petal[] = [];
        for (const bPetal of burstPetalsRef.current) {
          bPetal.opacity -= dt * 0.45;
          bPetal.vy += dt * 4.0; // gravity
          bPetal.x += bPetal.vx * dt * 50;
          bPetal.y += bPetal.vy * dt * 50;
          bPetal.rotation += bPetal.vRot;

          if (bPetal.opacity > 0.05 && bPetal.y < height + 50) {
            const scaleW = Math.max(0.2, Math.abs(Math.cos(bPetal.flutterPhase + t * 4)));
            ctx.save();
            ctx.translate(bPetal.x, bPetal.y);
            ctx.rotate(bPetal.rotation);
            ctx.globalAlpha = bPetal.opacity;
            ctx.fillStyle = bPetal.color;
            ctx.beginPath();
            ctx.ellipse(0, 0, bPetal.size * 0.5 * scaleW, bPetal.size, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            remainingBursts.push(bPetal);
          }
        }
        burstPetalsRef.current = remainingBursts;
      }

      ctx.restore();
      animationFrameId.current = requestAnimationFrame(render);
    };

    animationFrameId.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [settings]);

  return (
    <div
      ref={containerRef}
      id="landscape-container"
      className="relative w-full h-full overflow-hidden select-none cursor-pointer"
    >
      <canvas
        ref={canvasRef}
        id="landscape-canvas"
        onPointerDown={handlePointerDown}
        className="absolute inset-0 block touch-none"
      />
    </div>
  );
};

/**
 * Utility to interpolate two hex colors smoothly
 */
function interpolateColor(color1: string, color2: string, factor: number): string {
  const c1 = parseInt(color1.slice(1), 16);
  const c2 = parseInt(color2.slice(1), 16);

  const r1 = (c1 >> 16) & 255;
  const g1 = (c1 >> 8) & 255;
  const b1 = c1 & 255;

  const r2 = (c2 >> 16) & 255;
  const g2 = (c2 >> 8) & 255;
  const b2 = c2 & 255;

  const r = Math.round(r1 + factor * (r2 - r1));
  const g = Math.round(g1 + factor * (g2 - g1));
  const b = Math.round(b1 + factor * (b2 - b1));

  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Mail, Sparkles, Heart, Volume2 } from 'lucide-react';
import { LandscapeCanvas } from './components/LandscapeCanvas';
import { RomanticCard } from './components/RomanticCard';
import { ControlsDock } from './components/ControlsDock';
import { ShareWhatsAppModal } from './components/ShareWhatsAppModal';
import { romanticAudio } from './utils/audio';
import { SceneSettings } from './types';

const STORAGE_KEY = 'flores_amarillas_config_v1';

export default function App() {
  const [settings, setSettings] = useState<SceneSettings>(() => {
    // 1. Check URL parameters first (e.g. from WhatsApp share link)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlRecipient = urlParams.get('para');
      const urlMsg = urlParams.get('msg');
      if (urlRecipient || urlMsg) {
        return {
          recipientName: urlRecipient || 'Mi Niña Bonita',
          dedicationMessage:
            urlMsg ||
            'Cada flor amarilla en este atardecer representa un latido de amor por ti. Gracias por hacer mi mundo tan cálido y hermoso. 💛',
          timeOfDay: 0.62,
          windStrength: 1.0,
          petalDensity: 85,
          showCard: true,
          showFireflies: true,
          showStars: true,
          audioPlaying: false,
        };
      }
    }

    // 2. Fallback to localStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          recipientName: parsed.recipientName || 'Mi Niña Bonita',
          dedicationMessage:
            parsed.dedicationMessage ||
            'Cada flor amarilla en este atardecer representa un latido de amor por ti. Gracias por hacer mi mundo tan cálido y hermoso. 💛',
          timeOfDay: typeof parsed.timeOfDay === 'number' ? parsed.timeOfDay : 0.62,
          windStrength: typeof parsed.windStrength === 'number' ? parsed.windStrength : 1.0,
          petalDensity: typeof parsed.petalDensity === 'number' ? parsed.petalDensity : 85,
          showCard: parsed.showCard !== undefined ? parsed.showCard : true,
          showFireflies: true,
          showStars: true,
          audioPlaying: false,
        };
      }
    } catch {
      // Storage unavailable
    }

    return {
      recipientName: 'Mi Niña Bonita',
      dedicationMessage:
        'Cada flor amarilla en este atardecer representa un latido de amor por ti. Gracias por hacer mi mundo tan cálido y hermoso. 💛',
      timeOfDay: 0.62, // Warm dusk: "casi haciéndose noche"
      windStrength: 1.0,
      petalDensity: 85,
      showCard: true,
      showFireflies: true,
      showStars: true,
      audioPlaying: false,
    };
  });

  const [showShareModal, setShowShareModal] = useState(false);
  const [clickRipple, setClickRipple] = useState<{ x: number; y: number; id: number } | null>(null);
  const [showAudioPrompt, setShowAudioPrompt] = useState(true);
  const rippleTimeoutRef = useRef<number | null>(null);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          recipientName: settings.recipientName,
          dedicationMessage: settings.dedicationMessage,
          timeOfDay: settings.timeOfDay,
          windStrength: settings.windStrength,
          petalDensity: settings.petalDensity,
          showCard: settings.showCard,
        })
      );
    } catch {
      // Storage unavailable
    }
  }, [settings]);

  // Handle audio toggle
  const handleToggleAudio = () => {
    const isNowPlaying = romanticAudio.toggle();
    setSettings((prev) => ({ ...prev, audioPlaying: isNowPlaying }));
    setShowAudioPrompt(false);
  };

  // Stop audio when component unmounts
  useEffect(() => {
    return () => {
      romanticAudio.stop();
    };
  }, []);

  const handleCanvasClick = (x: number, y: number) => {
    setClickRipple({ x, y, id: Date.now() });
    if (rippleTimeoutRef.current) window.clearTimeout(rippleTimeoutRef.current);
    rippleTimeoutRef.current = window.setTimeout(() => {
      setClickRipple(null);
    }, 700);
  };

  const handleBurstPetals = () => {
    const cx = window.innerWidth * 0.5;
    const cy = window.innerHeight * 0.45;
    handleCanvasClick(cx, cy);
  };

  return (
    <main
      id="main-scenery-view"
      className="relative w-screen h-screen overflow-hidden bg-stone-950 select-none font-sans"
    >
      {/* Fullscreen Animated Canvas: Yellow Flowers & Twilight Horizon */}
      <LandscapeCanvas settings={settings} onCanvasClick={handleCanvasClick} />

      {/* Ripple ring effect on click */}
      {clickRipple && (
        <div
          key={clickRipple.id}
          style={{ left: clickRipple.x, top: clickRipple.y }}
          className="pointer-events-none fixed -translate-x-1/2 -translate-y-1/2 z-30"
        >
          <span className="block w-14 h-14 rounded-full border-2 border-amber-300/80 animate-ping" />
        </div>
      )}

      {/* Top Banner / Romantic Card Overlay */}
      <div className="fixed top-4 sm:top-6 left-0 right-0 z-30 pointer-events-none flex flex-col items-center">
        <AnimatePresence>
          {settings.showCard ? (
            <RomanticCard
              recipientName={settings.recipientName}
              dedicationMessage={settings.dedicationMessage}
              onUpdate={(name, message) =>
                setSettings((prev) => ({
                  ...prev,
                  recipientName: name,
                  dedicationMessage: message,
                }))
              }
              onClose={() => setSettings((prev) => ({ ...prev, showCard: false }))}
              onOpenShare={() => setShowShareModal(true)}
            />
          ) : (
            /* Minimized badge to reopen card */
            <button
              id="reopen-card-btn"
              type="button"
              onClick={() => setSettings((prev) => ({ ...prev, showCard: true }))}
              className="pointer-events-auto px-4 py-2 rounded-full bg-stone-950/70 hover:bg-stone-900/90 text-amber-300 border border-amber-400/40 backdrop-blur-md shadow-xl flex items-center gap-2 text-xs font-medium transition-all hover:scale-105"
            >
              <Heart className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Para {settings.recipientName} (Abrir carta)</span>
              <Mail className="w-3.5 h-3.5 ml-1 text-amber-200" />
            </button>
          )}
        </AnimatePresence>
      </div>

      {/* Subtle Mobile Audio Prompt */}
      <AnimatePresence>
        {!settings.audioPlaying && showAudioPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="fixed top-20 sm:top-4 right-4 z-20 pointer-events-auto"
          >
            <button
              id="play-music-prompt-btn"
              type="button"
              onClick={handleToggleAudio}
              className="px-3.5 py-1.5 rounded-full bg-amber-500/90 hover:bg-amber-400 text-stone-950 shadow-lg shadow-amber-950/40 flex items-center gap-2 text-xs font-semibold backdrop-blur-md transition-all hover:scale-105"
            >
              <Volume2 className="w-3.5 h-3.5 animate-pulse" />
              <span>Tocar con música 🎵</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle Hint on Top Left */}
      <div className="fixed top-4 left-4 z-20 pointer-events-none hidden sm:flex items-center gap-2 text-xs text-amber-100/75 bg-stone-950/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-400/20">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>Toca la pantalla para soltar pétalos</span>
      </div>

      {/* Floating Controls Dock */}
      <ControlsDock
        settings={settings}
        onUpdateSettings={setSettings}
        onToggleAudio={handleToggleAudio}
        onBurstPetals={handleBurstPetals}
        onOpenShare={() => setShowShareModal(true)}
      />

      {/* WhatsApp Share Link Modal */}
      <AnimatePresence>
        {showShareModal && (
          <ShareWhatsAppModal
            recipientName={settings.recipientName}
            dedicationMessage={settings.dedicationMessage}
            onClose={() => setShowShareModal(false)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

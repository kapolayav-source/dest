import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Sliders,
  Maximize2,
  Minimize2,
  Mail,
  Sparkles,
  Sun,
  Moon,
  Wind,
  Share2,
} from 'lucide-react';
import { SceneSettings } from '../types';

interface ControlsDockProps {
  settings: SceneSettings;
  onUpdateSettings: (updater: (prev: SceneSettings) => SceneSettings) => void;
  onToggleAudio: () => void;
  onBurstPetals: () => void;
  onOpenShare?: () => void;
}

export const ControlsDock: React.FC<ControlsDockProps> = ({
  settings,
  onUpdateSettings,
  onToggleAudio,
  onBurstPetals,
  onOpenShare,
}) => {
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <>
      {/* Floating Bottom Control Pill */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 p-1.5 sm:p-2 rounded-full bg-stone-950/75 backdrop-blur-md border border-amber-400/30 shadow-xl shadow-stone-950/60 text-stone-200 pointer-events-auto">
        {/* Toggle Audio */}
        <button
          id="toggle-audio-btn"
          type="button"
          onClick={onToggleAudio}
          title={settings.audioPlaying ? 'Pausar melodía' : 'Reproducir melodía romántica'}
          className={`p-2 sm:px-3 sm:py-2 rounded-full flex items-center gap-1.5 text-xs font-medium transition-all ${
            settings.audioPlaying
              ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/30'
              : 'hover:bg-white/10 text-stone-300'
          }`}
        >
          {settings.audioPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden sm:inline">
            {settings.audioPlaying ? 'Música activa' : 'Música'}
          </span>
        </button>

        {/* Toggle Dedication Card */}
        <button
          id="toggle-card-btn"
          type="button"
          onClick={() =>
            onUpdateSettings((prev) => ({ ...prev, showCard: !prev.showCard }))
          }
          title={settings.showCard ? 'Ocultar carta de amor' : 'Mostrar carta de amor'}
          className={`p-2 sm:px-3 sm:py-2 rounded-full flex items-center gap-1.5 text-xs font-medium transition-all ${
            settings.showCard
              ? 'bg-amber-400/20 text-amber-200 border border-amber-400/30'
              : 'hover:bg-white/10 text-stone-300'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span className="hidden sm:inline">Carta</span>
        </button>

        {/* Quick Petal Burst */}
        <button
          id="burst-petals-btn"
          type="button"
          onClick={onBurstPetals}
          title="Soltar más pétalos dorados"
          className="p-2 sm:px-3 sm:py-2 rounded-full hover:bg-amber-400/20 text-amber-300 flex items-center gap-1.5 text-xs transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span className="hidden md:inline">+ Pétalos</span>
        </button>

        {/* Adjust Scenery (Sliders) */}
        <button
          id="toggle-sliders-btn"
          type="button"
          onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
          title="Ajustar clima y atardecer"
          className={`p-2 sm:px-3 sm:py-2 rounded-full flex items-center gap-1.5 text-xs transition-all ${
            showSettingsDrawer
              ? 'bg-stone-800 text-amber-200 border border-amber-400/30'
              : 'hover:bg-white/10 text-stone-300'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span className="hidden sm:inline">Ajustes</span>
        </button>

        {/* Compartir por WhatsApp */}
        {onOpenShare && (
          <button
            id="open-share-dock-btn"
            type="button"
            onClick={onOpenShare}
            title="Enviar por WhatsApp para que lo abra en su celular"
            className="p-2 sm:px-3 sm:py-2 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 text-xs font-medium transition-all shadow-sm"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>
        )}

        {/* Fullscreen */}
        <button
          id="toggle-fullscreen-btn"
          type="button"
          onClick={toggleFullscreen}
          title="Alternar pantalla completa"
          className="p-2 rounded-full hover:bg-white/10 text-stone-300 transition-colors"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Scenery Sliders Drawer */}
      {showSettingsDrawer && (
        <div
          id="scenery-controls-card"
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md p-4 sm:p-5 rounded-2xl bg-stone-950/90 backdrop-blur-lg border border-amber-400/30 shadow-2xl text-stone-200 pointer-events-auto"
        >
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-amber-400/20">
            <h4 className="text-sm font-semibold text-amber-200 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              Ajustes del Escenario Cálido
            </h4>
            <button
              type="button"
              onClick={() => setShowSettingsDrawer(false)}
              className="text-xs text-stone-400 hover:text-stone-100"
            >
              Listo
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {/* Time of day (sunset to twilight) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="flex items-center gap-1.5 text-amber-300 font-medium">
                  {settings.timeOfDay < 0.5 ? (
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <Moon className="w-3.5 h-3.5 text-purple-300" />
                  )}
                  Hora: {settings.timeOfDay < 0.35 ? 'Atardecer cálido' : settings.timeOfDay < 0.7 ? 'Casi anocheciendo' : 'Noche crepuscular'}
                </span>
                <span className="text-stone-400">{Math.round(settings.timeOfDay * 100)}%</span>
              </div>
              <input
                id="time-of-day-slider"
                type="range"
                min="0"
                max="1"
                step="0.02"
                value={settings.timeOfDay}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onUpdateSettings((prev) => ({ ...prev, timeOfDay: val }));
                }}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            {/* Wind strength */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="flex items-center gap-1.5 text-amber-300 font-medium">
                  <Wind className="w-3.5 h-3.5" /> Brisa cálida (movimiento flores)
                </span>
                <span className="text-stone-400">{settings.windStrength.toFixed(1)}x</span>
              </div>
              <input
                id="wind-strength-slider"
                type="range"
                min="0.3"
                max="1.8"
                step="0.1"
                value={settings.windStrength}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onUpdateSettings((prev) => ({ ...prev, windStrength: val }));
                }}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            {/* Petals density */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="flex items-center gap-1.5 text-amber-300 font-medium">
                  <Sparkles className="w-3.5 h-3.5" /> Lluvia de pétalos
                </span>
                <span className="text-stone-400">{settings.petalDensity} pétalos</span>
              </div>
              <input
                id="petal-density-slider"
                type="range"
                min="30"
                max="180"
                step="10"
                value={settings.petalDensity}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  onUpdateSettings((prev) => ({ ...prev, petalDensity: val }));
                }}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            {/* Toggles */}
            <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showFireflies}
                  onChange={(e) =>
                    onUpdateSettings((prev) => ({ ...prev, showFireflies: e.target.checked }))
                  }
                  className="rounded accent-amber-400"
                />
                <span>Luciérnagas doradas</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showStars}
                  onChange={(e) =>
                    onUpdateSettings((prev) => ({ ...prev, showStars: e.target.checked }))
                  }
                  className="rounded accent-amber-400"
                />
                <span>Estrellas crepusculares</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

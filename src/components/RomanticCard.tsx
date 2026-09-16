import React, { useState } from 'react';
import { Heart, Edit3, X, Sparkles, Check, RefreshCw, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RomanticCardProps {
  recipientName: string;
  dedicationMessage: string;
  onUpdate: (name: string, message: string) => void;
  onClose: () => void;
  onOpenShare?: () => void;
}

const ROMANTIC_PRESETS = [
  "Como estas flores amarillas que bailan con la brisa al caer la tarde, mi corazón siempre encuentra la calma y la alegría cuando pienso en ti. 💛",
  "Dicen que las flores amarillas representan la promesa de un amor puro, cálido y eterno. Este atardecer y cada uno de mis días son para ti.",
  "Eres mi atardecer favorito en cualquier parte del mundo. Gracias por iluminar mi vida con tu sonrisa tan cálida y bonita.",
  "Un campo entero de flores amarillas no alcanza para expresar lo mucho que te quiero. Quédate siempre conmigo al final de cada día. 🌻",
];

export const RomanticCard: React.FC<RomanticCardProps> = ({
  recipientName,
  dedicationMessage,
  onUpdate,
  onClose,
  onOpenShare,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(recipientName);
  const [tempMessage, setTempMessage] = useState(dedicationMessage);

  const handleSave = () => {
    onUpdate(tempName.trim() || 'Mi Amor', tempMessage.trim() || 'Siempre juntos');
    setIsEditing(false);
  };

  const pickRandomPreset = () => {
    const randomPreset = ROMANTIC_PRESETS[Math.floor(Math.random() * ROMANTIC_PRESETS.length)];
    setTempMessage(randomPreset);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative max-w-xl w-full mx-auto px-4 pointer-events-auto"
    >
      <div className="relative rounded-2xl p-6 sm:p-7 backdrop-blur-md bg-stone-950/70 border border-amber-400/35 shadow-2xl shadow-amber-950/40 text-stone-100 overflow-hidden">
        {/* Subtle decorative warm golden glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-amber-500/20 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 rounded-full bg-rose-500/20 blur-2xl pointer-events-none" />

        {/* Header bar */}
        <div className="flex items-center justify-between gap-3 mb-3 border-b border-amber-400/20 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-full bg-amber-400/15 text-amber-300">
              <Heart className="w-4 h-4 fill-amber-400 text-amber-400" />
            </span>
            <span className="text-xs font-semibold tracking-wider uppercase text-amber-300/90">
              Detalle Especial
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {onOpenShare && !isEditing ? (
              <button
                id="share-whatsapp-card-btn"
                type="button"
                onClick={onOpenShare}
                title="Compartir enlace por WhatsApp"
                className="px-2.5 py-1 text-xs rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-colors flex items-center gap-1.5 font-medium"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">WhatsApp</span>
              </button>
            ) : null}
            {!isEditing ? (
              <button
                id="edit-dedication-btn"
                type="button"
                onClick={() => setIsEditing(true)}
                title="Personalizar dedicatoria"
                className="px-2.5 py-1 text-xs rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-200 border border-amber-400/30 transition-colors flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Personalizar</span>
              </button>
            ) : null}
            <button
              id="close-card-btn"
              type="button"
              onClick={onClose}
              title="Ocultar carta para ver el paisaje completo"
              className="p-1 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Mode vs Edit Mode */}
        <AnimatePresence mode="wait">
          {!isEditing ? (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <h2 className="text-xl sm:text-2xl font-bold font-display text-amber-200 tracking-wide">
                Para {recipientName} 💛
              </h2>

              <p className="text-base sm:text-lg font-script text-amber-100/95 leading-relaxed tracking-wide text-balance">
                "{dedicationMessage}"
              </p>

              <div className="pt-1 flex items-center justify-between text-xs text-amber-300/70">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Haz clic o toca la pantalla para soltar más pétalos
                </span>
                <span className="italic font-display">Con amor eterno</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="edit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3 pt-1"
            >
              <div>
                <label htmlFor="recipient-name-input" className="block text-xs font-medium text-amber-300 mb-1">
                  Nombre de tu enamorada:
                </label>
                <input
                  id="recipient-name-input"
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Ej. Mi Niña Hermosa, Sofía, Camila..."
                  className="w-full px-3 py-1.5 rounded-lg bg-stone-900/90 border border-amber-400/40 text-stone-100 text-sm focus:outline-none focus:border-amber-300"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="dedication-message-input" className="block text-xs font-medium text-amber-300">
                    Mensaje o carta de amor:
                  </label>
                  <button
                    type="button"
                    onClick={pickRandomPreset}
                    className="text-[11px] text-amber-300/80 hover:text-amber-200 flex items-center gap-1 underline"
                  >
                    <RefreshCw className="w-2.5 h-2.5" /> Frase sugerida
                  </button>
                </div>
                <textarea
                  id="dedication-message-input"
                  rows={3}
                  value={tempMessage}
                  onChange={(e) => setTempMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-900/90 border border-amber-400/40 text-stone-100 text-sm focus:outline-none focus:border-amber-300 resize-none font-script text-base"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 text-xs rounded-lg bg-stone-800 text-stone-300 hover:bg-stone-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-1.5 text-xs font-medium rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 flex items-center gap-1.5 transition-colors shadow-md shadow-amber-500/20"
                >
                  <Check className="w-3.5 h-3.5" /> Guardar detalle
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

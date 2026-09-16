import React, { useState } from 'react';
import { X, Copy, Check, Share2, Heart, ExternalLink, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface ShareWhatsAppModalProps {
  recipientName: string;
  dedicationMessage: string;
  onClose: () => void;
}

export const ShareWhatsAppModal: React.FC<ShareWhatsAppModalProps> = ({
  recipientName,
  dedicationMessage,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  // Generate shareable link with encoded parameters so she sees the exact customized message
  const baseUrl = window.location.origin + window.location.pathname;
  const params = new URLSearchParams();
  params.set('para', recipientName);
  params.set('msg', dedicationMessage);
  const shareableUrl = `${baseUrl}?${params.toString()}`;

  // Pre-filled WhatsApp message text
  const whatsappText = `Hola mi amor ${recipientName} 💛, te preparé este detalle especial de flores amarillas para ti: ${shareableUrl}`;
  const whatsappHref = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappText)}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      const input = document.createElement('input');
      input.value = shareableUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-lg bg-stone-900 border border-amber-400/35 rounded-2xl shadow-2xl shadow-amber-950/50 p-5 sm:p-6 text-stone-200 overflow-hidden"
      >
        {/* Decorative background glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-emerald-500/15 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-amber-500/20 blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-amber-200">
                Enviar Detalle por WhatsApp
              </h3>
              <p className="text-xs text-stone-400">
                Para que lo abra en su celular (Android o iPhone)
              </p>
            </div>
          </div>

          <button
            id="close-share-modal-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message preview */}
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-stone-950/70 border border-stone-800 text-xs space-y-2">
            <span className="text-amber-300/80 font-medium flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              Vista previa del mensaje que le llegará:
            </span>
            <p className="text-stone-300 italic bg-stone-900/80 p-2.5 rounded-lg border border-stone-800/80 select-text leading-relaxed">
              "{whatsappText}"
            </p>
          </div>

          {/* Direct WhatsApp Button */}
          <a
            id="open-whatsapp-link-btn"
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-emerald-950/40 hover:scale-[1.01]"
          >
            {/* WhatsApp Icon */}
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 2C6.504 2 2 6.505 2 12.033c0 1.954.563 3.778 1.542 5.32L2 22l4.808-1.508c1.477.896 3.208 1.411 5.063 1.411 5.526 0 10.03-4.505 10.03-10.033 0-5.527-4.504-10.033-10.03-10.033zm5.795 14.195c-.244.686-1.228 1.258-1.704 1.332-.476.074-.955.127-2.912-.663-2.359-.953-3.876-3.353-3.993-3.51-.116-.157-.954-1.268-.954-2.417 0-1.149.602-1.713.816-1.947.214-.233.475-.292.634-.292.159 0 .318.002.457.008.147.007.346-.056.541.413.205.492.7 1.706.762 1.83.061.125.103.271.02.434-.082.163-.123.265-.245.408-.122.143-.257.319-.367.428-.122.123-.25.257-.108.502.143.245.635 1.047 1.364 1.696.938.835 1.728 1.094 1.973 1.216.245.123.388.103.53-.061.143-.164.613-.715.776-.96.163-.245.327-.205.551-.123.224.082 1.43.674 1.675.796.245.123.408.184.47.286.061.102.061.593-.183 1.279z" />
            </svg>
            <span>Abrir WhatsApp para enviárselo</span>
            <ExternalLink className="w-4 h-4 opacity-80" />
          </a>

          {/* Copy Link Section */}
          <div className="pt-2">
            <label className="block text-xs font-medium text-stone-400 mb-1.5">
              O copia el enlace directamente:
            </label>
            <div className="flex items-center gap-2">
              <input
                id="shareable-link-input"
                type="text"
                readOnly
                value={shareableUrl}
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-300 text-xs font-mono focus:outline-none select-all truncate"
              />
              <button
                id="copy-link-btn"
                type="button"
                onClick={handleCopyLink}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-medium text-xs flex items-center gap-1.5 shrink-0 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-stone-950" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Steps summary */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/20 text-xs text-amber-200/90 space-y-1.5">
            <div className="font-semibold flex items-center gap-1 text-amber-300">
              <Sparkles className="w-3.5 h-3.5" /> ¿Cómo lo verá ella en su celular?
            </div>
            <p className="text-stone-300 text-[11px] leading-relaxed">
              1. Ella tocará el enlace desde su chat de WhatsApp.
              <br />
              2. Se abrirá directamente en el navegador de su teléfono (Chrome o Safari) a pantalla completa.
              <br />
              3. Verá el atardecer cálido, las flores amarillas meciéndose, la lluvia de pétalos y tu dedicatoria especial con su nombre.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

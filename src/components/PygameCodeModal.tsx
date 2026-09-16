import React, { useState } from 'react';
import { X, Copy, Check, Download, Terminal, Play, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { generatePygameScript } from '../utils/pythonCode';

interface PygameCodeModalProps {
  recipientName: string;
  dedicationMessage: string;
  onClose: () => void;
}

export const PygameCodeModal: React.FC<PygameCodeModalProps> = ({
  recipientName,
  dedicationMessage,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const pythonScript = generatePygameScript(recipientName, dedicationMessage);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pythonScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = pythonScript;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([pythonScript], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'flores_amarillas.py';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-4xl bg-stone-900 border border-amber-500/30 rounded-2xl shadow-2xl shadow-amber-950/50 flex flex-col max-h-[90vh] overflow-hidden text-stone-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800 bg-stone-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-amber-200 flex items-center gap-2">
                Código Python con Pygame
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-sans border border-amber-400/30 font-medium">
                  flores_amarillas.py
                </span>
              </h3>
              <p className="text-xs text-stone-400">
                Script completo y listo para ejecutar en tu computadora o enviarle como regalo digital.
              </p>
            </div>
          </div>

          <button
            id="close-code-modal-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Instructions Banner */}
        <div className="px-5 py-3 bg-amber-950/25 border-b border-amber-500/20 text-xs text-amber-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Pasos rápidos:</strong> 1. <code className="bg-stone-950/70 px-1.5 py-0.5 rounded text-amber-300">pip install pygame</code> &nbsp; 2. <code className="bg-stone-950/70 px-1.5 py-0.5 rounded text-amber-300">python flores_amarillas.py</code>
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              id="copy-code-btn"
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-100 border border-stone-700 transition-all flex items-center gap-1.5 text-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300 font-medium">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-stone-300" />
                  <span>Copiar código</span>
                </>
              )}
            </button>

            <button
              id="download-code-btn"
              type="button"
              onClick={handleDownload}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold transition-all flex items-center gap-1.5 text-xs shadow-md shadow-amber-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar .py</span>
            </button>
          </div>
        </div>

        {/* Code Preview container */}
        <div className="relative flex-1 overflow-y-auto p-4 bg-stone-950 font-mono text-xs leading-relaxed text-stone-300 select-text">
          <pre className="whitespace-pre overflow-x-auto text-[13px] leading-6">
            <code>{pythonScript}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-stone-900 border-t border-stone-800 text-xs text-stone-400 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-300/80">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Incluye renderizado de degradado, tallos con curvas Bezier, pétalos 3D y luciérnagas.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200"
          >
            Cerrar
          </button>
        </div>
      </motion.div>
    </div>
  );
};

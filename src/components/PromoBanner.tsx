import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Clock, Copy, Check, X } from 'lucide-react';

interface PromoBannerProps {
  onCopyCode: (code: string) => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({ onCopyCode }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [copied, setCopied] = useState(false);
  
  // Timer calculation for discount event
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopy = () => {
    onCopyCode('AURA2026');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="relative bg-[#09090b]/80 backdrop-blur-xl border-b border-white/10 text-zinc-200 text-xs py-2.5 px-4 overflow-hidden z-40"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold tracking-wide uppercase">
              <Sparkles className="w-3 h-3 text-emerald-400" /> Summer Keynote Sale
            </span>
            <span className="hidden sm:inline text-zinc-300">
              Enjoy up to <strong className="text-white">25% OFF</strong> flagship studio electronics.
            </span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400">
            <div className="hidden md:flex items-center gap-1.5 font-mono text-[11px] bg-white/5 px-3 py-1 rounded-full border border-white/10 text-zinc-300 backdrop-blur-md">
              <Clock className="w-3 h-3 text-blue-400" />
              <span>Ends in: {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s</span>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full text-[11px] font-mono border border-white/10 transition-all active:scale-95 backdrop-blur-md"
            >
              <span>Code: <strong>AURA2026</strong></span>
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-zinc-400" />}
            </button>

            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:text-white transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

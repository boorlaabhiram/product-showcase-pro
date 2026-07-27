import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, Info, AlertCircle, X } from 'lucide-react';
import { ToastMessage } from '../types/product';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl bg-zinc-900/90 dark:bg-zinc-800/95 text-white border border-zinc-700/50 shadow-2xl backdrop-blur-md"
          >
            <div className="mt-0.5 shrink-0 text-emerald-400">
              {toast.type === 'warning' ? (
                <AlertCircle className="w-5 h-5 text-amber-400" />
              ) : toast.type === 'info' ? (
                <Info className="w-5 h-5 text-sky-400" />
              ) : (
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              )}
            </div>

            <div className="flex-1 text-sm">
              <h4 className="font-semibold text-zinc-100">{toast.title}</h4>
              {toast.description && (
                <p className="mt-0.5 text-zinc-400 text-xs leading-relaxed">{toast.description}</p>
              )}
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

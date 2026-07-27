import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, PhoneCall, Send, ShieldCheck, Clock, CheckCircle } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (title: string, description?: string) => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  if (!isOpen) return null;

  const [form, setForm] = useState({ name: '', email: '', topic: 'Enterprise Inquiry', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    onShowToast('Concierge Request Received', 'A hardware advisor will reach out within 2 hours.');
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl p-6 z-10 space-y-6"
        >
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white text-zinc-950 flex items-center justify-center font-bold">
                <PhoneCall className="w-4 h-4" />
              </div>
              <h3 className="font-serif font-bold text-lg text-white">Aura Concierge Desk</h3>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="text-lg font-bold text-white font-serif">Inquiry Transmitted</h4>
              <p className="text-xs text-zinc-400">Our concierge team is reviewing your specification requirements.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="E.g. Marcus Vance"
                    className="w-full bg-zinc-900 text-xs text-white p-2.5 rounded-xl border border-zinc-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full bg-zinc-900 text-xs text-white p-2.5 rounded-xl border border-zinc-800 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">Topic</label>
                <select
                  value={form.topic}
                  onChange={(e) => setForm({ ...form, topic: e.target.value })}
                  className="w-full bg-zinc-900 text-xs text-white p-2.5 rounded-xl border border-zinc-800 focus:outline-none"
                >
                  <option value="Enterprise Inquiry">Enterprise / Corporate Bulk Order</option>
                  <option value="Custom Tech Walkthrough">Virtual 1-on-1 Product Demo</option>
                  <option value="Custom Finish Request">Custom Anodizing & Engraving</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">Message Details</label>
                <textarea
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Describe your setup or order requirements..."
                  className="w-full bg-zinc-900 text-xs text-white p-2.5 rounded-xl border border-zinc-800 focus:outline-none h-24"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-extrabold text-xs transition-all shadow-xl flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit to Hardware Advisor</span>
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

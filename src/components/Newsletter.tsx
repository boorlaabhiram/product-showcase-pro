import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, ArrowRight, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';

interface NewsletterProps {
  onShowToast: (title: string, description?: string) => void;
}

export const Newsletter: React.FC<NewsletterProps> = ({ onShowToast }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setSubscribed(true);
    onShowToast('Subscribed Successfully!', 'You will receive early access invitations to 2026 hardware keynotes.');
  };

  return (
    <section className="py-20 bg-[#09090b]/80 border-t border-white/10 backdrop-blur-2xl relative overflow-hidden">
      {/* Ambient Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-mono backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Aura Hardware Insiders</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
          Join the Priority Access List
        </h2>

        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Be the first to inspect limited-run titanium drops, secret discount vouchers, and live keynote streams before public release.
        </p>

        {subscribed ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 inline-flex items-center gap-3 text-sm font-semibold mx-auto backdrop-blur-md"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Welcome to Aura Hardware Insiders! Check your inbox shortly.</span>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="email"
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 text-xs text-white pl-11 pr-4 py-3.5 rounded-full border border-white/10 focus:border-white/30 focus:outline-none placeholder:text-zinc-500 backdrop-blur-md"
                required
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3.5 rounded-full bg-white text-black font-bold text-xs hover:bg-zinc-200 transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-2 active:scale-95 shrink-0"
            >
              <span>Join Keynote List</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        <div className="flex items-center justify-center gap-6 pt-2 text-[11px] text-zinc-500 font-mono">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" /> Zero Spam Policy
          </span>
          <span>•</span>
          <span>Unsubscribe Anytime</span>
        </div>
      </div>
    </section>
  );
};

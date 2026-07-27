import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Star, Play, Bot, ShieldCheck, Zap } from 'lucide-react';
import { Product } from '../types/product';
import { PRODUCTS } from '../data/products';
import { formatINR } from '../lib/utils';

interface HeroProps {
  onQuickView: (product: Product) => void;
  onExploreCollection: () => void;
  onOpenAIModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onQuickView,
  onExploreCollection,
  onOpenAIModal,
}) => {
  const flagshipProduct = PRODUCTS[0]; // iPhone 16 Pro Max or primary spotlight

  return (
    <section className="relative pt-8 pb-16 md:pt-16 md:pb-24 overflow-hidden bg-[#09090b]">
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-[-80px] left-[-80px] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-50px] right-[-50px] w-[450px] h-[450px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Frosted Showcase Container */}
        <div className="bg-white/[0.03] border border-white/10 rounded-[32px] p-6 sm:p-10 lg:p-12 backdrop-blur-2xl shadow-2xl">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* Left Text Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-bold tracking-widest uppercase"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                <span>Showcasely India • Official Brand Flagships 2026</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.02]"
              >
                Discover. Compare.{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
                  Shop Smarter.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-zinc-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed"
              >
                Explore India's premier tech catalog. Compare flagship smartphones, gaming laptops, and studio audio gear with AI purchasing guidance and verified INR pricing.
              </motion.p>

              {/* CTA Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
              >
                <button
                  onClick={onExploreCollection}
                  className="group flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-white text-black font-extrabold text-sm hover:bg-zinc-200 transition-all shadow-xl shadow-white/10 active:scale-95"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={onOpenAIModal}
                  className="flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-blue-600/20 text-blue-300 font-extrabold text-sm border border-blue-500/30 hover:bg-blue-600/30 transition-all active:scale-95 backdrop-blur-md shadow-lg shadow-blue-500/10"
                >
                  <Bot className="w-4 h-4 text-blue-400" />
                  <span>Ask AI Assistant</span>
                </button>
              </motion.div>

              {/* Trust Stat Highlights */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10 max-w-lg mx-auto lg:mx-0"
              >
                <div>
                  <div className="text-2xl font-bold font-mono text-emerald-400">100%</div>
                  <div className="text-xs text-zinc-400 font-medium mt-0.5">Brand Authentic</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono text-blue-400">1-Year</div>
                  <div className="text-xs text-zinc-400 font-medium mt-0.5">India Warranty</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono text-indigo-400">Express</div>
                  <div className="text-xs text-zinc-400 font-medium mt-0.5">24h Dispatch</div>
                </div>
              </motion.div>
            </div>

            {/* Right Product Spotlight Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl p-5 bg-white/[0.04] border border-white/10 shadow-2xl backdrop-blur-2xl group hover:bg-white/[0.07] hover:border-white/20 transition-all">
                {/* Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-mono font-medium">
                    ★ India Flagship Spotlight
                  </span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Verified Stock
                  </span>
                </div>

                {/* Product Image */}
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-900/90 border border-white/10 mb-5 group-hover:scale-[1.02] transition-transform duration-500">
                  <img
                    src={flagshipProduct.primaryImage}
                    alt={flagshipProduct.name}
                    className="w-full h-full object-cover object-center opacity-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090b]/80 via-transparent to-transparent" />

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono text-zinc-200">
                      {flagshipProduct.brand}
                    </div>
                    <div className="bg-emerald-500 text-black px-3.5 py-1.5 rounded-xl text-xs font-extrabold font-mono shadow-lg">
                      {formatINR(flagshipProduct.price)}
                    </div>
                  </div>
                </div>

                {/* Details & Interactive Quick View Trigger */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      {flagshipProduct.name}
                    </h3>
                    <div className="flex items-center text-amber-400 text-xs font-bold gap-1 font-mono">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{flagshipProduct.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {flagshipProduct.description}
                  </p>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={() => onQuickView(flagshipProduct)}
                      className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 border border-white/10"
                    >
                      <span>Inspect 360° & Specs</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

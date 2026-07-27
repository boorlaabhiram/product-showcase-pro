import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Star, Play, Layers } from 'lucide-react';
import { Product } from '../types/product';
import { PRODUCTS } from '../data/products';
import { formatCurrency } from '../lib/utils';

interface HeroProps {
  onQuickView: (product: Product) => void;
  onExploreCollection: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onQuickView, onExploreCollection }) => {
  const flagshipProduct = PRODUCTS[0]; // Aura Studio Headphones

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-[#09090b]">
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-[-80px] left-[-80px] w-[450px] h-[450px] bg-blue-600/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-50px] right-[-50px] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Frosted Showcase Container */}
        <div className="bg-white/[0.03] border border-white/10 rounded-[32px] p-6 sm:p-10 lg:p-12 backdrop-blur-xl shadow-2xl">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* Left Text Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-blue-400 text-xs font-mono font-bold tracking-widest uppercase"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>New Release 2026</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-white leading-[0.95]"
              >
                AURA Studio <span className="text-zinc-600">Max.</span> <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-emerald-400 to-teal-200">
                  Pure Precision.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed"
              >
                Experience spatial audio like never before with the next generation of acoustic engineering and titanium hardware.
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
                  className="group flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-white text-black font-bold text-sm hover:bg-zinc-200 transition-all shadow-xl shadow-white/10 active:scale-95"
                >
                  <span>Buy Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onQuickView(flagshipProduct)}
                  className="flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-white/10 text-white font-bold text-sm border border-white/10 hover:bg-white/20 transition-all active:scale-95 backdrop-blur-md"
                >
                  <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                  <span>Learn More</span>
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
                  <div className="text-2xl font-bold font-mono text-white">48 kHz</div>
                  <div className="text-xs text-zinc-500 font-medium mt-0.5">Lossless Audio</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono text-white">98.4%</div>
                  <div className="text-xs text-zinc-500 font-medium mt-0.5">Approval Rating</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono text-white">2-Year</div>
                  <div className="text-xs text-zinc-500 font-medium mt-0.5">Global Warranty</div>
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
                    ★ Flagship Spotlight
                  </span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> In Stock
                  </span>
                </div>

                {/* Product Image */}
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-900/90 border border-white/10 mb-5 group-hover:scale-[1.02] transition-transform duration-500">
                  <img
                    src={flagshipProduct.primaryImage}
                    alt={flagshipProduct.name}
                    className="w-full h-full object-cover object-center opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090b]/80 via-transparent to-transparent" />

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono text-zinc-200">
                      Planar Magnetic
                    </div>
                    <div className="bg-white text-black px-3.5 py-1.5 rounded-xl text-xs font-extrabold font-mono shadow-lg">
                      {formatCurrency(flagshipProduct.price)}
                    </div>
                  </div>
                </div>

                {/* Details & Interactive Quick View Trigger */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      {flagshipProduct.name}
                    </h3>
                    <div className="flex items-center text-orange-400 text-xs font-bold gap-1">
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
                      className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 border border-white/10"
                    >
                      <span>Inspect Hardware Specs</span>
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

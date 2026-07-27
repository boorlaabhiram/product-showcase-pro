import React from 'react';
import { Sparkles, ShieldCheck, Truck, RotateCcw, Headphones, Github, Twitter, Linkedin, Youtube, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onOpenContact: () => void;
  onOpenCompare: () => void;
  onOpenWishlist: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenContact,
  onOpenCompare,
  onOpenWishlist,
}) => {
  return (
    <footer className="bg-[#09090b]/80 backdrop-blur-2xl text-zinc-400 text-xs border-t border-white/10 pt-16 pb-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Value Guarantee Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-white/10">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-emerald-400 shrink-0 backdrop-blur-md">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs mb-0.5">Express Priority Shipping</h4>
              <p className="text-[11px] text-zinc-500 leading-normal">Complimentary 2-3 day shipping on orders over $100.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-amber-400 shrink-0 backdrop-blur-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs mb-0.5">2-Year Hardware Warranty</h4>
              <p className="text-[11px] text-zinc-500 leading-normal">Comprehensive international coverage for peace of mind.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-sky-400 shrink-0 backdrop-blur-md">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs mb-0.5">30-Day Risk-Free Returns</h4>
              <p className="text-[11px] text-zinc-500 leading-normal">Full refund guarantee with free return postage labels.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-purple-400 shrink-0 backdrop-blur-md">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs mb-0.5">24/7 Concierge Support</h4>
              <p className="text-[11px] text-zinc-500 leading-normal">Direct line to sound engineers and technical advisors.</p>
            </div>
          </div>
        </div>

        {/* Footer Link Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Bio Column */}
          <div className="col-span-2 space-y-4">
            <a href="#" className="flex items-center gap-3 text-white font-extrabold tracking-widest text-lg">
              <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-black">
                <Sparkles className="w-4 h-4 fill-black" />
              </div>
              <span className="font-serif tracking-tight text-xl text-white">AURA STUDIO</span>
            </a>

            <p className="text-zinc-400 text-xs max-w-sm leading-relaxed">
              Crafting premium acoustic hardware, spatial vision optics, and ergonomic workstation gear designed for creators who insist on perfection.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-colors backdrop-blur-md">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-colors backdrop-blur-md">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-colors backdrop-blur-md">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-colors backdrop-blur-md">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 1: Hardware */}
          <div className="space-y-3">
            <h5 className="font-mono text-white text-[11px] uppercase tracking-wider font-bold">Catalog</h5>
            <ul className="space-y-2 text-zinc-400">
              <li><a href="#" className="hover:text-white transition-colors">Audio & Sound</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Smart Wearables</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Ergonomic Setup</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Creative Gear</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Vision Tech</a></li>
            </ul>
          </div>

          {/* Column 2: Quick Tools */}
          <div className="space-y-3">
            <h5 className="font-mono text-white text-[11px] uppercase tracking-wider font-bold">Showcase Tools</h5>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <button onClick={onOpenCompare} className="hover:text-white transition-colors text-left">
                  Spec Comparison Matrix
                </button>
              </li>
              <li>
                <button onClick={onOpenWishlist} className="hover:text-white transition-colors text-left">
                  Saved Wishlist
                </button>
              </li>
              <li>
                <button onClick={onOpenContact} className="hover:text-white transition-colors text-left">
                  Concierge Desk
                </button>
              </li>
              <li><a href="#" className="hover:text-white transition-colors">Keynote Streams</a></li>
            </ul>
          </div>

          {/* Column 3: Legal & Standards */}
          <div className="space-y-3">
            <h5 className="font-mono text-white text-[11px] uppercase tracking-wider font-bold">Standards</h5>
            <ul className="space-y-2 text-zinc-400">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Eco-Material Transparency</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security Disclosures</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono text-zinc-500">
          <div>
            © 2026 Aura Studio Inc. All rights reserved. Designed with React 19 & Framer Motion.
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-400">Deploy Status: Vercel Production Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

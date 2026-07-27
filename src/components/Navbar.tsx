import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Heart, SlidersHorizontal, Sparkles, X, ArrowRight, Menu, PhoneCall, Layers } from 'lucide-react';
import { Product } from '../types/product';
import { PRODUCTS } from '../data/products';
import { formatCurrency } from '../lib/utils';

interface NavbarProps {
  wishlistCount: number;
  compareCount: number;
  onOpenWishlist: () => void;
  onOpenCompare: () => void;
  onOpenContact: () => void;
  onSelectProduct: (product: Product) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  wishlistCount,
  compareCount,
  onOpenWishlist,
  onOpenCompare,
  onOpenContact,
  onSelectProduct,
  searchQuery,
  setSearchQuery,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Search autocomplete suggestions
  const searchResults = searchQuery.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tagline.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-black/40 backdrop-blur-xl border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo */}
          <a
            href="#"
            className="flex items-center gap-3 text-white font-extrabold tracking-widest text-xl group shrink-0"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 via-emerald-400 to-indigo-500 p-[1px] shadow-lg shadow-blue-500/10 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-zinc-950/90 rounded-[15px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-400 fill-emerald-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-bold tracking-tight text-2xl bg-gradient-to-r from-blue-400 via-emerald-400 to-white bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
                AETHER.
              </span>
              <span className="text-[9px] tracking-[0.2em] uppercase text-zinc-400 font-mono -mt-1">
                STUDIO TECH
              </span>
            </div>
          </a>

          {/* Desktop Search Bar */}
          <div ref={searchRef} className="relative hidden md:block flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search products, specs, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full bg-white/5 text-zinc-100 text-xs pl-10 pr-9 py-2.5 rounded-full border border-white/10 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-500 backdrop-blur-md"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-zinc-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Live Autocomplete Dropdown */}
            <AnimatePresence>
              {isSearchFocused && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-[#09090b]/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 backdrop-blur-2xl p-2"
                >
                  <div className="text-[10px] font-mono text-zinc-400 px-3 py-1.5 uppercase tracking-wider border-b border-white/10">
                    Matching Products ({searchResults.length})
                  </div>
                  <div className="divide-y divide-white/5">
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => {
                          onSelectProduct(product);
                          setIsSearchFocused(false);
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center gap-3 p-2.5 hover:bg-white/10 rounded-xl transition-colors text-left group"
                      >
                        <img
                          src={product.primaryImage}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded-lg bg-zinc-900 border border-white/10 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-semibold text-zinc-100 truncate group-hover:text-white">
                            {product.name}
                          </h5>
                          <span className="text-[11px] text-zinc-400">
                            {product.category}
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold text-white">
                            {formatCurrency(product.price)}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Right Action Bar */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Compare Button */}
            <button
              onClick={onOpenCompare}
              className="relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all active:scale-95"
            >
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Compare</span>
              {compareCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-bold border border-sky-500/30">
                  {compareCount}
                </span>
              )}
            </button>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all active:scale-95"
            >
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Saved</span>
              {wishlistCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Concierge Contact Button */}
            <button
              onClick={onOpenContact}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-black bg-white hover:bg-zinc-200 transition-all shadow-lg shadow-white/5 active:scale-95"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Concierge</span>
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenWishlist}
              className="p-2.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:text-white relative backdrop-blur-md"
            >
              <Heart className="w-4 h-4 text-rose-400" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:text-white backdrop-blur-md"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/10 bg-[#09090b]/95 backdrop-blur-2xl p-4 space-y-4"
          >
            {/* Mobile Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 text-zinc-100 text-xs pl-9 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => {
                  onOpenCompare();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 p-3 bg-white/5 rounded-xl border border-white/10 text-xs text-zinc-200"
              >
                <Layers className="w-4 h-4 text-sky-400" />
                <span>Compare ({compareCount})</span>
              </button>

              <button
                onClick={() => {
                  onOpenContact();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 p-3 bg-white text-black font-bold rounded-xl text-xs"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Concierge</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

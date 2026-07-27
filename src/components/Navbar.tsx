import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Heart,
  Sparkles,
  X,
  Menu,
  PhoneCall,
  Layers,
  ShoppingBag,
  Bot,
  Compass,
  Mic,
  MicOff,
} from 'lucide-react';
import { Product } from '../types/product';
import { PRODUCTS } from '../data/products';
import { formatINR } from '../lib/utils';
import { useVoiceSearch } from '../hooks/useVoiceSearch';

interface NavbarProps {
  wishlistCount: number;
  compareCount: number;
  cartCount: number;
  onOpenWishlist: () => void;
  onOpenCompare: () => void;
  onOpenCart: () => void;
  onOpenContact: () => void;
  onOpenAIModal: () => void;
  onSelectProduct: (product: Product) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onShowToast?: (title: string, description?: string, type?: 'success' | 'info' | 'warning') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  wishlistCount,
  compareCount,
  cartCount,
  onOpenWishlist,
  onOpenCompare,
  onOpenCart,
  onOpenContact,
  onOpenAIModal,
  onSelectProduct,
  searchQuery,
  setSearchQuery,
  onShowToast,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
  } = useVoiceSearch({
    onResult: (text) => {
      setSearchQuery(text);
      setIsSearchFocused(true);
    },
    onError: (err) => {
      if (onShowToast) {
        onShowToast('Voice Search Notice', err, 'warning');
      }
    },
  });

  const handleMicClick = () => {
    if (!isSupported) {
      if (onShowToast) {
        onShowToast(
          'Browser Speech Unsupported',
          'Voice search requires Web Speech API support (Chrome, Edge, Safari or Android browser).',
          'info'
        );
      }
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      startListening();
      if (onShowToast) {
        onShowToast(
          'Listening for Voice Search...',
          'Speak clearly, e.g., "iPhone 16 Pro", "Gaming Laptop", or "OLED TV"',
          'info'
        );
      }
    }
  };

  // Live autocomplete search results
  const searchResults = searchQuery.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase())
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
    <header className="sticky top-0 z-40 bg-[#09090b]/80 backdrop-blur-2xl border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo & Tagline */}
          <a
            href="#"
            className="flex items-center gap-3 text-white font-extrabold tracking-widest group shrink-0"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-emerald-400 p-[1px] shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-zinc-950/90 rounded-[15px] flex items-center justify-center">
                <Compass className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-extrabold tracking-tight text-2xl bg-gradient-to-r from-blue-400 via-indigo-300 to-white bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
                Showcasely
              </span>
              <span className="text-[9px] tracking-[0.15em] uppercase text-zinc-400 font-mono -mt-1 font-semibold">
                Discover. Compare. Shop Smarter.
              </span>
            </div>
          </a>

          {/* Desktop Search Bar with Voice Search */}
          <div ref={searchRef} className="relative hidden md:block flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search smartphones, laptops, specs (e.g. ₹50,000)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full bg-white/5 text-zinc-100 text-xs pl-10 pr-20 py-2.5 rounded-full border border-white/10 focus:border-blue-500/80 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-500 backdrop-blur-md"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-zinc-400 hover:text-white transition-colors"
                    title="Clear Search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={handleMicClick}
                  className={`relative p-1.5 rounded-full transition-all ${
                    isListening
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/50 scale-105'
                      : 'text-zinc-400 hover:text-blue-400 hover:bg-white/10'
                  }`}
                  title={isListening ? 'Click to stop listening' : 'Voice Search (Web Speech API)'}
                >
                  {isListening ? (
                    <>
                      <span className="absolute -inset-1 rounded-full bg-rose-500/50 animate-ping pointer-events-none" />
                      <MicOff className="w-3.5 h-3.5 relative z-10" />
                    </>
                  ) : (
                    <Mic className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Voice Listening Active Waveform Banner */}
            <AnimatePresence>
              {isListening && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.95 }}
                  className="absolute top-full left-0 right-0 mt-2 p-3 bg-[#0c0a13]/95 border border-rose-500/40 rounded-2xl shadow-2xl backdrop-blur-2xl z-50 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex items-center gap-1 shrink-0 px-2 py-1 bg-rose-500/10 border border-rose-500/30 rounded-full">
                      <span className="w-1.5 h-3 bg-rose-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-5 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-4 bg-blue-400 rounded-full animate-bounce" />
                      <span className="w-1.5 h-2.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.4s]" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-[11px]">Listening for Hardware...</span>
                        <span className="text-[9px] font-mono bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded border border-rose-500/30 uppercase tracking-wider">
                          Web Speech API
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-300 font-mono truncate italic mt-0.5">
                        {transcript ? `"${transcript}"` : 'Speak product, brand, or spec...'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={stopListening}
                    className="px-2.5 py-1 text-[10px] font-mono font-bold rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-colors shrink-0"
                  >
                    Stop
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Live Autocomplete Suggestions */}
            <AnimatePresence>
              {isSearchFocused && searchResults.length > 0 && !isListening && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-[#09090b]/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 backdrop-blur-2xl p-2"
                >
                  <div className="text-[10px] font-mono text-zinc-400 px-3 py-1.5 uppercase tracking-wider border-b border-white/10 flex items-center justify-between">
                    <span>Matching Hardware ({searchResults.length})</span>
                    <span className="text-blue-400">Indian Market Prices</span>
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
                          <h5 className="text-xs font-semibold text-zinc-100 truncate group-hover:text-blue-400 transition-colors">
                            {product.name}
                          </h5>
                          <span className="text-[11px] text-zinc-400">
                            {product.brand} • {product.category}
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold font-mono text-emerald-400">
                            {formatINR(product.price)}
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
            {/* Ask AI Shopping Assistant */}
            <button
              onClick={onOpenAIModal}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-blue-300 hover:text-white bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 backdrop-blur-md transition-all active:scale-95 shadow-lg shadow-blue-500/10"
            >
              <Bot className="w-4 h-4 text-blue-400" />
              <span>Ask AI Assistant</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
              </span>
            </button>

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

            {/* Cart Drawer Trigger */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white text-blue-900 text-[10px] font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenCart}
              className="p-2.5 rounded-full bg-blue-600 text-white relative backdrop-blur-md shadow-lg shadow-blue-500/20"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
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
            {/* Mobile Search with Voice Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 text-zinc-100 text-xs pl-9 pr-16 py-2.5 rounded-xl border border-white/10 focus:outline-none"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-zinc-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={handleMicClick}
                  className={`p-1.5 rounded-lg transition-all ${
                    isListening
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40 animate-pulse'
                      : 'text-zinc-400 hover:text-blue-400 hover:bg-white/10'
                  }`}
                  title="Voice Search"
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Mobile Voice Status Banner */}
            {isListening && (
              <div className="p-3 bg-[#0c0a13] border border-rose-500/40 rounded-xl flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
                  <span className="text-zinc-200 text-[11px] font-mono truncate">
                    {transcript ? `"${transcript}"` : 'Listening for hardware...'}
                  </span>
                </div>
                <button
                  onClick={stopListening}
                  className="px-2 py-0.5 text-[10px] font-mono bg-rose-500/20 text-rose-300 rounded border border-rose-500/30 shrink-0"
                >
                  Stop
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => {
                  onOpenAIModal();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 p-3 bg-blue-600/20 border border-blue-500/30 rounded-xl text-xs text-blue-300 font-semibold"
              >
                <Bot className="w-4 h-4 text-blue-400" />
                <span>AI Assistant</span>
              </button>

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
                  onOpenWishlist();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 p-3 bg-white/5 rounded-xl border border-white/10 text-xs text-zinc-200"
              >
                <Heart className="w-4 h-4 text-rose-400" />
                <span>Saved ({wishlistCount})</span>
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

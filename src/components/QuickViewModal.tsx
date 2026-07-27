import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Star,
  Heart,
  Layers,
  CheckCircle,
  Share2,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Plus,
  Minus,
  MessageSquare,
  PackageCheck,
} from 'lucide-react';
import { Product } from '../types/product';
import { formatCurrency } from '../lib/utils';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  isWishlisted: boolean;
  isCompared: boolean;
  onToggleWishlist: (productId: string) => void;
  onToggleCompare: (productId: string) => void;
  onShowToast: (title: string, description?: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  isWishlisted,
  isCompared,
  onToggleWishlist,
  onToggleCompare,
  onShowToast,
}) => {
  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'box' | 'reviews'>('overview');

  // Review Form State
  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });
  const [reviewsList, setReviewsList] = useState(product.reviews);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;

    const reviewObj = {
      id: `rev-${Date.now()}`,
      userName: newReview.name,
      rating: Number(newReview.rating),
      date: 'Just now',
      title: 'Verified Buyer Feedback',
      comment: newReview.comment,
      verified: true,
    };

    setReviewsList([reviewObj, ...reviewsList]);
    setNewReview({ name: '', rating: 5, comment: '' });
    onShowToast('Review Submitted', 'Thank you for sharing your experience!');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    onShowToast('Link Copied!', 'Product page link copied to clipboard.');
  };

  const images = product.galleryImages && product.galleryImages.length > 0
    ? product.galleryImages
    : [product.primaryImage];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-5xl bg-[#09090b]/90 border border-white/10 rounded-[32px] shadow-2xl overflow-hidden z-10 my-8 max-h-[90vh] flex flex-col backdrop-blur-2xl"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02] shrink-0">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/5 text-zinc-300 text-xs font-mono border border-white/10">
                SKU: {product.sku}
              </span>
              <span className="text-xs text-zinc-400">/ {product.category}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors border border-white/10"
                title="Share Product"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Content Container */}
          <div className="p-6 overflow-y-auto space-y-8">
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Image Gallery */}
              <div className="lg:col-span-6 space-y-4">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-xl">
                  <img
                    src={images[activeImageIndex] || product.primaryImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.discountPercentage > 0 && (
                    <span className="absolute top-4 left-4 bg-rose-500 text-white font-mono font-bold text-xs px-3 py-1 rounded-full shadow-lg">
                      Save {product.discountPercentage}%
                    </span>
                  )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex items-center gap-3 overflow-x-auto pb-2">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                          activeImageIndex === idx
                            ? 'border-white scale-105 shadow-md'
                            : 'border-zinc-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Product Specs & Purchase Options */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                    {product.name}
                  </h2>
                  <p className="text-xs text-emerald-400 font-mono mt-1">{product.tagline}</p>
                </div>

                {/* Rating & Stock Status */}
                <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-amber-400 text-sm font-bold gap-1">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span>{product.rating}</span>
                    </div>
                    <span className="text-xs text-zinc-400 font-mono">
                      ({reviewsList.length} verified reviews)
                    </span>
                  </div>

                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {product.stockStatus === 'in-stock'
                      ? 'In Stock & Ready to Ship'
                      : `Low Stock (${product.stockCount} remaining)`}
                  </span>
                </div>

                {/* Pricing Block */}
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-white font-mono">
                    {formatCurrency(product.price)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-zinc-500 line-through font-mono">
                      {formatCurrency(product.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Color Selection */}
                {product.colors.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
                      Color Variant: <strong className="text-white">{selectedColor}</strong>
                    </label>
                    <div className="flex items-center gap-3">
                      {product.colors.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColor(c.name)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all ${
                            selectedColor === c.name
                              ? 'border-white bg-zinc-800 text-white font-bold'
                              : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-zinc-700 inline-block"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span>{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity & CTA Buttons */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-4">
                    {/* Quantity Selector */}
                    <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 text-zinc-400 hover:text-white transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center font-mono font-bold text-xs text-white">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2 text-zinc-400 hover:text-white transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Buy / Reserve Button */}
                    <button
                      onClick={() =>
                        onShowToast('Order Initiated', `Added ${quantity}x ${product.name} to checkout stream.`)
                      }
                      className="flex-1 py-3 px-6 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-extrabold text-sm shadow-xl transition-all active:scale-95 text-center"
                    >
                      Reserve / Buy Now ({formatCurrency(product.price * quantity)})
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onToggleWishlist(product.id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-medium transition-colors ${
                        isWishlisted
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                          : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>{isWishlisted ? 'Saved in Wishlist' : 'Save to Wishlist'}</span>
                    </button>

                    <button
                      onClick={() => onToggleCompare(product.id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-medium transition-colors ${
                        isCompared
                          ? 'bg-sky-500/20 text-sky-400 border-sky-500/40'
                          : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
                      }`}
                    >
                      <Layers className="w-4 h-4 text-sky-400" />
                      <span>{isCompared ? 'In Compare List' : 'Add to Compare'}</span>
                    </button>
                  </div>
                </div>

                {/* Shipping & Guarantee Value Bar */}
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-zinc-800/80 text-[11px] text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-emerald-400" />
                    <span>Free Express Ship</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>2-Yr Warranty</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RotateCcw className="w-4 h-4 text-sky-400" />
                    <span>30-Day Returns</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabbed Spec & Overview Navigation */}
            <div className="pt-6 border-t border-zinc-800/80">
              <div className="flex items-center gap-4 border-b border-zinc-800 pb-3">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`text-xs font-mono uppercase tracking-wider pb-1 transition-all ${
                    activeTab === 'overview'
                      ? 'text-white border-b-2 border-white font-bold'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`text-xs font-mono uppercase tracking-wider pb-1 transition-all ${
                    activeTab === 'specs'
                      ? 'text-white border-b-2 border-white font-bold'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Tech Specs
                </button>
                <button
                  onClick={() => setActiveTab('box')}
                  className={`text-xs font-mono uppercase tracking-wider pb-1 transition-all ${
                    activeTab === 'box'
                      ? 'text-white border-b-2 border-white font-bold'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  In The Box
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`text-xs font-mono uppercase tracking-wider pb-1 transition-all ${
                    activeTab === 'reviews'
                      ? 'text-white border-b-2 border-white font-bold'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Reviews ({reviewsList.length})
                </button>
              </div>

              {/* Tab Contents */}
              <div className="pt-4">
                {activeTab === 'overview' && (
                  <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
                    <p>{product.detailedOverview}</p>
                    <div className="space-y-2 pt-2">
                      <h4 className="font-bold text-white font-serif text-sm">Key Highlights</h4>
                      <ul className="grid sm:grid-cols-2 gap-2">
                        {product.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-2 text-zinc-400">
                            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'specs' && (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {product.specs.map((s, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80 flex items-center justify-between text-xs"
                      >
                        <span className="text-zinc-400 font-mono">{s.name}</span>
                        <span className="font-semibold text-white font-mono">{s.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'box' && (
                  <ul className="space-y-2">
                    {product.inTheBox.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                        <PackageCheck className="w-4 h-4 text-sky-400 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {/* User Review Submission */}
                    <form onSubmit={handleAddReview} className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                      <h4 className="text-xs font-mono uppercase text-zinc-300 font-bold">Write a Verified Review</h4>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Your Name"
                          value={newReview.name}
                          onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                          className="bg-zinc-900 text-xs text-white p-2.5 rounded-xl border border-zinc-800 focus:outline-none"
                          required
                        />
                        <select
                          value={newReview.rating}
                          onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                          className="bg-zinc-900 text-xs text-white p-2.5 rounded-xl border border-zinc-800 focus:outline-none"
                        >
                          <option value="5">5 Stars - Outstanding</option>
                          <option value="4">4 Stars - Very Good</option>
                          <option value="3">3 Stars - Average</option>
                        </select>
                      </div>
                      <textarea
                        placeholder="Share your thoughts about build quality, performance, and ergonomics..."
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        className="w-full bg-zinc-900 text-xs text-white p-2.5 rounded-xl border border-zinc-800 focus:outline-none h-20"
                        required
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-white text-zinc-950 font-bold text-xs rounded-xl hover:bg-zinc-200 transition-colors"
                      >
                        Submit Feedback
                      </button>
                    </form>

                    {/* Existing Reviews List */}
                    <div className="space-y-3">
                      {reviewsList.map((rev) => (
                        <div key={rev.id} className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/60 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-white">{rev.userName}</span>
                            <span className="text-[10px] text-zinc-500 font-mono">{rev.date}</span>
                          </div>
                          <div className="flex items-center text-amber-400 gap-1 text-xs">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span>{rev.rating}.0</span>
                          </div>
                          <p className="text-xs text-zinc-300 leading-relaxed pt-1">{rev.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

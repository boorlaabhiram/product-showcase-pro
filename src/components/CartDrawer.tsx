import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  Check,
  Sparkles,
  CreditCard,
  Truck,
  IndianRupee,
} from 'lucide-react';
import { CartItem } from '../types/product';
import { formatINR } from '../lib/utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const total = Math.max(0, subtotal - discountAmount);
  const gstInclusiveAmount = Math.round((total * 18) / 118); // 18% GST inclusive

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'SHOWCASE10' || code === 'AURA2026') {
      setDiscountPercent(10);
      setAppliedCoupon(code);
      setCouponError(null);
    } else if (code === 'FESTIVE25') {
      setDiscountPercent(25);
      setAppliedCoupon(code);
      setCouponError(null);
    } else {
      setCouponError('Invalid coupon code. Try SHOWCASE10 or FESTIVE25');
    }
  };

  const handleCheckout = () => {
    setIsCheckoutSuccess(true);
  };

  const handleResetCheckout = () => {
    setIsCheckoutSuccess(false);
    onClearCart();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-md bg-[#09090b] border-l border-white/10 shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Your Shopping Cart</h2>
                  <p className="text-xs text-zinc-400">
                    {cart.reduce((acc, i) => acc + i.quantity, 0)} Items Selected
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            {isCheckoutSuccess ? (
              <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-2xl shadow-emerald-500/20">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Order Placed Successfully!</h3>
                <p className="text-xs text-zinc-300 leading-relaxed max-w-xs">
                  Thank you for shopping on <strong className="text-white">Showcasely</strong>.
                  Your order confirmation invoice & GST breakdown has been sent to your registered email.
                </p>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 w-full text-left space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-zinc-400">
                    <span>Order Total:</span>
                    <strong className="text-emerald-400">{formatINR(total)}</strong>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>GST (18% Incl.):</span>
                    <span className="text-zinc-300">{formatINR(gstInclusiveAmount)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Estimated Delivery:</span>
                    <span className="text-blue-400">Tomorrow, 11 AM</span>
                  </div>
                </div>
                <button
                  onClick={handleResetCheckout}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/25 mt-4"
                >
                  Continue Shopping
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 text-zinc-500 flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-white">Your Cart is Empty</h3>
                <p className="text-xs text-zinc-400 max-w-xs">
                  Browse our high-performance electronics catalog and add products to test your checkout experience!
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all backdrop-blur-md"
                  >
                    <img
                      src={item.product.primaryImage}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-xl bg-zinc-900 border border-white/10 shrink-0"
                    />

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white truncate">{item.product.name}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono mt-0.5">
                          <span>{item.product.brand}</span>
                          {item.selectedStorage && <span>• {item.selectedStorage}</span>}
                          {item.selectedRam && <span>• {item.selectedRam}</span>}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          {formatINR(item.product.price * item.quantity)}
                        </span>

                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-2 py-0.5">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, -1)}
                            className="text-zinc-400 hover:text-white transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-mono text-white px-1.5 font-bold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                            className="text-zinc-400 hover:text-white transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-zinc-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Coupon Code Form */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2 mt-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                    <Tag className="w-3.5 h-3.5 text-blue-400" />
                    <span>Apply Promotional Coupon</span>
                  </div>

                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. SHOWCASE10"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white uppercase placeholder:text-zinc-600 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition-colors"
                    >
                      Apply
                    </button>
                  </form>

                  {appliedCoupon && (
                    <div className="flex items-center justify-between text-[11px] text-emerald-400 font-mono">
                      <span>Applied: {appliedCoupon} ({discountPercent}% OFF)</span>
                      <button
                        onClick={() => {
                          setAppliedCoupon(null);
                          setDiscountPercent(0);
                        }}
                        className="text-zinc-400 hover:text-white"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {couponError && <p className="text-[11px] text-rose-400 font-mono">{couponError}</p>}
                </div>
              </div>
            )}

            {/* Footer Summary */}
            {!isCheckoutSuccess && cart.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-white/[0.02] space-y-3">
                <div className="space-y-1 text-xs font-mono">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span className="text-white">{formatINR(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Coupon Savings</span>
                      <span>-{formatINR(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-zinc-400">
                    <span>GST (18% Inclusive)</span>
                    <span className="text-zinc-300">{formatINR(gstInclusiveAmount)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Express Shipping</span>
                    <span className="text-emerald-400 font-bold">FREE (India)</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                    <span>Grand Total</span>
                    <span className="text-emerald-400 text-base">{formatINR(total)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Proceed to Express Checkout ({formatINR(total)})</span>
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>256-Bit Encrypted Payment • Official Brand Warranty</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

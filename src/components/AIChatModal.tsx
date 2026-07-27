import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  ArrowRight,
  Zap,
  ShoppingBag,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { Product } from '../types/product';
import { formatINR } from '../lib/utils';

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  recommendedProductIds?: string[];
  timestamp: string;
}

const QUICK_PROMPTS = [
  '🔥 Find the best smartphone under ₹50,000 for camera & gaming',
  '💻 Which laptop should I buy for 4K video editing & 3D rendering?',
  '🎧 Compare Sony WH-1000XM5 vs AirPods Pro 2 active noise cancellation',
  '🎮 Recommend a top tier PS5 gaming setup with TV or monitor',
];

export const AIChatModal: React.FC<AIChatModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: 'Hello! I am Showcasely AI, your personal tech shopping advisor in India. Ask me about smartphones, laptops, audio gear, prices, or comparisons!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const prompt = textToSend || input;
    if (!prompt.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          contextProducts: products.map((p) => ({
            id: p.id,
            name: p.name,
            brand: p.brand,
            category: p.category,
            price: p.price,
            rating: p.rating,
            highlights: p.highlights,
          })),
        }),
      });

      const data = await res.json();

      // Find products matched in response or query
      const matchedIds = products
        .filter((p) => {
          const q = prompt.toLowerCase();
          const name = p.name.toLowerCase();
          const category = p.category.toLowerCase();
          const brand = p.brand.toLowerCase();
          return name.includes(q) || q.includes(brand) || q.includes(category);
        })
        .slice(0, 3)
        .map((p) => p.id);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply || 'Here are my top hardware picks on Showcasely:',
        recommendedProductIds: matchedIds.length > 0 ? matchedIds : undefined,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: 'I recommend exploring our curated category filters above for instant tech specifications!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[#09090b] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[650px] max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">Showcasely AI Assistant</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20 font-semibold">
                    Live IN
                  </span>
                </div>
                <p className="text-xs text-zinc-400">Powered by Gemini 3.6 Flash & Indian Market Intel</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-blue-400" />
                  </div>
                )}

                <div className={`max-w-[80%] space-y-3`}>
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none shadow-lg shadow-blue-500/20'
                        : 'bg-white/5 border border-white/10 text-zinc-200 rounded-bl-none backdrop-blur-md'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <span className="block text-[10px] text-zinc-400 mt-1 text-right font-mono">
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Recommended Products Cards */}
                  {msg.recommendedProductIds && msg.recommendedProductIds.length > 0 && (
                    <div className="grid grid-cols-1 gap-2 pt-2">
                      <span className="text-[11px] font-mono text-blue-400 uppercase tracking-wider flex items-center gap-1">
                        <ShoppingBag className="w-3 h-3" /> Relevant Hardware Recommendations:
                      </span>
                      {msg.recommendedProductIds.map((id) => {
                        const prod = products.find((p) => p.id === id);
                        if (!prod) return null;
                        return (
                          <div
                            key={id}
                            onClick={() => {
                              onSelectProduct(prod);
                              onClose();
                            }}
                            className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/10 hover:border-blue-500/50 hover:bg-white/[0.08] cursor-pointer transition-all group"
                          >
                            <img
                              src={prod.primaryImage}
                              alt={prod.name}
                              className="w-12 h-12 object-cover rounded-lg bg-zinc-900 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                                {prod.name}
                              </h5>
                              <p className="text-[11px] text-emerald-400 font-mono font-bold mt-0.5">
                                {formatINR(prod.price)}
                              </p>
                            </div>
                            <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-white shrink-0" />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4 text-zinc-300" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-3 text-zinc-400 text-xs font-mono">
                <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center animate-pulse">
                  <Bot className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-2">Analyzing specifications & Indian store prices...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Starter Prompts */}
          {messages.length <= 2 && (
            <div className="px-5 py-2 border-t border-white/5 bg-white/[0.01]">
              <span className="text-[10px] text-zinc-400 font-mono block mb-2 uppercase">
                Suggested Hardware Inquiries:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_PROMPTS.map((qp, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(qp)}
                    className="text-[11px] px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 transition-colors text-left"
                  >
                    {qp}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Box */}
          <div className="p-4 border-t border-white/10 bg-white/[0.02]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask AI about smartphones, laptops, audio gear, or prices..."
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/80 transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 transition-opacity disabled:opacity-40 shadow-lg shadow-blue-500/25"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

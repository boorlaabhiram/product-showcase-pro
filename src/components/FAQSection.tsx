import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle, Search, Sparkles } from 'lucide-react';
import { FAQS } from '../data/faq';

export const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [faqSearch, setFaqSearch] = useState<string>('');

  const categories = ['All', 'Shipping & Delivery', 'Warranty & Returns', 'Product Tech', 'General'];

  const filteredFaqs = FAQS.filter((f) => {
    const matchesCategory = activeCategory === 'All' || f.category === activeCategory;
    const matchesSearch =
      f.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.answer.toLowerCase().includes(faqSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-20 bg-[#09090b]/80 border-t border-white/10 backdrop-blur-2xl relative z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-mono backdrop-blur-md">
            <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
            <span>Hardware Assistance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Everything you need to know about shipping speeds, international warranties, and technical compatibility.
          </p>
        </div>

        {/* Search & Category Pills */}
        <div className="space-y-4 mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search help topics..."
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              className="w-full bg-white/5 text-xs text-white pl-11 pr-4 py-3 rounded-full border border-white/10 focus:outline-none placeholder:text-zinc-500 backdrop-blur-md"
            />
          </div>

          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-white text-black font-bold shadow-lg shadow-white/5'
                    : 'bg-white/5 text-zinc-400 hover:text-white border border-white/10 backdrop-blur-md'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion Questions */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className="rounded-3xl bg-white/[0.03] border border-white/10 overflow-hidden transition-all hover:bg-white/[0.05] hover:border-white/20 backdrop-blur-md shadow-xl"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full flex items-center justify-between p-5 text-left text-xs sm:text-sm font-semibold text-white font-serif"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 transition-transform duration-300 shrink-0 ml-4 ${
                      isOpen ? 'rotate-180 text-white' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-5 pb-5 text-xs text-zinc-300 leading-relaxed border-t border-white/10 pt-3"
                    >
                      <p>{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

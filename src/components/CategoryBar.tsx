import React from 'react';
import { motion } from 'motion/react';
import { Headphones, Watch, Monitor, Sparkles, Home, Glasses, Compass, Cpu } from 'lucide-react';
import { ProductCategory } from '../types/product';
import { CATEGORIES } from '../data/products';

interface CategoryBarProps {
  selectedCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
  categoryCounts: Record<ProductCategory, number>;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  const getCategoryIcon = (category: ProductCategory) => {
    switch (category) {
      case 'Audio & Sound':
        return Headphones;
      case 'Smart Wearables':
        return Watch;
      case 'Ergonomic Setup':
        return Monitor;
      case 'Creative Gear':
        return Cpu;
      case 'Smart Home':
        return Home;
      case 'Vision Tech':
        return Glasses;
      default:
        return Compass;
    }
  };

  return (
    <div className="w-full py-6 border-b border-white/10 bg-black/30 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 pt-1">
          {CATEGORIES.map((category) => {
            const Icon = getCategoryIcon(category);
            const isSelected = selectedCategory === category;
            const count = categoryCounts[category] || 0;

            return (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 shrink-0 ${
                  isSelected
                    ? 'text-black font-bold bg-white shadow-xl shadow-white/5'
                    : 'text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : 'text-zinc-400'}`} />
                <span>{category}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                    isSelected ? 'bg-zinc-200 text-black font-bold' : 'bg-white/10 text-zinc-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

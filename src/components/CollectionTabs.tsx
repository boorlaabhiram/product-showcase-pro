import React from 'react';
import { Sparkles, Flame, Trophy, Zap, Crown, Grid } from 'lucide-react';
import { CollectionTag } from '../types/product';

interface CollectionTabsProps {
  selectedCollection: 'all' | CollectionTag;
  onSelectCollection: (collection: 'all' | CollectionTag) => void;
}

export const CollectionTabs: React.FC<CollectionTabsProps> = ({
  selectedCollection,
  onSelectCollection,
}) => {
  const tabs: { id: 'all' | CollectionTag; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'all', label: 'All Hardware', icon: Grid },
    { id: 'featured', label: 'Featured', icon: Sparkles },
    { id: 'trending', label: 'Trending', icon: Flame },
    { id: 'best-seller', label: 'Best Sellers', icon: Trophy },
    { id: 'new-arrival', label: 'New Arrivals', icon: Zap },
    { id: 'premium', label: 'Premium Edition', icon: Crown },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-3 border-b border-white/10">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = selectedCollection === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onSelectCollection(tab.id)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              isActive
                ? 'bg-white text-black shadow-lg shadow-white/5'
                : 'text-zinc-400 hover:text-white bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-blue-400'}`} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

import React from 'react';
import { SlidersHorizontal, ArrowUpDown, LayoutGrid, Grid3x3, List, RotateCcw } from 'lucide-react';
import { FilterState } from '../types/product';

interface FilterToolbarProps {
  filterState: FilterState;
  onUpdateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onResetFilters: () => void;
  layoutMode: 'grid-4' | 'grid-3' | 'list';
  setLayoutMode: (mode: 'grid-4' | 'grid-3' | 'list') => void;
  totalResults: number;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  filterState,
  onUpdateFilter,
  onResetFilters,
  layoutMode,
  setLayoutMode,
  totalResults,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-4 px-5 bg-white/[0.03] rounded-2xl border border-white/10 mb-8 backdrop-blur-md shadow-xl">
      {/* Result Counter & Active Filters Indicator */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono text-zinc-400">
          Showing <strong className="text-white font-bold">{totalResults}</strong> Hardware Products
        </span>

        {filterState.inStockOnly && (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20">
            In-Stock Only
          </span>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* In Stock Toggle */}
        <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300 font-medium px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-md">
          <input
            type="checkbox"
            checked={filterState.inStockOnly}
            onChange={(e) => onUpdateFilter('inStockOnly', e.target.checked)}
            className="rounded border-white/20 bg-zinc-900 text-blue-500 focus:ring-0 w-3.5 h-3.5"
          />
          <span>In-Stock Only</span>
        </label>

        {/* Sort Select Dropdown */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3.5 py-1.5 text-xs text-zinc-300 backdrop-blur-md">
          <ArrowUpDown className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span className="text-zinc-500 text-[11px] font-mono hidden sm:inline">Sort:</span>
          <select
            value={filterState.sortBy}
            onChange={(e) =>
              onUpdateFilter('sortBy', e.target.value as FilterState['sortBy'])
            }
            className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer pr-2"
          >
            <option value="featured" className="bg-[#09090b] text-white">Featured</option>
            <option value="price-low" className="bg-[#09090b] text-white">Price: Low to High</option>
            <option value="price-high" className="bg-[#09090b] text-white">Price: High to Low</option>
            <option value="rating" className="bg-[#09090b] text-white">Highest Rated</option>
            <option value="newest" className="bg-[#09090b] text-white">Newest Release</option>
            <option value="discount" className="bg-[#09090b] text-white">Biggest Discount</option>
          </select>
        </div>

        {/* Layout Mode Switcher */}
        <div className="hidden sm:flex items-center bg-white/5 border border-white/10 rounded-full p-1 gap-1 backdrop-blur-md">
          <button
            onClick={() => setLayoutMode('grid-4')}
            title="4 Column Grid"
            className={`p-1.5 rounded-full text-xs transition-colors ${
              layoutMode === 'grid-4' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Grid3x3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setLayoutMode('grid-3')}
            title="3 Column Grid"
            className={`p-1.5 rounded-full text-xs transition-colors ${
              layoutMode === 'grid-3' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setLayoutMode('list')}
            title="List View"
            className={`p-1.5 rounded-full text-xs transition-colors ${
              layoutMode === 'list' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Reset Filter Button */}
        <button
          onClick={onResetFilters}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white text-xs transition-colors backdrop-blur-md"
          title="Reset All Filters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

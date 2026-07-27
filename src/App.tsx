import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { PromoBanner } from './components/PromoBanner';
import { Hero } from './components/Hero';
import { CategoryBar } from './components/CategoryBar';
import { CollectionTabs } from './components/CollectionTabs';
import { FilterToolbar } from './components/FilterToolbar';
import { ProductGrid } from './components/ProductGrid';
import { QuickViewModal } from './components/QuickViewModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CompareModal } from './components/CompareModal';
import { RecentlyViewedBar } from './components/RecentlyViewedBar';
import { FAQSection } from './components/FAQSection';
import { Newsletter } from './components/Newsletter';
import { ContactModal } from './components/ContactModal';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';

import { PRODUCTS } from './data/products';
import { Product, ProductCategory, CollectionTag, FilterState, ToastMessage } from './types/product';
import { useLocalStorage } from './hooks/useLocalStorage';

export default function App() {
  // Persistent Storage Hooks
  const [wishlistIds, setWishlistIds] = useLocalStorage<string[]>('aura_wishlist_ids', [
    'prod-01',
    'prod-04',
  ]);
  const [compareIds, setCompareIds] = useLocalStorage<string[]>('aura_compare_ids', [
    'prod-01',
    'prod-11',
  ]);
  const [recentlyViewedIds, setRecentlyViewedIds] = useLocalStorage<string[]>('aura_recent_ids', [
    'prod-01',
    'prod-02',
    'prod-05',
  ]);

  // Toast Notifications State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (title: string, description?: string, type: ToastMessage['type'] = 'success') => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      title,
      description,
      type,
    };
    setToasts((prev) => [newToast, ...prev].slice(0, 4));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Filter & Layout States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');
  const [selectedCollection, setSelectedCollection] = useState<'all' | CollectionTag>('all');
  const [layoutMode, setLayoutMode] = useState<'grid-4' | 'grid-3' | 'list'>('grid-4');

  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: '',
    selectedCategory: 'All',
    selectedCollection: 'all',
    sortBy: 'featured',
    minPrice: 0,
    maxPrice: 2000,
    inStockOnly: false,
  });

  const handleUpdateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilterState((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedCollection('all');
    setFilterState({
      searchQuery: '',
      selectedCategory: 'All',
      selectedCollection: 'all',
      sortBy: 'featured',
      minPrice: 0,
      maxPrice: 2000,
      inStockOnly: false,
    });
    showToast('Filters Reset', 'Showing all products in flagship catalog.');
  };

  // Modal / Drawer States
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  // Quick View Inspection Action
  const handleOpenQuickView = (product: Product) => {
    setQuickViewProduct(product);
    // Add to recently viewed if not already at top
    setRecentlyViewedIds((prev) => [product.id, ...prev.filter((id) => id !== product.id)].slice(0, 8));
  };

  // Wishlist Actions
  const handleToggleWishlist = (id: string) => {
    const isSaved = wishlistIds.includes(id);
    const product = PRODUCTS.find((p) => p.id === id);
    if (isSaved) {
      setWishlistIds((prev) => prev.filter((item) => item !== id));
      showToast('Removed from Wishlist', product?.name);
    } else {
      setWishlistIds((prev) => [...prev, id]);
      showToast('Added to Wishlist', product?.name);
    }
  };

  // Compare Actions
  const handleToggleCompare = (id: string) => {
    const isCompared = compareIds.includes(id);
    const product = PRODUCTS.find((p) => p.id === id);
    if (isCompared) {
      setCompareIds((prev) => prev.filter((item) => item !== id));
      showToast('Removed from Comparison', product?.name);
    } else {
      if (compareIds.length >= 4) {
        showToast('Matrix Limit Reached', 'You can compare up to 4 items simultaneously.', 'warning');
        return;
      }
      setCompareIds((prev) => [...prev, id]);
      showToast('Added to Comparison Matrix', product?.name);
    }
  };

  // Calculate Category Item Counts
  const categoryCounts = useMemo(() => {
    const counts: Record<ProductCategory, number> = {
      All: PRODUCTS.length,
      'Audio & Sound': 0,
      'Smart Wearables': 0,
      'Ergonomic Setup': 0,
      'Creative Gear': 0,
      'Smart Home': 0,
      'Vision Tech': 0,
    };

    PRODUCTS.forEach((p) => {
      if (counts[p.category] !== undefined) {
        counts[p.category] += 1;
      }
    });

    return counts;
  }, []);

  // Filtered & Sorted Products Processing
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // 1. Search filter
      const query = searchQuery.trim().toLowerCase();
      if (query) {
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        const matchesTagline = product.tagline.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        if (!matchesName && !matchesCategory && !matchesTagline && !matchesDesc) {
          return false;
        }
      }

      // 2. Category filter
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }

      // 3. Collection Tag filter
      if (selectedCollection === 'featured' && !product.isFeatured) return false;
      if (selectedCollection === 'trending' && !product.isTrending) return false;
      if (selectedCollection === 'best-seller' && !product.isBestSeller) return false;
      if (selectedCollection === 'new-arrival' && !product.isNewArrival) return false;
      if (selectedCollection === 'premium' && !product.isPremium) return false;

      // 4. In-Stock filter
      if (filterState.inStockOnly && product.stockStatus !== 'in-stock') {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filterState.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return b.releaseYear - a.releaseYear;
        case 'discount':
          return b.discountPercentage - a.discountPercentage;
        case 'featured':
        default:
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
    });
  }, [searchQuery, selectedCategory, selectedCollection, filterState]);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans antialiased selection:bg-white selection:text-black relative overflow-hidden">
      {/* Global Ambient Glow Spotlights */}
      <div className="fixed top-[-100px] left-[-100px] w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="relative z-10">
        {/* Top Discount Promo Ticker */}
        <PromoBanner
          onCopyCode={(code) =>
            showToast('Coupon Code Copied!', `Use code "${code}" at checkout for extra savings.`)
          }
        />

      {/* Sticky Main Navigation */}
      <Navbar
        wishlistCount={wishlistIds.length}
        compareCount={compareIds.length}
        onOpenWishlist={() => setWishlistOpen(true)}
        onOpenCompare={() => setCompareOpen(true)}
        onOpenContact={() => setContactOpen(true)}
        onSelectProduct={handleOpenQuickView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Flagship Hero Spotlight */}
      <Hero
        onQuickView={handleOpenQuickView}
        onExploreCollection={() => {
          const el = document.getElementById('catalog-grid');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Category Pills Bar */}
      <CategoryBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categoryCounts={categoryCounts}
      />

      {/* Main Catalog Showcase Section */}
      <main id="catalog-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-bold">
                Hardware Collection 2026
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight mt-1">
                Explore The Showcase
              </h2>
            </div>
          </div>

          {/* Collection Filter Tabs */}
          <CollectionTabs
            selectedCollection={selectedCollection}
            onSelectCollection={setSelectedCollection}
          />
        </div>

        {/* Filter Toolbar Controls */}
        <FilterToolbar
          filterState={filterState}
          onUpdateFilter={handleUpdateFilter}
          onResetFilters={handleResetFilters}
          layoutMode={layoutMode}
          setLayoutMode={setLayoutMode}
          totalResults={filteredProducts.length}
        />

        {/* Product Grid / List Showcase */}
        <ProductGrid
          products={filteredProducts}
          wishlistIds={wishlistIds}
          compareIds={compareIds}
          onToggleWishlist={handleToggleWishlist}
          onToggleCompare={handleToggleCompare}
          onQuickView={handleOpenQuickView}
          layoutMode={layoutMode}
          onResetFilters={handleResetFilters}
        />
      </main>

      {/* Recently Inspected Horizontal Bar */}
      <RecentlyViewedBar
        recentlyViewedIds={recentlyViewedIds}
        onQuickView={handleOpenQuickView}
      />

      {/* FAQ Assistance Accordion */}
      <FAQSection />

      {/* Keynote Newsletter Access */}
      <Newsletter onShowToast={showToast} />

      {/* Footer */}
      <Footer
        onOpenContact={() => setContactOpen(true)}
        onOpenCompare={() => setCompareOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
      />

      {/* Modals & Drawers */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        isWishlisted={quickViewProduct ? wishlistIds.includes(quickViewProduct.id) : false}
        isCompared={quickViewProduct ? compareIds.includes(quickViewProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onToggleCompare={handleToggleCompare}
        onShowToast={showToast}
      />

      <WishlistDrawer
        isOpen={wishlistOpen}
        wishlistIds={wishlistIds}
        onClose={() => setWishlistOpen(false)}
        onRemoveWishlist={handleToggleWishlist}
        onClearWishlist={() => {
          setWishlistIds([]);
          showToast('Wishlist Cleared');
        }}
        onQuickView={handleOpenQuickView}
      />

      <CompareModal
        compareIds={compareIds}
        onClose={() => setCompareOpen(false)}
        onRemoveFromCompare={handleToggleCompare}
        onClearCompare={() => {
          setCompareIds([]);
          showToast('Comparison Matrix Cleared');
        }}
        onQuickView={handleOpenQuickView}
      />

      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        onShowToast={showToast}
      />

      {/* Toast Notification Queue */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
      </div>
    </div>
  );
}

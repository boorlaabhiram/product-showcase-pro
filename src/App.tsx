import React, { useState, useEffect, useMemo } from 'react';
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
import { CartDrawer } from './components/CartDrawer';
import { AIChatModal } from './components/AIChatModal';
import { RecentlyViewedBar } from './components/RecentlyViewedBar';
import { FAQSection } from './components/FAQSection';
import { Newsletter } from './components/Newsletter';
import { ContactModal } from './components/ContactModal';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';

import { PRODUCTS as FALLBACK_PRODUCTS } from './data/products';
import { Product, ProductCategory, CollectionTag, FilterState, ToastMessage, CartItem } from './types/product';
import { useLocalStorage } from './hooks/useLocalStorage';
import { fetchLiveProducts } from './services/productService';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';

export default function App() {
  // Live Product Catalog State
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);
  const [apiNotice, setApiNotice] = useState<string | null>(null);

  // Load products on mount from DummyJSON API with graceful fallback
  useEffect(() => {
    let isMounted = true;

    async function loadCatalog() {
      setIsLoadingProducts(true);
      const { products: fetchedProducts, error } = await fetchLiveProducts();
      if (!isMounted) return;

      if (error) {
        setApiNotice(error);
        setProducts(FALLBACK_PRODUCTS);
      } else {
        setProducts(fetchedProducts);
        setApiNotice(null);
      }
      setIsLoadingProducts(false);
    }

    loadCatalog();

    return () => {
      isMounted = false;
    };
  }, []);

  // Persistent Storage Hooks
  const [wishlistIds, setWishlistIds] = useLocalStorage<string[]>('showcasely_wishlist_ids', [
    'prod-01',
    'prod-02',
  ]);
  const [compareIds, setCompareIds] = useLocalStorage<string[]>('showcasely_compare_ids', [
    'prod-01',
    'prod-02',
  ]);
  const [recentlyViewedIds, setRecentlyViewedIds] = useLocalStorage<string[]>('showcasely_recent_ids', [
    'prod-01',
    'prod-02',
    'prod-03',
  ]);
  const [cart, setCart] = useLocalStorage<CartItem[]>('showcasely_cart', [
    {
      product: FALLBACK_PRODUCTS[0],
      quantity: 1,
      selectedStorage: '512 GB',
      selectedColor: 'Natural Titanium',
    },
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
    maxPrice: 500000,
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
      maxPrice: 500000,
      inStockOnly: false,
    });
    showToast('Filters Reset', 'Showing all products in Showcasely catalog.');
  };

  // Modal / Drawer States
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  // Quick View Inspection Action
  const handleOpenQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setRecentlyViewedIds((prev) => [product.id, ...prev.filter((id) => id !== product.id)].slice(0, 8));
  };

  // Wishlist Actions
  const handleToggleWishlist = (id: string) => {
    const isSaved = wishlistIds.includes(id);
    const product = products.find((p) => p.id === id);
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
    const product = products.find((p) => p.id === id);
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

  // Cart Actions
  const handleAddToCart = (product: Product, quantity = 1, storage?: string, ram?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [
        ...prev,
        {
          product,
          quantity,
          selectedStorage: storage || product.storageOptions?.[0],
          selectedRam: ram || product.ramOptions?.[0],
        },
      ];
    });
    setCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Removed from Cart');
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Calculate Category Item Counts
  const categoryCounts = useMemo(() => {
    const counts = {} as Record<ProductCategory, number>;
    counts['All'] = products.length;

    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });

    return counts;
  }, [products]);

  // Global Search & Filtered Products Processing
  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
      // 1. Global Search Filter (searches across ALL products in catalog)
      if (query) {
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesTagline = product.tagline.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesModel = (product.model || '').toLowerCase().includes(query);
        const matchesProcessor = (product.processor || '').toLowerCase().includes(query);
        const matchesTags = (product.highlights || []).some((h) => h.toLowerCase().includes(query));

        if (
          !matchesName &&
          !matchesCategory &&
          !matchesBrand &&
          !matchesTagline &&
          !matchesDesc &&
          !matchesModel &&
          !matchesProcessor &&
          !matchesTags
        ) {
          return false;
        }
      }

      // 2. Category Filter (Only applies when no search query is typed, OR if category matches)
      // Searching overrides strict category boundary unless user selects category explicitly while searching
      if (!query && selectedCategory !== 'All' && product.category !== selectedCategory) {
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
  }, [products, searchQuery, selectedCategory, selectedCollection, filterState]);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans antialiased selection:bg-blue-500 selection:text-white relative overflow-hidden">
      {/* Global Ambient Glow Spotlights */}
      <div className="fixed top-[-100px] left-[-100px] w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="relative z-10">
        {/* Top Discount Promo Ticker */}
        <PromoBanner
          onCopyCode={(code) =>
            showToast('Coupon Code Copied!', `Use code "${code}" in your cart for discount.`)
          }
        />

        {/* API Status Notice Banner if Offline Fallback */}
        {apiNotice && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-center text-xs text-amber-300 font-mono flex items-center justify-center gap-2">
            <WifiOff className="w-3.5 h-3.5 text-amber-400" />
            <span>{apiNotice}</span>
          </div>
        )}

        {/* Sticky Main Navigation */}
        <Navbar
          wishlistCount={wishlistIds.length}
          compareCount={compareIds.length}
          cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
          onOpenWishlist={() => setWishlistOpen(true)}
          onOpenCompare={() => setCompareOpen(true)}
          onOpenCart={() => setCartOpen(true)}
          onOpenContact={() => setContactOpen(true)}
          onOpenAIModal={() => setAiModalOpen(true)}
          onSelectProduct={handleOpenQuickView}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onShowToast={showToast}
        />

        {/* Flagship Hero Spotlight */}
        <Hero
          onQuickView={handleOpenQuickView}
          onExploreCollection={() => {
            const el = document.getElementById('catalog-grid');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenAIModal={() => setAiModalOpen(true)}
        />

        {/* Category Pills Bar */}
        <CategoryBar
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            // If user explicitly clicks category while search is populated, offer clear search or navigate
          }}
          categoryCounts={categoryCounts}
        />

        {/* Main Catalog Showcase Section */}
        <main id="catalog-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-blue-400 uppercase tracking-widest font-bold">
                    DummyJSON & Showcase 2.0 Catalog
                  </span>
                  {isLoadingProducts ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      <RefreshCw className="w-3 h-3 animate-spin" /> Fetching Live API...
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      <Wifi className="w-3 h-3 text-emerald-400" /> {products.length} Products Synchronized
                    </span>
                  )}
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
                  Explore The Hardware Catalog
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
            onAddToCart={handleAddToCart}
            layoutMode={layoutMode}
            onResetFilters={handleResetFilters}
          />
        </main>

        {/* Recently Inspected Horizontal Bar */}
        <RecentlyViewedBar
          recentlyViewedIds={recentlyViewedIds}
          allProducts={products}
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
          onAddToCart={handleAddToCart}
          onShowToast={showToast}
        />

        <WishlistDrawer
          isOpen={wishlistOpen}
          wishlistIds={wishlistIds}
          allProducts={products}
          onClose={() => setWishlistOpen(false)}
          onRemoveWishlist={handleToggleWishlist}
          onClearWishlist={() => {
            setWishlistIds([]);
            showToast('Wishlist Cleared');
          }}
          onQuickView={handleOpenQuickView}
        />

        <CompareModal
          isOpen={compareOpen}
          compareIds={compareIds}
          allProducts={products}
          onClose={() => setCompareOpen(false)}
          onRemoveFromCompare={handleToggleCompare}
          onClearCompare={() => {
            setCompareIds([]);
            showToast('Comparison Matrix Cleared');
          }}
          onQuickView={handleOpenQuickView}
        />

        <CartDrawer
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          cart={cart}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveCartItem}
          onClearCart={handleClearCart}
        />

        <AIChatModal
          isOpen={aiModalOpen}
          onClose={() => setAiModalOpen(false)}
          products={products}
          onSelectProduct={handleOpenQuickView}
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

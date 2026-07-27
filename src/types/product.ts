export type ProductCategory = 
  | 'All'
  | 'Smartphones'
  | 'Laptops'
  | 'Gaming Laptops'
  | 'Tablets'
  | 'Smart Watches'
  | 'Earbuds'
  | 'Headphones'
  | 'Bluetooth Speakers'
  | 'Televisions'
  | 'DSLR Cameras'
  | 'Action Cameras'
  | 'Monitors'
  | 'Mechanical Keyboards'
  | 'Gaming Mouse'
  | 'SSD Storage'
  | 'Hard Drives'
  | 'Power Banks'
  | 'Fast Chargers'
  | 'Smart Home'
  | 'Wi-Fi Routers'
  | 'Projectors'
  | 'Air Purifiers'
  | 'Printers'
  | 'Graphics Cards'
  | 'CPUs'
  | 'Motherboards'
  | 'RAM Modules'
  | 'Gaming Consoles'
  | 'Accessories';

export type CollectionTag = 
  | 'all'
  | 'featured'
  | 'trending'
  | 'flash-deal'
  | 'best-seller'
  | 'new-launch'
  | 'new-arrival'
  | 'premium'
  | 'editors-choice';

export type StockStatus = 'in-stock' | 'low-stock' | 'pre-order' | 'out-of-stock';

export type IndianStoreName = 'Amazon India' | 'Flipkart' | 'Croma' | 'Reliance Digital' | 'Vijay Sales' | string;

export interface StoreBuyingOption {
  storeName: IndianStoreName;
  price: number;
  originalPrice?: number;
  inStock?: boolean;
  deliveryDays?: string;
  isBestPrice?: boolean;
  linkUrl?: string;
  url?: string;
  badge?: string;
}

export interface ProductSpec {
  name: string;
  value: string;
  group?: 'General' | 'Performance' | 'Display' | 'Camera' | 'Battery' | 'Connectivity' | 'Physical';
}

export interface ColorVariant {
  name: string;
  hex: string;
  image?: string;
}

export interface ProductReview {
  id: string;
  userName: string;
  userCity?: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  helpfulCount?: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  model: string;
  slug: string;
  tagline: string;
  description: string;
  detailedOverview: string;
  category: ProductCategory;
  
  // Indian Price in ₹
  price: number;
  originalPrice: number;
  discountPercentage: number;
  
  rating: number;
  reviewCount: number;
  stockStatus: StockStatus;
  stockCount: number;
  
  // Badges & Collection Tags
  isFeatured?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
  isNewLaunch?: boolean;
  isNewArrival?: boolean;
  isPremium?: boolean;
  isFlashDeal?: boolean;
  isEditorsChoice?: boolean;
  badgeText?: string;
  
  // Images & 360 View
  primaryImage: string;
  galleryImages: string[];
  view360Images?: string[]; // Multi-angle frames for 360 viewer
  
  // Key Specs Quick Access
  processor?: string;
  ram?: string;
  storage?: string;
  display?: string;
  camera?: string;
  battery?: string;
  os?: string;
  connectivity?: string;
  weight?: string;
  dimensions?: string;
  
  // Variants
  colors: ColorVariant[];
  storageVariants?: string[];
  ramVariants?: string[];
  storageOptions?: string[];
  ramOptions?: string[];
  
  // Market & Delivery Info
  warranty: string;
  deliveryEstimate: string;
  sellerName: string;
  sellerRating?: number;
  
  // Stores Available
  buyingOptions: StoreBuyingOption[];
  
  // Lists
  specs: ProductSpec[];
  highlights: string[];
  inTheBox: string[];
  pros: string[];
  cons: string[];
  
  reviews: ProductReview[];
  releaseYear: number;
  sku: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedStorage?: string;
  selectedRam?: string;
}

export interface FilterState {
  searchQuery: string;
  selectedCategory: ProductCategory;
  selectedCollection: CollectionTag;
  sortBy: 'featured' | 'popularity' | 'rating' | 'newest' | 'price-low' | 'price-high' | 'discount';
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'warning';
}

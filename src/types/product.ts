export type ProductCategory = 
  | 'All'
  | 'Audio & Sound'
  | 'Smart Wearables'
  | 'Ergonomic Setup'
  | 'Creative Gear'
  | 'Smart Home'
  | 'Vision Tech';

export type CollectionTag = 
  | 'featured'
  | 'trending'
  | 'best-seller'
  | 'new-arrival'
  | 'premium';

export type StockStatus = 'in-stock' | 'low-stock' | 'pre-order' | 'out-of-stock';

export interface ProductSpec {
  name: string;
  value: string;
}

export interface ColorVariant {
  name: string;
  hex: string;
  image?: string;
}

export interface ProductReview {
  id: string;
  userName: string;
  avatar?: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  detailedOverview: string;
  category: ProductCategory;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  stockStatus: StockStatus;
  stockCount: number;
  isFeatured: boolean;
  isTrending: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isPremium: boolean;
  primaryImage: string;
  galleryImages: string[];
  colors: ColorVariant[];
  specs: ProductSpec[];
  highlights: string[];
  inTheBox: string[];
  reviews: ProductReview[];
  releaseYear: number;
  sku: string;
  badgeText?: string;
}

export interface FilterState {
  searchQuery: string;
  selectedCategory: ProductCategory;
  selectedCollection: 'all' | CollectionTag;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest' | 'discount';
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

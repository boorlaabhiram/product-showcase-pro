import { Product, ProductCategory } from '../types/product';
import { PRODUCTS } from '../data/products';

const DUMMYJSON_BASE_URL = 'https://dummyjson.com/products';

// USD to INR conversion multiplier
const USD_TO_INR_RATE = 86;

function isElectronicsItem(item: any): boolean {
  if (!item) return false;
  const cat = (item.category || '').toLowerCase();
  const title = (item.title || '').toLowerCase();
  const brand = (item.brand || '').toLowerCase();
  const desc = (item.description || '').toLowerCase();

  // Strict list of non-electronics categories to block completely
  const blockedCategories = [
    'beauty',
    'fragrances',
    'furniture',
    'groceries',
    'home-decoration',
    'kitchen-accessories',
    'mens-shirts',
    'mens-shoes',
    'mens-watches',
    'skincare',
    'skin-care',
    'sunglasses',
    'tops',
    'womens-bags',
    'womens-dresses',
    'womens-jewellery',
    'womens-shoes',
    'womens-watches',
    'sports-accessories',
    'motorcycle',
    'vehicle',
  ];

  if (blockedCategories.some((bc) => cat === bc || cat.includes(bc))) {
    if (
      title.includes('smartwatch') ||
      title.includes('smart watch') ||
      title.includes('fitbit') ||
      title.includes('apple watch') ||
      title.includes('galaxy watch')
    ) {
      return true;
    }
    return false;
  }

  // Non-electronics keywords in title or description
  const nonElectronicsKeywords = [
    'mascara',
    'lipstick',
    'eyeshadow',
    'perfume',
    'eau de',
    'essence',
    'powder',
    'foundation',
    'serum',
    'cream',
    'lotion',
    'cleanser',
    'shampoo',
    'conditioner',
    'soap',
    'couch',
    'sofa',
    'table',
    'chair',
    'bed',
    'cabinet',
    'shelf',
    'desk',
    'cushion',
    'shirt',
    'dress',
    'shoe',
    'boot',
    'sandal',
    'heel',
    'sneaker',
    'bag',
    'handbag',
    'necklace',
    'ring',
    'earring',
    'jewel',
    'juice',
    'pie',
    'beef',
    'chicken',
    'fruit',
    'vegetable',
    'plant',
    'flower',
    'vase',
    'curtain',
    'rug',
    'towel',
    'blanket',
    'pan',
    'pot',
    'knife',
    'fork',
    'spoon',
    'plate',
    'bowl',
    'mug',
    'cup',
  ];

  if (nonElectronicsKeywords.some((kw) => title.includes(kw))) {
    return false;
  }

  // Allowed categories in DummyJSON
  const allowedCategories = ['smartphones', 'laptops', 'tablets', 'mobile-accessories'];
  if (allowedCategories.includes(cat)) {
    return true;
  }

  // Electronics keywords check for brand/title/desc
  const techKeywords = [
    'phone',
    'smartphone',
    'iphone',
    'galaxy',
    'pixel',
    'oneplus',
    'xiaomi',
    'realme',
    'nothing',
    'laptop',
    'macbook',
    'notebook',
    'pc',
    'desktop', 'computer',
    'rog',
    'alienware',
    'legion',
    'tablet',
    'ipad',
    'tab',
    'watch',
    'smartwatch',
    'band',
    'fitbit',
    'charger',
    'cable',
    'adapter',
    'power bank',
    'powerbank',
    'usb',
    'hub',
    'dock',
    'headphone',
    'headset',
    'airpods',
    'earbud',
    'buds',
    'earphone',
    'speaker',
    'audio',
    'soundbar',
    'tv',
    'television',
    'display',
    'oled',
    'qled',
    'camera',
    'dslr',
    'gopro',
    'lens',
    'monitor',
    'keyboard',
    'keychron',
    'mouse',
    'logitech',
    'razer',
    'ssd',
    'nvme',
    'drive',
    'hdd',
    'storage',
    'gpu',
    'graphics card',
    'rtx',
    'gtx',
    'radeon',
    'cpu',
    'intel',
    'ryzen',
    'i7',
    'i9',
    'm3',
    'm4',
    'motherboard',
    'ram',
    'memory',
    'router',
    'wifi',
    'printer',
    'projector',
    'console',
    'playstation',
    'ps5',
    'xbox',
    'nintendo',
    'switch',
    'gamepad',
    'air purifier',
    'smart home',
    'plug',
    'bulb',
    'drone',
    'case',
    'cover',
  ];

  return techKeywords.some((kw) => title.includes(kw) || brand.includes(kw) || desc.includes(kw));
}

function mapDummyJsonCategory(category: string, title: string = ''): ProductCategory {
  const cat = (category || '').toLowerCase();
  const t = (title || '').toLowerCase();

  if (cat.includes('smartphone') || t.includes('phone') || t.includes('iphone') || t.includes('galaxy') || t.includes('pixel') || t.includes('oneplus')) {
    return 'Smartphones';
  }
  if (t.includes('gaming laptop') || t.includes('rog') || t.includes('alienware') || t.includes('legion') || t.includes('rtx')) {
    return 'Gaming Laptops';
  }
  if (cat.includes('laptop') || t.includes('macbook') || t.includes('notebook') || t.includes('laptop')) {
    return 'Laptops';
  }
  if (cat.includes('tablet') || t.includes('ipad') || t.includes('tab')) {
    return 'Tablets';
  }
  if (cat.includes('watch') || t.includes('watch') || t.includes('band') || t.includes('fitbit')) {
    return 'Smart Watches';
  }
  if (t.includes('headphone') || t.includes('headset') || t.includes('wh-1000xm5')) {
    return 'Headphones';
  }
  if (t.includes('earbud') || t.includes('airpods') || t.includes('buds') || t.includes('earphone')) {
    return 'Earbuds';
  }
  if (t.includes('speaker') || cat.includes('audio') || t.includes('soundbar')) {
    return 'Bluetooth Speakers';
  }
  if (t.includes('tv') || t.includes('television') || t.includes('display') || t.includes('oled') || t.includes('qled')) {
    return 'Televisions';
  }
  if (t.includes('camera') || t.includes('sony a7') || t.includes('nikon') || t.includes('canon') || t.includes('gopro')) {
    return 'DSLR Cameras';
  }
  if (t.includes('monitor') || t.includes('curved display')) {
    return 'Monitors';
  }
  if (t.includes('keyboard') || t.includes('keychron')) {
    return 'Mechanical Keyboards';
  }
  if (t.includes('mouse') || t.includes('logitech mx') || t.includes('razer')) {
    return 'Gaming Mouse';
  }
  if (t.includes('ssd') || t.includes('nvme') || t.includes('drive') || t.includes('storage')) {
    return 'SSD Storage';
  }
  if (t.includes('power bank') || t.includes('powerbank') || t.includes('anker')) {
    return 'Power Banks';
  }
  if (t.includes('charger') || t.includes('adapter') || t.includes('gan')) {
    return 'Fast Chargers';
  }
  if (cat.includes('mobile-accessories') || t.includes('case') || t.includes('cable') || t.includes('usb')) {
    return 'Accessories';
  }

  return 'Accessories';
}

function mapDummyJsonToProduct(item: any): Product {
  const rawPrice = item.price || 49;
  const priceInINR = Math.round(rawPrice * USD_TO_INR_RATE);
  const discount = Math.round(item.discountPercentage || 12);
  const originalPrice = Math.round(priceInINR / Math.max(0.5, 1 - discount / 100));

  const category = mapDummyJsonCategory(item.category || '', item.title || '');
  const images = Array.isArray(item.images) && item.images.length > 0 ? item.images : [item.thumbnail || ''];

  return {
    id: `dj-${item.id}`,
    name: item.title,
    brand: item.brand || 'Global Premium',
    model: item.sku || `MODEL-${item.id}`,
    slug: item.title ? item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `product-${item.id}`,
    tagline: item.description ? item.description.slice(0, 65) + '...' : 'Premium tech component with high reliability',
    description: item.description || 'High quality tech product with top tier global build standards.',
    detailedOverview: `${item.description || ''} Sourced with official warranty across all major authorized service centers in India. Includes genuine invoice and express shipping across 19,000+ pin codes.`,
    category: category,
    price: priceInINR,
    originalPrice: originalPrice,
    discountPercentage: discount,
    rating: Number((item.rating || 4.6).toFixed(1)),
    reviewCount: item.reviews?.length ? item.reviews.length * 24 : Math.floor(Math.random() * 180 + 30),
    stockStatus: (item.stock || 10) > 0 ? 'in-stock' : 'out-of-stock',
    stockCount: item.stock || 18,
    isFeatured: item.rating > 4.5,
    isTrending: item.stock < 15,
    isBestSeller: item.id % 3 === 0,
    isNewLaunch: item.id % 4 === 0,
    badgeText: item.rating > 4.6 ? 'Popular Tech' : 'Verified',
    primaryImage: item.thumbnail || images[0] || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80',
    galleryImages: images,
    processor: item.weight ? `${Math.round(item.weight * 100)}g Build Weight` : 'High Speed Architecture',
    ram: '16 GB',
    storage: '512 GB',
    warranty: item.warrantyInformation || '1 Year Official India Brand Warranty',
    deliveryEstimate: item.shippingInformation || 'Express Delivery within 24 Hours in India',
    sellerName: 'Reliance Digital & Official Partners',
    colors: [{ name: 'Titanium Grey', hex: '#3f3f46' }, { name: 'Matte Black', hex: '#18181b' }],
    buyingOptions: [
      { storeName: 'Amazon India', price: priceInINR, inStock: true, deliveryDays: 'Tomorrow', isBestPrice: true },
      { storeName: 'Flipkart', price: Math.round(priceInINR * 1.02), inStock: true, deliveryDays: '2 Days' },
      { storeName: 'Croma', price: Math.round(priceInINR * 1.03), inStock: true, deliveryDays: 'Same Day Store Pickup' },
    ],
    specs: [
      { name: 'Category', value: item.category || 'Electronics', group: 'General' },
      { name: 'SKU Code', value: item.sku || `SKU-DJ-${item.id}`, group: 'General' },
      { name: 'Warranty', value: item.warrantyInformation || '1 Year Official Warranty', group: 'General' },
      { name: 'Return Policy', value: item.returnPolicy || '7 Days Replacement Policy', group: 'General' },
    ],
    highlights: [
      item.warrantyInformation || 'Official Manufacturer Warranty',
      item.shippingInformation || 'Express Insured Delivery across India',
      item.returnPolicy || '7-Day Replacement Guarantee',
    ],
    inTheBox: ['1x Hardware Unit', '1x Charging Cable / Manual', '1x Official Warranty Card'],
    pros: ['High performance to price ratio', 'Genuine brand warranty', 'Verified customer satisfaction'],
    cons: ['Limited flash offer quantity available'],
    reviews: Array.isArray(item.reviews) && item.reviews.length > 0
      ? item.reviews.map((r: any, idx: number) => ({
          id: `rev-${idx}-${item.id}`,
          userName: r.reviewerName || 'Verified Buyer',
          userCity: 'Mumbai',
          rating: r.rating || 5,
          date: r.date ? new Date(r.date).toLocaleDateString('en-IN') : 'Recent',
          title: r.comment ? r.comment.slice(0, 35) : 'Excellent product!',
          comment: r.comment || 'Completely satisfied with product quality and delivery speed.',
          verified: true,
        }))
      : [
          {
            id: `rev-def-${item.id}`,
            userName: 'Rahul Sharma',
            userCity: 'Bengaluru',
            rating: 5,
            date: 'Yesterday',
            title: 'Outstanding Quality!',
            comment: 'Fast shipping and genuine brand original item.',
            verified: true,
          },
        ],
    releaseYear: 2025,
    sku: item.sku || `SKU-DJ-${item.id}`,
  };
}

export async function fetchLiveProducts(): Promise<{ products: Product[]; error: string | null }> {
  try {
    const res = await fetch(`${DUMMYJSON_BASE_URL}?limit=100`);
    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}`);
    }
    const data = await res.json();
    if (!data.products || !Array.isArray(data.products)) {
      throw new Error('Invalid products array');
    }

    // STRICTLY FILTER to electronics items only
    const electronicsOnly = data.products.filter(isElectronicsItem);
    const apiProducts = electronicsOnly.map(mapDummyJsonToProduct);

    // Merge API products with static demo products (which are 100% electronics)
    const existingIds = new Set(apiProducts.map((p: Product) => p.id));
    const merged = [...apiProducts];

    PRODUCTS.forEach((p) => {
      if (!existingIds.has(p.id)) {
        merged.push(p);
      }
    });

    return { products: merged, error: null };
  } catch (err: any) {
    console.warn('DummyJSON API Error, using static local dataset:', err);
    return {
      products: PRODUCTS,
      error: 'Unable to connect to live DummyJSON API. Using offline backup catalog.',
    };
  }
}

export async function searchLiveProducts(query: string): Promise<Product[]> {
  if (!query.trim()) return [];
  try {
    const res = await fetch(`${DUMMYJSON_BASE_URL}/search?q=${encodeURIComponent(query)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.products && Array.isArray(data.products)) {
        return data.products.filter(isElectronicsItem).map(mapDummyJsonToProduct);
      }
    }
  } catch (e) {
    console.warn('Live search API failed, falling back to local search');
  }
  return [];
}

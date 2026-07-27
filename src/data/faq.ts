export interface FAQItem {
  id: string;
  category: 'General' | 'Shipping & Delivery' | 'Warranty & Returns' | 'Product Tech';
  question: string;
  answer: string;
}

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Shipping & Delivery',
    question: 'How quickly will my order ship, and what are the delivery options?',
    answer: 'Orders placed before 2:00 PM EST ship the same business day. We offer complimentary Express Priority Shipping (2-3 business days) on all orders over $100. Overnight Concierge Air Shipping is also available at checkout.',
  },
  {
    id: 'faq-2',
    category: 'Warranty & Returns',
    question: 'What is Aura’s warranty policy and return guarantee?',
    answer: 'Every hardware product comes standard with a 2-Year International Limited Warranty covering defects in materials and craftsmanship. Additionally, we offer a 30-Day Risk-Free Money-Back Guarantee with free return shipping.',
  },
  {
    id: 'faq-3',
    category: 'Product Tech',
    question: 'Are Aura devices compatible with both Apple and Windows/Android ecosystems?',
    answer: 'Yes! All Aura products are built on open hardware standards (Bluetooth 5.4, USB-C Lossless Audio, Wi-Fi 6E, Matter, and Thread). They sync effortlessly across macOS, iOS, Windows 11, and Android.',
  },
  {
    id: 'faq-4',
    category: 'Product Tech',
    question: 'How does spatial audio and noise cancellation work in Aura Studio headphones?',
    answer: 'Aura Studio uses dual high-definition DSP processors executing real-time neural noise cancellation at 48,000 samples per second. Spatial sound tracking adjusts dynamic EQ to keep instruments positioned naturally around you.',
  },
  {
    id: 'faq-5',
    category: 'General',
    question: 'Can I request a custom product demo or corporate gift order?',
    answer: 'Yes, our Concierge Sales team provides virtual product walk-throughs and corporate volume discounts. Click the "Concierge Sales" button in the footer or top navigation to connect with an advisor.',
  },
];

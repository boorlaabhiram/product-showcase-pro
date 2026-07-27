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
    question: 'How fast is express delivery across India?',
    answer: 'Orders placed before 3:00 PM IST qualify for Same-Day or Next-Day Express Delivery in tier-1 metro cities (Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata, Pune). All other 19,000+ pin codes receive insured shipping within 2 to 4 business days.',
  },
  {
    id: 'faq-2',
    category: 'Warranty & Returns',
    question: 'Are all products 100% genuine with official brand warranty in India?',
    answer: 'Yes! Every device on Showcasely is 100% authentic, sourced directly from authorized brand distributors (Appario, SuperComNet, Official Brand Stores). Each unit includes a GST invoice and valid 1 to 2 Year Official Manufacturer Warranty redeemable at any authorized service center across India.',
  },
  {
    id: 'faq-3',
    category: 'Warranty & Returns',
    question: 'What is Showcasely’s return and replacement policy?',
    answer: 'We provide a 7-Day Hassle-Free Replacement Guarantee for manufacturing defects, transit damage, or DOA (Dead on Arrival) hardware. Our courier pickup team collects the item directly from your doorstep.',
  },
  {
    id: 'faq-4',
    category: 'Product Tech',
    question: 'How does the Hardware Comparison Matrix work?',
    answer: 'You can select up to 4 smartphones, laptops, audio devices, or components and compare their processor clock speeds, RAM technology, battery capacities, display refresh rates, and price across major stores like Amazon, Flipkart, Croma, and Reliance Digital.',
  },
  {
    id: 'faq-5',
    category: 'General',
    question: 'Do you provide GST business invoices for tax credit?',
    answer: 'Yes! You can enter your company GSTIN and business name during checkout to claim input tax credit (ITC) on all electronics and IT hardware purchases.',
  },
];

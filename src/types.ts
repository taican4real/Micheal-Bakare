export const WORK_CATEGORIES = [
  'Compositions',
  'Productions',
  'Arrangements',
  'Music Direction',
  'Piano Works',
  'Scores',
  'Manuscripts',
  'Publications',
  'Recordings',
  'Performances',
  'Collaborations',
  'Scholarly Works'
];

export interface WorkLink {
  title: string;
  url: string;
}

export interface PortfolioWork {
  id?: string;
  title: string;
  description: string;
  year: string;
  category: string;
  role: string;
  collaborators: string;
  coverImageUrl: string;
  gallery: string[];
  videoUrl: string;
  audioMetadata: string;
  audioStreamUrl?: string;
  externalLinks: WorkLink[];
  relatedWorks: string[];
  seoTitle: string;
  seoDescription: string;
  status: 'published' | 'draft';
  createdAt?: any;
  updatedAt?: any;
}

export const QUOTE_STATUSES = [
  'NEW',
  'REVIEWING',
  'CONTACTED',
  'QUOTED',
  'ACCEPTED',
  'DECLINED',
  'COMPLETED',
  'CANCELLED'
] as const;

export type QuoteStatus = typeof QUOTE_STATUSES[number];

export const BUDGET_RANGES = [
  'Under $5,000',
  '$5,000 - $15,000',
  '$15,000 - $50,000',
  '$50,000 - $100,000',
  '$100,000+'
];

export interface Service {
  id?: string;
  title: string;
  description: string;
  category: string;
  coverImageUrl: string;
  deliverables: string[];
  requirements: string[];
  faqs: { question: string; answer: string }[];
  seoTitle: string;
  seoDescription: string;
  status: 'active' | 'inactive';
  createdAt?: any;
  updatedAt?: any;
}

export interface QuoteRequest {
  id?: string;
  name: string;
  email: string;
  phone: string;
  organisation: string;
  service: string;
  projectDescription: string;
  preferredDate: string;
  budgetRange: string;
  location: string;
  fileUploadUrl?: string;
  additionalRequirements: string;
  status: QuoteStatus;
  createdAt?: any;
  updatedAt?: any;
}

export const PRODUCT_CATEGORIES = [
  'eBooks/PDFs',
  'Sheet Music',
  'Audio Recordings',
  'Manuscripts',
  'Scores',
  'Music Compositions',
  'Other Digital Products'
];

export interface Product {
  id?: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  coverImageUrl: string;
  features: string[];
  previewUrl?: string;
  selarPaymentUrl?: string;
  storagePath?: string;
  metadata?: Record<string, string>;
  status: 'active' | 'draft';
  createdAt?: any;
  updatedAt?: any;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'PENDING' | 'PAID' | 'COMPLETED' | 'CANCELLED';

export interface Order {
  id?: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  totalAmount: number;
  currency: string;
  status: OrderStatus;
  accessKey?: string;
  createdAt?: any;
  updatedAt?: any;
}


// Product and category types for Soko Tanzania

export interface Category {
  id: string;
  name: string;
  nameSwahili: string;
  slug: string;
  icon: string;
  description: string;
  subcategories: Subcategory[];
  productCount: number;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: 'TZS' | 'USD';
  images: string[];
  categoryId: string;
  subcategoryId?: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar?: string;
  sellerVerified: boolean;
  location: string;
  region: string;
  condition: 'new' | 'used' | 'refurbished';
  negotiable: boolean;
  featured: boolean;
  promoted: boolean;
  views: number;
  favorites: number;
  status: 'active' | 'sold' | 'pending' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  categoryId?: string;
  subcategoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  location?: string;
  sortBy?: 'newest' | 'oldest' | 'price-low' | 'price-high' | 'popular';
  search?: string;
}

// Categories data
export const categories: Category[] = [
  {
    id: 'vehicles',
    name: 'Vehicles',
    nameSwahili: 'Magari',
    slug: 'vehicles',
    icon: 'Car',
    description: 'Cars, motorcycles, trucks and more',
    productCount: 1250,
    subcategories: [
      { id: 'cars', name: 'Cars', slug: 'cars' },
      { id: 'motorcycles', name: 'Motorcycles', slug: 'motorcycles' },
      { id: 'trucks', name: 'Trucks & Buses', slug: 'trucks' },
      { id: 'parts', name: 'Vehicle Parts', slug: 'parts' },
    ],
  },
  {
    id: 'electronics',
    name: 'Electronics',
    nameSwahili: 'Vifaa vya Umeme',
    slug: 'electronics',
    icon: 'Smartphone',
    description: 'Phones, computers, TVs and gadgets',
    productCount: 3420,
    subcategories: [
      { id: 'phones', name: 'Mobile Phones', slug: 'phones' },
      { id: 'computers', name: 'Computers & Laptops', slug: 'computers' },
      { id: 'tvs', name: 'TVs & Audio', slug: 'tvs' },
      { id: 'accessories', name: 'Accessories', slug: 'accessories' },
    ],
  },
  {
    id: 'property',
    name: 'Property',
    nameSwahili: 'Mali Isiyohamishika',
    slug: 'property',
    icon: 'Home',
    description: 'Houses, land, apartments for sale or rent',
    productCount: 890,
    subcategories: [
      { id: 'houses', name: 'Houses', slug: 'houses' },
      { id: 'apartments', name: 'Apartments', slug: 'apartments' },
      { id: 'land', name: 'Land & Plots', slug: 'land' },
      { id: 'commercial', name: 'Commercial', slug: 'commercial' },
    ],
  },
  {
    id: 'fashion',
    name: 'Fashion',
    nameSwahili: 'Mitindo',
    slug: 'fashion',
    icon: 'Shirt',
    description: 'Clothing, shoes, bags and accessories',
    productCount: 5670,
    subcategories: [
      { id: 'mens', name: "Men's Clothing", slug: 'mens' },
      { id: 'womens', name: "Women's Clothing", slug: 'womens' },
      { id: 'shoes', name: 'Shoes', slug: 'shoes' },
      { id: 'bags', name: 'Bags & Accessories', slug: 'bags' },
    ],
  },
  {
    id: 'home',
    name: 'Home & Garden',
    nameSwahili: 'Nyumba & Bustani',
    slug: 'home',
    icon: 'Sofa',
    description: 'Furniture, appliances and home decor',
    productCount: 2340,
    subcategories: [
      { id: 'furniture', name: 'Furniture', slug: 'furniture' },
      { id: 'appliances', name: 'Appliances', slug: 'appliances' },
      { id: 'garden', name: 'Garden', slug: 'garden' },
      { id: 'kitchen', name: 'Kitchen', slug: 'kitchen' },
    ],
  },
  {
    id: 'jobs',
    name: 'Jobs',
    nameSwahili: 'Kazi',
    slug: 'jobs',
    icon: 'Briefcase',
    description: 'Job listings and employment opportunities',
    productCount: 780,
    subcategories: [
      { id: 'fulltime', name: 'Full Time', slug: 'fulltime' },
      { id: 'parttime', name: 'Part Time', slug: 'parttime' },
      { id: 'freelance', name: 'Freelance', slug: 'freelance' },
      { id: 'internships', name: 'Internships', slug: 'internships' },
    ],
  },
  {
    id: 'services',
    name: 'Services',
    nameSwahili: 'Huduma',
    slug: 'services',
    icon: 'Wrench',
    description: 'Professional and personal services',
    productCount: 1560,
    subcategories: [
      { id: 'repair', name: 'Repair & Maintenance', slug: 'repair' },
      { id: 'cleaning', name: 'Cleaning', slug: 'cleaning' },
      { id: 'education', name: 'Education & Training', slug: 'education' },
      { id: 'events', name: 'Events & Entertainment', slug: 'events' },
    ],
  },
  {
    id: 'agriculture',
    name: 'Agriculture',
    nameSwahili: 'Kilimo',
    slug: 'agriculture',
    icon: 'Wheat',
    description: 'Farm products, equipment and livestock',
    productCount: 920,
    subcategories: [
      { id: 'produce', name: 'Farm Produce', slug: 'produce' },
      { id: 'livestock', name: 'Livestock', slug: 'livestock' },
      { id: 'equipment', name: 'Farm Equipment', slug: 'equipment' },
      { id: 'seeds', name: 'Seeds & Fertilizers', slug: 'seeds' },
    ],
  },
];

// Tanzanian regions
export const regions = [
  'Dar es Salaam',
  'Arusha',
  'Mwanza',
  'Dodoma',
  'Mbeya',
  'Morogoro',
  'Tanga',
  'Kilimanjaro',
  'Zanzibar',
  'Iringa',
  'Kagera',
  'Kigoma',
  'Lindi',
  'Mara',
  'Mtwara',
  'Pwani',
  'Rukwa',
  'Ruvuma',
  'Shinyanga',
  'Singida',
  'Tabora',
  'Geita',
  'Katavi',
  'Njombe',
  'Simiyu',
  'Songwe',
];

// Mock products for display
export const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Toyota Corolla 2019 - Very Clean',
    description: 'Well maintained Toyota Corolla, single owner, full service history. AC working perfectly, new tires.',
    price: 45000000,
    currency: 'TZS',
    images: ['/placeholder-car.jpg'],
    categoryId: 'vehicles',
    subcategoryId: 'cars',
    sellerId: 'seller1',
    sellerName: 'John Mwamba',
    sellerVerified: true,
    location: 'Kinondoni',
    region: 'Dar es Salaam',
    condition: 'used',
    negotiable: true,
    featured: true,
    promoted: true,
    views: 234,
    favorites: 45,
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'iPhone 14 Pro Max 256GB',
    description: 'Brand new iPhone 14 Pro Max, sealed in box. International warranty included.',
    price: 3200000,
    currency: 'TZS',
    images: ['/placeholder-phone.jpg'],
    categoryId: 'electronics',
    subcategoryId: 'phones',
    sellerId: 'seller2',
    sellerName: 'TechHub Tanzania',
    sellerVerified: true,
    location: 'Masaki',
    region: 'Dar es Salaam',
    condition: 'new',
    negotiable: false,
    featured: true,
    promoted: false,
    views: 567,
    favorites: 89,
    status: 'active',
    createdAt: '2024-01-14T08:30:00Z',
    updatedAt: '2024-01-14T08:30:00Z',
  },
  {
    id: '3',
    title: '3 Bedroom House for Sale - Mbezi Beach',
    description: 'Beautiful 3 bedroom house with modern finishes. Large compound, swimming pool, generator backup.',
    price: 450000000,
    currency: 'TZS',
    images: ['/placeholder-house.jpg'],
    categoryId: 'property',
    subcategoryId: 'houses',
    sellerId: 'seller3',
    sellerName: 'Prime Properties TZ',
    sellerVerified: true,
    location: 'Mbezi Beach',
    region: 'Dar es Salaam',
    condition: 'new',
    negotiable: true,
    featured: false,
    promoted: true,
    views: 123,
    favorites: 34,
    status: 'active',
    createdAt: '2024-01-13T14:00:00Z',
    updatedAt: '2024-01-13T14:00:00Z',
  },
  {
    id: '4',
    title: 'Kitenge Dress - African Print Fashion',
    description: 'Beautiful handmade kitenge dress, available in multiple sizes. High quality African print fabric.',
    price: 85000,
    currency: 'TZS',
    images: ['/placeholder-fashion.jpg'],
    categoryId: 'fashion',
    subcategoryId: 'womens',
    sellerId: 'seller4',
    sellerName: 'Mama Africa Fashions',
    sellerVerified: false,
    location: 'Kariakoo',
    region: 'Dar es Salaam',
    condition: 'new',
    negotiable: true,
    featured: false,
    promoted: false,
    views: 89,
    favorites: 23,
    status: 'active',
    createdAt: '2024-01-12T09:00:00Z',
    updatedAt: '2024-01-12T09:00:00Z',
  },
  {
    id: '5',
    title: 'Samsung 55" Smart TV 4K',
    description: 'Brand new Samsung Smart TV, 4K UHD resolution, built-in Netflix and YouTube apps.',
    price: 1800000,
    currency: 'TZS',
    images: ['/placeholder-tv.jpg'],
    categoryId: 'electronics',
    subcategoryId: 'tvs',
    sellerId: 'seller2',
    sellerName: 'TechHub Tanzania',
    sellerVerified: true,
    location: 'Masaki',
    region: 'Dar es Salaam',
    condition: 'new',
    negotiable: true,
    featured: true,
    promoted: false,
    views: 345,
    favorites: 67,
    status: 'active',
    createdAt: '2024-01-11T11:30:00Z',
    updatedAt: '2024-01-11T11:30:00Z',
  },
  {
    id: '6',
    title: 'Honda CBR 600RR Motorcycle',
    description: 'Sport bike in excellent condition, low mileage, recently serviced.',
    price: 18000000,
    currency: 'TZS',
    images: ['/placeholder-bike.jpg'],
    categoryId: 'vehicles',
    subcategoryId: 'motorcycles',
    sellerId: 'seller5',
    sellerName: 'Speed Motors',
    sellerVerified: true,
    location: 'Mikocheni',
    region: 'Dar es Salaam',
    condition: 'used',
    negotiable: true,
    featured: false,
    promoted: true,
    views: 178,
    favorites: 45,
    status: 'active',
    createdAt: '2024-01-10T16:00:00Z',
    updatedAt: '2024-01-10T16:00:00Z',
  },
  {
    id: '7',
    title: 'Modern Office Desk with Chair',
    description: 'Executive office desk with ergonomic chair. Perfect for home office or business.',
    price: 450000,
    currency: 'TZS',
    images: ['/placeholder-furniture.jpg'],
    categoryId: 'home',
    subcategoryId: 'furniture',
    sellerId: 'seller6',
    sellerName: 'Furniture Palace',
    sellerVerified: true,
    location: 'Posta',
    region: 'Dar es Salaam',
    condition: 'new',
    negotiable: true,
    featured: false,
    promoted: false,
    views: 67,
    favorites: 12,
    status: 'active',
    createdAt: '2024-01-09T13:00:00Z',
    updatedAt: '2024-01-09T13:00:00Z',
  },
  {
    id: '8',
    title: 'Fresh Organic Vegetables - Weekly Supply',
    description: 'Farm fresh organic vegetables delivered weekly. Tomatoes, spinach, carrots and more.',
    price: 25000,
    currency: 'TZS',
    images: ['/placeholder-farm.jpg'],
    categoryId: 'agriculture',
    subcategoryId: 'produce',
    sellerId: 'seller7',
    sellerName: 'Green Valley Farm',
    sellerVerified: false,
    location: 'Morogoro Road',
    region: 'Dar es Salaam',
    condition: 'new',
    negotiable: false,
    featured: false,
    promoted: false,
    views: 234,
    favorites: 56,
    status: 'active',
    createdAt: '2024-01-08T07:00:00Z',
    updatedAt: '2024-01-08T07:00:00Z',
  },
];

// Helper function to format Tanzanian Shillings
export function formatTZS(amount: number): string {
  return new Intl.NumberFormat('sw-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Helper function to format relative time
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return date.toLocaleDateString('en-TZ');
}

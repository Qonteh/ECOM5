// PostgreSQL Database Connection for Soko Tanzania
// Database: ecom_web (PostgreSQL via pgAdmin)

import { Pool, PoolClient, QueryResult } from 'pg';

// Database connection configuration
const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'ecom_web',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  
  // Connection pool settings
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return error if connection takes more than 2 seconds
};

// Create connection pool
let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool(poolConfig);
    
    // Error handling for the pool
    pool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client', err);
    });
    
    pool.on('connect', () => {
      console.log('New client connected to PostgreSQL');
    });
  }
  return pool;
}

// Query helper function
export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  const pool = getPool();
  const start = Date.now();
  
  try {
    const result = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Executed query', { text: text.substring(0, 100), duration, rows: result.rowCount });
    }
    
    return result;
  } catch (error) {
    console.error('Database query error:', { text: text.substring(0, 100), error });
    throw error;
  }
}

// Get a client from the pool for transactions
export async function getClient(): Promise<PoolClient> {
  const pool = getPool();
  return await pool.connect();
}

// Transaction helper
export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await getClient();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Test database connection
export async function testConnection(): Promise<boolean> {
  try {
    const result = await query('SELECT NOW() as current_time');
    console.log('Database connection successful:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Close all connections (for graceful shutdown)
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('Database pool closed');
  }
}

// =====================================================
// TYPE DEFINITIONS FOR DATABASE ENTITIES
// =====================================================

// User types
export type UserRole = 'buyer' | 'seller' | 'developer' | 'admin';
export type SubscriptionTier = 'free' | 'basic' | 'premium' | 'business';

export interface DBUser {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  phone: string;
  role: UserRole;
  avatar_url?: string;
  region: string;
  district?: string;
  ward?: string;
  street_address?: string;
  email_verified: boolean;
  phone_verified: boolean;
  id_verified: boolean;
  id_type?: string;
  id_number?: string;
  business_name?: string;
  business_type?: string;
  tin_number?: string;
  business_license?: string;
  subscription_tier: SubscriptionTier;
  subscription_starts_at?: Date;
  subscription_expires_at?: Date;
  created_at: Date;
  updated_at: Date;
  last_login_at?: Date;
  is_active: boolean;
  is_banned: boolean;
  ban_reason?: string;
}

// Product types
export type ProductCondition = 'new' | 'used' | 'refurbished';
export type ProductStatus = 'draft' | 'pending' | 'active' | 'sold' | 'expired' | 'rejected';
export type ListingType = 'sale' | 'rent' | 'service' | 'job' | 'wanted';

export interface DBProduct {
  id: string;
  seller_id: string;
  category_id: string;
  subcategory_id?: string;
  title: string;
  description: string;
  listing_type: ListingType;
  price: number;
  currency: string;
  price_negotiable: boolean;
  original_price?: number;
  condition: ProductCondition;
  region: string;
  district?: string;
  ward?: string;
  location_address?: string;
  latitude?: number;
  longitude?: number;
  status: ProductStatus;
  rejection_reason?: string;
  is_featured: boolean;
  featured_until?: Date;
  is_promoted: boolean;
  promoted_until?: Date;
  is_urgent: boolean;
  views_count: number;
  favorites_count: number;
  inquiries_count: number;
  created_at: Date;
  updated_at: Date;
  expires_at?: Date;
  sold_at?: Date;
}

// Category types
export interface DBCategory {
  id: string;
  name: string;
  name_swahili?: string;
  slug: string;
  icon?: string;
  description?: string;
  description_swahili?: string;
  image_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: Date;
}

export interface DBSubcategory {
  id: string;
  category_id: string;
  name: string;
  name_swahili?: string;
  slug: string;
  description?: string;
  display_order: number;
  is_active: boolean;
  created_at: Date;
}

// Order types
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'mpesa' | 'tigopesa' | 'airtelmoney' | 'halopesa' | 'bank_transfer' | 'cash_on_delivery' | 'card';

export interface DBOrder {
  id: string;
  order_number: string;
  buyer_id: string;
  seller_id: string;
  subtotal: number;
  delivery_fee: number;
  platform_fee: number;
  total_amount: number;
  currency: string;
  status: OrderStatus;
  delivery_region: string;
  delivery_district?: string;
  delivery_ward?: string;
  delivery_address: string;
  delivery_phone: string;
  delivery_notes?: string;
  created_at: Date;
  confirmed_at?: Date;
  shipped_at?: Date;
  delivered_at?: Date;
  cancelled_at?: Date;
  cancellation_reason?: string;
}

// Theme types
export interface DBTheme {
  id: string;
  theme_key: string;
  name: string;
  description?: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  styles: Record<string, string>;
  is_active: boolean;
  is_default: boolean;
  created_at: Date;
}

// Platform settings
export interface DBSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  setting_type: 'string' | 'number' | 'boolean' | 'json';
  description?: string;
  updated_at: Date;
}

// Revenue types
export type RevenueType = 'subscription' | 'featured_listing' | 'promoted_ad' | 'transaction_fee' | 'other';

export interface DBRevenue {
  id: string;
  revenue_type: RevenueType;
  amount: number;
  currency: string;
  user_id?: string;
  product_id?: string;
  order_id?: string;
  subscription_id?: string;
  featured_id?: string;
  promoted_id?: string;
  description?: string;
  created_at: Date;
}

// Daily stats
export interface DBDailyStats {
  id: string;
  stat_date: Date;
  new_users: number;
  new_sellers: number;
  active_users: number;
  new_listings: number;
  sold_items: number;
  total_active_listings: number;
  subscription_revenue: number;
  featured_revenue: number;
  promoted_revenue: number;
  transaction_fees: number;
  total_revenue: number;
  new_orders: number;
  completed_orders: number;
  total_order_value: number;
  total_views: number;
  total_messages: number;
  created_at: Date;
}

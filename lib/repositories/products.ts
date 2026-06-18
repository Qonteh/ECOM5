// Product Repository - Database operations for products/listings
import { 
  query, 
  transaction, 
  DBProduct, 
  DBCategory, 
  DBSubcategory,
  ProductCondition, 
  ProductStatus, 
  ListingType 
} from '@/lib/db';

export interface CreateProductInput {
  seller_id: string;
  category_id: string;
  subcategory_id?: string;
  title: string;
  description: string;
  listing_type?: ListingType;
  price: number;
  currency?: string;
  price_negotiable?: boolean;
  original_price?: number;
  condition: ProductCondition;
  region: string;
  district?: string;
  ward?: string;
  location_address?: string;
  latitude?: number;
  longitude?: number;
  images?: string[];
  attributes?: { name: string; value: string }[];
}

export interface UpdateProductInput {
  title?: string;
  description?: string;
  price?: number;
  price_negotiable?: boolean;
  condition?: ProductCondition;
  region?: string;
  district?: string;
  ward?: string;
  location_address?: string;
  status?: ProductStatus;
}

export interface ProductFilters {
  category_id?: string;
  subcategory_id?: string;
  seller_id?: string;
  region?: string;
  min_price?: number;
  max_price?: number;
  condition?: ProductCondition;
  status?: ProductStatus;
  is_featured?: boolean;
  is_promoted?: boolean;
  search?: string;
  sort_by?: 'newest' | 'oldest' | 'price_low' | 'price_high' | 'popular' | 'views';
}

export interface ProductWithDetails extends DBProduct {
  category_name?: string;
  category_slug?: string;
  subcategory_name?: string;
  seller_name?: string;
  seller_business_name?: string;
  seller_phone?: string;
  seller_verified?: boolean;
  primary_image?: string;
  images?: string[];
  attributes?: { name: string; value: string }[];
}

export const ProductRepository = {
  // Create new product
  async create(input: CreateProductInput): Promise<ProductWithDetails> {
    return await transaction(async (client) => {
      // Insert product
      const productResult = await client.query<DBProduct>(
        `INSERT INTO products (
          seller_id, category_id, subcategory_id, title, description,
          listing_type, price, currency, price_negotiable, original_price,
          condition, region, district, ward, location_address,
          latitude, longitude, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, 'active')
        RETURNING *`,
        [
          input.seller_id,
          input.category_id,
          input.subcategory_id || null,
          input.title,
          input.description,
          input.listing_type || 'sale',
          input.price,
          input.currency || 'TZS',
          input.price_negotiable ?? true,
          input.original_price || null,
          input.condition,
          input.region,
          input.district || null,
          input.ward || null,
          input.location_address || null,
          input.latitude || null,
          input.longitude || null,
        ]
      );
      
      const product = productResult.rows[0];
      
      // Insert images
      if (input.images && input.images.length > 0) {
        for (let i = 0; i < input.images.length; i++) {
          await client.query(
            `INSERT INTO product_images (product_id, image_url, is_primary, display_order)
             VALUES ($1, $2, $3, $4)`,
            [product.id, input.images[i], i === 0, i]
          );
        }
      }
      
      // Insert attributes
      if (input.attributes && input.attributes.length > 0) {
        for (const attr of input.attributes) {
          await client.query(
            `INSERT INTO product_attributes (product_id, attribute_name, attribute_value)
             VALUES ($1, $2, $3)`,
            [product.id, attr.name, attr.value]
          );
        }
      }
      
      return product as ProductWithDetails;
    });
  },

  // Find product by ID with details
  async findById(id: string): Promise<ProductWithDetails | null> {
    const result = await query<ProductWithDetails>(
      `SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        sc.name as subcategory_name,
        u.name as seller_name,
        u.business_name as seller_business_name,
        u.phone as seller_phone,
        u.id_verified as seller_verified
       FROM products p
       JOIN categories c ON p.category_id = c.id
       LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
       JOIN users u ON p.seller_id = u.id
       WHERE p.id = $1`,
      [id]
    );
    
    if (!result.rows[0]) return null;
    
    const product = result.rows[0];
    
    // Get images
    const imagesResult = await query<{ image_url: string }>(
      'SELECT image_url FROM product_images WHERE product_id = $1 ORDER BY display_order',
      [id]
    );
    product.images = imagesResult.rows.map(r => r.image_url);
    
    // Get attributes
    const attrsResult = await query<{ attribute_name: string; attribute_value: string }>(
      'SELECT attribute_name, attribute_value FROM product_attributes WHERE product_id = $1',
      [id]
    );
    product.attributes = attrsResult.rows.map(r => ({ name: r.attribute_name, value: r.attribute_value }));
    
    return product;
  },

  // Find all products with filters and pagination
  async findAll(filters: ProductFilters = {}, page = 1, limit = 20): Promise<{
    products: ProductWithDetails[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    const conditions: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;
    
    // Build WHERE clause
    if (filters.category_id) {
      conditions.push(`p.category_id = $${paramIndex++}`);
      params.push(filters.category_id);
    }
    if (filters.subcategory_id) {
      conditions.push(`p.subcategory_id = $${paramIndex++}`);
      params.push(filters.subcategory_id);
    }
    if (filters.seller_id) {
      conditions.push(`p.seller_id = $${paramIndex++}`);
      params.push(filters.seller_id);
    }
    if (filters.region) {
      conditions.push(`p.region = $${paramIndex++}`);
      params.push(filters.region);
    }
    if (filters.min_price !== undefined) {
      conditions.push(`p.price >= $${paramIndex++}`);
      params.push(filters.min_price);
    }
    if (filters.max_price !== undefined) {
      conditions.push(`p.price <= $${paramIndex++}`);
      params.push(filters.max_price);
    }
    if (filters.condition) {
      conditions.push(`p.condition = $${paramIndex++}`);
      params.push(filters.condition);
    }
    if (filters.status && filters.status !== 'all' as any) {
      conditions.push(`p.status = $${paramIndex++}`);
      params.push(filters.status);
    } else if (!filters.status && !filters.seller_id) { // Only enforce 'active' by default if we are not fetching a specific seller's list broadly
      conditions.push(`p.status = 'active'`);
    }
    if (filters.is_featured !== undefined) {
      conditions.push(`p.is_featured = $${paramIndex++}`);
      params.push(filters.is_featured);
    }
    if (filters.is_promoted !== undefined) {
      conditions.push(`p.is_promoted = $${paramIndex++}`);
      params.push(filters.is_promoted);
    }
    if (filters.search) {
      conditions.push(`(p.title ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`);
      params.push(`%${filters.search}%`);
      paramIndex++;
    }
    
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    // Sort order
    let orderBy = 'p.created_at DESC';
    switch (filters.sort_by) {
      case 'oldest': orderBy = 'p.created_at ASC'; break;
      case 'price_low': orderBy = 'p.price ASC'; break;
      case 'price_high': orderBy = 'p.price DESC'; break;
      case 'popular': orderBy = 'p.favorites_count DESC'; break;
      case 'views': orderBy = 'p.views_count DESC'; break;
    }
    
    // Get total count
    const countResult = await query<{ count: string }>(
      `SELECT COUNT(*) FROM products p ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);
    
    // Get products
    const result = await query<ProductWithDetails>(
      `SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        sc.name as subcategory_name,
        u.name as seller_name,
        u.business_name as seller_business_name,
        u.id_verified as seller_verified,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as primary_image
       FROM products p
       JOIN categories c ON p.category_id = c.id
       LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
       JOIN users u ON p.seller_id = u.id
       ${whereClause}
       ORDER BY p.is_promoted DESC, p.is_featured DESC, ${orderBy}
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );
    
    return {
      products: result.rows,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  // Update product
  async update(id: string, input: UpdateProductInput): Promise<ProductWithDetails | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;
    
    Object.entries(input).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    });
    
    if (fields.length === 0) return this.findById(id);
    
    values.push(id);
    await query(
      `UPDATE products SET ${fields.join(', ')}, updated_at = NOW() 
       WHERE id = $${paramIndex}`,
      values
    );
    
    return this.findById(id);
  },

  // Record view
  async recordView(productId: string, userId?: string, ipAddress?: string): Promise<void> {
    await query(
      `INSERT INTO product_views (product_id, user_id, ip_address) VALUES ($1, $2, $3)`,
      [productId, userId, ipAddress]
    );
  },

  // Feature product
  async featureProduct(productId: string, durationDays: number): Promise<boolean> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + durationDays);
    
    const result = await query(
      `UPDATE products SET is_featured = true, featured_until = $1 WHERE id = $2`,
      [expiresAt, productId]
    );
    return (result.rowCount ?? 0) > 0;
  },

  // Promote product
  async promoteProduct(productId: string, durationDays: number): Promise<boolean> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + durationDays);
    
    const result = await query(
      `UPDATE products SET is_promoted = true, promoted_until = $1 WHERE id = $2`,
      [expiresAt, productId]
    );
    return (result.rowCount ?? 0) > 0;
  },

  // Mark as sold
  async markAsSold(productId: string): Promise<boolean> {
    const result = await query(
      `UPDATE products SET status = 'sold', sold_at = NOW() WHERE id = $1`,
      [productId]
    );
    return (result.rowCount ?? 0) > 0;
  },

  // Delete product
  async delete(productId: string): Promise<boolean> {
    const result = await query('DELETE FROM products WHERE id = $1', [productId]);
    return (result.rowCount ?? 0) > 0;
  },

  // Get categories with subcategories
  async getCategories(): Promise<(DBCategory & { subcategories: DBSubcategory[], productCount: number })[]> {
    const categoriesResult = await query<DBCategory & { product_count: string }>(
      `SELECT c.*, COUNT(p.id) as product_count 
       FROM categories c 
       LEFT JOIN products p ON p.category_id = c.id AND p.status = 'active'
       WHERE c.is_active = true 
       GROUP BY c.id
       ORDER BY c.display_order`
    );
    
    const subcategoriesResult = await query<DBSubcategory>(
      'SELECT * FROM subcategories WHERE is_active = true ORDER BY display_order'
    );
    
    return categoriesResult.rows.map(cat => ({
      ...cat,
      productCount: parseInt(cat.product_count || '0'),
      subcategories: subcategoriesResult.rows.filter(sub => sub.category_id === cat.id),
    }));
  },

  // Get featured products
  async getFeatured(limit = 10): Promise<ProductWithDetails[]> {
    const result = await this.findAll({ is_featured: true, status: 'active' }, 1, limit);
    return result.products;
  },

  // Get promoted products
  async getPromoted(limit = 10): Promise<ProductWithDetails[]> {
    const result = await this.findAll({ is_promoted: true, status: 'active' }, 1, limit);
    return result.products;
  },
};

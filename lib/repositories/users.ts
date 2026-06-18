// User Repository - Database operations for users
import { query, transaction, DBUser, UserRole, SubscriptionTier } from '@/lib/db';
import bcrypt from 'bcryptjs';

export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
  phone: string;
  role?: UserRole;
  region: string;
  district?: string;
  ward?: string;
  street_address?: string;
  business_name?: string;
  business_type?: string;
  tin_number?: string;
  business_license?: string;
}

export interface UpdateUserInput {
  name?: string;
  phone?: string;
  avatar_url?: string;
  region?: string;
  district?: string;
  ward?: string;
  street_address?: string;
  business_name?: string;
  business_type?: string;
  tin_number?: string;
  business_license?: string;
}

// Omit password_hash from user responses
export type SafeUser = Omit<DBUser, 'password_hash'>;

export const UserRepository = {
  // Create new user
  async create(input: CreateUserInput): Promise<SafeUser> {
    const passwordHash = await bcrypt.hash(input.password, 12);
    
    const result = await query<DBUser>(
      `INSERT INTO users (
        email, password_hash, name, phone, role, region, 
        district, ward, street_address, business_name,
        business_type, tin_number, business_license
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        input.email.toLowerCase(),
        passwordHash,
        input.name,
        input.phone,
        input.role || 'buyer',
        input.region,
        input.district,
        input.ward,
        input.street_address,
        input.business_name,
        input.business_type,
        input.tin_number,
        input.business_license,
      ]
    );
    
    const user = result.rows[0];
    const { password_hash: _, ...safeUser } = user;
    return safeUser as SafeUser;
  },

  // Find user by email
  async findByEmail(email: string): Promise<DBUser | null> {
    const result = await query<DBUser>(
      'SELECT * FROM users WHERE email = $1 AND is_active = true',
      [email.toLowerCase()]
    );
    return result.rows[0] || null;
  },

  // Find user by ID
  async findById(id: string): Promise<SafeUser | null> {
    const result = await query<DBUser>(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    if (!result.rows[0]) return null;
    const { password_hash: _, ...safeUser } = result.rows[0];
    return safeUser as SafeUser;
  },

  // Verify password
  async verifyPassword(email: string, password: string): Promise<SafeUser | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) return null;
    
    // Update last login
    await query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]);
    
    const { password_hash: _, ...safeUser } = user;
    return safeUser as SafeUser;
  },

  // Update user
  async update(id: string, input: UpdateUserInput): Promise<SafeUser | null> {
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
    const result = await query<DBUser>(
      `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() 
       WHERE id = $${paramIndex} RETURNING *`,
      values
    );
    
    if (!result.rows[0]) return null;
    const { password_hash: _, ...safeUser } = result.rows[0];
    return safeUser as SafeUser;
  },

  // Update subscription
  async updateSubscription(
    userId: string, 
    tier: SubscriptionTier, 
    expiresAt: Date
  ): Promise<SafeUser | null> {
    const result = await query<DBUser>(
      `UPDATE users SET 
        subscription_tier = $1,
        subscription_starts_at = NOW(),
        subscription_expires_at = $2,
        updated_at = NOW()
       WHERE id = $3 RETURNING *`,
      [tier, expiresAt, userId]
    );
    
    if (!result.rows[0]) return null;
    const { password_hash: _, ...safeUser } = result.rows[0];
    return safeUser as SafeUser;
  },

  // Get all users with pagination
  async findAll(options: {
    page?: number;
    limit?: number;
    role?: UserRole;
    region?: string;
    search?: string;
  } = {}): Promise<{ users: SafeUser[]; total: number }> {
    const { page = 1, limit = 20, role, region, search } = options;
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE is_active = true';
    const params: unknown[] = [];
    let paramIndex = 1;
    
    if (role) {
      whereClause += ` AND role = $${paramIndex}`;
      params.push(role);
      paramIndex++;
    }
    
    if (region) {
      whereClause += ` AND region = $${paramIndex}`;
      params.push(region);
      paramIndex++;
    }
    
    if (search) {
      whereClause += ` AND (name ILIKE $${paramIndex} OR email ILIKE $${paramIndex} OR business_name ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }
    
    // Get total count
    const countResult = await query<{ count: string }>(
      `SELECT COUNT(*) FROM users ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);
    
    // Get users
    const result = await query<DBUser>(
      `SELECT * FROM users ${whereClause} 
       ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );
    
    const users = result.rows.map(user => {
      const { password_hash: _, ...safeUser } = user;
      return safeUser as SafeUser;
    });
    
    return { users, total };
  },

  // Get seller stats
  async getSellerStats(sellerId: string) {
    const result = await query<{
      total_listings: string;
      active_listings: string;
      sold_items: string;
      total_views: string;
      total_favorites: string;
      total_revenue: string;
    }>(
      `SELECT 
        COUNT(DISTINCT p.id) as total_listings,
        COUNT(DISTINCT CASE WHEN p.status = 'active' THEN p.id END) as active_listings,
        COUNT(DISTINCT CASE WHEN p.status = 'sold' THEN p.id END) as sold_items,
        COALESCE(SUM(p.views_count), 0) as total_views,
        COALESCE(SUM(p.favorites_count), 0) as total_favorites,
        COALESCE(SUM(CASE WHEN o.status = 'delivered' THEN o.total_amount ELSE 0 END), 0) as total_revenue
       FROM users u
       LEFT JOIN products p ON u.id = p.seller_id
       LEFT JOIN orders o ON u.id = o.seller_id
       WHERE u.id = $1
       GROUP BY u.id`,
      [sellerId]
    );
    
    return result.rows[0] ? {
      totalListings: parseInt(result.rows[0].total_listings),
      activeListings: parseInt(result.rows[0].active_listings),
      soldItems: parseInt(result.rows[0].sold_items),
      totalViews: parseInt(result.rows[0].total_views),
      totalFavorites: parseInt(result.rows[0].total_favorites),
      totalRevenue: parseFloat(result.rows[0].total_revenue),
    } : null;
  },

  // Ban user
  async banUser(id: string, reason: string): Promise<boolean> {
    const result = await query(
      'UPDATE users SET is_banned = true, ban_reason = $1, is_active = false WHERE id = $2',
      [reason, id]
    );
    return (result.rowCount ?? 0) > 0;
  },

  // Unban user
  async unbanUser(id: string): Promise<boolean> {
    const result = await query(
      'UPDATE users SET is_banned = false, ban_reason = NULL, is_active = true WHERE id = $1',
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  },
};

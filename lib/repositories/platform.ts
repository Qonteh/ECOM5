// Platform Repository - Settings, Themes, Revenue, and Analytics
import { 
  query, 
  transaction, 
  DBTheme, 
  DBSetting, 
  DBRevenue, 
  DBDailyStats,
  RevenueType 
} from '@/lib/db';

// =====================================================
// THEMES
// =====================================================

export const ThemeRepository = {
  // Get all themes
  async findAll(): Promise<DBTheme[]> {
    const result = await query<DBTheme>(
      'SELECT * FROM site_themes WHERE is_active = true ORDER BY is_default DESC, name'
    );
    return result.rows;
  },

  // Get active theme
  async getActive(): Promise<DBTheme | null> {
    // First check platform settings for active theme
    const settingResult = await query<DBSetting>(
      "SELECT * FROM platform_settings WHERE setting_key = 'active_theme'"
    );
    const activeThemeKey = settingResult.rows[0]?.setting_value;
    
    if (activeThemeKey) {
      const themeResult = await query<DBTheme>(
        'SELECT * FROM site_themes WHERE theme_key = $1',
        [activeThemeKey]
      );
      if (themeResult.rows[0]) return themeResult.rows[0];
    }
    
    // Fall back to default theme
    const defaultResult = await query<DBTheme>(
      'SELECT * FROM site_themes WHERE is_default = true LIMIT 1'
    );
    return defaultResult.rows[0] || null;
  },

  // Set active theme
  async setActive(themeKey: string): Promise<boolean> {
    const result = await query(
      `INSERT INTO platform_settings (setting_key, setting_value, setting_type, description)
       VALUES ('active_theme', $1, 'string', 'Currently active theme')
       ON CONFLICT (setting_key) DO UPDATE SET setting_value = $1, updated_at = NOW()`,
      [themeKey]
    );
    return true;
  },

  // Create theme
  async create(theme: Omit<DBTheme, 'id' | 'created_at'>): Promise<DBTheme> {
    const result = await query<DBTheme>(
      `INSERT INTO site_themes (theme_key, name, description, primary_color, secondary_color, accent_color, styles, is_active, is_default)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        theme.theme_key,
        theme.name,
        theme.description,
        theme.primary_color,
        theme.secondary_color,
        theme.accent_color,
        JSON.stringify(theme.styles),
        theme.is_active,
        theme.is_default,
      ]
    );
    return result.rows[0];
  },

  // Update theme
  async update(themeKey: string, updates: Partial<DBTheme>): Promise<DBTheme | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id' && key !== 'theme_key' && key !== 'created_at') {
        fields.push(`${key} = $${paramIndex}`);
        values.push(key === 'styles' ? JSON.stringify(value) : value);
        paramIndex++;
      }
    });
    
    if (fields.length === 0) return null;
    
    values.push(themeKey);
    const result = await query<DBTheme>(
      `UPDATE site_themes SET ${fields.join(', ')} WHERE theme_key = $${paramIndex} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  },
};

// =====================================================
// SETTINGS
// =====================================================

export const SettingsRepository = {
  // Get all settings
  async findAll(): Promise<Record<string, string | number | boolean>> {
    const result = await query<DBSetting>('SELECT * FROM platform_settings');
    const settings: Record<string, string | number | boolean> = {};
    
    for (const row of result.rows) {
      switch (row.setting_type) {
        case 'number':
          settings[row.setting_key] = parseFloat(row.setting_value);
          break;
        case 'boolean':
          settings[row.setting_key] = row.setting_value === 'true';
          break;
        case 'json':
          settings[row.setting_key] = JSON.parse(row.setting_value);
          break;
        default:
          settings[row.setting_key] = row.setting_value;
      }
    }
    
    return settings;
  },

  // Get single setting
  async get(key: string): Promise<string | number | boolean | null> {
    const result = await query<DBSetting>(
      'SELECT * FROM platform_settings WHERE setting_key = $1',
      [key]
    );
    
    if (!result.rows[0]) return null;
    
    const row = result.rows[0];
    switch (row.setting_type) {
      case 'number': return parseFloat(row.setting_value);
      case 'boolean': return row.setting_value === 'true';
      case 'json': return JSON.parse(row.setting_value);
      default: return row.setting_value;
    }
  },

  // Set setting
  async set(key: string, value: string | number | boolean, type: 'string' | 'number' | 'boolean' | 'json' = 'string'): Promise<void> {
    const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
    
    await query(
      `INSERT INTO platform_settings (setting_key, setting_value, setting_type)
       VALUES ($1, $2, $3)
       ON CONFLICT (setting_key) DO UPDATE SET setting_value = $2, setting_type = $3, updated_at = NOW()`,
      [key, stringValue, type]
    );
  },

  // Delete setting
  async delete(key: string): Promise<boolean> {
    const result = await query('DELETE FROM platform_settings WHERE setting_key = $1', [key]);
    return (result.rowCount ?? 0) > 0;
  },
};

// =====================================================
// REVENUE
// =====================================================

export const RevenueRepository = {
  // Record revenue
  async record(data: {
    revenue_type: RevenueType;
    amount: number;
    currency?: string;
    user_id?: string;
    product_id?: string;
    order_id?: string;
    subscription_id?: string;
    featured_id?: string;
    promoted_id?: string;
    description?: string;
  }): Promise<DBRevenue> {
    const result = await query<DBRevenue>(
      `INSERT INTO platform_revenue (
        revenue_type, amount, currency, user_id, product_id, order_id,
        subscription_id, featured_id, promoted_id, description
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        data.revenue_type,
        data.amount,
        data.currency || 'TZS',
        data.user_id,
        data.product_id,
        data.order_id,
        data.subscription_id,
        data.featured_id,
        data.promoted_id,
        data.description,
      ]
    );
    return result.rows[0];
  },

  // Get revenue summary
  async getSummary(period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<{
    total: number;
    byType: Record<RevenueType, number>;
    growth: number;
  }> {
    const intervalMap = {
      day: '1 day',
      week: '7 days',
      month: '30 days',
      year: '365 days',
    };
    
    // Current period
    const currentResult = await query<{ revenue_type: RevenueType; total: string }>(
      `SELECT revenue_type, SUM(amount) as total
       FROM platform_revenue
       WHERE created_at >= NOW() - INTERVAL '${intervalMap[period]}'
       GROUP BY revenue_type`
    );
    
    // Previous period for growth calculation
    const previousResult = await query<{ total: string }>(
      `SELECT SUM(amount) as total
       FROM platform_revenue
       WHERE created_at >= NOW() - INTERVAL '${intervalMap[period]}' * 2
         AND created_at < NOW() - INTERVAL '${intervalMap[period]}'`
    );
    
    const byType: Record<string, number> = {};
    let total = 0;
    
    for (const row of currentResult.rows) {
      const amount = parseFloat(row.total);
      byType[row.revenue_type] = amount;
      total += amount;
    }
    
    const previousTotal = parseFloat(previousResult.rows[0]?.total || '0');
    const growth = previousTotal > 0 ? ((total - previousTotal) / previousTotal) * 100 : 0;
    
    return {
      total,
      byType: byType as Record<RevenueType, number>,
      growth,
    };
  },

  // Get recent transactions
  async getRecent(limit = 10): Promise<(DBRevenue & { user_name?: string; product_title?: string })[]> {
    const result = await query<DBRevenue & { user_name?: string; product_title?: string }>(
      `SELECT 
        r.*,
        u.name as user_name,
        p.title as product_title
       FROM platform_revenue r
       LEFT JOIN users u ON r.user_id = u.id
       LEFT JOIN products p ON r.product_id = p.id
       ORDER BY r.created_at DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  },

  // Get revenue by date range
  async getByDateRange(startDate: Date, endDate: Date): Promise<{
    date: string;
    total: number;
    byType: Record<string, number>;
  }[]> {
    const result = await query<{
      date: string;
      revenue_type: RevenueType;
      total: string;
    }>(
      `SELECT 
        DATE(created_at) as date,
        revenue_type,
        SUM(amount) as total
       FROM platform_revenue
       WHERE created_at >= $1 AND created_at <= $2
       GROUP BY DATE(created_at), revenue_type
       ORDER BY date`,
      [startDate, endDate]
    );
    
    // Group by date
    const byDate: Record<string, { total: number; byType: Record<string, number> }> = {};
    
    for (const row of result.rows) {
      if (!byDate[row.date]) {
        byDate[row.date] = { total: 0, byType: {} };
      }
      const amount = parseFloat(row.total);
      byDate[row.date].total += amount;
      byDate[row.date].byType[row.revenue_type] = amount;
    }
    
    return Object.entries(byDate).map(([date, data]) => ({
      date,
      ...data,
    }));
  },
};

// =====================================================
// ANALYTICS
// =====================================================

export const AnalyticsRepository = {
  // Get platform stats
  async getPlatformStats(): Promise<{
    totalUsers: number;
    totalSellers: number;
    totalBuyers: number;
    totalProducts: number;
    activeProducts: number;
    totalOrders: number;
    completedOrders: number;
    totalRevenue: number;
  }> {
    const usersResult = await query<{
      total: string;
      sellers: string;
      buyers: string;
    }>(
      `SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN role IN ('seller', 'developer', 'admin') THEN 1 END) as sellers,
        COUNT(CASE WHEN role = 'buyer' THEN 1 END) as buyers
       FROM users WHERE is_active = true`
    );
    
    const productsResult = await query<{
      total: string;
      active: string;
    }>(
      `SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active
       FROM products`
    );
    
    const ordersResult = await query<{
      total: string;
      completed: string;
      revenue: string;
    }>(
      `SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) as completed,
        COALESCE(SUM(total_amount), 0) as revenue
       FROM orders`
    );
    
    return {
      totalUsers: parseInt(usersResult.rows[0].total),
      totalSellers: parseInt(usersResult.rows[0].sellers),
      totalBuyers: parseInt(usersResult.rows[0].buyers),
      totalProducts: parseInt(productsResult.rows[0].total),
      activeProducts: parseInt(productsResult.rows[0].active),
      totalOrders: parseInt(ordersResult.rows[0].total),
      completedOrders: parseInt(ordersResult.rows[0].completed),
      totalRevenue: parseFloat(ordersResult.rows[0].revenue),
    };
  },

  // Get growth metrics
  async getGrowthMetrics(period: 'day' | 'week' | 'month' = 'month'): Promise<{
    newUsers: number;
    newSellers: number;
    newListings: number;
    newOrders: number;
    userGrowth: number;
    listingGrowth: number;
    orderGrowth: number;
  }> {
    const intervalMap = {
      day: '1 day',
      week: '7 days',
      month: '30 days',
    };
    
    // Current period metrics
    const currentUsers = await query<{ count: string }>(
      `SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL '${intervalMap[period]}'`
    );
    const currentSellers = await query<{ count: string }>(
      `SELECT COUNT(*) FROM users WHERE role IN ('seller', 'developer', 'admin') AND created_at >= NOW() - INTERVAL '${intervalMap[period]}'`
    );
    const currentListings = await query<{ count: string }>(
      `SELECT COUNT(*) FROM products WHERE created_at >= NOW() - INTERVAL '${intervalMap[period]}'`
    );
    const currentOrders = await query<{ count: string }>(
      `SELECT COUNT(*) FROM orders WHERE created_at >= NOW() - INTERVAL '${intervalMap[period]}'`
    );
    
    // Previous period for growth
    const prevUsers = await query<{ count: string }>(
      `SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL '${intervalMap[period]}' * 2 AND created_at < NOW() - INTERVAL '${intervalMap[period]}'`
    );
    const prevListings = await query<{ count: string }>(
      `SELECT COUNT(*) FROM products WHERE created_at >= NOW() - INTERVAL '${intervalMap[period]}' * 2 AND created_at < NOW() - INTERVAL '${intervalMap[period]}'`
    );
    const prevOrders = await query<{ count: string }>(
      `SELECT COUNT(*) FROM orders WHERE created_at >= NOW() - INTERVAL '${intervalMap[period]}' * 2 AND created_at < NOW() - INTERVAL '${intervalMap[period]}'`
    );
    
    const calcGrowth = (current: number, previous: number) => 
      previous > 0 ? ((current - previous) / previous) * 100 : 0;
    
    return {
      newUsers: parseInt(currentUsers.rows[0].count),
      newSellers: parseInt(currentSellers.rows[0].count),
      newListings: parseInt(currentListings.rows[0].count),
      newOrders: parseInt(currentOrders.rows[0].count),
      userGrowth: calcGrowth(parseInt(currentUsers.rows[0].count), parseInt(prevUsers.rows[0].count)),
      listingGrowth: calcGrowth(parseInt(currentListings.rows[0].count), parseInt(prevListings.rows[0].count)),
      orderGrowth: calcGrowth(parseInt(currentOrders.rows[0].count), parseInt(prevOrders.rows[0].count)),
    };
  },

  // Get top sellers
  async getTopSellers(limit = 10): Promise<{
    id: string;
    name: string;
    businessName?: string;
    totalProducts: number;
    totalSales: number;
    totalRevenue: number;
    rating: number;
  }[]> {
    const result = await query<{
      id: string;
      name: string;
      business_name?: string;
      total_products: string;
      total_sales: string;
      total_revenue: string;
      avg_rating: string;
    }>(
      `SELECT 
        u.id,
        u.name,
        u.business_name,
        COUNT(DISTINCT p.id) as total_products,
        COUNT(DISTINCT CASE WHEN o.status = 'delivered' THEN o.id END) as total_sales,
        COALESCE(SUM(CASE WHEN o.status = 'delivered' THEN o.total_amount ELSE 0 END), 0) as total_revenue,
        COALESCE(AVG(r.rating), 0) as avg_rating
       FROM users u
       LEFT JOIN products p ON u.id = p.seller_id
       LEFT JOIN orders o ON u.id = o.seller_id
       LEFT JOIN reviews r ON u.id = r.seller_id
       WHERE u.role IN ('seller', 'developer', 'admin') AND u.is_active = true
       GROUP BY u.id, u.name, u.business_name
       ORDER BY total_revenue DESC
       LIMIT $1`,
      [limit]
    );
    
    return result.rows.map(row => ({
      id: row.id,
      name: row.name,
      businessName: row.business_name,
      totalProducts: parseInt(row.total_products),
      totalSales: parseInt(row.total_sales),
      totalRevenue: parseFloat(row.total_revenue),
      rating: parseFloat(row.avg_rating),
    }));
  },

  // Record daily stats (run daily via cron)
  async recordDailyStats(): Promise<void> {
    await query(
      `INSERT INTO daily_stats (
        stat_date, new_users, new_sellers, active_users, new_listings,
        sold_items, total_active_listings, subscription_revenue, featured_revenue,
        promoted_revenue, transaction_fees, total_revenue, new_orders,
        completed_orders, total_order_value, total_views, total_messages
      )
      SELECT 
        CURRENT_DATE,
        (SELECT COUNT(*) FROM users WHERE DATE(created_at) = CURRENT_DATE),
        (SELECT COUNT(*) FROM users WHERE role IN ('seller', 'developer', 'admin') AND DATE(created_at) = CURRENT_DATE),
        (SELECT COUNT(DISTINCT user_id) FROM user_sessions WHERE DATE(created_at) = CURRENT_DATE),
        (SELECT COUNT(*) FROM products WHERE DATE(created_at) = CURRENT_DATE),
        (SELECT COUNT(*) FROM products WHERE DATE(sold_at) = CURRENT_DATE),
        (SELECT COUNT(*) FROM products WHERE status = 'active'),
        (SELECT COALESCE(SUM(amount), 0) FROM platform_revenue WHERE revenue_type = 'subscription' AND DATE(created_at) = CURRENT_DATE),
        (SELECT COALESCE(SUM(amount), 0) FROM platform_revenue WHERE revenue_type = 'featured_listing' AND DATE(created_at) = CURRENT_DATE),
        (SELECT COALESCE(SUM(amount), 0) FROM platform_revenue WHERE revenue_type = 'promoted_ad' AND DATE(created_at) = CURRENT_DATE),
        (SELECT COALESCE(SUM(amount), 0) FROM platform_revenue WHERE revenue_type = 'transaction_fee' AND DATE(created_at) = CURRENT_DATE),
        (SELECT COALESCE(SUM(amount), 0) FROM platform_revenue WHERE DATE(created_at) = CURRENT_DATE),
        (SELECT COUNT(*) FROM orders WHERE DATE(created_at) = CURRENT_DATE),
        (SELECT COUNT(*) FROM orders WHERE DATE(delivered_at) = CURRENT_DATE),
        (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE DATE(created_at) = CURRENT_DATE),
        (SELECT COUNT(*) FROM product_views WHERE DATE(viewed_at) = CURRENT_DATE),
        (SELECT COUNT(*) FROM messages WHERE DATE(created_at) = CURRENT_DATE)
      ON CONFLICT (stat_date) DO UPDATE SET
        new_users = EXCLUDED.new_users,
        new_sellers = EXCLUDED.new_sellers,
        active_users = EXCLUDED.active_users,
        new_listings = EXCLUDED.new_listings,
        sold_items = EXCLUDED.sold_items,
        total_active_listings = EXCLUDED.total_active_listings,
        subscription_revenue = EXCLUDED.subscription_revenue,
        featured_revenue = EXCLUDED.featured_revenue,
        promoted_revenue = EXCLUDED.promoted_revenue,
        transaction_fees = EXCLUDED.transaction_fees,
        total_revenue = EXCLUDED.total_revenue,
        new_orders = EXCLUDED.new_orders,
        completed_orders = EXCLUDED.completed_orders,
        total_order_value = EXCLUDED.total_order_value,
        total_views = EXCLUDED.total_views,
        total_messages = EXCLUDED.total_messages`
    );
  },

  // Get historical stats
  async getHistoricalStats(days = 30): Promise<DBDailyStats[]> {
    const result = await query<DBDailyStats>(
      `SELECT * FROM daily_stats 
       WHERE stat_date >= CURRENT_DATE - $1
       ORDER BY stat_date DESC`,
      [days]
    );
    return result.rows;
  },
};

// Orders Repository - Database operations for orders and payments
import { 
  query, 
  transaction, 
  DBOrder, 
  OrderStatus, 
  PaymentStatus, 
  PaymentMethod 
} from '@/lib/db';

export interface CreateOrderInput {
  buyer_id: string;
  seller_id: string;
  items: {
    product_id: string;
    product_title: string;
    product_image_url?: string;
    quantity: number;
    unit_price: number;
  }[];
  delivery_region: string;
  delivery_district?: string;
  delivery_ward?: string;
  delivery_address: string;
  delivery_phone: string;
  delivery_notes?: string;
  delivery_fee?: number;
}

export interface OrderWithItems extends DBOrder {
  items: {
    id: string;
    product_id: string;
    product_title: string;
    product_image_url?: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }[];
  buyer_name?: string;
  buyer_phone?: string;
  seller_name?: string;
  seller_business_name?: string;
}

export const OrderRepository = {
  // Create new order
  async create(input: CreateOrderInput): Promise<OrderWithItems> {
    return await transaction(async (client) => {
      // Calculate totals
      const subtotal = input.items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
      const deliveryFee = input.delivery_fee || 0;
      const platformFee = subtotal * 0.025; // 2.5% platform fee
      const totalAmount = subtotal + deliveryFee + platformFee;
      
      // Insert order
      const orderResult = await client.query<DBOrder>(
        `INSERT INTO orders (
          buyer_id, seller_id, subtotal, delivery_fee, platform_fee, total_amount,
          delivery_region, delivery_district, delivery_ward, delivery_address,
          delivery_phone, delivery_notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *`,
        [
          input.buyer_id,
          input.seller_id,
          subtotal,
          deliveryFee,
          platformFee,
          totalAmount,
          input.delivery_region,
          input.delivery_district,
          input.delivery_ward,
          input.delivery_address,
          input.delivery_phone,
          input.delivery_notes,
        ]
      );
      
      const order = orderResult.rows[0];
      
      // Insert order items
      const items = [];
      for (const item of input.items) {
        const itemResult = await client.query(
          `INSERT INTO order_items (
            order_id, product_id, product_title, product_image_url,
            quantity, unit_price, total_price
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *`,
          [
            order.id,
            item.product_id,
            item.product_title,
            item.product_image_url,
            item.quantity,
            item.unit_price,
            item.unit_price * item.quantity,
          ]
        );
        items.push(itemResult.rows[0]);
      }
      
      return { ...order, items } as OrderWithItems;
    });
  },

  // Find order by ID
  async findById(id: string): Promise<OrderWithItems | null> {
    const orderResult = await query<OrderWithItems>(
      `SELECT 
        o.*,
        buyer.name as buyer_name,
        buyer.phone as buyer_phone,
        seller.name as seller_name,
        seller.business_name as seller_business_name
       FROM orders o
       JOIN users buyer ON o.buyer_id = buyer.id
       JOIN users seller ON o.seller_id = seller.id
       WHERE o.id = $1`,
      [id]
    );
    
    if (!orderResult.rows[0]) return null;
    
    const order = orderResult.rows[0];
    
    // Get items
    const itemsResult = await query(
      'SELECT * FROM order_items WHERE order_id = $1',
      [id]
    );
    order.items = itemsResult.rows as OrderWithItems['items'];
    
    return order;
  },

  // Find order by order number
  async findByOrderNumber(orderNumber: string): Promise<OrderWithItems | null> {
    const result = await query<{ id: string }>('SELECT id FROM orders WHERE order_number = $1', [orderNumber]);
    if (!result.rows[0]) return null;
    return this.findById(result.rows[0].id);
  },

  // Get orders by buyer
  async findByBuyer(buyerId: string, page = 1, limit = 20): Promise<{
    orders: OrderWithItems[];
    total: number;
  }> {
    const offset = (page - 1) * limit;
    
    const countResult = await query<{ count: string }>(
      'SELECT COUNT(*) FROM orders WHERE buyer_id = $1',
      [buyerId]
    );
    const total = parseInt(countResult.rows[0].count);
    
    const ordersResult = await query<OrderWithItems>(
      `SELECT 
        o.*,
        seller.name as seller_name,
        seller.business_name as seller_business_name
       FROM orders o
       JOIN users seller ON o.seller_id = seller.id
       WHERE o.buyer_id = $1
       ORDER BY o.created_at DESC
       LIMIT $2 OFFSET $3`,
      [buyerId, limit, offset]
    );
    
    // Get items for each order
    for (const order of ordersResult.rows) {
      const itemsResult = await query(
        'SELECT * FROM order_items WHERE order_id = $1',
        [order.id]
      );
      order.items = itemsResult.rows as OrderWithItems['items'];
    }
    
    return { orders: ordersResult.rows, total };
  },

  // Get orders by seller
  async findBySeller(sellerId: string, page = 1, limit = 20, status?: OrderStatus): Promise<{
    orders: OrderWithItems[];
    total: number;
  }> {
    const offset = (page - 1) * limit;
    const whereClause = status 
      ? 'WHERE o.seller_id = $1 AND o.status = $2'
      : 'WHERE o.seller_id = $1';
    const params = status ? [sellerId, status] : [sellerId];
    
    const countResult = await query<{ count: string }>(
      `SELECT COUNT(*) FROM orders o ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);
    
    const ordersResult = await query<OrderWithItems>(
      `SELECT 
        o.*,
        buyer.name as buyer_name,
        buyer.phone as buyer_phone
       FROM orders o
       JOIN users buyer ON o.buyer_id = buyer.id
       ${whereClause}
       ORDER BY o.created_at DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    );
    
    // Get items for each order
    for (const order of ordersResult.rows) {
      const itemsResult = await query(
        'SELECT * FROM order_items WHERE order_id = $1',
        [order.id]
      );
      order.items = itemsResult.rows as OrderWithItems['items'];
    }
    
    return { orders: ordersResult.rows, total };
  },

  // Update order status
  async updateStatus(id: string, status: OrderStatus, reason?: string): Promise<OrderWithItems | null> {
    let updateFields = 'status = $1';
    const params: unknown[] = [status];
    
    switch (status) {
      case 'confirmed':
        updateFields += ', confirmed_at = NOW()';
        break;
      case 'shipped':
        updateFields += ', shipped_at = NOW()';
        break;
      case 'delivered':
        updateFields += ', delivered_at = NOW()';
        break;
      case 'cancelled':
        updateFields += ', cancelled_at = NOW(), cancellation_reason = $3';
        params.push(id, reason);
        break;
    }
    
    if (status !== 'cancelled') {
      params.push(id);
    }
    
    await query(
      `UPDATE orders SET ${updateFields} WHERE id = $${params.length}`,
      params
    );
    
    return this.findById(id);
  },

  // Create payment
  async createPayment(
    orderId: string,
    method: PaymentMethod,
    amount: number,
    mobileNumber?: string
  ): Promise<{ id: string; status: PaymentStatus }> {
    const result = await query<{ id: string; status: PaymentStatus }>(
      `INSERT INTO payments (order_id, payment_method, amount, mobile_number)
       VALUES ($1, $2, $3, $4)
       RETURNING id, status`,
      [orderId, method, amount, mobileNumber]
    );
    return result.rows[0];
  },

  // Update payment status
  async updatePaymentStatus(
    paymentId: string, 
    status: PaymentStatus,
    reference?: string,
    failureReason?: string
  ): Promise<boolean> {
    let updateFields = 'status = $1';
    const params: unknown[] = [status, paymentId];
    
    if (status === 'completed') {
      updateFields += ', completed_at = NOW(), transaction_reference = $3';
      params.splice(1, 0, reference);
    } else if (status === 'failed') {
      updateFields += ', failed_at = NOW(), failure_reason = $3';
      params.splice(1, 0, failureReason);
    }
    
    const result = await query(
      `UPDATE payments SET ${updateFields} WHERE id = $2`,
      params
    );
    return (result.rowCount ?? 0) > 0;
  },

  // Get platform order stats
  async getStats(period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<{
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
    platformFees: number;
  }> {
    const intervalMap = {
      day: '1 day',
      week: '7 days',
      month: '30 days',
      year: '365 days',
    };
    
    const result = await query<{
      total_orders: string;
      pending_orders: string;
      completed_orders: string;
      cancelled_orders: string;
      total_revenue: string;
      platform_fees: string;
    }>(
      `SELECT 
        COUNT(*) as total_orders,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) as completed_orders,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders,
        COALESCE(SUM(total_amount), 0) as total_revenue,
        COALESCE(SUM(platform_fee), 0) as platform_fees
       FROM orders
       WHERE created_at >= NOW() - INTERVAL '${intervalMap[period]}'`
    );
    
    const row = result.rows[0];
    return {
      totalOrders: parseInt(row.total_orders),
      pendingOrders: parseInt(row.pending_orders),
      completedOrders: parseInt(row.completed_orders),
      cancelledOrders: parseInt(row.cancelled_orders),
      totalRevenue: parseFloat(row.total_revenue),
      platformFees: parseFloat(row.platform_fees),
    };
  },
};

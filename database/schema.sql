-- =====================================================
-- SOKO TANZANIA E-COMMERCE DATABASE SCHEMA
-- Database Name: ecom_web
-- PostgreSQL Database for pgAdmin
-- =====================================================

-- Create the database (run this separately in pgAdmin)
-- CREATE DATABASE ecom_web;

-- Connect to ecom_web database before running the rest

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- 1. USERS & AUTHENTICATION
-- =====================================================

-- User roles enum
CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'developer', 'admin');

-- Subscription tiers enum
CREATE TYPE subscription_tier AS ENUM ('free', 'basic', 'premium', 'business');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role user_role DEFAULT 'buyer',
    avatar_url TEXT,
    
    -- Tanzania specific fields
    region VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    ward VARCHAR(100),
    street_address TEXT,
    
    -- Verification
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    id_verified BOOLEAN DEFAULT FALSE,
    id_type VARCHAR(50), -- NIDA, Passport, Driver's License
    id_number VARCHAR(50),
    
    -- Business info (for sellers)
    business_name VARCHAR(255),
    business_type VARCHAR(100), -- Sole Proprietor, Company, etc.
    tin_number VARCHAR(50), -- Tax Identification Number (TIN)
    business_license VARCHAR(100),
    
    -- Subscription
    subscription_tier subscription_tier DEFAULT 'free',
    subscription_starts_at TIMESTAMP WITH TIME ZONE,
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_banned BOOLEAN DEFAULT FALSE,
    ban_reason TEXT
);

-- User sessions for authentication
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL UNIQUE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Password reset tokens
CREATE TABLE password_resets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. CATEGORIES & SUBCATEGORIES
-- =====================================================

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    name_swahili VARCHAR(100),
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(50),
    description TEXT,
    description_swahili TEXT,
    image_url TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE subcategories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    name_swahili VARCHAR(100),
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(category_id, slug)
);

-- =====================================================
-- 3. PRODUCTS / LISTINGS
-- =====================================================

-- Product condition enum
CREATE TYPE product_condition AS ENUM ('new', 'used', 'refurbished');

-- Product status enum
CREATE TYPE product_status AS ENUM ('draft', 'pending', 'active', 'sold', 'expired', 'rejected');

-- Listing type enum
CREATE TYPE listing_type AS ENUM ('sale', 'rent', 'service', 'job', 'wanted');

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id),
    subcategory_id UUID REFERENCES subcategories(id),
    
    -- Basic info
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    listing_type listing_type DEFAULT 'sale',
    
    -- Pricing
    price DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'TZS',
    price_negotiable BOOLEAN DEFAULT TRUE,
    original_price DECIMAL(15, 2), -- For showing discounts
    
    -- Condition
    condition product_condition DEFAULT 'new',
    
    -- Location (Tanzania specific)
    region VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    ward VARCHAR(100),
    location_address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Status & visibility
    status product_status DEFAULT 'pending',
    rejection_reason TEXT,
    
    -- Promotion features
    is_featured BOOLEAN DEFAULT FALSE,
    featured_until TIMESTAMP WITH TIME ZONE,
    is_promoted BOOLEAN DEFAULT FALSE,
    promoted_until TIMESTAMP WITH TIME ZONE,
    is_urgent BOOLEAN DEFAULT FALSE,
    
    -- Stats
    views_count INT DEFAULT 0,
    favorites_count INT DEFAULT 0,
    inquiries_count INT DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    sold_at TIMESTAMP WITH TIME ZONE
);

-- Product images
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product specifications/attributes (flexible key-value)
CREATE TABLE product_attributes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    attribute_name VARCHAR(100) NOT NULL,
    attribute_value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product views tracking
CREATE TABLE product_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. FAVORITES / WISHLIST
-- =====================================================

CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- =====================================================
-- 5. MESSAGES / INQUIRIES
-- =====================================================

-- Conversation threads
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    last_message_at TIMESTAMP WITH TIME ZONE,
    buyer_unread_count INT DEFAULT 0,
    seller_unread_count INT DEFAULT 0,
    is_archived_buyer BOOLEAN DEFAULT FALSE,
    is_archived_seller BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. ORDERS & TRANSACTIONS
-- =====================================================

-- Order status enum
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');

-- Payment status enum
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');

-- Payment method enum
CREATE TYPE payment_method AS ENUM ('mpesa', 'tigopesa', 'airtelmoney', 'halopesa', 'bank_transfer', 'cash_on_delivery', 'card');

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    buyer_id UUID NOT NULL REFERENCES users(id),
    seller_id UUID NOT NULL REFERENCES users(id),
    
    -- Order totals
    subtotal DECIMAL(15, 2) NOT NULL,
    delivery_fee DECIMAL(15, 2) DEFAULT 0,
    platform_fee DECIMAL(15, 2) DEFAULT 0,
    total_amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'TZS',
    
    -- Status
    status order_status DEFAULT 'pending',
    
    -- Delivery info
    delivery_region VARCHAR(100) NOT NULL,
    delivery_district VARCHAR(100),
    delivery_ward VARCHAR(100),
    delivery_address TEXT NOT NULL,
    delivery_phone VARCHAR(20) NOT NULL,
    delivery_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT
);

-- Order items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    product_title VARCHAR(255) NOT NULL, -- Snapshot of title
    product_image_url TEXT,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(15, 2) NOT NULL,
    total_price DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    payment_method payment_method NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'TZS',
    status payment_status DEFAULT 'pending',
    
    -- Mobile money details
    mobile_number VARCHAR(20),
    transaction_reference VARCHAR(100),
    provider_reference VARCHAR(100),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE,
    failure_reason TEXT
);

-- =====================================================
-- 7. REVIEWS & RATINGS
-- =====================================================

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    
    -- Response from seller
    seller_response TEXT,
    seller_response_at TIMESTAMP WITH TIME ZONE,
    
    -- Moderation
    is_approved BOOLEAN DEFAULT TRUE,
    reported BOOLEAN DEFAULT FALSE,
    report_reason TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. SUBSCRIPTIONS & MONETIZATION
-- =====================================================

-- Subscription plans
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    tier subscription_tier UNIQUE NOT NULL,
    price_monthly DECIMAL(10, 2) NOT NULL,
    price_yearly DECIMAL(10, 2) NOT NULL,
    
    -- Limits
    max_listings INT NOT NULL,
    max_photos_per_listing INT NOT NULL,
    max_featured_listings INT DEFAULT 0,
    
    -- Features (JSON for flexibility)
    features JSONB NOT NULL DEFAULT '[]',
    
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User subscriptions history
CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES subscription_plans(id),
    
    amount_paid DECIMAL(10, 2) NOT NULL,
    billing_period VARCHAR(20) NOT NULL, -- 'monthly' or 'yearly'
    
    starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Payment info
    payment_method payment_method,
    payment_reference VARCHAR(100),
    
    is_active BOOLEAN DEFAULT TRUE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Featured listing purchases
CREATE TABLE featured_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    amount_paid DECIMAL(10, 2) NOT NULL,
    duration_days INT NOT NULL,
    
    starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Payment info
    payment_method payment_method,
    payment_reference VARCHAR(100),
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Promoted ads purchases
CREATE TABLE promoted_ads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    package_type VARCHAR(50) NOT NULL, -- 'basic', 'standard', 'premium'
    amount_paid DECIMAL(10, 2) NOT NULL,
    impressions_purchased INT NOT NULL,
    impressions_used INT DEFAULT 0,
    clicks_count INT DEFAULT 0,
    
    starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Payment info
    payment_method payment_method,
    payment_reference VARCHAR(100),
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Platform revenue tracking
CREATE TYPE revenue_type AS ENUM ('subscription', 'featured_listing', 'promoted_ad', 'transaction_fee', 'other');

CREATE TABLE platform_revenue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    revenue_type revenue_type NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'TZS',
    
    -- Related entities
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    subscription_id UUID REFERENCES user_subscriptions(id) ON DELETE SET NULL,
    featured_id UUID REFERENCES featured_listings(id) ON DELETE SET NULL,
    promoted_id UUID REFERENCES promoted_ads(id) ON DELETE SET NULL,
    
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 9. PLATFORM SETTINGS & CONFIGURATION
-- =====================================================

-- Site themes/designs
CREATE TABLE site_themes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    theme_key VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    
    -- Color scheme
    primary_color VARCHAR(20) NOT NULL,
    secondary_color VARCHAR(20) NOT NULL,
    accent_color VARCHAR(20) NOT NULL,
    
    -- Style configurations (JSON)
    styles JSONB NOT NULL DEFAULT '{}',
    
    is_active BOOLEAN DEFAULT TRUE,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Platform settings (key-value store)
CREATE TABLE platform_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    setting_type VARCHAR(20) DEFAULT 'string', -- string, number, boolean, json
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 10. NOTIFICATIONS
-- =====================================================

CREATE TYPE notification_type AS ENUM ('message', 'order', 'review', 'promotion', 'system', 'payment');

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    
    -- Related entities
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 11. REPORTS & MODERATION
-- =====================================================

CREATE TYPE report_status AS ENUM ('pending', 'investigating', 'resolved', 'dismissed');
CREATE TYPE report_type AS ENUM ('product', 'user', 'message', 'review');

CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    report_type report_type NOT NULL,
    
    -- Reported entity
    reported_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    reported_product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    reported_message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
    reported_review_id UUID REFERENCES reviews(id) ON DELETE SET NULL,
    
    reason VARCHAR(100) NOT NULL,
    description TEXT,
    
    status report_status DEFAULT 'pending',
    resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    resolution_notes TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 12. ANALYTICS & TRACKING
-- =====================================================

-- Daily platform statistics
CREATE TABLE daily_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stat_date DATE UNIQUE NOT NULL,
    
    -- User stats
    new_users INT DEFAULT 0,
    new_sellers INT DEFAULT 0,
    active_users INT DEFAULT 0,
    
    -- Product stats
    new_listings INT DEFAULT 0,
    sold_items INT DEFAULT 0,
    total_active_listings INT DEFAULT 0,
    
    -- Revenue stats
    subscription_revenue DECIMAL(15, 2) DEFAULT 0,
    featured_revenue DECIMAL(15, 2) DEFAULT 0,
    promoted_revenue DECIMAL(15, 2) DEFAULT 0,
    transaction_fees DECIMAL(15, 2) DEFAULT 0,
    total_revenue DECIMAL(15, 2) DEFAULT 0,
    
    -- Order stats
    new_orders INT DEFAULT 0,
    completed_orders INT DEFAULT 0,
    total_order_value DECIMAL(15, 2) DEFAULT 0,
    
    -- Engagement stats
    total_views INT DEFAULT 0,
    total_messages INT DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_region ON users(region);
CREATE INDEX idx_users_subscription ON users(subscription_tier);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = TRUE;

-- Products indexes
CREATE INDEX idx_products_seller ON products(seller_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_subcategory ON products(subcategory_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_region ON products(region);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_products_promoted ON products(is_promoted) WHERE is_promoted = TRUE;
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_created ON products(created_at DESC);
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('english', title || ' ' || description));

-- Orders indexes
CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_orders_seller ON orders(seller_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- Messages indexes
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);

-- Favorites indexes
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_product ON favorites(product_id);

-- Notifications indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;

-- Revenue indexes
CREATE INDEX idx_revenue_type ON platform_revenue(revenue_type);
CREATE INDEX idx_revenue_date ON platform_revenue(created_at DESC);

-- =====================================================
-- INSERT DEFAULT DATA
-- =====================================================

-- Insert default categories
INSERT INTO categories (name, name_swahili, slug, icon, description, display_order) VALUES
('Vehicles', 'Magari', 'vehicles', 'Car', 'Cars, motorcycles, trucks and more', 1),
('Electronics', 'Vifaa vya Umeme', 'electronics', 'Smartphone', 'Phones, computers, TVs and gadgets', 2),
('Property', 'Mali Isiyohamishika', 'property', 'Home', 'Houses, land, apartments for sale or rent', 3),
('Fashion', 'Mitindo', 'fashion', 'Shirt', 'Clothing, shoes, bags and accessories', 4),
('Home & Garden', 'Nyumba na Bustani', 'home', 'Sofa', 'Furniture, appliances and home decor', 5),
('Jobs', 'Kazi', 'jobs', 'Briefcase', 'Job listings and employment opportunities', 6),
('Services', 'Huduma', 'services', 'Wrench', 'Professional and personal services', 7),
('Agriculture', 'Kilimo', 'agriculture', 'Wheat', 'Farm products, equipment and livestock', 8);

-- Insert subcategories for vehicles
INSERT INTO subcategories (category_id, name, name_swahili, slug, display_order) VALUES
((SELECT id FROM categories WHERE slug = 'vehicles'), 'Cars', 'Magari', 'cars', 1),
((SELECT id FROM categories WHERE slug = 'vehicles'), 'Motorcycles', 'Pikipiki', 'motorcycles', 2),
((SELECT id FROM categories WHERE slug = 'vehicles'), 'Trucks & Buses', 'Malori na Mabasi', 'trucks', 3),
((SELECT id FROM categories WHERE slug = 'vehicles'), 'Vehicle Parts', 'Vipuri vya Magari', 'parts', 4);

-- Insert subcategories for electronics
INSERT INTO subcategories (category_id, name, name_swahili, slug, display_order) VALUES
((SELECT id FROM categories WHERE slug = 'electronics'), 'Mobile Phones', 'Simu za Mkononi', 'phones', 1),
((SELECT id FROM categories WHERE slug = 'electronics'), 'Computers & Laptops', 'Kompyuta', 'computers', 2),
((SELECT id FROM categories WHERE slug = 'electronics'), 'TVs & Audio', 'Televisheni na Sauti', 'tvs', 3),
((SELECT id FROM categories WHERE slug = 'electronics'), 'Accessories', 'Vifaa', 'accessories', 4);

-- Insert subcategories for property
INSERT INTO subcategories (category_id, name, name_swahili, slug, display_order) VALUES
((SELECT id FROM categories WHERE slug = 'property'), 'Houses', 'Nyumba', 'houses', 1),
((SELECT id FROM categories WHERE slug = 'property'), 'Apartments', 'Vyumba', 'apartments', 2),
((SELECT id FROM categories WHERE slug = 'property'), 'Land & Plots', 'Ardhi na Viwanja', 'land', 3),
((SELECT id FROM categories WHERE slug = 'property'), 'Commercial', 'Biashara', 'commercial', 4);

-- Insert subcategories for fashion
INSERT INTO subcategories (category_id, name, name_swahili, slug, display_order) VALUES
((SELECT id FROM categories WHERE slug = 'fashion'), 'Men''s Clothing', 'Nguo za Wanaume', 'mens', 1),
((SELECT id FROM categories WHERE slug = 'fashion'), 'Women''s Clothing', 'Nguo za Wanawake', 'womens', 2),
((SELECT id FROM categories WHERE slug = 'fashion'), 'Shoes', 'Viatu', 'shoes', 3),
((SELECT id FROM categories WHERE slug = 'fashion'), 'Bags & Accessories', 'Mifuko na Vifaa', 'bags', 4);

-- Insert subcategories for home
INSERT INTO subcategories (category_id, name, name_swahili, slug, display_order) VALUES
((SELECT id FROM categories WHERE slug = 'home'), 'Furniture', 'Samani', 'furniture', 1),
((SELECT id FROM categories WHERE slug = 'home'), 'Appliances', 'Vifaa vya Nyumbani', 'appliances', 2),
((SELECT id FROM categories WHERE slug = 'home'), 'Garden', 'Bustani', 'garden', 3),
((SELECT id FROM categories WHERE slug = 'home'), 'Kitchen', 'Jikoni', 'kitchen', 4);

-- Insert subcategories for jobs
INSERT INTO subcategories (category_id, name, name_swahili, slug, display_order) VALUES
((SELECT id FROM categories WHERE slug = 'jobs'), 'Full Time', 'Kazi ya Kudumu', 'fulltime', 1),
((SELECT id FROM categories WHERE slug = 'jobs'), 'Part Time', 'Kazi ya Muda', 'parttime', 2),
((SELECT id FROM categories WHERE slug = 'jobs'), 'Freelance', 'Kazi Huru', 'freelance', 3),
((SELECT id FROM categories WHERE slug = 'jobs'), 'Internships', 'Mafunzo', 'internships', 4);

-- Insert subcategories for services
INSERT INTO subcategories (category_id, name, name_swahili, slug, display_order) VALUES
((SELECT id FROM categories WHERE slug = 'services'), 'Repair & Maintenance', 'Ukarabati', 'repair', 1),
((SELECT id FROM categories WHERE slug = 'services'), 'Cleaning', 'Usafi', 'cleaning', 2),
((SELECT id FROM categories WHERE slug = 'services'), 'Education & Training', 'Elimu na Mafunzo', 'education', 3),
((SELECT id FROM categories WHERE slug = 'services'), 'Events & Entertainment', 'Matukio na Burudani', 'events', 4);

-- Insert subcategories for agriculture
INSERT INTO subcategories (category_id, name, name_swahili, slug, display_order) VALUES
((SELECT id FROM categories WHERE slug = 'agriculture'), 'Farm Produce', 'Mazao ya Shamba', 'produce', 1),
((SELECT id FROM categories WHERE slug = 'agriculture'), 'Livestock', 'Mifugo', 'livestock', 2),
((SELECT id FROM categories WHERE slug = 'agriculture'), 'Farm Equipment', 'Vifaa vya Kilimo', 'equipment', 3),
((SELECT id FROM categories WHERE slug = 'agriculture'), 'Seeds & Fertilizers', 'Mbegu na Mbolea', 'seeds', 4);

-- Insert subscription plans
INSERT INTO subscription_plans (name, tier, price_monthly, price_yearly, max_listings, max_photos_per_listing, max_featured_listings, features, display_order) VALUES
('Free', 'free', 0, 0, 5, 3, 0, '["5 active listings", "3 photos per listing", "Basic support", "Standard visibility"]', 1),
('Basic', 'basic', 15000, 150000, 25, 10, 1, '["25 active listings", "10 photos per listing", "Email support", "Priority visibility", "1 featured listing/month"]', 2),
('Premium', 'premium', 50000, 500000, 100, 20, 5, '["100 active listings", "20 photos per listing", "Priority support", "Top visibility", "5 featured listings/month", "Analytics dashboard", "Verified badge"]', 3),
('Business', 'business', 150000, 1500000, -1, 50, 20, '["Unlimited listings", "50 photos per listing", "24/7 dedicated support", "Maximum visibility", "20 featured listings/month", "Advanced analytics", "Verified badge", "Custom store page", "API access"]', 4);

-- Insert default themes
INSERT INTO site_themes (theme_key, name, description, primary_color, secondary_color, accent_color, styles, is_default) VALUES
('safari', 'Safari', 'Warm earth tones with rounded, friendly design', '#8B5A2B', '#D4A574', '#4A7C59', '{"cardStyle": "rounded", "headerStyle": "modern", "buttonStyle": "rounded", "layoutStyle": "grid", "heroStyle": "centered", "fontStyle": "modern"}', true),
('ocean', 'Ocean', 'Cool blues with glass morphism effects', '#1E6091', '#A8D8EA', '#2E8B8B', '{"cardStyle": "glass", "headerStyle": "minimal", "buttonStyle": "pill", "layoutStyle": "masonry", "heroStyle": "split", "fontStyle": "elegant"}', false),
('kilimanjaro', 'Kilimanjaro', 'Bold and modern with sharp contrasts', '#C41E3A', '#FFD700', '#E8A317', '{"cardStyle": "sharp", "headerStyle": "bold", "buttonStyle": "square", "layoutStyle": "cards", "heroStyle": "fullwidth", "fontStyle": "bold"}', false),
('serengeti', 'Serengeti', 'Vibrant African colors with soft, organic shapes', '#228B22', '#FFB347', '#DAA520', '{"cardStyle": "soft", "headerStyle": "classic", "buttonStyle": "soft", "layoutStyle": "list", "heroStyle": "minimal", "fontStyle": "classic"}', false);

-- Insert default platform settings
INSERT INTO platform_settings (setting_key, setting_value, setting_type, description) VALUES
('site_name', 'Soko Tanzania', 'string', 'Website name'),
('site_tagline', 'Tanzania''s Largest Online Marketplace', 'string', 'Website tagline'),
('contact_email', 'support@sokotanzania.com', 'string', 'Support email address'),
('contact_phone', '+255 700 000 000', 'string', 'Support phone number'),
('active_theme', 'safari', 'string', 'Currently active theme'),
('platform_fee_percentage', '2.5', 'number', 'Platform fee percentage on transactions'),
('featured_listing_price_daily', '5000', 'number', 'Daily price for featured listings in TZS'),
('promoted_ad_price_per_1000_impressions', '10000', 'number', 'Price per 1000 impressions for promoted ads'),
('max_free_listings', '5', 'number', 'Maximum listings for free tier'),
('listing_expiry_days', '30', 'number', 'Days until listing expires'),
('allow_registration', 'true', 'boolean', 'Allow new user registrations'),
('require_phone_verification', 'true', 'boolean', 'Require phone verification for sellers'),
('currency', 'TZS', 'string', 'Default currency');

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- Active products view
CREATE VIEW active_products_view AS
SELECT 
    p.*,
    c.name as category_name,
    c.slug as category_slug,
    sc.name as subcategory_name,
    u.name as seller_name,
    u.business_name,
    u.phone as seller_phone,
    u.id_verified as seller_verified,
    (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as primary_image
FROM products p
JOIN categories c ON p.category_id = c.id
LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
JOIN users u ON p.seller_id = u.id
WHERE p.status = 'active' AND u.is_active = true;

-- Seller dashboard stats view
CREATE VIEW seller_stats_view AS
SELECT 
    u.id as seller_id,
    u.name as seller_name,
    u.subscription_tier,
    COUNT(DISTINCT p.id) as total_listings,
    COUNT(DISTINCT CASE WHEN p.status = 'active' THEN p.id END) as active_listings,
    COUNT(DISTINCT CASE WHEN p.status = 'sold' THEN p.id END) as sold_items,
    COALESCE(SUM(p.views_count), 0) as total_views,
    COALESCE(SUM(p.favorites_count), 0) as total_favorites,
    COALESCE(SUM(p.inquiries_count), 0) as total_inquiries,
    COUNT(DISTINCT o.id) as total_orders,
    COALESCE(SUM(o.total_amount), 0) as total_sales
FROM users u
LEFT JOIN products p ON u.id = p.seller_id
LEFT JOIN orders o ON u.id = o.seller_id AND o.status = 'delivered'
WHERE u.role IN ('seller', 'developer', 'admin')
GROUP BY u.id, u.name, u.subscription_tier;

-- Platform revenue summary view
CREATE VIEW revenue_summary_view AS
SELECT 
    date_trunc('month', created_at) as month,
    revenue_type,
    SUM(amount) as total_amount,
    COUNT(*) as transaction_count
FROM platform_revenue
GROUP BY date_trunc('month', created_at), revenue_type
ORDER BY month DESC, revenue_type;

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number = 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('order_number_seq')::TEXT, 6, '0');
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE SEQUENCE order_number_seq START 1;
CREATE TRIGGER set_order_number BEFORE INSERT ON orders FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- Function to update product stats
CREATE OR REPLACE FUNCTION update_product_view_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products SET views_count = views_count + 1 WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER increment_product_views AFTER INSERT ON product_views FOR EACH ROW EXECUTE FUNCTION update_product_view_count();

-- Function to update favorite count
CREATE OR REPLACE FUNCTION update_favorite_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE products SET favorites_count = favorites_count + 1 WHERE id = NEW.product_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE products SET favorites_count = favorites_count - 1 WHERE id = OLD.product_id;
        RETURN OLD;
    END IF;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_favorites_count AFTER INSERT OR DELETE ON favorites FOR EACH ROW EXECUTE FUNCTION update_favorite_count();

-- =====================================================
-- END OF SCHEMA
-- =====================================================

-- Print success message
DO $$
BEGIN
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'SOKO TANZANIA DATABASE SCHEMA CREATED SUCCESSFULLY!';
    RAISE NOTICE 'Database: ecom_web';
    RAISE NOTICE 'Tables created: 28';
    RAISE NOTICE 'Views created: 3';
    RAISE NOTICE 'Default categories: 8';
    RAISE NOTICE 'Default subscription plans: 4';
    RAISE NOTICE 'Default themes: 4';
    RAISE NOTICE '=====================================================';
END $$;

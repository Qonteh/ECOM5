"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  Shield,
  Users,
  Zap,
  MapPin,
  Search,
  Star,
  Sparkles,
  ChevronRight,
  BadgeCheck,
  ShoppingBag,
  MessageCircle,
  CreditCard,
  Truck,
  Clock,
  Play,
  CheckCircle2,
  ArrowUpRight,
  Store,
  Smartphone,
  Globe,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ProductGrid } from "@/components/product-card";
import { CategoryGrid } from "@/components/category-card";
import { categories, regions, formatTZS } from "@/lib/data";
import { useThemeStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [regionCounts, setRegionCounts] = useState<Record<string, number>>({});
  const { themeId } = useThemeStore();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const data = await response.json();
          // Map DB products to frontend format (returned in data.products)
          const mappedProducts = (data.products || []).map((p: any) => ({
            id: p.id,
            title: p.title,
            price: p.price,
            currency: p.currency,
            images: p.images?.length
              ? p.images
              : p.primary_image
                ? [p.primary_image]
                : [
                    "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800",
                  ],
            categoryId: p.category_id,
            sellerName: p.seller_name || "Verified Seller",
            sellerVerified: p.seller_verified ?? true,
            location: p.region,
            condition: p.condition,
            featured: p.is_featured,
          }));
          setAllProducts(mappedProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
    async function fetchRegions() {
      try {
        const res = await fetch("/api/regions");
        if (res.ok) {
          const data = await res.json();
          const counts: Record<string, number> = {};
          data.forEach((r: any) => {
            counts[r.region] = parseInt(r.count, 10);
          });
          setRegionCounts(counts);
        }
      } catch (e) {
        console.error("Error fetching regions:", e);
      }
    }
    fetchRegions();
  }, []);

  const featuredProducts = allProducts.filter((p) => p.featured);
  const recentProducts = allProducts.slice(0, 8);

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* New Premium Hero Section */}
      <HeroSection />

      {/* Animated Stats Bar */}
      <AnimatedStatsBar />

      {/* Trust Badges */}
      <TrustSection />

      {/* Categories Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <SectionHeader
            badge="Browse"
            title="Shop by Category"
            subtitle="Find exactly what you need"
          />
          <CategoryGrid variant="large" />
          <div className="text-center mt-10">
            <Link href="/categories">
              <Button
                variant="outline"
                size="lg"
                className="gap-2 rounded-full px-8"
              >
                View All Categories <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <SectionHeader
            badge="Featured"
            title="Top Picks for You"
            subtitle="Handpicked premium listings from verified sellers"
            icon={<Star className="w-5 h-5" />}
          />
          <ProductGrid products={featuredProducts} columns={4} />
          <div className="text-center mt-10">
            <Link href="/featured">
              <Button size="lg" className="gap-2 rounded-full px-8">
                Explore All Featured <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <HowItWorksSection />

      {/* Recent Products */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <SectionHeader
            badge="Fresh"
            title="Just Listed"
            subtitle="Discover the newest additions to our marketplace"
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <ProductGrid products={recentProducts} columns={4} />
          <div className="text-center mt-10">
            <Link href="/recent">
              <Button
                variant="outline"
                size="lg"
                className="gap-2 rounded-full px-8"
              >
                See More Listings <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <BenefitsSection />

      {/* Regions Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <SectionHeader
            badge="Local"
            title="Shop by Region"
            subtitle="Find items near you across Tanzania"
            icon={<MapPin className="w-5 h-5" />}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {regions.slice(0, 12).map((region, idx) => (
              <Link
                key={region}
                href={`/region/${region.toLowerCase().replace(/\s+/g, "-")}`}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border p-5 text-center transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <MapPin className="w-6 h-6 mx-auto mb-2 text-primary" />
                <span className="font-medium text-sm block">{region}</span>
                <span className="text-xs text-muted-foreground">
                  {regionCounts[region] || 0} ads
                </span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/regions">
              <Button
                variant="outline"
                size="lg"
                className="gap-2 rounded-full px-8"
              >
                View All 26 Regions <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Final CTA */}
      <FinalCTASection />
    </div>
  );
}

// Hero Section
function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [activeWord, setActiveWord] = useState(0);
  const words = ["Electronics", "Vehicles", "Fashion", "Property", "Jobs"];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWord((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm font-medium text-primary">
              Tanzania&apos;s #1 Marketplace
            </span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight text-balance">
            Buy & Sell{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                {words[activeWord]}
              </span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/20 -z-10 rounded" />
            </span>
            <br />
            <span className="text-foreground">Across Tanzania</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto text-pretty leading-relaxed">
            Join over{" "}
            <span className="text-foreground font-semibold">100,000+</span>{" "}
            Tanzanians buying and selling on the most trusted marketplace.
          </p>

          {/* Search Box */}
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 p-3 bg-card/80 backdrop-blur-xl rounded-2xl border border-border shadow-2xl shadow-primary/5">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="What are you looking for?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-lg border-0 bg-transparent focus-visible:ring-0"
                />
              </div>
              <div className="hidden sm:block w-px bg-border" />
              <div className="relative flex-1 hidden sm:block">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <select
                  className="w-full h-14 pl-12 pr-4 rounded-xl bg-transparent border-0 text-base appearance-none cursor-pointer focus:ring-0 focus:outline-none"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Tanzania</option>
                  {regions.slice(0, 10).map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                size="lg"
                className="h-14 px-8 rounded-xl text-base font-semibold gap-2"
              >
                <Search className="w-5 h-5" />
                Search
              </Button>
            </div>
          </div>

          {/* Popular searches */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm text-muted-foreground">Popular:</span>
            {[
              "iPhone 15",
              "Toyota Hilux",
              "Apartment Rent",
              "Samsung TV",
              "Nike Shoes",
            ].map((term) => (
              <Link
                key={term}
                href={`/search?q=${term}`}
                className="px-4 py-2 rounded-full bg-muted/80 hover:bg-primary hover:text-primary-foreground text-sm transition-all duration-300 hover:scale-105"
              >
                {term}
              </Link>
            ))}
          </div>

          {/* Quick actions */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Link href="/sell">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 rounded-full px-8 h-12"
              >
                <Store className="w-5 h-5" />
                Post Free Ad
              </Button>
            </Link>
            <Link href="/benefits">
              <Button
                size="lg"
                variant="ghost"
                className="gap-2 rounded-full px-8 h-12"
              >
                How It Works
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-muted-foreground/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}

// Animated Stats Bar
function AnimatedStatsBar() {
  const [userCount, setUserCount] = useState<number | string>("...");
  const [listingCount, setListingCount] = useState<number | string>("...");

  useEffect(() => {
    async function fetchStats() {
      try {
        const [usersRes, productsRes] = await Promise.all([
          fetch("/api/users?limit=1"),
          fetch("/api/products?status=active&limit=1"),
        ]);

        if (usersRes.ok) {
          const uData = await usersRes.json();
          setUserCount(uData.total || 0);
        }
        if (productsRes.ok) {
          const pData = await productsRes.json();
          setListingCount(pData.total || 0);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    }
    fetchStats();
  }, []);

  const stats = [
    {
      value:
        typeof userCount === "number" ? userCount.toLocaleString() : userCount,
      label: "Active Users",
      icon: Users,
    },
    {
      value:
        typeof listingCount === "number"
          ? listingCount.toLocaleString()
          : listingCount,
      label: "Live Listings",
      icon: ShoppingBag,
    },
    { value: "26", label: "Regions", icon: MapPin },
    { value: "24/7", label: "Support", icon: MessageCircle },
  ];

  return (
    <section className="py-8 bg-foreground text-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-background/10 mb-3 group-hover:scale-110 transition-transform">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <p className="text-3xl md:text-4xl font-bold text-primary mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-background/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Trust Section
function TrustSection() {
  const badges = [
    { icon: Shield, text: "Buyer Protection" },
    { icon: BadgeCheck, text: "Verified Sellers" },
    { icon: Lock, text: "Secure Payments" },
    { icon: Truck, text: "Fast Delivery" },
    { icon: MessageCircle, text: "Direct Chat" },
    { icon: Clock, text: "24/7 Support" },
  ];

  return (
    <section className="py-12 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {badges.map((badge, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <badge.icon className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">{badge.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Section Header
function SectionHeader({
  badge,
  title,
  subtitle,
  icon,
}: {
  badge?: string;
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="text-center mb-12">
      {badge && (
        <Badge variant="secondary" className="mb-4 px-4 py-1 text-sm">
          {icon && <span className="mr-2">{icon}</span>}
          {badge}
        </Badge>
      )}
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
        {title}
      </h2>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
        {subtitle}
      </p>
    </div>
  );
}

// How It Works Section
function HowItWorksSection() {
  const steps = [
    {
      icon: Search,
      title: "Browse & Discover",
      description:
        "Search through thousands of listings across 8 categories and 26 regions.",
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: MessageCircle,
      title: "Chat with Sellers",
      description:
        "Message sellers directly, ask questions, negotiate prices in real-time.",
      color: "from-green-500/20 to-emerald-500/20",
    },
    {
      icon: CreditCard,
      title: "Pay Securely",
      description: "Use M-Pesa, Tigo Pesa, Airtel Money, or Cash on Delivery.",
      color: "from-purple-500/20 to-pink-500/20",
    },
    {
      icon: CheckCircle2,
      title: "Enjoy Your Purchase",
      description:
        "Receive your item and leave a review to help the community.",
      color: "from-orange-500/20 to-amber-500/20",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeader
          badge="Easy Steps"
          title="How Soko Works"
          subtitle="Buy and sell with confidence in just a few simple steps"
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <Card
              key={idx}
              className="relative overflow-hidden border-0 bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-100 transition-opacity`}
              />
              <CardContent className="p-6 relative">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-4xl font-bold text-muted-foreground/30">
                    0{idx + 1}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Benefits Section
function BenefitsSection() {
  return (
    <section className="py-16 md:py-24 bg-foreground text-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: For Buyers */}
          <div className="space-y-8">
            <Badge className="bg-primary/20 text-primary border-primary/30 px-4 py-1">
              For Buyers
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-balance">
              Shop Smarter,
              <br />
              <span className="text-primary">Save More</span>
            </h2>
            <div className="space-y-4">
              {[
                { icon: Shield, text: "Buyer protection on every purchase" },
                {
                  icon: MessageCircle,
                  text: "Chat directly with verified sellers",
                },
                {
                  icon: CreditCard,
                  text: "Multiple payment options including M-Pesa",
                },
                {
                  icon: MessageCircle,
                  text: "Save favorites and get price drop alerts",
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-background/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-lg text-background/80">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
            <Link href="/benefits/buyer">
              <Button size="lg" className="gap-2 rounded-full px-8">
                Learn More <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Right: For Sellers */}
          <div className="space-y-8">
            <Badge className="bg-accent/20 text-accent border-accent/30 px-4 py-1">
              For Sellers
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-balance">
              Grow Your
              <br />
              <span className="text-accent">Business</span>
            </h2>
            <div className="space-y-4">
              {[
                { icon: Zap, text: "Post free ads and reach millions" },
                {
                  icon: TrendingUp,
                  text: "Boost listings to get 10x more views",
                },
                { icon: Users, text: "Build your seller reputation" },
                { icon: Globe, text: "Sell across all 26 regions" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-background/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <item.icon className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-lg text-background/80">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
            <Link href="/benefits/seller">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 rounded-full px-8"
              >
                Start Selling <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// Testimonials Section
function TestimonialsSection() {
  const testimonials = [
    {
      name: "Amina Hassan",
      role: "Buyer from Dar es Salaam",
      text: "Found my dream car at an amazing price. The seller was verified and the whole process was smooth!",
      rating: 5,
    },
    {
      name: "John Mwangi",
      role: "Seller, Electronics Shop",
      text: "My business grew 300% after joining Soko. The platform makes it so easy to reach customers.",
      rating: 5,
    },
    {
      name: "Grace Kimaro",
      role: "Buyer from Arusha",
      text: "Love the chat feature! I can negotiate directly with sellers and get the best deals.",
      rating: 5,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeader
          badge="Reviews"
          title="Loved by Thousands"
          subtitle="See what our community has to say"
          icon={<MessageCircle className="w-5 h-5" />}
        />
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <Card
              key={idx}
              className="border-0 bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-lg mb-6 text-muted-foreground leading-relaxed">
                  &quot;{testimonial.text}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Final CTA Section
function FinalCTASection() {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-1">
            <Sparkles className="w-4 h-4 mr-2" />
            Get Started Today
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
            Ready to Join{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Tanzania&apos;s
            </span>
            <br />
            Largest Marketplace?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-pretty">
            Whether you want to buy, sell, or both - Soko is here to help you
            succeed. Join today and start your journey!
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/auth/register">
              <Button
                size="lg"
                className="gap-2 rounded-full px-10 h-14 text-lg"
              >
                Create Free Account <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/sell">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 rounded-full px-10 h-14 text-lg"
              >
                <Store className="w-5 h-5" />
                Start Selling
              </Button>
            </Link>
          </div>
          <p className="mt-8 text-sm text-muted-foreground">
            No credit card required. Free to join.
          </p>
        </div>
      </div>
    </section>
  );
}

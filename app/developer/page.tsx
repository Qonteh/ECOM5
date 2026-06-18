"use client";

import { useState } from "react";
import {
  DollarSign,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Star,
  Megaphone,
  Eye,
  ShoppingCart,
  BarChart3,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatTZS } from "@/lib/data";
import { subscriptionPlans } from "@/lib/store";

// Mock data for developer dashboard
const platformStats = {
  totalRevenue: 12500000,
  monthlyRevenue: 2350000,
  revenueGrowth: 23.5,
  totalUsers: 105420,
  newUsersThisMonth: 3420,
  userGrowth: 12.3,
  totalSellers: 8540,
  totalBuyers: 96880,
  totalProducts: 52340,
  activeProducts: 48200,
  totalOrders: 15680,
  ordersThisMonth: 2340,

  // Revenue breakdown
  subscriptionRevenue: 4500000,
  featuredListingRevenue: 3200000,
  promotedAdsRevenue: 2800000,
  transactionFees: 2000000,

  // Conversion metrics
  conversionRate: 3.2,
  avgOrderValue: 125000,
  repeatCustomerRate: 28.5,
};

const recentTransactions = [
  {
    id: "1",
    type: "subscription",
    user: "John Mwangi",
    plan: "Premium",
    amount: 50000,
    date: "2 hours ago",
  },
  {
    id: "2",
    type: "featured",
    user: "Amina Hassan",
    product: "Toyota Vitz 2018",
    amount: 15000,
    date: "3 hours ago",
  },
  {
    id: "3",
    type: "subscription",
    user: "Peter Kimaro",
    plan: "Business",
    amount: 150000,
    date: "5 hours ago",
  },
  {
    id: "4",
    type: "promoted",
    user: "Grace Mbeki",
    product: "iPhone 14 Pro",
    amount: 25000,
    date: "6 hours ago",
  },
  {
    id: "5",
    type: "transaction_fee",
    user: "System",
    product: "Order #12345",
    amount: 5000,
    date: "8 hours ago",
  },
];

const topSellers = [
  {
    id: "1",
    name: "Electronics Plus",
    revenue: 2500000,
    products: 156,
    rating: 4.8,
  },
  {
    id: "2",
    name: "Auto Deals TZ",
    revenue: 1800000,
    products: 45,
    rating: 4.9,
  },
  {
    id: "3",
    name: "Fashion Hub",
    revenue: 1200000,
    products: 320,
    rating: 4.7,
  },
  {
    id: "4",
    name: "Home & Living",
    revenue: 950000,
    products: 210,
    rating: 4.6,
  },
  { id: "5", name: "Tech World", revenue: 820000, products: 89, rating: 4.8 },
];

export default function DeveloperDashboard() {
  const [period, setPeriod] = useState<"today" | "week" | "month" | "year">(
    "month",
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Developer Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your platform performance and revenue
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs
            value={period}
            onValueChange={(v) => setPeriod(v as typeof period)}
          >
            <TabsList>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Revenue Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Total Revenue</p>
                <p className="text-3xl font-bold mt-1">
                  {formatTZS(platformStats.totalRevenue)}
                </p>
                <p className="text-sm mt-2 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />+
                  {platformStats.revenueGrowth}% this month
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold mt-1">
                  {platformStats.totalUsers.toLocaleString()}
                </p>
                <p className="text-sm mt-2 flex items-center gap-1 text-green-600">
                  <ArrowUpRight className="w-4 h-4" />+
                  {platformStats.newUsersThisMonth.toLocaleString()} new
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Listings</p>
                <p className="text-3xl font-bold mt-1">
                  {platformStats.activeProducts.toLocaleString()}
                </p>
                <p className="text-sm mt-2 flex items-center gap-1 text-green-600">
                  <ArrowUpRight className="w-4 h-4" />
                  +8.2% growth
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Package className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Orders This Month
                </p>
                <p className="text-3xl font-bold mt-1">
                  {platformStats.ordersThisMonth.toLocaleString()}
                </p>
                <p className="text-sm mt-2 flex items-center gap-1 text-green-600">
                  <ArrowUpRight className="w-4 h-4" />
                  +15.3% growth
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Revenue Breakdown
            </CardTitle>
            <CardDescription>
              Your income sources for this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <RevenueBar
                label="Subscriptions"
                amount={platformStats.subscriptionRevenue}
                total={platformStats.totalRevenue}
                color="bg-blue-500"
                icon={<CreditCard className="w-4 h-4" />}
              />
              <RevenueBar
                label="Featured Listings"
                amount={platformStats.featuredListingRevenue}
                total={platformStats.totalRevenue}
                color="bg-yellow-500"
                icon={<Star className="w-4 h-4" />}
              />
              <RevenueBar
                label="Promoted Ads"
                amount={platformStats.promotedAdsRevenue}
                total={platformStats.totalRevenue}
                color="bg-purple-500"
                icon={<Megaphone className="w-4 h-4" />}
              />
              <RevenueBar
                label="Transaction Fees"
                amount={platformStats.transactionFees}
                total={platformStats.totalRevenue}
                color="bg-green-500"
                icon={<DollarSign className="w-4 h-4" />}
              />
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">
                    {platformStats.conversionRate}%
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Conversion Rate
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {formatTZS(platformStats.avgOrderValue)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Avg Order Value
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {platformStats.repeatCustomerRate}%
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Repeat Customers
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Platform overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Sellers</p>
                  <p className="text-sm text-muted-foreground">
                    Active accounts
                  </p>
                </div>
              </div>
              <p className="font-bold">
                {platformStats.totalSellers.toLocaleString()}
              </p>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Buyers</p>
                  <p className="text-sm text-muted-foreground">
                    Active accounts
                  </p>
                </div>
              </div>
              <p className="font-bold">
                {platformStats.totalBuyers.toLocaleString()}
              </p>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Package className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Products</p>
                  <p className="text-sm text-muted-foreground">
                    Total listings
                  </p>
                </div>
              </div>
              <p className="font-bold">
                {platformStats.totalProducts.toLocaleString()}
              </p>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium">Page Views</p>
                  <p className="text-sm text-muted-foreground">This month</p>
                </div>
              </div>
              <p className="font-bold">1.2M</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Plans Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Subscription Plans Performance
          </CardTitle>
          <CardDescription>Revenue from each subscription tier</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {subscriptionPlans.map((plan) => (
              <div
                key={plan.id}
                className={`p-4 rounded-xl border-2 ${
                  plan.popular ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                {plan.popular && <Badge className="mb-2">Most Popular</Badge>}
                <h3 className="font-bold text-lg">{plan.name}</h3>
                <p className="text-2xl font-bold text-primary mt-1">
                  {plan.price === 0 ? "Free" : formatTZS(plan.price)}
                  {plan.price > 0 && (
                    <span className="text-sm font-normal text-muted-foreground">
                      /mo
                    </span>
                  )}
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subscribers</span>
                    <span className="font-medium">
                      {plan.id === "free"
                        ? "85,420"
                        : plan.id === "basic"
                          ? "12,340"
                          : plan.id === "premium"
                            ? "5,890"
                            : "1,770"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Revenue</span>
                    <span className="font-medium">
                      {plan.id === "free"
                        ? "TZS 0"
                        : plan.id === "basic"
                          ? "TZS 185M"
                          : plan.id === "premium"
                            ? "TZS 294M"
                            : "TZS 265M"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions & Top Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Revenue</CardTitle>
            <CardDescription>
              Latest transactions on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        tx.type === "subscription"
                          ? "bg-blue-100 text-blue-600"
                          : tx.type === "featured"
                            ? "bg-yellow-100 text-yellow-600"
                            : tx.type === "promoted"
                              ? "bg-purple-100 text-purple-600"
                              : "bg-green-100 text-green-600"
                      }`}
                    >
                      {tx.type === "subscription" ? (
                        <CreditCard className="w-5 h-5" />
                      ) : tx.type === "featured" ? (
                        <Star className="w-5 h-5" />
                      ) : tx.type === "promoted" ? (
                        <Megaphone className="w-5 h-5" />
                      ) : (
                        <DollarSign className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{tx.user}</p>
                      <p className="text-xs text-muted-foreground">
                        {tx.type === "subscription"
                          ? `${tx.plan} Plan`
                          : tx.product}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-green-600">
                      +{formatTZS(tx.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Transactions
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Sellers</CardTitle>
            <CardDescription>Highest revenue generators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSellers.map((seller, i) => (
                <div
                  key={seller.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{seller.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {seller.products} products | {seller.rating} rating
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">
                      {formatTZS(seller.revenue)}
                    </p>
                    <p className="text-xs text-muted-foreground">revenue</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Sellers
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function RevenueBar({
  label,
  amount,
  total,
  color,
  icon,
}: {
  label: string;
  amount: number;
  total: number;
  color: string;
  icon: React.ReactNode;
}) {
  const percentage = (amount / total) * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-lg ${color.replace("bg-", "bg-")}/20 flex items-center justify-center`}
          >
            <div
              className={color.replace("bg-", "text-").replace("-500", "-600")}
            >
              {icon}
            </div>
          </div>
          <span className="font-medium text-sm">{label}</span>
        </div>
        <div className="text-right">
          <span className="font-bold">{formatTZS(amount)}</span>
          <span className="text-sm text-muted-foreground ml-2">
            ({percentage.toFixed(1)}%)
          </span>
        </div>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

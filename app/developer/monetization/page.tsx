"use client";

import { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingBag,
  Percent,
  CreditCard,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Megaphone,
  Star,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  PiggyBank,
  Wallet,
  Receipt,
  BadgeDollarSign,
  Sparkles,
  Target,
  Zap,
  Crown,
  Gift,
  Coins,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

// Mock revenue data
const revenueStreams = {
  transactionFees: {
    name: "Transaction Fees (2%)",
    description: "Commission on every sale",
    totalRevenue: 45678500,
    thisMonth: 8945000,
    lastMonth: 7823000,
    growth: 14.3,
    transactions: 4567,
  },
  listingFees: {
    name: "Listing Fees",
    description: "Base fee per product listing",
    totalRevenue: 12340000,
    thisMonth: 2340000,
    lastMonth: 2100000,
    growth: 11.4,
    transactions: 4680,
  },
  featuredListings: {
    name: "Featured Listings",
    description: "Premium visibility boost",
    totalRevenue: 8750000,
    thisMonth: 1560000,
    lastMonth: 1320000,
    growth: 18.2,
    transactions: 156,
  },
  urgentBadges: {
    name: "Urgent Sale Badges",
    description: "Quick sale promotion",
    totalRevenue: 3450000,
    thisMonth: 620000,
    lastMonth: 545000,
    growth: 13.8,
    transactions: 124,
  },
  premiumSellers: {
    name: "Premium Seller Subscriptions",
    description: "Monthly seller memberships",
    totalRevenue: 15670000,
    thisMonth: 2890000,
    lastMonth: 2650000,
    growth: 9.1,
    transactions: 289,
  },
  advertisements: {
    name: "Banner Advertisements",
    description: "Ad placements across the site",
    totalRevenue: 22340000,
    thisMonth: 4120000,
    lastMonth: 3780000,
    growth: 9.0,
    transactions: 45,
  },
  affiliateCommissions: {
    name: "Affiliate Commissions",
    description: "Partner referral revenue",
    totalRevenue: 5670000,
    thisMonth: 980000,
    lastMonth: 870000,
    growth: 12.6,
    transactions: 234,
  },
};

// Pending payouts
const pendingPayouts = [
  {
    id: 1,
    seller: "TechMart Tanzania",
    amount: 450000,
    date: "2024-01-20",
    status: "processing",
  },
  {
    id: 2,
    seller: "Fashion House DSM",
    amount: 320000,
    date: "2024-01-20",
    status: "pending",
  },
  {
    id: 3,
    seller: "Auto Parts Plus",
    amount: 890000,
    date: "2024-01-21",
    status: "pending",
  },
  {
    id: 4,
    seller: "Home Essentials",
    amount: 234000,
    date: "2024-01-21",
    status: "processing",
  },
  {
    id: 5,
    seller: "Mobile World TZ",
    amount: 567000,
    date: "2024-01-22",
    status: "pending",
  },
];

// Premium subscription plans
const subscriptionPlans = [
  {
    name: "Basic Seller",
    price: 0,
    features: ["5 listings/month", "2% transaction fee", "Basic analytics"],
    subscribers: 3456,
    revenue: 0,
  },
  {
    name: "Pro Seller",
    price: 25000,
    features: [
      "50 listings/month",
      "1.5% transaction fee",
      "Advanced analytics",
      "Priority support",
    ],
    subscribers: 567,
    revenue: 14175000,
  },
  {
    name: "Business",
    price: 75000,
    features: [
      "Unlimited listings",
      "1% transaction fee",
      "Full analytics",
      "Dedicated support",
      "API access",
    ],
    subscribers: 123,
    revenue: 9225000,
  },
  {
    name: "Enterprise",
    price: 200000,
    features: [
      "Everything in Business",
      "Custom branding",
      "White-label options",
      "SLA guarantee",
    ],
    subscribers: 12,
    revenue: 2400000,
  },
];

// Ad placements
const adPlacements = [
  {
    position: "Homepage Banner",
    impressions: 1250000,
    clicks: 45000,
    ctr: 3.6,
    revenue: 4500000,
  },
  {
    position: "Category Sidebar",
    impressions: 890000,
    clicks: 28000,
    ctr: 3.1,
    revenue: 2800000,
  },
  {
    position: "Search Results",
    impressions: 2340000,
    clicks: 89000,
    ctr: 3.8,
    revenue: 8900000,
  },
  {
    position: "Product Page",
    impressions: 1560000,
    clicks: 52000,
    ctr: 3.3,
    revenue: 5200000,
  },
  {
    position: "Mobile App",
    impressions: 670000,
    clicks: 21000,
    ctr: 3.1,
    revenue: 2100000,
  },
];

// Monetization ideas
const monetizationIdeas = [
  {
    title: "Escrow Service",
    description:
      "Charge 1-2% for secure payment holding until delivery confirmed",
    potentialRevenue: "TZS 5-10M/month",
    difficulty: "Medium",
    implemented: false,
  },
  {
    title: "Delivery Partnership",
    description: "Partner with delivery companies and take 5-10% commission",
    potentialRevenue: "TZS 3-5M/month",
    difficulty: "Medium",
    implemented: false,
  },
  {
    title: "Verified Seller Badge",
    description: "Charge for verification and trust badges",
    potentialRevenue: "TZS 2-3M/month",
    difficulty: "Easy",
    implemented: true,
  },
  {
    title: "Storefront Customization",
    description: "Premium storefront themes and branding options",
    potentialRevenue: "TZS 1-2M/month",
    difficulty: "Easy",
    implemented: false,
  },
  {
    title: "Insurance Partnership",
    description:
      "Offer product insurance with commission from insurance providers",
    potentialRevenue: "TZS 2-4M/month",
    difficulty: "Hard",
    implemented: false,
  },
  {
    title: "Business Loans",
    description: "Partner with microfinance institutions for seller loans",
    potentialRevenue: "TZS 3-6M/month",
    difficulty: "Hard",
    implemented: false,
  },
  {
    title: "Data Analytics Service",
    description: "Sell market insights and trend reports to businesses",
    potentialRevenue: "TZS 1-3M/month",
    difficulty: "Medium",
    implemented: false,
  },
  {
    title: "API Access Fees",
    description: "Charge for API access for third-party integrations",
    potentialRevenue: "TZS 500K-1M/month",
    difficulty: "Easy",
    implemented: false,
  },
];

export default function MonetizationPage() {
  const [dateRange, setDateRange] = useState("this_month");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const totalRevenue = Object.values(revenueStreams).reduce(
    (sum, stream) => sum + stream.thisMonth,
    0,
  );
  const totalLastMonth = Object.values(revenueStreams).reduce(
    (sum, stream) => sum + stream.lastMonth,
    0,
  );
  const overallGrowth =
    ((totalRevenue - totalLastMonth) / totalLastMonth) * 100;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BadgeDollarSign className="w-6 h-6 text-primary" />
            Revenue & Monetization
          </h1>
          <p className="text-muted-foreground">
            Track your platform earnings and explore revenue opportunities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this_week">This Week</SelectItem>
              <SelectItem value="this_month">This Month</SelectItem>
              <SelectItem value="last_month">Last Month</SelectItem>
              <SelectItem value="this_year">This Year</SelectItem>
              <SelectItem value="all_time">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">
                  TZS {(totalRevenue / 1000000).toFixed(1)}M
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {overallGrowth >= 0 ? (
                    <ArrowUpRight className="w-4 h-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-600" />
                  )}
                  <span
                    className={`text-sm ${overallGrowth >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {overallGrowth.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Transaction Fees
                </p>
                <p className="text-2xl font-bold">
                  TZS{" "}
                  {(revenueStreams.transactionFees.thisMonth / 1000000).toFixed(
                    1,
                  )}
                  M
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">
                    {revenueStreams.transactionFees.growth}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Percent className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Subscriptions</p>
                <p className="text-2xl font-bold">
                  TZS{" "}
                  {(revenueStreams.premiumSellers.thisMonth / 1000000).toFixed(
                    1,
                  )}
                  M
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">
                    {revenueStreams.premiumSellers.growth}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Crown className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Advertising</p>
                <p className="text-2xl font-bold">
                  TZS{" "}
                  {(revenueStreams.advertisements.thisMonth / 1000000).toFixed(
                    1,
                  )}
                  M
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">
                    {revenueStreams.advertisements.growth}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Megaphone className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-2 lg:grid-cols-5 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="advertising">Advertising</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Revenue Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Streams Breakdown</CardTitle>
              <CardDescription>
                Performance of each monetization channel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(revenueStreams).map(([key, stream]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{stream.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {stream.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">
                          TZS {stream.thisMonth.toLocaleString()}
                        </p>
                        <div className="flex items-center gap-1 justify-end">
                          {stream.growth >= 0 ? (
                            <TrendingUp className="w-3 h-3 text-green-600" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-red-600" />
                          )}
                          <span
                            className={`text-xs ${stream.growth >= 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {stream.growth}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <Progress
                      value={(stream.thisMonth / totalRevenue) * 100}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Pending Payouts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  Pending Seller Payouts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingPayouts.map((payout) => (
                    <div
                      key={payout.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-sm">{payout.seller}</p>
                        <p className="text-xs text-muted-foreground">
                          {payout.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">
                          TZS {payout.amount.toLocaleString()}
                        </p>
                        <Badge
                          variant={
                            payout.status === "processing"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {payout.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Payouts
                </Button>
              </CardContent>
            </Card>

            {/* Platform Fees */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="w-5 h-5" />
                  Fee Structure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border border-border rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Transaction Fee</span>
                      <Badge>2%</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Applied on every successful sale
                    </p>
                  </div>
                  <div className="p-3 border border-border rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Listing Fee</span>
                      <Badge variant="secondary">TZS 500</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Per product listing (on sale)
                    </p>
                  </div>
                  <div className="p-3 border border-border rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Featured Listing</span>
                      <Badge variant="secondary">TZS 10,000</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      7-day premium visibility
                    </p>
                  </div>
                  <div className="p-3 border border-border rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Urgent Badge</span>
                      <Badge variant="secondary">TZS 5,000</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Quick sale promotion tag
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Edit Fee Structure
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Fee Revenue</CardTitle>
              <CardDescription>
                Revenue from the 2% commission on all sales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-2xl font-bold">
                    {revenueStreams.transactionFees.transactions.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total Transactions
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-2xl font-bold">
                    TZS{" "}
                    {(
                      revenueStreams.transactionFees.thisMonth / 1000000
                    ).toFixed(1)}
                    M
                  </p>
                  <p className="text-sm text-muted-foreground">This Month</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-2xl font-bold">
                    TZS{" "}
                    {(
                      revenueStreams.transactionFees.totalRevenue / 1000000
                    ).toFixed(1)}
                    M
                  </p>
                  <p className="text-sm text-muted-foreground">All Time</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">
                    +{revenueStreams.transactionFees.growth}%
                  </p>
                  <p className="text-sm text-muted-foreground">Growth</p>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h4 className="font-medium">Fee Optimization Tips</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-primary" />
                      <span className="font-medium">Increase GMV</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Focus on bringing more sellers and promoting high-value
                      categories to increase Gross Merchandise Value.
                    </p>
                  </div>
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-primary" />
                      <span className="font-medium">Reduce Friction</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Simplify checkout process and add more payment options to
                      increase conversion rates.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Listing Fees */}
          <Card>
            <CardHeader>
              <CardTitle>Listing & Promotion Fees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingBag className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Base Listings</span>
                  </div>
                  <p className="text-2xl font-bold">
                    TZS {revenueStreams.listingFees.thisMonth.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {revenueStreams.listingFees.transactions} listings
                  </p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium">Featured</span>
                  </div>
                  <p className="text-2xl font-bold">
                    TZS{" "}
                    {revenueStreams.featuredListings.thisMonth.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {revenueStreams.featuredListings.transactions} listings
                  </p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-red-600" />
                    <span className="font-medium">Urgent Badges</span>
                  </div>
                  <p className="text-2xl font-bold">
                    TZS {revenueStreams.urgentBadges.thisMonth.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {revenueStreams.urgentBadges.transactions} badges
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscriptions Tab */}
        <TabsContent value="subscriptions" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {subscriptionPlans.map((plan, index) => (
              <Card
                key={plan.name}
                className={index === 2 ? "border-primary" : ""}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    {index === 2 && <Badge>Popular</Badge>}
                  </div>
                  <CardDescription>
                    {plan.price === 0
                      ? "Free"
                      : `TZS ${plan.price.toLocaleString()}/mo`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <ul className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Separator />
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Subscribers
                        </span>
                        <span className="font-bold">
                          {plan.subscribers.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Monthly Revenue
                        </span>
                        <span className="font-bold">
                          TZS {plan.revenue.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Subscription Revenue Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-primary/5 rounded-lg text-center">
                  <p className="text-3xl font-bold">
                    {subscriptionPlans
                      .reduce((sum, plan) => sum + plan.subscribers, 0)
                      .toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total Subscribers
                  </p>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg text-center">
                  <p className="text-3xl font-bold">
                    TZS{" "}
                    {(
                      subscriptionPlans.reduce(
                        (sum, plan) => sum + plan.revenue,
                        0,
                      ) / 1000000
                    ).toFixed(1)}
                    M
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Monthly Recurring Revenue
                  </p>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg text-center">
                  <p className="text-3xl font-bold">
                    TZS{" "}
                    {Math.round(
                      subscriptionPlans.reduce(
                        (sum, plan) => sum + plan.revenue,
                        0,
                      ) /
                        subscriptionPlans.reduce(
                          (sum, plan) => sum + plan.subscribers,
                          0,
                        ),
                    ).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Average Revenue Per User
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advertising Tab */}
        <TabsContent value="advertising" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ad Placement Performance</CardTitle>
              <CardDescription>
                Revenue and engagement by ad position
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4">Position</th>
                      <th className="text-right py-3 px-4">Impressions</th>
                      <th className="text-right py-3 px-4">Clicks</th>
                      <th className="text-right py-3 px-4">CTR</th>
                      <th className="text-right py-3 px-4">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adPlacements.map((ad) => (
                      <tr key={ad.position} className="border-b border-border">
                        <td className="py-3 px-4 font-medium">{ad.position}</td>
                        <td className="text-right py-3 px-4">
                          {ad.impressions.toLocaleString()}
                        </td>
                        <td className="text-right py-3 px-4">
                          {ad.clicks.toLocaleString()}
                        </td>
                        <td className="text-right py-3 px-4">
                          <Badge variant="outline">{ad.ctr}%</Badge>
                        </td>
                        <td className="text-right py-3 px-4 font-bold">
                          TZS {ad.revenue.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-muted/50">
                      <td className="py-3 px-4 font-bold">Total</td>
                      <td className="text-right py-3 px-4 font-bold">
                        {adPlacements
                          .reduce((sum, ad) => sum + ad.impressions, 0)
                          .toLocaleString()}
                      </td>
                      <td className="text-right py-3 px-4 font-bold">
                        {adPlacements
                          .reduce((sum, ad) => sum + ad.clicks, 0)
                          .toLocaleString()}
                      </td>
                      <td className="text-right py-3 px-4 font-bold">
                        <Badge>
                          {(
                            (adPlacements.reduce(
                              (sum, ad) => sum + ad.clicks,
                              0,
                            ) /
                              adPlacements.reduce(
                                (sum, ad) => sum + ad.impressions,
                                0,
                              )) *
                            100
                          ).toFixed(1)}
                          %
                        </Badge>
                      </td>
                      <td className="text-right py-3 px-4 font-bold">
                        TZS{" "}
                        {adPlacements
                          .reduce((sum, ad) => sum + ad.revenue, 0)
                          .toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ad Pricing Tiers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-bold text-lg mb-2">Standard</h4>
                  <p className="text-2xl font-bold">TZS 50/CPM</p>
                  <p className="text-sm text-muted-foreground">
                    Cost per 1000 impressions
                  </p>
                  <ul className="mt-4 space-y-2 text-sm">
                    <li>Category sidebar</li>
                    <li>Search results (bottom)</li>
                  </ul>
                </div>
                <div className="p-4 border border-primary rounded-lg">
                  <h4 className="font-bold text-lg mb-2">Premium</h4>
                  <p className="text-2xl font-bold">TZS 100/CPM</p>
                  <p className="text-sm text-muted-foreground">
                    Cost per 1000 impressions
                  </p>
                  <ul className="mt-4 space-y-2 text-sm">
                    <li>Homepage banner</li>
                    <li>Search results (top)</li>
                  </ul>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-bold text-lg mb-2">Exclusive</h4>
                  <p className="text-2xl font-bold">TZS 200/CPM</p>
                  <p className="text-sm text-muted-foreground">
                    Cost per 1000 impressions
                  </p>
                  <ul className="mt-4 space-y-2 text-sm">
                    <li>Product page takeover</li>
                    <li>Category sponsorship</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Opportunities Tab */}
        <TabsContent value="opportunities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                Revenue Opportunities
              </CardTitle>
              <CardDescription>
                Potential new monetization strategies to grow your platform
                revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {monetizationIdeas.map((idea) => (
                  <div
                    key={idea.title}
                    className={`p-4 border rounded-lg ${idea.implemented ? "border-green-200 bg-green-50" : "border-border"}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold">{idea.title}</h4>
                      {idea.implemented ? (
                        <Badge variant="default" className="bg-green-600">
                          Implemented
                        </Badge>
                      ) : (
                        <Badge variant="outline">{idea.difficulty}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {idea.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">
                        <span className="text-muted-foreground">
                          Potential:{" "}
                        </span>
                        <span className="font-bold text-green-600">
                          {idea.potentialRevenue}
                        </span>
                      </span>
                      {!idea.implemented && (
                        <Button size="sm" variant="outline">
                          Implement
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Revenue Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Revenue Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Monthly Target: TZS 30M</span>
                    <span className="font-bold">
                      {((totalRevenue / 30000000) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <Progress
                    value={(totalRevenue / 30000000) * 100}
                    className="h-3"
                  />
                  <p className="text-sm text-muted-foreground">
                    TZS {(30000000 - totalRevenue).toLocaleString()} to go
                  </p>
                </div>

                <Separator />

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <Gift className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="font-bold">TZS 50M</p>
                    <p className="text-sm text-muted-foreground">Q1 Target</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <Coins className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="font-bold">TZS 250M</p>
                    <p className="text-sm text-muted-foreground">
                      Annual Target
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <PiggyBank className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="font-bold">TZS 1B</p>
                    <p className="text-sm text-muted-foreground">3-Year Goal</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

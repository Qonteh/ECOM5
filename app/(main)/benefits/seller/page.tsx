"use client";

import Link from "next/link";
import {
  Store,
  TrendingUp,
  Users,
  CreditCard,
  BarChart3,
  Shield,
  Star,
  Package,
  MessageCircle,
  Smartphone,
  Globe,
  BadgeCheck,
  ArrowRight,
  CheckCircle2,
  Zap,
  DollarSign,
  Camera,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { subscriptionPlans } from "@/lib/store";
import { formatTZS } from "@/lib/data";

const sellerBenefits = [
  {
    icon: Users,
    title: "Access 100K+ Buyers",
    description:
      "Reach a massive audience of active buyers across all 26 regions of Tanzania looking for products like yours.",
  },
  {
    icon: Globe,
    title: "Nationwide Reach",
    description:
      "Sell to customers anywhere in Tanzania without the need for a physical store in every location.",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description:
      "Receive payments safely through M-Pesa, Tigo Pesa, Airtel Money, or direct bank transfer.",
  },
  {
    icon: MessageCircle,
    title: "Direct Customer Chat",
    description:
      "Communicate directly with interested buyers to answer questions and close sales faster.",
  },
  {
    icon: BarChart3,
    title: "Sales Analytics",
    description:
      "Track your views, favorites, and sales with detailed analytics to grow your business.",
  },
  {
    icon: Zap,
    title: "Promoted Listings",
    description:
      "Boost your products visibility with featured and promoted listing options for faster sales.",
  },
  {
    icon: BadgeCheck,
    title: "Verified Seller Badge",
    description:
      "Get verified to build trust with buyers and stand out from the competition.",
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description:
      "Manage your shop on the go with our mobile-optimized platform and upcoming app.",
  },
];

const sellerSteps = [
  {
    step: 1,
    title: "Create Your Seller Account",
    description:
      "Sign up for free and complete your seller profile with business information and verification.",
  },
  {
    step: 2,
    title: "List Your Products",
    description:
      "Add your products with photos, descriptions, and pricing. Our tools make listing fast and easy.",
  },
  {
    step: 3,
    title: "Receive Inquiries",
    description:
      "Get notified when buyers are interested. Chat directly to answer questions and negotiate.",
  },
  {
    step: 4,
    title: "Close the Sale",
    description:
      "Accept payments securely through our platform and arrange delivery with the buyer.",
  },
  {
    step: 5,
    title: "Grow Your Business",
    description:
      "Use analytics to understand your customers, promote top products, and scale your sales.",
  },
];

const successStories = [
  {
    name: "TechHub Tanzania",
    category: "Electronics",
    sales: "500+ items sold",
    text: "We grew from a small shop in Kariakoo to serving customers nationwide. Soko helped us reach buyers we never could before.",
  },
  {
    name: "Mama Africa Fashions",
    category: "Fashion",
    sales: "1000+ items sold",
    text: "My kitenge business exploded after joining Soko. The chat feature helps me understand exactly what customers want.",
  },
  {
    name: "Green Valley Farm",
    category: "Agriculture",
    sales: "200+ orders",
    text: "Selling fresh produce online was a game changer. We now supply vegetables to hotels and restaurants across Dar.",
  },
];

export default function SellerBenefitsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              For Sellers
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
              Grow Your Business <span className="text-primary">Online</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              Join thousands of successful Tanzanian sellers on Soko. Reach
              buyers across all regions, manage your shop easily, and watch your
              business grow.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="gap-2">
                  Start Selling Free <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/sell">
                <Button size="lg" variant="outline">
                  Post Your First Ad
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="border-t border-border bg-muted/30">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-3xl md:text-4xl font-bold text-primary">
                  10K+
                </p>
                <p className="text-sm text-muted-foreground">Active Sellers</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-primary">
                  100K+
                </p>
                <p className="text-sm text-muted-foreground">Monthly Buyers</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-primary">
                  1M+
                </p>
                <p className="text-sm text-muted-foreground">
                  TZS in Daily Sales
                </p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-primary">
                  24h
                </p>
                <p className="text-sm text-muted-foreground">
                  Avg. Time to First Sale
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Sell on Soko?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to start, manage, and grow your online
              business in Tanzania.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sellerBenefits.map((benefit) => (
              <Card
                key={benefit.title}
                className="border-2 hover:border-primary/50 transition-colors"
              >
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Start Selling in 5 Steps
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              It takes just minutes to set up your seller account and start
              listing products.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {sellerSteps.map((step, index) => (
                <div key={step.step} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                      {step.step}
                    </div>
                    {index < sellerSteps.length - 1 && (
                      <div className="w-0.5 h-full bg-border mt-2" />
                    )}
                  </div>
                  <Card className="flex-1">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Start free and upgrade as your business grows. All plans include
              core selling features.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {subscriptionPlans.map((plan) => (
              <Card
                key={plan.id}
                className={
                  plan.popular ? "border-2 border-primary relative" : ""
                }
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-center">
                    <span className="text-lg">{plan.name}</span>
                    <div className="mt-2">
                      <span className="text-3xl font-bold">
                        {plan.price === 0 ? "Free" : formatTZS(plan.price)}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-sm text-muted-foreground">
                          /month
                        </span>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm"
                      >
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full mt-6"
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.price === 0 ? "Start Free" : "Get Started"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Seller Success Stories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real sellers, real results. See how businesses are thriving on
              Soko.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {successStories.map((story) => (
              <Card key={story.name}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Store className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{story.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="secondary">{story.category}</Badge>
                        <span>{story.sales}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    &quot;{story.text}&quot;
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tips for Success */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Tips for Seller Success</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Follow these best practices to maximize your sales on Soko.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Camera,
                title: "Use Quality Photos",
                description:
                  "Products with clear, well-lit photos get 3x more views. Show multiple angles.",
              },
              {
                icon: Clock,
                title: "Respond Quickly",
                description:
                  "Sellers who respond within 1 hour are 5x more likely to close the sale.",
              },
              {
                icon: DollarSign,
                title: "Price Competitively",
                description:
                  "Research similar listings and price fairly. Buyers compare across sellers.",
              },
              {
                icon: BadgeCheck,
                title: "Get Verified",
                description:
                  "Verified sellers see 40% more inquiries. Complete your profile verification.",
              },
              {
                icon: Star,
                title: "Earn Good Reviews",
                description:
                  "Deliver quality products and great service. Reviews build trust with buyers.",
              },
              {
                icon: TrendingUp,
                title: "Promote Top Items",
                description:
                  "Use featured and promoted listings for your best products to boost visibility.",
              },
            ].map((tip) => (
              <Card key={tip.title}>
                <CardContent className="pt-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <tip.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{tip.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {tip.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Selling?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of successful sellers on Soko. Create your free
            account and post your first listing today.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" variant="secondary" className="gap-2">
                Create Seller Account
              </Button>
            </Link>
            <Link href="/sell">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Post Free Ad
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

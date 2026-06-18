"use client";

import Link from "next/link";
import {
  ShoppingBag,
  Shield,
  MessageCircle,
  Truck,
  Tag,
  Smartphone,
  CreditCard,
  Clock,
  Star,
  MapPin,
  Bell,
  Gift,
  Percent,
  Search,
  BadgeCheck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatTZS } from "@/lib/data";

const buyerBenefits = [
  {
    icon: Search,
    title: "Easy Product Discovery",
    description:
      "Find what you need quickly with smart search, filters, and category browsing across all 26 Tanzanian regions.",
  },
  {
    icon: Shield,
    title: "Secure Transactions",
    description:
      "Shop with confidence using secure payment methods including M-Pesa, Tigo Pesa, and Airtel Money.",
  },
  {
    icon: MessageCircle,
    title: "Direct Communication",
    description:
      "Chat directly with sellers to ask questions, negotiate prices, and arrange delivery details.",
  },
  {
    icon: BadgeCheck,
    title: "Verified Sellers",
    description:
      "Look for the verified badge to shop from trusted sellers with proven track records.",
  },
  {
    icon: MessageCircle,
    title: "Wishlist & Favorites",
    description:
      "Save products you love to your wishlist and get notified when prices drop.",
  },
  {
    icon: Truck,
    title: "Nationwide Delivery",
    description:
      "Get products delivered to your doorstep anywhere in Tanzania with reliable delivery partners.",
  },
  {
    icon: Percent,
    title: "Best Deals",
    description:
      "Discover exclusive discounts, flash sales, and negotiate for the best prices directly with sellers.",
  },
  {
    icon: Bell,
    title: "Price Alerts",
    description:
      "Set price alerts on products and get notified when they reach your target price.",
  },
];

const buyerSteps = [
  {
    step: 1,
    title: "Create Your Account",
    description:
      "Sign up for free in just 2 minutes. Add your delivery address and payment preferences.",
  },
  {
    step: 2,
    title: "Browse & Discover",
    description:
      "Explore thousands of products across categories. Use filters to find exactly what you need.",
  },
  {
    step: 3,
    title: "Chat & Negotiate",
    description:
      "Contact sellers directly to ask questions, request more photos, or negotiate the best price.",
  },
  {
    step: 4,
    title: "Pay Securely",
    description:
      "Choose your preferred payment method - mobile money, bank transfer, or cash on delivery.",
  },
  {
    step: 5,
    title: "Receive & Review",
    description:
      "Track your order, receive your product, and leave a review to help other buyers.",
  },
];

const testimonials = [
  {
    name: "Amina Hassan",
    location: "Dar es Salaam",
    text: "I found my dream furniture at half the price of retail stores. The seller was very helpful and delivery was fast!",
    rating: 5,
  },
  {
    name: "John Mwangi",
    location: "Arusha",
    text: "Great platform for finding electronics. I saved over TZS 500,000 on my new laptop compared to local shops.",
    rating: 5,
  },
  {
    name: "Grace Kimaro",
    location: "Mwanza",
    text: "Love the ability to chat with sellers before buying. It gives me confidence in what I am purchasing.",
    rating: 4,
  },
];

export default function BuyerBenefitsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              For Buyers
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
              Shop Smarter, <span className="text-primary">Save More</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              Join thousands of Tanzanians discovering great deals on Soko. From
              electronics to property, find everything you need from verified
              sellers across all regions.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="gap-2">
                  Start Shopping <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline">
                  Browse Products
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
                  50K+
                </p>
                <p className="text-sm text-muted-foreground">Active Products</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-primary">
                  10K+
                </p>
                <p className="text-sm text-muted-foreground">
                  Verified Sellers
                </p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-primary">
                  26
                </p>
                <p className="text-sm text-muted-foreground">Regions Covered</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-primary">
                  4.8
                </p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Shop on Soko?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We have built the best marketplace experience for Tanzanian buyers
              with features that make shopping easy, safe, and rewarding.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {buyerBenefits.map((benefit) => (
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
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Start shopping in 5 simple steps
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {buyerSteps.map((step, index) => (
                <div key={step.step} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                      {step.step}
                    </div>
                    {index < buyerSteps.length - 1 && (
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

      {/* Payment Methods */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Pay Your Way</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from multiple secure payment methods that work for you
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { name: "M-Pesa", description: "Vodacom mobile money" },
              { name: "Tigo Pesa", description: "Tigo mobile money" },
              { name: "Airtel Money", description: "Airtel mobile money" },
              { name: "Cash on Delivery", description: "Pay when you receive" },
            ].map((method) => (
              <Card key={method.name} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">{method.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {method.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Buyers Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied buyers across Tanzania
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name}>
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    &quot;{testimonial.text}&quot;
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold text-primary">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
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
            Ready to Start Shopping?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Create your free account today and discover amazing deals from
            verified sellers across Tanzania.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" variant="secondary" className="gap-2">
                Create Free Account
              </Button>
            </Link>
            <Link href="/">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

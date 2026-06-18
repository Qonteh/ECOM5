"use client";

import Link from "next/link";
import {
  ShoppingBag,
  Store,
  Code,
  ArrowRight,
  Users,
  Globe,
  Shield,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const userTypes = [
  {
    icon: ShoppingBag,
    title: "For Buyers",
    description:
      "Discover great deals from verified sellers across Tanzania. Shop securely with multiple payment options.",
    benefits: [
      "50,000+ products to choose from",
      "Secure mobile money payments",
      "Direct chat with sellers",
      "Nationwide delivery",
    ],
    href: "/benefits/buyer",
    cta: "Start Shopping",
    color: "bg-blue-500",
  },
  {
    icon: Store,
    title: "For Sellers",
    description:
      "Reach millions of buyers and grow your business online. List products, manage orders, and scale easily.",
    benefits: [
      "Access to 100K+ monthly buyers",
      "Easy listing management",
      "Multiple payment options",
      "Sales analytics & insights",
    ],
    href: "/benefits/seller",
    cta: "Start Selling",
    color: "bg-green-500",
  },
  {
    icon: Code,
    title: "For Developers",
    description:
      "Build and monetize your own marketplace platform. Full admin control with built-in revenue tools.",
    benefits: [
      "Complete e-commerce codebase",
      "Built-in monetization",
      "Admin dashboard",
      "API-ready architecture",
    ],
    href: "/benefits/developer",
    cta: "View Platform",
    color: "bg-purple-500",
  },
];

const platformFeatures = [
  {
    icon: Users,
    title: "100K+ Users",
    description:
      "Growing community of active buyers and sellers across Tanzania.",
  },
  {
    icon: Globe,
    title: "26 Regions",
    description:
      "Full coverage across all Tanzanian regions from Dar to Mwanza.",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "M-Pesa, Tigo Pesa, Airtel Money, and bank transfers.",
  },
  {
    icon: Zap,
    title: "Fast & Modern",
    description: "Built with the latest technology for speed and reliability.",
  },
];

export default function BenefitsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              Soko Tanzania
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
              Something for <span className="text-primary">Everyone</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              Whether you are buying, selling, or building - Soko has the tools
              and community to help you succeed. Discover how you can benefit
              from Tanzania&apos;s leading marketplace.
            </p>
          </div>
        </div>
      </section>

      {/* User Type Cards */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {userTypes.map((type) => (
              <Card
                key={type.title}
                className="relative overflow-hidden border-2 hover:border-primary/50 transition-all hover:shadow-lg"
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-1 ${type.color}`}
                />
                <CardHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <div
                      className={`w-12 h-12 rounded-xl ${type.color}/10 flex items-center justify-center`}
                    >
                      <type.icon className={`w-6 h-6 text-primary`} />
                    </div>
                    <CardTitle className="text-xl">{type.title}</CardTitle>
                  </div>
                  <p className="text-muted-foreground">{type.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {type.benefits.map((benefit) => (
                      <li
                        key={benefit}
                        className="flex items-center gap-2 text-sm"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <Link href={type.href}>
                    <Button className="w-full gap-2">
                      {type.cta} <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Soko?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tanzania&apos;s most trusted marketplace for buying, selling, and
              growing your business online.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {platformFeatures.map((feature) => (
              <Card key={feature.title} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="bg-primary text-primary-foreground p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-primary-foreground/80 mb-8">
                Join thousands of Tanzanians already buying, selling, and
                growing on Soko. Create your free account today.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/auth/register">
                  <Button size="lg" variant="secondary">
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
          </Card>
        </div>
      </section>
    </div>
  );
}

"use client";

import Link from "next/link";
import {
  Code,
  Palette,
  DollarSign,
  BarChart3,
  Settings,
  Users,
  Shield,
  Zap,
  Database,
  Globe,
  Layers,
  GitBranch,
  Terminal,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Star,
  TrendingUp,
  Lock,
  Webhook,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatTZS } from "@/lib/data";

const developerBenefits = [
  {
    icon: DollarSign,
    title: "Multiple Revenue Streams",
    description:
      "Earn from subscriptions, featured listings, promoted ads, transaction fees, and premium themes.",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description:
      "Access comprehensive dashboards showing platform growth, revenue, user metrics, and trends.",
  },
  {
    icon: Palette,
    title: "Theme Customization",
    description:
      "Create and sell custom themes. Build unique marketplace experiences for different markets.",
  },
  {
    icon: Settings,
    title: "Full Admin Control",
    description:
      "Manage users, listings, payments, subscriptions, and platform settings from one dashboard.",
  },
  {
    icon: Shield,
    title: "Security First",
    description:
      "Built with security best practices - JWT auth, password hashing, SQL injection protection.",
  },
  {
    icon: Database,
    title: "PostgreSQL Database",
    description:
      "Scalable PostgreSQL schema designed for growth with proper indexing and relationships.",
  },
  {
    icon: Webhook,
    title: "API Ready",
    description:
      "RESTful API architecture ready for mobile apps, integrations, and third-party connections.",
  },
  {
    icon: Globe,
    title: "Multi-Region Support",
    description:
      "Built for Tanzania with support for all 26 regions, local currencies, and mobile payments.",
  },
];

const revenueStreams = [
  {
    title: "Subscription Plans",
    description: "Monthly recurring revenue from seller subscriptions",
    example:
      "Free, Basic (TZS 15,000), Premium (TZS 50,000), Business (TZS 150,000)",
    potential: "TZS 5M+/month with 100+ premium sellers",
    icon: Users,
  },
  {
    title: "Featured Listings",
    description: "One-time fees for premium placement in search results",
    example: "TZS 5,000-25,000 per listing for 7-30 days",
    potential: "TZS 2M+/month with 200+ featured items",
    icon: Star,
  },
  {
    title: "Promoted Ads",
    description: "Pay-per-impression advertising for sellers",
    example: "TZS 100-500 per 1,000 impressions",
    potential: "TZS 3M+/month with active promotion",
    icon: TrendingUp,
  },
  {
    title: "Transaction Fees",
    description: "Small percentage on successful transactions",
    example: "2-5% commission on sales (optional)",
    potential: "Scales with platform GMV",
    icon: DollarSign,
  },
];

const techStack = [
  {
    name: "Next.js 16",
    description: "React framework for production",
    category: "Frontend",
  },
  {
    name: "TypeScript",
    description: "Type-safe JavaScript",
    category: "Frontend",
  },
  {
    name: "Tailwind CSS",
    description: "Utility-first CSS framework",
    category: "Frontend",
  },
  {
    name: "shadcn/ui",
    description: "Beautiful component library",
    category: "Frontend",
  },
  {
    name: "Zustand",
    description: "Lightweight state management",
    category: "State",
  },
  {
    name: "PostgreSQL",
    description: "Powerful relational database",
    category: "Database",
  },
  {
    name: "JWT Auth",
    description: "Secure authentication",
    category: "Security",
  },
  { name: "bcrypt", description: "Password hashing", category: "Security" },
];

const roadmapItems = [
  {
    phase: "Phase 1 - Foundation",
    items: [
      "User authentication and authorization",
      "Product listings and categories",
      "Search and filtering",
      "User profiles and dashboards",
    ],
    status: "complete",
  },
  {
    phase: "Phase 2 - Commerce",
    items: [
      "Shopping cart and checkout",
      "Mobile money integration (M-Pesa, Tigo)",
      "Order management",
      "Messaging system",
    ],
    status: "in-progress",
  },
  {
    phase: "Phase 3 - Growth",
    items: [
      "Subscription billing",
      "Featured and promoted listings",
      "Advanced analytics",
      "Review and rating system",
    ],
    status: "planned",
  },
  {
    phase: "Phase 4 - Scale",
    items: [
      "Mobile app (React Native)",
      "API for third-party integrations",
      "Multi-language support",
      "Advanced fraud detection",
    ],
    status: "planned",
  },
];

export default function DeveloperBenefitsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              For Developers & Platform Owners
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
              Build & <span className="text-primary">Monetize</span> Your
              Marketplace
            </h1>
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              Full-stack e-commerce platform with built-in monetization,
              analytics, and admin tools. Generate revenue from day one with
              subscription plans, featured listings, and transaction fees.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/developer">
                <Button size="lg" className="gap-2">
                  Open Developer Dashboard <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/developer/monetization">
                <Button size="lg" variant="outline">
                  View Revenue Model
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Tech badges */}
        <div className="border-t border-border bg-muted/30">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-wrap items-center justify-center gap-4">
              {[
                "Next.js 16",
                "TypeScript",
                "PostgreSQL",
                "Tailwind CSS",
                "shadcn/ui",
                "Zustand",
              ].map((tech) => (
                <Badge
                  key={tech}
                  variant="outline"
                  className="text-sm py-1 px-3"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Platform Capabilities</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to run a successful marketplace business in
              Tanzania.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {developerBenefits.map((benefit) => (
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

      {/* Revenue Streams */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Revenue Streams</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Multiple ways to monetize your marketplace from day one.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {revenueStreams.map((stream) => (
              <Card key={stream.title}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <stream.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{stream.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {stream.description}
                      </p>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="font-medium">Example:</span>{" "}
                          {stream.example}
                        </p>
                        <p className="text-primary font-medium">
                          {stream.potential}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/developer/revenue">
              <Button variant="outline" className="gap-2">
                View Full Revenue Analytics <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Tech Stack</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built with modern, production-ready technologies.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="Frontend" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="Frontend">Frontend</TabsTrigger>
                <TabsTrigger value="State">State</TabsTrigger>
                <TabsTrigger value="Database">Database</TabsTrigger>
                <TabsTrigger value="Security">Security</TabsTrigger>
              </TabsList>
              {["Frontend", "State", "Database", "Security"].map((category) => (
                <TabsContent key={category} value={category}>
                  <div className="grid md:grid-cols-2 gap-4">
                    {techStack
                      .filter((tech) => tech.category === category)
                      .map((tech) => (
                        <Card key={tech.name}>
                          <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Code className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{tech.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {tech.description}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Development Roadmap</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our planned features and development timeline.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {roadmapItems.map((phase) => (
              <Card key={phase.phase}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{phase.phase}</CardTitle>
                    <Badge
                      variant={
                        phase.status === "complete"
                          ? "default"
                          : phase.status === "in-progress"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {phase.status === "complete"
                        ? "Complete"
                        : phase.status === "in-progress"
                          ? "In Progress"
                          : "Planned"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-3">
                    {phase.items.map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle2
                          className={`w-4 h-4 shrink-0 ${
                            phase.status === "complete"
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Admin Features */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Admin Dashboard Features
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools to manage every aspect of your marketplace.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Users,
                title: "User Management",
                description:
                  "View, edit, ban users. Manage seller verifications.",
              },
              {
                icon: Layers,
                title: "Product Moderation",
                description:
                  "Approve listings, handle reports, manage categories.",
              },
              {
                icon: DollarSign,
                title: "Revenue Tracking",
                description:
                  "Monitor all revenue streams with detailed breakdowns.",
              },
              {
                icon: BarChart3,
                title: "Analytics Dashboard",
                description: "Platform metrics, growth trends, user behavior.",
              },
              {
                icon: Palette,
                title: "Theme Management",
                description:
                  "Switch themes, customize colors, manage branding.",
              },
              {
                icon: Settings,
                title: "Platform Settings",
                description:
                  "Configure fees, limits, features, and integrations.",
              },
            ].map((feature) => (
              <Card key={feature.title}>
                <CardContent className="pt-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-5 h-5 text-primary" />
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
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start Building Your Marketplace
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Access the developer dashboard to monitor platform health, manage
            revenue streams, and customize your marketplace.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/developer">
              <Button size="lg" variant="secondary" className="gap-2">
                Open Dashboard
              </Button>
            </Link>
            <Link href="/developer/themes">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Customize Themes
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

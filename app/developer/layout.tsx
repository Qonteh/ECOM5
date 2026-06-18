"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  CreditCard,
  Settings,
  BarChart3,
  Palette,
  TrendingUp,
  DollarSign,
  Star,
  Megaphone,
  ShieldCheck,
  ChevronRight,
  Menu,
  X,
  Bell,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store";
import { NotificationsDropdown } from "@/components/notifications-dropdown";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/developer" },
  { icon: DollarSign, label: "Monetization", href: "/developer/monetization" },
  { icon: TrendingUp, label: "Revenue", href: "/developer/revenue" },
  { icon: Users, label: "Users", href: "/developer/users" },
  { icon: Package, label: "Products", href: "/developer/products" },
  {
    icon: CreditCard,
    label: "Subscriptions",
    href: "/developer/subscriptions",
  },
  { icon: Star, label: "Featured Listings", href: "/developer/featured" },
  { icon: Megaphone, label: "Advertisements", href: "/developer/ads" },
  { icon: BarChart3, label: "Analytics", href: "/developer/analytics" },
  { icon: Palette, label: "Theme Settings", href: "/developer/themes" },
  { icon: ShieldCheck, label: "Moderation", href: "/developer/moderation" },
  { icon: Settings, label: "Settings", href: "/developer/settings" },
];

export default function DeveloperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error(e);
    }
    logout();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile header */}
      <header className="lg:hidden sticky top-0 z-50 bg-background border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <Link href="/developer" className="font-bold text-lg">
            Developer Panel
          </Link>
          <NotificationsDropdown />
        </div>
      </header>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 bg-card border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <Link href="/developer" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">
                  S
                </span>
              </div>
              <div>
                <h1 className="font-bold text-lg">Soko Tanzania</h1>
                <p className="text-xs text-muted-foreground">Developer Panel</p>
              </div>
            </Link>
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Revenue Summary */}
          <div className="px-4 py-4 border-b bg-primary/5">
            <p className="text-xs text-muted-foreground mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-primary">TZS 12.5M</p>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +23% this month
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {sidebarItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors group"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span>{item.label}</span>
                    <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User section */}
          <div className="border-t p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-semibold text-primary">
                  {user?.name?.charAt(0) || "D"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {user?.name || "Developer"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email || "dev@soko.tz"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/" className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  View Site
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:pl-72">
        <div className="min-h-screen">{children}</div>
      </main>
    </div>
  );
}

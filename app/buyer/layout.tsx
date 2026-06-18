"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MessageCircle,
  ShoppingBag,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  Bell,
  User,
  ChevronDown,
  Clock,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeSwitcher } from "@/components/theme-provider";
import { NotificationsDropdown } from "@/components/notifications-dropdown";
import { useAuthStore, useChatStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/buyer" },
  { icon: ShoppingBag, label: "My Orders", href: "/buyer/orders" },
  { icon: MessageCircle, label: "Wishlist", href: "/buyer/wishlist" },
  { icon: Clock, label: "Recently Viewed", href: "/buyer/history" },
  { icon: MessageSquare, label: "Messages", href: "/buyer/messages" },
  { icon: Settings, label: "Settings", href: "/buyer/settings" },
];

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const unreadMessages = useChatStore((state) => state.getTotalUnread());

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
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-sidebar border-r border-sidebar-border transition-transform lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-sidebar-border">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center">
                <span className="text-sidebar-primary-foreground font-bold text-xl">
                  S
                </span>
              </div>
              <div>
                <h1 className="font-bold text-sidebar-foreground">
                  Soko Tanzania
                </h1>
                <p className="text-xs text-sidebar-foreground/60">My Account</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
                <User className="w-5 h-5 text-sidebar-accent-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-sidebar-foreground/60 truncate">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-background border-b border-border flex items-center gap-4 px-4">
          <button
            className="lg:hidden p-2 -ml-2"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1" />

          <ThemeSwitcher compact />

          <Link href="/messages">
            <Button variant="ghost" size="icon" className="relative">
              <MessageCircle className="w-5 h-5" />
              {unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                  {unreadMessages}
                </span>
              )}
            </Button>
          </Link>

          <NotificationsDropdown />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/buyer/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/">Back to Store</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive"
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

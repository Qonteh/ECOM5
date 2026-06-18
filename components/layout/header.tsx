'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Menu,
  X,
  ShoppingCart,
  MessageCircle,
  User,
  Plus,
  ChevronDown,
  MapPin,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeSwitcher } from '@/components/theme-provider';
import { useAuthStore, useCartStore, useWishlistStore, useChatStore } from '@/lib/store';
import { categories } from '@/lib/data';
import { NotificationsDropdown } from '@/components/notifications-dropdown';

export function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuthStore();
  const cartItems = useCartStore((state) => state.getTotalItems());
  const wishlistItems = useWishlistStore((state) => state.items.length);
  const unreadMessages = useChatStore((state) => state.getTotalUnread());

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    logout();
    router.push('/');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top bar */}
      <div className="hidden md:block border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-1.5 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Tanzania
            </span>
            <Link href="/help" className="hover:text-foreground transition-colors">
              Help Center
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeSwitcher compact />
            <Link href="/download" className="hover:text-foreground transition-colors">
              Download App
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 -ml-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">S</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-xl text-foreground leading-none">Soko</h1>
              <p className="text-xs text-muted-foreground">Tanzania</p>
            </div>
          </Link>

          {/* Search bar */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <form className="relative" onSubmit={(e) => e.preventDefault()}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for anything in Tanzania..."
                className="pl-10 pr-4 h-11 w-full bg-muted/50 border-border focus:bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2 ml-auto">
            {/* Notifications Dropdown (Live Database Data) */}
            {user && <NotificationsDropdown />}

            {/* Messages */}
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

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                    {cartItems}
                  </span>
                )}
              </Button>
            </Link>

            {/* User menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <span className="hidden lg:block">{user.name.split(' ')[0]}</span>
                    <ChevronDown className="w-4 h-4 hidden lg:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  {user.role === 'seller' && (
                    <DropdownMenuItem asChild>
                      <Link href="/seller">Seller Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  {user.role === 'buyer' && (
                    <DropdownMenuItem asChild>
                      <Link href="/buyer">My Orders</Link>
                    </DropdownMenuItem>
                  )}
                  {(user.role === 'developer' || user.role === 'admin') && (
                    <DropdownMenuItem asChild>
                      <Link href="/developer">Developer Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/profile">My Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/messages">Messages</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive cursor-pointer" onClick={handleLogout}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="hidden sm:flex">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">Register</Button>
                </Link>
              </div>
            )}

            {/* Sell button */}
            {user?.role === 'seller' ? (
               <Link href="/sell" className="hidden lg:block ml-2">
                 <Button className="gap-2">
                   <Plus className="w-4 h-4" />
                   Sell Now
                 </Button>
               </Link>
            ) : null}
          </div>
        </div>

        {/* Mobile search */}
        <div className="mt-3 md:hidden">
          <form className="relative" onSubmit={(e) => e.preventDefault()}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-10 pr-4 h-10 w-full bg-muted/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
      </div>

      {/* Categories nav */}
      <nav className="hidden lg:block border-t border-border bg-muted/20">
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-1 overflow-x-auto py-2">
            <li>
              <Link
                href="/categories"
                className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-muted transition-colors"
              >
                <Menu className="w-4 h-4" />
                All Categories
              </Link>
            </li>
            {categories.slice(0, 7).map((category) => (
              <li key={category.id}>
                <Link
                  href={`/category/${category.slug}`}
                  className="px-3 py-1.5 rounded-md text-sm hover:bg-muted transition-colors whitespace-nowrap"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[120px] z-50 bg-background border-t border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="mb-4">
              <ThemeSwitcher />
            </div>
            <nav className="space-y-1">
              <Link
                href="/categories"
                className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-muted transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Menu className="w-5 h-5 text-primary" />
                <span className="font-medium">All Categories</span>
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-muted transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{category.name}</span>
                  <span className="ml-auto text-sm text-muted-foreground">
                    {category.productCount.toLocaleString()}
                  </span>
                </Link>
              ))}
            </nav>
            <div className="mt-6 pt-6 border-t border-border">
              {user?.role === 'seller' ? (
                <Link href="/sell" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full gap-2">
                    <Plus className="w-4 h-4" />
                    Sell Now
                  </Button>
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

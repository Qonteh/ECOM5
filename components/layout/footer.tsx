import Link from 'next/link';
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';
import { categories } from '@/lib/data';

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border">
      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">S</span>
              </div>
              <div>
                <h2 className="font-bold text-lg">Soko Tanzania</h2>
                <p className="text-xs text-muted-foreground">Buy & Sell Online</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Tanzania&apos;s leading online marketplace. Buy and sell anything from
              electronics to vehicles, property to fashion.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Popular Categories</h3>
            <ul className="space-y-2">
              {categories.slice(0, 6).map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/benefits"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/benefits/buyer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  For Buyers
                </Link>
              </li>
              <li>
                <Link
                  href="/benefits/seller"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  For Sellers
                </Link>
              </li>
              <li>
                <Link
                  href="/benefits/developer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  For Developers
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/safety"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Safety Tips
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>
                  Samora Avenue, Posta House
                  <br />
                  Dar es Salaam, Tanzania
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>+255 22 123 4567</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>support@sokotanzania.co.tz</span>
              </li>
            </ul>

            {/* App download */}
            <div className="mt-6">
              <h4 className="font-medium text-sm mb-3">Download Our App</h4>
              <div className="flex gap-2">
                <button className="px-3 py-2 bg-foreground text-background rounded-lg text-xs font-medium hover:opacity-90 transition-opacity">
                  App Store
                </button>
                <button className="px-3 py-2 bg-foreground text-background rounded-lg text-xs font-medium hover:opacity-90 transition-opacity">
                  Play Store
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Soko Tanzania. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Payments secured by:</span>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-muted rounded text-xs font-medium">M-Pesa</span>
              <span className="px-2 py-1 bg-muted rounded text-xs font-medium">Tigo Pesa</span>
              <span className="px-2 py-1 bg-muted rounded text-xs font-medium">Airtel Money</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

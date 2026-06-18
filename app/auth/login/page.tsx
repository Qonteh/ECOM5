"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Store,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/lib/store";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userCount, setUserCount] = useState<number | string>("...");
  const [listingCount, setListingCount] = useState<number | string>("...");

  useEffect(() => {
    async function fetchStats() {
      try {
        const [usersRes, productsRes] = await Promise.all([
          fetch("/api/users?limit=1"),
          fetch("/api/products?status=active&limit=1"),
        ]);
        if (usersRes.ok) {
          const uData = await usersRes.json();
          setUserCount(uData.total || 0);
        }
        if (productsRes.ok) {
          const pData = await productsRes.json();
          setListingCount(pData.total || 0);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    }
    fetchStats();
  }, []);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      setUser(data.user);
      toast.success("Welcome back!");

      // Redirect based on role
      if (data.user.role === "seller") {
        router.push("/seller");
      } else if (data.user.role === "developer" || data.user.role === "admin") {
        router.push("/developer");
      } else {
        router.push("/");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Brand */}
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 mb-10 group"
          >
            <div className="w-11 h-11 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
              <span className="text-primary-foreground font-bold text-xl">
                S
              </span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-lg tracking-tight">
                Soko Tanzania
              </span>
              <span className="text-xs text-muted-foreground">
                Marketplace
              </span>
            </div>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-balance">
              Welcome back
            </h1>
            <p className="text-muted-foreground mt-2 leading-relaxed">
              Sign in to continue buying and selling across Tanzania.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-11 h-12 bg-card"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Link
                  href="/auth/reset-password"
                  className="text-sm text-primary hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-11 pr-11 h-12 bg-card"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="flex items-center gap-2 mt-8 text-sm text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span>Your data is protected with bank-level encryption.</span>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-primary font-semibold hover:underline"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Branding */}
      <div className="hidden lg:block relative flex-1 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/auth/marketplace-tanzania.png')",
          }}
        />
        <div className="absolute inset-0 gradient-primary opacity-90" />
        <div className="relative h-full flex flex-col justify-between p-12 text-primary-foreground">
          <div className="flex items-center gap-2 text-sm font-medium">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Live marketplace
          </div>

          <div className="max-w-md">
            <h2 className="text-4xl font-bold leading-tight text-balance">
              Tanzania&apos;s #1 Marketplace
            </h2>
            <p className="text-primary-foreground/85 mt-4 text-lg leading-relaxed">
              Join thousands of Tanzanians buying and selling everything from
              electronics to vehicles, property to fashion.
            </p>

            <div className="grid grid-cols-3 gap-4 mt-10">
              <div className="rounded-2xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/15 p-4">
                <Users className="w-5 h-5 mb-2 text-primary-foreground/80" />
                <p className="text-2xl font-bold">{userCount}</p>
                <p className="text-xs text-primary-foreground/75">Members</p>
              </div>
              <div className="rounded-2xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/15 p-4">
                <Store className="w-5 h-5 mb-2 text-primary-foreground/80" />
                <p className="text-2xl font-bold">{listingCount}</p>
                <p className="text-xs text-primary-foreground/75">Listings</p>
              </div>
              <div className="rounded-2xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/15 p-4">
                <MapPinIcon />
                <p className="text-2xl font-bold">26</p>
                <p className="text-xs text-primary-foreground/75">Regions</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-primary-foreground/70">
            &copy; {new Date().getFullYear()} Soko Tanzania. All rights
            reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

function MapPinIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mb-2 text-primary-foreground/80"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

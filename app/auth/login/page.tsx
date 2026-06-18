"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore, User } from "@/lib/store";
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
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link href="/" className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">
                  S
                </span>
              </div>
              <span className="font-bold text-xl">Soko Tanzania</span>
            </Link>
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground mt-1">
              Sign in to your account to continue
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10"
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
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/auth/reset-password"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-10"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
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
                  className="w-full mt-6"
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
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-primary font-medium hover:underline"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Branding */}
      <div className="hidden lg:flex flex-1 bg-primary items-center justify-center p-8">
        <div className="max-w-md text-primary-foreground text-center">
          <h2 className="text-3xl font-bold mb-4">
            Tanzania&apos;s #1 Marketplace
          </h2>
          <p className="text-primary-foreground/80 mb-8">
            Join {userCount} Tanzanians buying and selling everything from
            electronics to vehicles, property to fashion.
          </p>
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="bg-primary-foreground/10 rounded-lg p-4">
              <p className="text-2xl font-bold">{listingCount}</p>
              <p className="text-sm text-primary-foreground/80">
                Active Listings
              </p>
            </div>
            <div className="bg-primary-foreground/10 rounded-lg p-4">
              <p className="text-2xl font-bold">26</p>
              <p className="text-sm text-primary-foreground/80">Regions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

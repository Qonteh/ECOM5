"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  ArrowRight,
  Loader2,
  Check,
  ShoppingBag,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/lib/store";
import { regions } from "@/lib/data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type UserRole = "buyer" | "seller";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>(
    (searchParams.get("role") as UserRole) || "buyer",
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    region: "",
    agreeTerms: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!formData.agreeTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          role: selectedRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setUser(data.user);
      toast.success("Account created successfully!");

      if (selectedRole === "seller") {
        router.push("/seller");
      } else {
        router.push("/");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Registration failed",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side - Branding */}
      <div className="hidden lg:block relative flex-1 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/auth/marketplace-tanzania.png')",
          }}
        />
        <div className="absolute inset-0 gradient-primary opacity-90" />
        <div className="relative h-full flex flex-col justify-between p-12 text-primary-foreground">
          <Link href="/" className="inline-flex items-center gap-2.5 group w-fit">
            <div className="w-11 h-11 rounded-2xl bg-primary-foreground/15 backdrop-blur-sm border border-primary-foreground/20 flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">
                S
              </span>
            </div>
            <span className="font-bold text-lg tracking-tight">
              Soko Tanzania
            </span>
          </Link>

          <div className="max-w-md">
            <h2 className="text-4xl font-bold leading-tight text-balance">
              Start buying & selling today
            </h2>
            <p className="text-primary-foreground/85 mt-4 text-lg leading-relaxed">
              Create your free account and join Tanzania&apos;s largest online
              marketplace.
            </p>
            <ul className="space-y-3.5 mt-10">
              {[
                "Free to list your products",
                "Reach thousands of buyers instantly",
                "Secure M-Pesa payments",
                "Verified seller badges",
                "24/7 customer support",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-primary-foreground/90">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm text-primary-foreground/70">
            &copy; {new Date().getFullYear()} Soko Tanzania. All rights
            reserved.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Brand (mobile) */}
          <Link
            href="/"
            className="lg:hidden inline-flex items-center gap-2.5 mb-8"
          >
            <div className="w-11 h-11 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-primary-foreground font-bold text-xl">
                S
              </span>
            </div>
            <span className="font-bold text-lg tracking-tight">
              Soko Tanzania
            </span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-balance">
              Create your account
            </h1>
            <p className="text-muted-foreground mt-2 leading-relaxed">
              Join the largest marketplace in Tanzania in just two steps.
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex items-center justify-center w-9 h-9 rounded-full text-sm font-semibold transition-colors",
                  step >= 1
                    ? "gradient-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {step > 1 ? <Check className="w-4 h-4" /> : "1"}
              </div>
              <span
                className={cn(
                  "text-sm font-medium hidden sm:block",
                  step >= 1 ? "text-foreground" : "text-muted-foreground",
                )}
              >
                Your details
              </span>
            </div>
            <div
              className={cn(
                "flex-1 h-0.5 rounded transition-colors",
                step >= 2 ? "bg-primary" : "bg-border",
              )}
            />
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex items-center justify-center w-9 h-9 rounded-full text-sm font-semibold transition-colors",
                  step >= 2
                    ? "gradient-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "bg-muted text-muted-foreground",
                )}
              >
                2
              </div>
              <span
                className={cn(
                  "text-sm font-medium hidden sm:block",
                  step >= 2 ? "text-foreground" : "text-muted-foreground",
                )}
              >
                Security
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 1 && (
              <>
                {/* Role selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">I want to...</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className={cn(
                        "p-4 rounded-xl border-2 text-left transition-all",
                        selectedRole === "buyer"
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:border-primary/50",
                      )}
                      onClick={() => setSelectedRole("buyer")}
                    >
                      <div
                        className={cn(
                          "w-9 h-9 rounded-lg flex items-center justify-center mb-2",
                          selectedRole === "buyer"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                      <div className="font-semibold">Buy Products</div>
                      <div className="text-sm text-muted-foreground">
                        Shop for items
                      </div>
                    </button>
                    <button
                      type="button"
                      className={cn(
                        "p-4 rounded-xl border-2 text-left transition-all",
                        selectedRole === "seller"
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:border-primary/50",
                      )}
                      onClick={() => setSelectedRole("seller")}
                    >
                      <div
                        className={cn(
                          "w-9 h-9 rounded-lg flex items-center justify-center mb-2",
                          selectedRole === "seller"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        <Store className="w-5 h-5" />
                      </div>
                      <div className="font-semibold">Sell Products</div>
                      <div className="text-sm text-muted-foreground">
                        List &amp; sell items
                      </div>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="Your full name"
                      className="pl-11 h-12 bg-card"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
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
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+255 XXX XXX XXX"
                      className="pl-11 h-12 bg-card"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20"
                  onClick={() => setStep(2)}
                  disabled={
                    !formData.name || !formData.email || !formData.phone
                  }
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="region" className="text-sm font-medium">
                    Region
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                    <select
                      id="region"
                      className="w-full h-12 pl-11 pr-4 rounded-md border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      value={formData.region}
                      onChange={(e) =>
                        setFormData({ ...formData, region: e.target.value })
                      }
                      required
                    >
                      <option value="">Select your region</option>
                      {regions.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      className="pl-11 pr-11 h-12 bg-card"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          password: e.target.value,
                        })
                      }
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="pl-11 h-12 bg-card"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 accent-primary w-4 h-4"
                    checked={formData.agreeTerms}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        agreeTerms: e.target.checked,
                      })
                    }
                  />
                  <Label
                    htmlFor="terms"
                    className="text-sm text-muted-foreground font-normal leading-relaxed"
                  >
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-primary hover:underline font-medium"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-primary hover:underline font-medium"
                    >
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-12 text-base font-semibold shadow-lg shadow-primary/20"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </form>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-primary font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}

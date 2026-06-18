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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex flex-1 bg-primary items-center justify-center p-8">
        <div className="max-w-md text-primary-foreground">
          <h2 className="text-3xl font-bold mb-4">
            Start Buying & Selling Today
          </h2>
          <p className="text-primary-foreground/80 mb-8">
            Create your free account and join Tanzania&apos;s largest online
            marketplace.
          </p>
          <ul className="space-y-4">
            {[
              "Free to list your products",
              "Reach thousands of buyers instantly",
              "Secure M-Pesa payments",
              "Verified seller badges",
              "24/7 customer support",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right side - Form */}
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
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-muted-foreground mt-1">
              Join the largest marketplace in Tanzania
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
                step >= 1
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground",
              )}
            >
              1
            </div>
            <div
              className={cn(
                "flex-1 h-1 rounded",
                step >= 2 ? "bg-primary" : "bg-muted",
              )}
            />
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
                step >= 2
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground",
              )}
            >
              2
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {step === 1 && (
                  <>
                    {/* Role selection */}
                    <div className="space-y-2">
                      <Label>I want to...</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          className={cn(
                            "p-4 rounded-xl border-2 text-left transition-all",
                            selectedRole === "buyer"
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50",
                          )}
                          onClick={() => setSelectedRole("buyer")}
                        >
                          <div className="font-medium">Buy Products</div>
                          <div className="text-sm text-muted-foreground">
                            Shop for items
                          </div>
                        </button>
                        <button
                          type="button"
                          className={cn(
                            "p-4 rounded-xl border-2 text-left transition-all",
                            selectedRole === "seller"
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50",
                          )}
                          onClick={() => setSelectedRole("seller")}
                        >
                          <div className="font-medium">Sell Products</div>
                          <div className="text-sm text-muted-foreground">
                            List & sell items
                          </div>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="name"
                          placeholder="Your full name"
                          className="pl-10"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

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
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+255 XXX XXX XXX"
                          className="pl-10"
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
                      className="w-full"
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
                      <Label htmlFor="region">Region</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <select
                          id="region"
                          className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-ring"
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
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          className="pl-10 pr-10"
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

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          className="pl-10"
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

                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="terms"
                        className="mt-1"
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
                        className="text-sm text-muted-foreground font-normal"
                      >
                        I agree to the{" "}
                        <Link
                          href="/terms"
                          className="text-primary hover:underline"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy"
                          className="text-primary hover:underline"
                        >
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1"
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
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-primary font-medium hover:underline"
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
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}

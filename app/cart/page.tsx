"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ShoppingBag,
  CreditCard,
  Truck,
  Shield,
  Tag,
  ChevronRight,
  MapPin,
  Phone,
  User,
  CheckCircle2,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCartStore, useAuthStore } from "@/lib/store";
import { formatTZS, regions } from "@/lib/data";
import { cn } from "@/lib/utils";

type CheckoutStep = "cart" | "delivery" | "payment" | "confirmation";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = useCartStore();
  const { user } = useAuthStore();
  const [step, setStep] = useState<CheckoutStep>("cart");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Delivery form state
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    region: user?.location || "",
    district: "",
    ward: "",
    address: "",
    notes: "",
  });

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [mobileNumber, setMobileNumber] = useState("");

  // Calculate totals
  const subtotal = getTotalPrice();
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const deliveryFee = subtotal > 100000 ? 0 : 5000;
  const total = subtotal - discount + deliveryFee;

  // Group items by seller
  const itemsBySeller = items.reduce(
    (acc, item) => {
      if (!acc[item.sellerId]) {
        acc[item.sellerId] = {
          sellerName: item.sellerName,
          items: [],
        };
      }
      acc[item.sellerId].items.push(item);
      return acc;
    },
    {} as Record<string, { sellerName: string; items: typeof items }>,
  );

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === "soko10") {
      setCouponApplied(true);
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      alert("You must log in to place an order");
      return;
    }
    setIsProcessing(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyer_id: user.id,
          seller_id: items[0]?.sellerId || "some-default-seller",
          items: items.map((i) => ({
            product_id: i.productId,
            quantity: i.quantity,
            price: i.price,
            title: i.title,
          })),
          delivery_region: deliveryInfo.region,
          delivery_district: deliveryInfo.district,
          delivery_ward: deliveryInfo.ward,
          delivery_address: deliveryInfo.address,
          delivery_phone: deliveryInfo.phone,
          delivery_notes: deliveryInfo.notes,
          delivery_fee: deliveryFee,
          total_amount: total,
        }),
      });

      if (response.ok) {
        setShowSuccessDialog(true);
      } else {
        alert("Payment processing failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOrderComplete = () => {
    clearCart();
    setShowSuccessDialog(false);
    window.location.href = "/buyer";
  };

  if (items.length === 0 && step === "cart") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-3">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">
              Looks like you haven&apos;t added anything to your cart yet. Start
              shopping to find great deals!
            </p>
            <Link href="/">
              <Button size="lg" className="gap-2">
                <ShoppingBag className="w-5 h-5" />
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Progress Bar */}
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-2 md:gap-4">
            {[
              { key: "cart", label: "Cart", icon: ShoppingCart },
              { key: "delivery", label: "Delivery", icon: Truck },
              { key: "payment", label: "Payment", icon: CreditCard },
              { key: "confirmation", label: "Confirm", icon: CheckCircle2 },
            ].map((s, index) => (
              <div key={s.key} className="flex items-center gap-2 md:gap-4">
                <button
                  onClick={() => {
                    if (
                      s.key === "cart" ||
                      (s.key === "delivery" && step !== "cart") ||
                      (s.key === "payment" &&
                        (step === "payment" || step === "confirmation")) ||
                      (s.key === "confirmation" && step === "confirmation")
                    ) {
                      setStep(s.key as CheckoutStep);
                    }
                  }}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors",
                    step === s.key
                      ? "bg-primary text-primary-foreground"
                      : ["delivery", "payment", "confirmation"].indexOf(
                            s.key,
                          ) <=
                          ["delivery", "payment", "confirmation"].indexOf(step)
                        ? "text-primary"
                        : "text-muted-foreground",
                  )}
                >
                  <s.icon className="w-4 h-4" />
                  <span className="hidden md:inline text-sm font-medium">
                    {s.label}
                  </span>
                </button>
                {index < 3 && (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Step */}
            {step === "cart" && (
              <>
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold">
                    Shopping Cart ({getTotalItems()} items)
                  </h1>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCart}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                </div>

                {/* Items grouped by seller */}
                {Object.entries(itemsBySeller).map(
                  ([sellerId, { sellerName, items: sellerItems }]) => (
                    <Card key={sellerId}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <Store className="w-4 h-4 text-muted-foreground" />
                          <CardTitle className="text-base">
                            {sellerName}
                          </CardTitle>
                          <Badge variant="secondary" className="ml-auto">
                            {sellerItems.length} items
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {sellerItems.map((item) => (
                          <div key={item.id} className="flex gap-4">
                            <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden shrink-0">
                              {item.image.startsWith("http") ? (
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  width={96}
                                  height={96}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                  IMG
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <Link href={`/product/${item.productId}`}>
                                <h3 className="font-medium hover:text-primary transition-colors line-clamp-2">
                                  {item.name}
                                </h3>
                              </Link>
                              <p className="text-lg font-bold text-primary mt-1">
                                {formatTZS(item.price)}
                              </p>
                              <div className="flex items-center gap-4 mt-3">
                                <div className="flex items-center border border-border rounded-lg">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity - 1)
                                    }
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus className="w-4 h-4" />
                                  </Button>
                                  <span className="w-10 text-center font-medium">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity + 1)
                                    }
                                  >
                                    <Plus className="w-4 h-4" />
                                  </Button>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => removeItem(item.id)}
                                >
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Remove
                                </Button>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">
                                {formatTZS(item.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ),
                )}

                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Continue Shopping
                </Link>
              </>
            )}

            {/* Delivery Step */}
            {step === "delivery" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Delivery Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="fullName"
                          value={deliveryInfo.fullName}
                          onChange={(e) =>
                            setDeliveryInfo({
                              ...deliveryInfo,
                              fullName: e.target.value,
                            })
                          }
                          placeholder="Enter your full name"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          value={deliveryInfo.phone}
                          onChange={(e) =>
                            setDeliveryInfo({
                              ...deliveryInfo,
                              phone: e.target.value,
                            })
                          }
                          placeholder="+255 XXX XXX XXX"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="region">Region</Label>
                      <Select
                        value={deliveryInfo.region}
                        onValueChange={(value) =>
                          setDeliveryInfo({ ...deliveryInfo, region: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          {regions.map((region) => (
                            <SelectItem key={region} value={region}>
                              {region}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="district">District</Label>
                      <Input
                        id="district"
                        value={deliveryInfo.district}
                        onChange={(e) =>
                          setDeliveryInfo({
                            ...deliveryInfo,
                            district: e.target.value,
                          })
                        }
                        placeholder="Enter district"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ward">Ward</Label>
                      <Input
                        id="ward"
                        value={deliveryInfo.ward}
                        onChange={(e) =>
                          setDeliveryInfo({
                            ...deliveryInfo,
                            ward: e.target.value,
                          })
                        }
                        placeholder="Enter ward"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Textarea
                        id="address"
                        value={deliveryInfo.address}
                        onChange={(e) =>
                          setDeliveryInfo({
                            ...deliveryInfo,
                            address: e.target.value,
                          })
                        }
                        placeholder="Enter your detailed street address"
                        className="pl-10 min-h-[80px]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Delivery Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={deliveryInfo.notes}
                      onChange={(e) =>
                        setDeliveryInfo({
                          ...deliveryInfo,
                          notes: e.target.value,
                        })
                      }
                      placeholder="Any special delivery instructions..."
                      className="min-h-[60px]"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Step */}
            {step === "payment" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                  >
                    <div className="grid gap-4">
                      {[
                        {
                          value: "mpesa",
                          label: "M-Pesa",
                          description: "Pay with Vodacom M-Pesa",
                        },
                        {
                          value: "tigopesa",
                          label: "Tigo Pesa",
                          description: "Pay with Tigo Pesa",
                        },
                        {
                          value: "airtelmoney",
                          label: "Airtel Money",
                          description: "Pay with Airtel Money",
                        },
                        {
                          value: "halopesa",
                          label: "Halo Pesa",
                          description: "Pay with Halotel Halo Pesa",
                        },
                        {
                          value: "cod",
                          label: "Cash on Delivery",
                          description: "Pay when you receive your order",
                        },
                      ].map((method) => (
                        <div
                          key={method.value}
                          className={cn(
                            "flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors",
                            paymentMethod === method.value
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50",
                          )}
                          onClick={() => setPaymentMethod(method.value)}
                        >
                          <RadioGroupItem
                            value={method.value}
                            id={method.value}
                          />
                          <div className="flex-1">
                            <Label
                              htmlFor={method.value}
                              className="font-medium cursor-pointer"
                            >
                              {method.label}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              {method.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>

                  {paymentMethod !== "cod" && (
                    <div className="space-y-2 pt-4 border-t border-border">
                      <Label htmlFor="mobileNumber">Mobile Money Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="mobileNumber"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          placeholder="+255 XXX XXX XXX"
                          className="pl-10"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        You will receive a payment prompt on this number
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Confirmation Step */}
            {step === "confirmation" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden shrink-0">
                          {item.image.startsWith("http") ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                              IMG
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium">
                          {formatTZS(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">{deliveryInfo.fullName}</p>
                        <p className="text-muted-foreground">
                          {deliveryInfo.phone}
                        </p>
                        <p className="text-muted-foreground">
                          {deliveryInfo.address}, {deliveryInfo.ward},{" "}
                          {deliveryInfo.district}, {deliveryInfo.region}
                        </p>
                        {deliveryInfo.notes && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Note: {deliveryInfo.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium capitalize">
                          {paymentMethod.replace("_", " ")}
                        </p>
                        {paymentMethod !== "cod" && mobileNumber && (
                          <p className="text-muted-foreground">
                            {mobileNumber}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Coupon code */}
                {step === "cart" && (
                  <div className="space-y-2">
                    <Label>Coupon Code</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Enter code"
                          className="pl-10"
                          disabled={couponApplied}
                        />
                      </div>
                      <Button
                        variant="outline"
                        onClick={handleApplyCoupon}
                        disabled={couponApplied || !couponCode}
                      >
                        Apply
                      </Button>
                    </div>
                    {couponApplied && (
                      <p className="text-sm text-green-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        10% discount applied!
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Try: SOKO10 for 10% off
                    </p>
                  </div>
                )}

                <Separator />

                {/* Price breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatTZS(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount (10%)</span>
                      <span>-{formatTZS(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span>
                      {deliveryFee === 0 ? "FREE" : formatTZS(deliveryFee)}
                    </span>
                  </div>
                  {deliveryFee === 0 && (
                    <p className="text-xs text-green-600">
                      Free delivery on orders over TZS 100,000
                    </p>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatTZS(total)}</span>
                </div>

                {/* Action button */}
                {step === "cart" && (
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => setStep("delivery")}
                    disabled={items.length === 0}
                  >
                    Proceed to Delivery
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}

                {step === "delivery" && (
                  <div className="space-y-2">
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => setStep("payment")}
                      disabled={
                        !deliveryInfo.fullName ||
                        !deliveryInfo.phone ||
                        !deliveryInfo.region ||
                        !deliveryInfo.address
                      }
                    >
                      Continue to Payment
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setStep("cart")}
                    >
                      Back to Cart
                    </Button>
                  </div>
                )}

                {step === "payment" && (
                  <div className="space-y-2">
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => setStep("confirmation")}
                      disabled={paymentMethod !== "cod" && !mobileNumber}
                    >
                      Review Order
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setStep("delivery")}
                    >
                      Back to Delivery
                    </Button>
                  </div>
                )}

                {step === "confirmation" && (
                  <div className="space-y-2">
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Processing..." : "Place Order"}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setStep("payment")}
                    >
                      Back to Payment
                    </Button>
                  </div>
                )}

                {/* Trust badges */}
                <div className="pt-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="w-4 h-4 text-primary" />
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Truck className="w-4 h-4 text-primary" />
                    <span>Delivery across Tanzania</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <DialogTitle className="text-center">
              Order Placed Successfully!
            </DialogTitle>
            <DialogDescription className="text-center">
              Your order has been placed and you will receive a confirmation
              shortly. Order number:{" "}
              <span className="font-medium">
                ORD-{Date.now().toString().slice(-6)}
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 mt-4">
            <Button onClick={handleOrderComplete}>View My Orders</Button>
            <Link href="/">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

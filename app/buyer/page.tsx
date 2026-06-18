"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  MessageCircle,
  ShoppingBag,
  MessageSquare,
  Eye,
  ArrowRight,
  Package,
  Clock,
  MapPin,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore, useWishlistStore, useCartStore } from "@/lib/store";
import { mockProducts, formatTZS, formatRelativeTime } from "@/lib/data";

const recentlyViewed = mockProducts.slice(0, 4);

const statusColors: Record<string, string> = {
  delivered: "bg-green-100 text-green-700",
  shipped: "bg-blue-100 text-blue-700",
  processing: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-700",
  pending: "bg-gray-100 text-gray-700",
  confirmed: "bg-indigo-100 text-indigo-700",
};

export default function BuyerDashboard() {
  const { user } = useAuthStore();
  const wishlistItems = useWishlistStore((state) => state.items);
  const cartItems = useCartStore((state) => state.getTotalItems());

  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      try {
        setLoadingOrders(true);
        const res = await fetch(`/api/orders?buyer_id=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          const orders = data.orders || [];
          setRecentOrders(
            orders.map((o: any) => ({
              id: o.order_number || o.id,
              product: `${o.items?.[0]?.product_title || "Product"} ${o.items?.length > 1 ? `+${o.items.length - 1} more` : ""}`,
              price: o.total_amount,
              status: o.status,
              date: new Date(o.created_at).toLocaleDateString(),
            })),
          );
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoadingOrders(false);
      }
    }
    fetchOrders();
  }, [user]);

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name?.split(" ")[0] || "Shopper"}!
        </h1>
        <p className="text-primary-foreground/80 mb-4">
          Here&apos;s an overview of your account activity.
        </p>
        <Link href="/">
          <Button variant="secondary" className="gap-2">
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{recentOrders.length}</p>
                <p className="text-xs text-muted-foreground">Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{wishlistItems.length}</p>
                <p className="text-xs text-muted-foreground">Wishlist</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <Package className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{cartItems}</p>
                <p className="text-xs text-muted-foreground">In Cart</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">5</p>
                <p className="text-xs text-muted-foreground">Messages</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Link href="/buyer/orders">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {loadingOrders ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No orders yet</p>
                  <Link href="/">
                    <Button className="mt-4">Start Shopping</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                        IMG
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm text-muted-foreground">
                            {order.id}
                          </p>
                          <Badge
                            className={
                              statusColors[
                                order.status as keyof typeof statusColors
                              ]
                            }
                            variant="secondary"
                          >
                            {order.status}
                          </Badge>
                        </div>
                        <h4 className="font-medium truncate">
                          {order.product}
                        </h4>
                        <p className="text-sm text-primary font-semibold">
                          {formatTZS(order.price)}
                        </p>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {order.date}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Account info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{user?.name || "Not set"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user?.email || "Not set"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{user?.phone || "Not set"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {user?.location || "Not set"}
                </p>
              </div>
              <Link href="/buyer/settings">
                <Button variant="outline" className="w-full mt-2">
                  Edit Profile
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/buyer/wishlist" className="block">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  View Wishlist
                </Button>
              </Link>
              <Link href="/cart" className="block">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  View Cart
                </Button>
              </Link>
              <Link href="/buyer/messages" className="block">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Messages
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recently viewed */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recently Viewed</CardTitle>
          <Link href="/buyer/history">
            <Button variant="ghost" size="sm" className="gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentlyViewed.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <div className="group">
                  <div className="aspect-square rounded-lg bg-muted mb-2 flex items-center justify-center text-muted-foreground">
                    IMG
                  </div>
                  <h4 className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                    {product.title}
                  </h4>
                  <p className="text-sm font-bold text-primary">
                    {formatTZS(product.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

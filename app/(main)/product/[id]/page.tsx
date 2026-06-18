"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  MessageCircle,
  Share2,
  MapPin,
  Clock,
  Eye,
  BadgeCheck,
  Phone,
  ChevronLeft,
  ChevronRight,
  Flag,
  Shield,
  Star,
  ExternalLink,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ProductCard } from "@/components/product-card";
import { categories, formatTZS, formatRelativeTime, Product } from "@/lib/data";
import {
  useWishlistStore,
  useThemeStore,
  useCartStore,
  useChatStore,
  useAuthStore,
} from "@/lib/store";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const { themeId } = useThemeStore();
  const { isInWishlist, addItem, removeItem } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addItem);
  const router = useRouter();
  const { addConversation, setActiveConversation, getConversation } =
    useChatStore();
  const { user } = useAuthStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPhone, setShowPhone] = useState(false);

  const [product, setProduct] = useState<any>(null);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const [productRes, similarRes] = await Promise.all([
          fetch(`/api/products/${productId}`),
          fetch(`/api/products?limit=4`), // you would typically pass category here
        ]);

        if (productRes.ok) {
          const data = await productRes.json();
          const p = data.product;
          if (p) {
            setProduct({
              id: p.id,
              title: p.title,
              description: p.description,
              price: p.price,
              currency: p.currency,
              images: p.images?.length
                ? p.images
                : [
                    "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800",
                  ],
              categoryId: p.category_id,
              sellerName: p.seller_name || "Verified Seller",
              sellerVerified: p.seller_verified ?? true,
              location: p.region,
              condition: p.condition,
              featured: p.is_featured,
              createdAt: p.created_at,
              views: p.views_count,
            });
            // Refetch similar products using the category ID if possible
            const simRes = await fetch(
              `/api/products?category=${p.category_id}&limit=4`,
            );
            if (simRes.ok) {
              const simData = await simRes.json();
              setSimilarProducts(
                (simData.data || [])
                  .map((sp: any) => ({
                    id: sp.id,
                    title: sp.title,
                    price: sp.price,
                    images: sp.images?.length
                      ? sp.images
                      : [
                          "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800",
                        ],
                    location: sp.region,
                  }))
                  .filter((sp: any) => sp.id !== productId),
              );
            }
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productId]);

  // Get category info
  const category = useMemo(
    () => categories.find((c) => c.id === product?.categoryId),
    [product],
  );

  const subcategory = useMemo(
    () => category?.subcategories.find((s) => s.id === product?.subcategoryId),
    [category, product],
  );

  const isWishlisted = product ? isInWishlist(product.id) : false;

  const handleWishlistToggle = () => {
    if (!product) return;
    if (isWishlisted) {
      removeItem(product.id);
    } else {
      addItem(product.id);
    }
  };

  const handleStartChat = () => {
    if (!product || !user) {
      // Redirect to login if not logged in
      window.location.href = "/auth/login";
      return;
    }

    // Check if conversation already exists
    const existing = getConversation(product.id, product.sellerId);
    if (existing) {
      setActiveConversation(existing.id);
      router.push("/messages");
      return;
    }

    // Create new conversation
    const conversationId = addConversation({
      productId: product.id,
      productTitle: product.title,
      productImage: product.images[0] || "",
      productPrice: product.price,
      buyerId: user.id,
      buyerName: user.name,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
      sellerVerified: product.sellerVerified,
    });

    setActiveConversation(conversationId);
    router.push("/messages");
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      productId: product.id,
      name: product.title,
      price: product.price,
      quantity: 1,
      image: product.images[0] || "",
      sellerId: product.sellerId,
      sellerName: product.sellerName,
    });
  };

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The listing you are looking for does not exist or has been removed.
        </p>
        <Link href="/">
          <Button>Go Back Home</Button>
        </Link>
      </div>
    );
  }

  // Use actual images if available
  const productImages =
    product.images.length > 0
      ? product.images
      : ["https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800"];

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div
        className={cn(
          "border-b border-border",
          themeId === "safari" && "bg-muted/30",
          themeId === "ocean" &&
            "bg-gradient-to-r from-primary/5 via-background to-accent/5",
          themeId === "kilimanjaro" && "bg-muted",
          themeId === "serengeti" && "bg-muted/20",
        )}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            {category && (
              <>
                <Link
                  href={`/category/${category.slug}`}
                  className="hover:text-foreground transition-colors"
                >
                  {category.name}
                </Link>
                <span>/</span>
              </>
            )}
            {subcategory && (
              <>
                <Link
                  href={`/category/${category?.slug}?subcategory=${subcategory.id}`}
                  className="hover:text-foreground transition-colors"
                >
                  {subcategory.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-foreground truncate max-w-[200px]">
              {product.title}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card
              className={cn(
                "overflow-hidden",
                themeId === "safari" && "rounded-xl",
                themeId === "ocean" && "rounded-2xl",
                themeId === "kilimanjaro" && "rounded-none border-2",
                themeId === "serengeti" && "rounded-3xl",
              )}
            >
              <div className="relative aspect-[4/3] bg-muted">
                {productImages[currentImageIndex]?.startsWith("http") ? (
                  <Image
                    src={productImages[currentImageIndex]}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    <span className="text-6xl font-light opacity-40">IMG</span>
                  </div>
                )}

                {/* Image navigation */}
                {productImages.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="icon"
                      className={cn(
                        "absolute left-4 top-1/2 -translate-y-1/2",
                        themeId === "kilimanjaro" && "rounded-none",
                      )}
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          prev === 0 ? productImages.length - 1 : prev - 1,
                        )
                      }
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className={cn(
                        "absolute right-4 top-1/2 -translate-y-1/2",
                        themeId === "kilimanjaro" && "rounded-none",
                      )}
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          prev === productImages.length - 1 ? 0 : prev + 1,
                        )
                      }
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.featured && (
                    <Badge
                      className={cn(
                        "bg-accent text-accent-foreground",
                        themeId === "kilimanjaro" &&
                          "rounded-none uppercase font-bold",
                      )}
                    >
                      Featured
                    </Badge>
                  )}
                  {product.promoted && (
                    <Badge
                      variant="secondary"
                      className={cn(
                        themeId === "kilimanjaro" &&
                          "rounded-none uppercase font-bold",
                      )}
                    >
                      Promoted
                    </Badge>
                  )}
                </div>

                {/* Action buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    className={cn(themeId === "kilimanjaro" && "rounded-none")}
                    onClick={handleStartChat}
                  >
                    <MessageCircle className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className={cn(themeId === "kilimanjaro" && "rounded-none")}
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>

                {/* Image counter */}
                <div className="absolute bottom-4 right-4">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "bg-background/80 backdrop-blur-sm",
                      themeId === "kilimanjaro" && "rounded-none",
                    )}
                  >
                    {currentImageIndex + 1} / {productImages.length}
                  </Badge>
                </div>
              </div>

              {/* Thumbnail strip */}
              {productImages.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      className={cn(
                        "relative w-20 h-20 shrink-0 bg-muted overflow-hidden border-2 transition-colors",
                        index === currentImageIndex
                          ? "border-primary"
                          : "border-transparent",
                        themeId === "safari" && "rounded-lg",
                        themeId === "ocean" && "rounded-xl",
                        themeId === "kilimanjaro" && "rounded-none",
                        themeId === "serengeti" && "rounded-xl",
                      )}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      {img.startsWith("http") ? (
                        <Image
                          src={img}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs">
                          IMG
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </Card>

            {/* Product Details */}
            <Card
              className={cn(
                themeId === "safari" && "rounded-xl",
                themeId === "ocean" && "rounded-2xl",
                themeId === "kilimanjaro" && "rounded-none border-2",
                themeId === "serengeti" && "rounded-3xl",
              )}
            >
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "capitalize",
                          themeId === "kilimanjaro" && "rounded-none uppercase",
                        )}
                      >
                        {product.condition}
                      </Badge>
                      {product.negotiable && (
                        <Badge
                          variant="outline"
                          className={cn(
                            themeId === "kilimanjaro" &&
                              "rounded-none uppercase",
                          )}
                        >
                          Negotiable
                        </Badge>
                      )}
                    </div>
                    <CardTitle
                      className={cn(
                        "text-xl md:text-2xl",
                        themeId === "kilimanjaro" && "uppercase tracking-tight",
                      )}
                    >
                      {product.title}
                    </CardTitle>
                  </div>
                  <p
                    className={cn(
                      "text-2xl md:text-3xl font-bold text-primary shrink-0",
                      themeId === "kilimanjaro" && "text-4xl",
                    )}
                  >
                    {formatTZS(product.price)}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Meta info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {product.location}, {product.region}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    Posted {formatRelativeTime(product.createdAt)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    {product.views} views
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4" />
                    {product.favorites} chats
                  </span>
                </div>

                <Separator />

                {/* Description */}
                <div>
                  <h3 className="font-semibold mb-3">Description</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>

                <Separator />

                {/* Details */}
                <div>
                  <h3 className="font-semibold mb-3">Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category</span>
                      <span className="font-medium">{category?.name}</span>
                    </div>
                    {subcategory && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Subcategory
                        </span>
                        <span className="font-medium">{subcategory.name}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Condition</span>
                      <span className="font-medium capitalize">
                        {product.condition}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location</span>
                      <span className="font-medium">{product.region}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Card
              className={cn(
                "bg-muted/50",
                themeId === "safari" && "rounded-xl",
                themeId === "ocean" && "rounded-2xl",
                themeId === "kilimanjaro" && "rounded-none border-2",
                themeId === "serengeti" && "rounded-3xl",
              )}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Safety Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>- Meet in a safe, public place</li>
                  <li>- Check the item before you pay</li>
                  <li>- Pay only after inspecting the item</li>
                  <li>
                    - Never send money in advance or use mobile money for
                    deposits
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Seller Info & Actions */}
          <div className="space-y-6">
            {/* Price Card (Mobile) */}
            <Card
              className={cn(
                "lg:hidden",
                themeId === "safari" && "rounded-xl",
                themeId === "ocean" && "rounded-2xl",
                themeId === "kilimanjaro" && "rounded-none border-2",
                themeId === "serengeti" && "rounded-3xl",
              )}
            >
              <CardContent className="p-4">
                <p
                  className={cn(
                    "text-3xl font-bold text-primary mb-4",
                    themeId === "kilimanjaro" && "text-4xl",
                  )}
                >
                  {formatTZS(product.price)}
                </p>
                <div className="flex gap-2">
                  <Button className="flex-1 gap-2" onClick={handleAddToCart}>
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={handleStartChat}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Seller Card */}
            <Card
              className={cn(
                "sticky top-24",
                themeId === "safari" && "rounded-xl",
                themeId === "ocean" && "rounded-2xl",
                themeId === "kilimanjaro" && "rounded-none border-2",
                themeId === "serengeti" && "rounded-3xl",
              )}
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="w-14 h-14">
                    <AvatarFallback className="bg-primary/10 text-primary text-lg">
                      {product.sellerName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">
                        {product.sellerName}
                      </h3>
                      {product.sellerVerified && (
                        <BadgeCheck className="w-5 h-5 text-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Member since Jan 2023
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Seller stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div
                    className={cn(
                      "p-2 bg-muted",
                      themeId === "safari" && "rounded-lg",
                      themeId === "ocean" && "rounded-xl",
                      themeId === "kilimanjaro" && "rounded-none",
                      themeId === "serengeti" && "rounded-xl",
                    )}
                  >
                    <p className="text-lg font-bold">24</p>
                    <p className="text-xs text-muted-foreground">Listings</p>
                  </div>
                  <div
                    className={cn(
                      "p-2 bg-muted",
                      themeId === "safari" && "rounded-lg",
                      themeId === "ocean" && "rounded-xl",
                      themeId === "kilimanjaro" && "rounded-none",
                      themeId === "serengeti" && "rounded-xl",
                    )}
                  >
                    <p className="text-lg font-bold flex items-center justify-center gap-1">
                      4.8 <Star className="w-3 h-3 fill-primary text-primary" />
                    </p>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                  <div
                    className={cn(
                      "p-2 bg-muted",
                      themeId === "safari" && "rounded-lg",
                      themeId === "ocean" && "rounded-xl",
                      themeId === "kilimanjaro" && "rounded-none",
                      themeId === "serengeti" && "rounded-xl",
                    )}
                  >
                    <p className="text-lg font-bold">98%</p>
                    <p className="text-xs text-muted-foreground">Response</p>
                  </div>
                </div>

                <Separator />

                {/* Contact buttons */}
                <div className="space-y-3">
                  <Button
                    className={cn(
                      "w-full gap-2",
                      themeId === "kilimanjaro" &&
                        "rounded-none uppercase font-bold h-12",
                    )}
                    onClick={() => setShowPhone(!showPhone)}
                  >
                    <Phone className="w-4 h-4" />
                    {showPhone ? "+255 XXX XXX XXX" : "Show Phone Number"}
                  </Button>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full gap-2",
                      themeId === "kilimanjaro" &&
                        "rounded-none uppercase font-bold h-12",
                    )}
                    onClick={handleStartChat}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Start Chat
                  </Button>
                </div>

                <Separator />

                {/* View seller profile */}
                <Button
                  variant="ghost"
                  className="w-full justify-between"
                  asChild
                >
                  <Link href={`/seller/${product.sellerId}`}>
                    View Seller Profile
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </Button>

                {/* Report */}
                <Button
                  variant="ghost"
                  className="w-full justify-start text-muted-foreground hover:text-destructive"
                >
                  <Flag className="w-4 h-4 mr-2" />
                  Report this listing
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-12">
            <h2
              className={cn(
                "text-2xl font-bold mb-6",
                themeId === "kilimanjaro" && "uppercase tracking-tight",
              )}
            >
              Similar Listings
            </h2>
            <div
              className={cn(
                "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4",
                themeId === "kilimanjaro" && "gap-1",
                themeId === "ocean" && "gap-6",
                themeId === "serengeti" && "gap-6",
              )}
            >
              {similarProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

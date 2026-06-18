'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { MessageCircle, MapPin, Eye, Clock, BadgeCheck, Star, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Product, formatTZS, formatRelativeTime } from '@/lib/data';
import { useThemeStore, useChatStore, useAuthStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'horizontal' | 'compact';
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const { themeId } = useThemeStore();
  const router = useRouter();
  const { user } = useAuthStore();
  const { addConversation, setActiveConversation, getConversation } = useChatStore();

  const handleStartChat = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      window.location.href = "/auth/login";
      return;
    }

    if (user.id === product.sellerId) {
      // Cannot chat with yourself
      router.push("/messages");
      return;
    }

    const existing = getConversation(product.id, product.sellerId);
    if (existing) {
      setActiveConversation(existing.id);
      router.push("/messages");
      return;
    }

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

  // Theme-specific card styles
  const cardStyles = {
    safari: 'rounded-xl hover:shadow-lg',
    ocean: 'rounded-2xl backdrop-blur-sm bg-card/80 hover:shadow-xl hover:shadow-primary/10 border-primary/10',
    kilimanjaro: 'rounded-none border-2 hover:border-primary hover:shadow-2xl',
    serengeti: 'rounded-3xl hover:shadow-md hover:-translate-y-1',
  };

  // Theme-specific image container styles
  const imageStyles = {
    safari: 'aspect-[4/3] rounded-t-xl',
    ocean: 'aspect-square rounded-2xl m-2',
    kilimanjaro: 'aspect-[16/10]',
    serengeti: 'aspect-[4/3] rounded-t-3xl',
  };

  // Theme-specific badge styles
  const badgeStyles = {
    safari: 'rounded-md',
    ocean: 'rounded-full',
    kilimanjaro: 'rounded-none font-bold uppercase text-xs',
    serengeti: 'rounded-full px-3',
  };

  if (variant === 'horizontal') {
    return (
      <Link href={`/product/${product.id}`}>
        <Card className={cn('overflow-hidden transition-all group', cardStyles[themeId])}>
          <div className="flex">
            <div className={cn('relative w-40 h-32 shrink-0 bg-muted overflow-hidden', 
              themeId === 'ocean' && 'rounded-xl m-2',
              themeId === 'kilimanjaro' && 'w-48'
            )}>
              {product.images && product.images[0] && (product.images[0].startsWith('http') || product.images[0].startsWith('data:') || product.images[0].startsWith('/')) ? (
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="160px"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-gradient-to-br from-muted to-muted/50">
                  <span className="text-3xl font-light opacity-50">IMG</span>
                </div>
              )}
              {product.featured && (
                <Badge className={cn('absolute top-2 left-2 bg-accent text-accent-foreground z-10', badgeStyles[themeId])}>
                  {themeId === 'kilimanjaro' ? 'TOP' : 'Featured'}
                </Badge>
              )}
            </div>
            <CardContent className="flex-1 p-4">
              <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                {product.title}
              </h3>
              <p className={cn('text-lg font-bold text-primary mt-1',
                themeId === 'kilimanjaro' && 'text-xl',
                themeId === 'ocean' && 'text-primary/90'
              )}>
                {formatTZS(product.price)}
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>{product.location}</span>
              </div>
            </CardContent>
          </div>
        </Card>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href={`/product/${product.id}`}>
        <div className={cn('flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors group',
          themeId === 'kilimanjaro' && 'rounded-none border-l-2 border-transparent hover:border-primary',
          themeId === 'ocean' && 'rounded-xl',
          themeId === 'serengeti' && 'rounded-2xl'
        )}>
          <div className={cn('w-16 h-16 bg-muted shrink-0 flex items-center justify-center text-muted-foreground text-xs',
            themeId === 'safari' && 'rounded-lg',
            themeId === 'ocean' && 'rounded-xl',
            themeId === 'kilimanjaro' && 'rounded-none',
            themeId === 'serengeti' && 'rounded-2xl'
          )}>
            IMG
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium truncate group-hover:text-primary transition-colors">
              {product.title}
            </h4>
            <p className="text-sm font-bold text-primary">{formatTZS(product.price)}</p>
          </div>
        </div>
      </Link>
    );
  }

  // Default card - completely different designs per theme
  return (
    <Link href={`/product/${product.id}`}>
      <Card className={cn('overflow-hidden transition-all group h-full', cardStyles[themeId])}>
        {/* SAFARI THEME - Classic rounded design */}
        {themeId === 'safari' && (
          <>
            <div className={cn('relative bg-muted overflow-hidden', imageStyles[themeId])}>
              {product.images && product.images[0] && (product.images[0].startsWith('http') || product.images[0].startsWith('data:') || product.images[0].startsWith('/')) ? (
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-gradient-to-br from-muted to-muted/50">
                  <span className="text-5xl font-light opacity-40">IMG</span>
                </div>
              )}
              
              <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                {product.featured && (
                  <Badge className="bg-accent text-accent-foreground">Featured</Badge>
                )}
                {product.promoted && (
                  <Badge variant="secondary">Promoted</Badge>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'absolute top-2 right-2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background z-10',
                )}
                onClick={handleStartChat}
              >
                <MessageCircle className="w-4 h-4" />
              </Button>

              <Badge variant="outline" className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm text-xs capitalize z-10">
                {product.condition}
              </Badge>
            </div>

            <CardContent className="p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-lg font-bold text-primary">{formatTZS(product.price)}</p>
                {product.negotiable && (
                  <Badge variant="outline" className="text-xs shrink-0">Negotiable</Badge>
                )}
              </div>
              <h3 className="font-medium text-sm mt-1 line-clamp-2 group-hover:text-primary transition-colors min-h-[2.5rem]">
                {product.title}
              </h3>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{product.location}, {product.region}</span>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  {product.sellerVerified && <BadgeCheck className="w-4 h-4 text-primary" />}
                  <span className="truncate max-w-[80px]">{product.sellerName}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />{product.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />{formatRelativeTime(product.createdAt)}
                  </span>
                </div>
              </div>
            </CardContent>
          </>
        )}

        {/* OCEAN THEME - Glass morphism with floating design */}
        {themeId === 'ocean' && (
          <>
            <div className={cn('relative bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden', imageStyles[themeId])}>
              {product.images && product.images[0] && (product.images[0].startsWith('http') || product.images[0].startsWith('data:') || product.images[0].startsWith('/')) ? (
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-primary/20">
                  <span className="text-5xl font-extralight">IMG</span>
                </div>
              )}
              
              {(product.featured || product.promoted) && (
                <div className="absolute top-3 left-3 flex gap-1 z-10">
                  {product.featured && (
                    <Badge className="bg-primary/90 text-primary-foreground rounded-full px-3 gap-1">
                      <Sparkles className="w-3 h-3" /> Featured
                    </Badge>
                  )}
                </div>
              )}

              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'absolute top-3 right-3 w-9 h-9 rounded-full bg-background/60 backdrop-blur-md hover:bg-background/80 border border-border/50 z-10',
                )}
                onClick={handleStartChat}
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
            </div>

            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="rounded-full text-xs capitalize bg-muted/80">
                  {product.condition}
                </Badge>
                {product.negotiable && (
                  <Badge variant="outline" className="rounded-full text-xs">Negotiable</Badge>
                )}
              </div>
              
              <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors min-h-[2.5rem]">
                {product.title}
              </h3>
              
              <p className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mt-2">
                {formatTZS(product.price)}
              </p>

              <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary/60" />
                <span>{product.location}</span>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                    {product.sellerVerified ? (
                      <BadgeCheck className="w-4 h-4 text-primary" />
                    ) : (
                      <span className="text-xs font-medium text-primary">
                        {product.sellerName.charAt(0)}
                      </span>
                    )}
                  </div>
                  <span className="text-sm">{product.sellerName}</span>
                </div>
                <span className="text-xs text-muted-foreground">{formatRelativeTime(product.createdAt)}</span>
              </div>
            </CardContent>
          </>
        )}

        {/* KILIMANJARO THEME - Bold, sharp, high contrast */}
        {themeId === 'kilimanjaro' && (
          <>
            <div className={cn('relative bg-muted overflow-hidden', imageStyles[themeId])}>
              {product.images && product.images[0] && (product.images[0].startsWith('http') || product.images[0].startsWith('data:') || product.images[0].startsWith('/')) ? (
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <span className="text-6xl font-black opacity-20">IMG</span>
                </div>
              )}
              
              {product.featured && (
                <div className="absolute top-0 left-0 bg-primary text-primary-foreground px-3 py-1 z-10">
                  <span className="text-xs font-bold uppercase tracking-wider">Top Pick</span>
                </div>
              )}
              
              {product.promoted && (
                <div className="absolute top-0 right-0 bg-accent text-accent-foreground px-3 py-1 z-10">
                  <span className="text-xs font-bold uppercase tracking-wider">Ad</span>
                </div>
              )}

              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'absolute bottom-2 right-2 w-10 h-10 rounded-none bg-background border-2 border-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary z-10',
                )}
                onClick={handleStartChat}
              >
                <MessageCircle className="w-5 h-5" />
              </Button>
            </div>

            <CardContent className="p-4">
              <p className="text-3xl font-black text-primary tracking-tight">
                {formatTZS(product.price)}
              </p>
              
              <h3 className="font-bold text-base mt-2 line-clamp-2 group-hover:text-primary transition-colors uppercase tracking-wide">
                {product.title}
              </h3>

              <div className="flex items-center gap-4 mt-3 text-sm">
                <Badge variant="outline" className="rounded-none uppercase text-xs font-bold">
                  {product.condition}
                </Badge>
                {product.negotiable && (
                  <span className="text-xs font-bold text-muted-foreground uppercase">Price Flexible</span>
                )}
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t-2 border-foreground/10">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium uppercase">{product.location}</span>
                </div>
                <div className="flex items-center gap-1 text-sm font-bold">
                  <Eye className="w-4 h-4" />
                  {product.views}
                </div>
              </div>

              {product.sellerVerified && (
                <div className="mt-3 flex items-center gap-2 text-xs text-primary font-bold uppercase">
                  <BadgeCheck className="w-4 h-4" />
                  Verified Seller
                </div>
              )}
            </CardContent>
          </>
        )}

        {/* SERENGETI THEME - Organic, soft, nature-inspired */}
        {themeId === 'serengeti' && (
          <>
            <div className={cn('relative bg-gradient-to-br from-primary/10 via-muted to-accent/10 overflow-hidden', imageStyles[themeId])}>
              {product.images && product.images[0] && (product.images[0].startsWith('http') || product.images[0].startsWith('data:') || product.images[0].startsWith('/')) ? (
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl text-primary/10 font-serif italic">IMG</span>
                </div>
              )}
              
              <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
                {product.featured && (
                  <Badge className="bg-primary text-primary-foreground rounded-full px-4 py-1 gap-1.5 shadow-lg">
                    <Star className="w-3 h-3 fill-current" /> Featured
                  </Badge>
                )}
                {product.promoted && (
                  <Badge className="bg-accent text-accent-foreground rounded-full px-4 py-1 shadow-lg">
                    Sponsored
                  </Badge>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'absolute top-3 right-3 w-10 h-10 rounded-full bg-background shadow-lg hover:shadow-xl hover:scale-110 transition-all z-10',
                )}
                onClick={handleStartChat}
              >
                <MessageCircle className="w-5 h-5" />
              </Button>

              <div className="absolute bottom-3 left-3 z-10">
                <Badge className="bg-background/90 backdrop-blur-sm text-foreground rounded-full px-3 capitalize shadow">
                  {product.condition}
                </Badge>
              </div>
            </div>

            <CardContent className="p-5">
              <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                {product.title}
              </h3>
              
              <div className="flex items-baseline gap-2 mt-2">
                <p className="text-2xl font-bold text-primary">
                  {formatTZS(product.price)}
                </p>
                {product.negotiable && (
                  <span className="text-sm text-muted-foreground italic">negotiable</span>
                )}
              </div>

              <div className="flex items-center gap-2 mt-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  {product.sellerVerified ? (
                    <BadgeCheck className="w-5 h-5 text-primary" />
                  ) : (
                    <span className="text-sm font-semibold text-primary">
                      {product.sellerName.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{product.sellerName}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {product.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" /> {product.views} views
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> {formatRelativeTime(product.createdAt)}
                </span>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </Link>
  );
}

// Theme-aware Product grid component
interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4 | 5;
}

export function ProductGrid({ products, columns = 4 }: ProductGridProps) {
  const { themeId } = useThemeStore();
  
  // Different grid layouts per theme
  const gridStyles = {
    safari: {
      2: 'grid-cols-1 sm:grid-cols-2 gap-4',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4',
      4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4',
      5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4',
    },
    ocean: {
      2: 'grid-cols-1 sm:grid-cols-2 gap-6',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
      5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6',
    },
    kilimanjaro: {
      2: 'grid-cols-1 sm:grid-cols-2 gap-1',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1',
      4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1',
      5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1',
    },
    serengeti: {
      2: 'grid-cols-1 sm:grid-cols-2 gap-8',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8',
      5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8',
    },
  };

  return (
    <div className={cn('grid', gridStyles[themeId][columns])}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

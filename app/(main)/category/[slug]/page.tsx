"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Filter,
  SlidersHorizontal,
  Grid3X3,
  List,
  ChevronDown,
  X,
  MapPin,
  Search,
  ArrowLeft,
  Car,
  Smartphone,
  Home,
  Shirt,
  Sofa,
  Briefcase,
  Wrench,
  Wheat,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { ProductCard, ProductGrid } from "@/components/product-card";
import { categories, regions, formatTZS, Category, Product } from "@/lib/data";
import { useThemeStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Car,
  Smartphone,
  Home,
  Shirt,
  Sofa,
  Briefcase,
  Wrench,
  Wheat,
};

interface FilterState {
  subcategory: string | null;
  condition: string[];
  minPrice: number;
  maxPrice: number;
  region: string | null;
  search: string;
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const category = categories.find((c) => c.slug === slug);
  const { themeId } = useThemeStore();

  // State
  const [filters, setFilters] = useState<FilterState>({
    subcategory: null,
    condition: [],
    minPrice: 0,
    maxPrice: 1000000000,
    region: null,
    search: "",
  });
  const [sortBy, setSortBy] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategoryProducts() {
      if (!category) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await fetch(
          `/api/products?category=${category.id}&limit=100`,
        );
        if (res.ok) {
          const data = await res.json();
          setAllProducts(
            (data.products || []).map((p: any) => ({
              id: p.id,
              title: p.title,
              description: p.description,
              price: p.price,
              currency: p.currency,
              images: p.images?.length
                ? p.images
                : p.primary_image
                  ? [p.primary_image]
                  : [
                      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800",
                    ],
              categoryId: p.category_id,
              subcategoryId: p.subcategory_id,
              sellerName: p.seller_name || "Verified Seller",
              sellerVerified: p.seller_verified ?? true,
              location: p.region,
              condition: p.condition,
              featured: p.is_featured,
              createdAt: p.created_at,
              views: p.views_count,
            })),
          );
        }
      } catch (error) {
        console.error("Error fetching category products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategoryProducts();
  }, [category]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Apply filters
    if (filters.subcategory) {
      result = result.filter((p) => p.subcategoryId === filters.subcategory);
    }
    if (filters.condition.length > 0) {
      result = result.filter((p) => filters.condition.includes(p.condition));
    }
    if (filters.minPrice > 0) {
      result = result.filter((p) => p.price >= filters.minPrice);
    }
    if (filters.maxPrice < 1000000000) {
      result = result.filter((p) => p.price <= filters.maxPrice);
    }
    if (filters.region) {
      result = result.filter((p) => p.region === filters.region);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower),
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        break;
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        result.sort((a, b) => b.views - a.views);
        break;
      default:
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
    }

    return result;
  }, [allProducts, filters, sortBy]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.subcategory) count++;
    if (filters.condition.length > 0) count++;
    if (filters.minPrice > 0 || filters.maxPrice < 1000000000) count++;
    if (filters.region) count++;
    if (filters.search) count++;
    return count;
  }, [filters]);

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      subcategory: null,
      condition: [],
      minPrice: 0,
      maxPrice: 1000000000,
      region: null,
      search: "",
    });
  };

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The category you are looking for does not exist.
        </p>
        <Link href="/">
          <Button>Go Back Home</Button>
        </Link>
      </div>
    );
  }

  const Icon = iconMap[category.icon] || Smartphone;

  return (
    <div className="min-h-screen bg-background">
      {/* Category Header */}
      <div
        className={cn(
          "border-b border-border",
          themeId === "safari" && "bg-muted/30",
          themeId === "ocean" &&
            "bg-gradient-to-r from-primary/5 via-background to-accent/5",
          themeId === "kilimanjaro" && "bg-foreground text-background",
          themeId === "serengeti" &&
            "bg-gradient-to-br from-primary/5 to-accent/5",
        )}
      >
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <span
              className={cn(themeId === "kilimanjaro" && "text-background/70")}
            >
              {category.name}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "w-14 h-14 flex items-center justify-center",
                  themeId === "safari" && "rounded-xl bg-primary/10",
                  themeId === "ocean" &&
                    "rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20",
                  themeId === "kilimanjaro" && "bg-primary",
                  themeId === "serengeti" &&
                    "rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10",
                )}
              >
                <Icon
                  className={cn(
                    "w-7 h-7",
                    themeId === "kilimanjaro"
                      ? "text-primary-foreground"
                      : "text-primary",
                  )}
                />
              </div>
              <div>
                <h1
                  className={cn(
                    "text-2xl md:text-3xl font-bold",
                    themeId === "kilimanjaro" && "uppercase tracking-tight",
                  )}
                >
                  {category.name}
                </h1>
                <p
                  className={cn(
                    "text-muted-foreground",
                    themeId === "kilimanjaro" && "text-background/60",
                  )}
                >
                  {category.description} - {filteredProducts.length} listings
                </p>
              </div>
            </div>

            {/* Search in category */}
            <div className="w-full md:w-auto md:min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={`Search in ${category.name}...`}
                  className={cn(
                    "pl-9",
                    themeId === "kilimanjaro" &&
                      "rounded-none border-background/30 bg-background/10 text-background placeholder:text-background/50",
                    themeId === "ocean" && "rounded-xl",
                    themeId === "serengeti" && "rounded-xl",
                  )}
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Subcategory quick links */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant={filters.subcategory === null ? "default" : "outline"}
              size="sm"
              className={cn(
                themeId === "kilimanjaro" && "rounded-none uppercase font-bold",
                themeId === "ocean" && "rounded-full",
                themeId === "serengeti" && "rounded-full",
              )}
              onClick={() => setFilters({ ...filters, subcategory: null })}
            >
              All
            </Button>
            {category.subcategories.map((sub) => (
              <Button
                key={sub.id}
                variant={filters.subcategory === sub.id ? "default" : "outline"}
                size="sm"
                className={cn(
                  themeId === "kilimanjaro" &&
                    "rounded-none uppercase font-bold border-background/30 text-background hover:bg-background hover:text-foreground",
                  themeId === "ocean" && "rounded-full",
                  themeId === "serengeti" && "rounded-full",
                  filters.subcategory !== sub.id &&
                    themeId === "kilimanjaro" &&
                    "bg-transparent",
                )}
                onClick={() => setFilters({ ...filters, subcategory: sub.id })}
              >
                {sub.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <FiltersSidebar
              category={category}
              filters={filters}
              setFilters={setFilters}
              clearFilters={clearFilters}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                {/* Mobile filters */}
                <Sheet
                  open={mobileFiltersOpen}
                  onOpenChange={setMobileFiltersOpen}
                >
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "lg:hidden gap-2",
                        themeId === "kilimanjaro" && "rounded-none",
                        themeId === "ocean" && "rounded-xl",
                        themeId === "serengeti" && "rounded-xl",
                      )}
                    >
                      <SlidersHorizontal className="w-4 h-4" />
                      Filters
                      {activeFilterCount > 0 && (
                        <Badge variant="secondary" className="ml-1">
                          {activeFilterCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="w-[300px] sm:w-[350px] overflow-y-auto"
                  >
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FiltersSidebar
                        category={category}
                        filters={filters}
                        setFilters={setFilters}
                        clearFilters={clearFilters}
                      />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Results count */}
                <span className="text-sm text-muted-foreground">
                  {filteredProducts.length} results
                </span>

                {/* Active filter badges */}
                {activeFilterCount > 0 && (
                  <div className="hidden sm:flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={clearFilters}
                    >
                      Clear all
                      <X className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Sort dropdown */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger
                    className={cn(
                      "w-[150px]",
                      themeId === "kilimanjaro" && "rounded-none",
                      themeId === "ocean" && "rounded-xl",
                      themeId === "serengeti" && "rounded-xl",
                    )}
                  >
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>

                {/* View mode toggle */}
                <div className="hidden sm:flex items-center border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-9 w-9 rounded-r-none"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-9 w-9 rounded-l-none"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products */}
            {filteredProducts.length > 0 ? (
              viewMode === "grid" ? (
                <ProductGrid products={filteredProducts} columns={3} />
              ) : (
                <div className="space-y-4">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      variant="horizontal"
                    />
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-16">
                <div
                  className={cn(
                    "w-20 h-20 mx-auto mb-4 flex items-center justify-center",
                    themeId === "safari" && "rounded-2xl bg-muted",
                    themeId === "ocean" &&
                      "rounded-full bg-gradient-to-br from-primary/10 to-accent/10",
                    themeId === "kilimanjaro" && "bg-muted",
                    themeId === "serengeti" && "rounded-3xl bg-muted",
                  )}
                >
                  <Search className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  No listings found
                </h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Filters sidebar component
function FiltersSidebar({
  category,
  filters,
  setFilters,
  clearFilters,
}: {
  category: Category;
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  clearFilters: () => void;
}) {
  const { themeId } = useThemeStore();
  const [priceRange, setPriceRange] = useState([
    filters.minPrice,
    filters.maxPrice,
  ]);

  const handleConditionChange = (condition: string, checked: boolean) => {
    if (checked) {
      setFilters({ ...filters, condition: [...filters.condition, condition] });
    } else {
      setFilters({
        ...filters,
        condition: filters.condition.filter((c) => c !== condition),
      });
    }
  };

  const applyPriceFilter = () => {
    setFilters({
      ...filters,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    });
  };

  return (
    <div className="space-y-6">
      {/* Clear filters button */}
      {(filters.subcategory ||
        filters.condition.length > 0 ||
        filters.minPrice > 0 ||
        filters.maxPrice < 1000000000 ||
        filters.region) && (
        <Button
          variant="outline"
          className={cn(
            "w-full",
            themeId === "kilimanjaro" && "rounded-none",
            themeId === "ocean" && "rounded-xl",
            themeId === "serengeti" && "rounded-xl",
          )}
          onClick={clearFilters}
        >
          Clear All Filters
        </Button>
      )}

      {/* Condition */}
      <Card
        className={cn(
          themeId === "kilimanjaro" && "rounded-none border-2",
          themeId === "ocean" && "rounded-2xl",
          themeId === "serengeti" && "rounded-2xl",
        )}
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Condition</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {["new", "used", "refurbished"].map((condition) => (
            <div key={condition} className="flex items-center space-x-2">
              <Checkbox
                id={`condition-${condition}`}
                checked={filters.condition.includes(condition)}
                onCheckedChange={(checked) =>
                  handleConditionChange(condition, checked as boolean)
                }
              />
              <label
                htmlFor={`condition-${condition}`}
                className="text-sm capitalize cursor-pointer"
              >
                {condition}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card
        className={cn(
          themeId === "kilimanjaro" && "rounded-none border-2",
          themeId === "ocean" && "rounded-2xl",
          themeId === "serengeti" && "rounded-2xl",
        )}
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={priceRange}
            min={0}
            max={100000000}
            step={100000}
            onValueChange={setPriceRange}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm">
            <span>{formatTZS(priceRange[0])}</span>
            <span>{formatTZS(priceRange[1])}</span>
          </div>
          <Button
            size="sm"
            className={cn(
              "w-full",
              themeId === "kilimanjaro" && "rounded-none",
              themeId === "ocean" && "rounded-xl",
              themeId === "serengeti" && "rounded-xl",
            )}
            onClick={applyPriceFilter}
          >
            Apply Price
          </Button>
        </CardContent>
      </Card>

      {/* Region */}
      <Card
        className={cn(
          themeId === "kilimanjaro" && "rounded-none border-2",
          themeId === "ocean" && "rounded-2xl",
          themeId === "serengeti" && "rounded-2xl",
        )}
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Region</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={filters.region || "all"}
            onValueChange={(value) =>
              setFilters({ ...filters, region: value === "all" ? null : value })
            }
          >
            <SelectTrigger
              className={cn(
                themeId === "kilimanjaro" && "rounded-none",
                themeId === "ocean" && "rounded-xl",
                themeId === "serengeti" && "rounded-xl",
              )}
            >
              <SelectValue placeholder="All Regions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {regions.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Subcategories */}
      <Card
        className={cn(
          themeId === "kilimanjaro" && "rounded-none border-2",
          themeId === "ocean" && "rounded-2xl",
          themeId === "serengeti" && "rounded-2xl",
        )}
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Subcategories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <Button
            variant={filters.subcategory === null ? "secondary" : "ghost"}
            size="sm"
            className="w-full justify-start"
            onClick={() => setFilters({ ...filters, subcategory: null })}
          >
            All {category.name}
          </Button>
          {category.subcategories.map((sub) => (
            <Button
              key={sub.id}
              variant={filters.subcategory === sub.id ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              onClick={() => setFilters({ ...filters, subcategory: sub.id })}
            >
              {sub.name}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

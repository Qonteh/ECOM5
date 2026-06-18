"use client";

import Link from "next/link";
import {
  Car,
  Smartphone,
  Home,
  Shirt,
  Sofa,
  Briefcase,
  Wrench,
  Wheat,
  ArrowRight,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { categories } from "@/lib/data";
import { useThemeStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

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

export default function CategoriesPage() {
  const { themeId } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [fetchedCategories, setFetchedCategories] = useState<any[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data = await response.json();
          setFetchedCategories(data.categories || []);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, []);

  const baseCategories =
    fetchedCategories.length > 0 ? fetchedCategories : categories;

  const filteredCategories = baseCategories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cat.nameSwahili &&
        cat.nameSwahili.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (cat.subcategories &&
        cat.subcategories.some((sub: any) =>
          sub.name.toLowerCase().includes(searchQuery.toLowerCase()),
        )),
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h1
              className={cn(
                "text-3xl md:text-4xl font-bold mb-4",
                themeId === "kilimanjaro" && "uppercase tracking-tight",
              )}
            >
              Browse All Categories
            </h1>
            <p
              className={cn(
                "text-muted-foreground mb-6",
                themeId === "kilimanjaro" && "text-background/60",
              )}
            >
              Find what you need from thousands of listings across Tanzania
            </p>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search categories..."
                className={cn(
                  "pl-10 h-12",
                  themeId === "kilimanjaro" &&
                    "rounded-none border-background/30 bg-background/10 text-background placeholder:text-background/50",
                  themeId === "ocean" && "rounded-xl",
                  themeId === "serengeti" && "rounded-xl",
                )}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div
          className={cn(
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
            themeId === "kilimanjaro" && "gap-1",
            themeId === "serengeti" && "gap-8",
          )}
        >
          {filteredCategories.map((category) => {
            const Icon = iconMap[category.icon] || Smartphone;
            return (
              <Card
                key={category.id}
                className={cn(
                  "overflow-hidden hover:shadow-lg transition-all group",
                  themeId === "safari" && "rounded-xl",
                  themeId === "ocean" &&
                    "rounded-2xl backdrop-blur-sm bg-card/80",
                  themeId === "kilimanjaro" &&
                    "rounded-none border-2 hover:border-primary",
                  themeId === "serengeti" && "rounded-3xl hover:-translate-y-1",
                )}
              >
                <CardContent className="p-0">
                  {/* Category Header */}
                  <Link
                    href={`/category/${category.slug}`}
                    className={cn(
                      "flex items-center gap-4 p-4 border-b border-border",
                      themeId === "kilimanjaro" && "border-b-2",
                    )}
                  >
                    <div
                      className={cn(
                        "w-14 h-14 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform",
                        themeId === "safari" && "rounded-xl bg-primary/10",
                        themeId === "ocean" &&
                          "rounded-full bg-gradient-to-br from-primary/20 to-accent/20",
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
                    <div className="flex-1 min-w-0">
                      <h2
                        className={cn(
                          "font-semibold text-lg",
                          themeId === "kilimanjaro" &&
                            "uppercase tracking-wide",
                        )}
                      >
                        {category.name}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {category.nameSwahili}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={cn(
                        themeId === "kilimanjaro" &&
                          "rounded-none uppercase text-xs font-bold",
                        themeId === "ocean" && "rounded-full",
                      )}
                    >
                      {(category.productCount || 0).toLocaleString()}
                    </Badge>
                  </Link>

                  {/* Subcategories */}
                  <div className="p-4 space-y-1">
                    {category.subcategories?.map((sub: any) => (
                      <Link
                        key={sub.id}
                        href={`/category/${category.slug}?subcategory=${sub.id}`}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 text-sm hover:bg-muted transition-colors",
                          themeId === "safari" && "rounded-lg",
                          themeId === "ocean" && "rounded-xl",
                          themeId === "kilimanjaro" &&
                            "rounded-none border-l-2 border-transparent hover:border-primary",
                          themeId === "serengeti" && "rounded-xl",
                        )}
                      >
                        <span>{sub.name}</span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))}
                  </div>

                  {/* View All Link */}
                  <div className="px-4 pb-4">
                    <Link href={`/category/${category.slug}`}>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full gap-2",
                          themeId === "safari" && "rounded-lg",
                          themeId === "ocean" && "rounded-xl",
                          themeId === "kilimanjaro" &&
                            "rounded-none uppercase font-bold",
                          themeId === "serengeti" && "rounded-xl",
                        )}
                      >
                        View All {category.name}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No categories found</h3>
            <p className="text-muted-foreground">Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
}

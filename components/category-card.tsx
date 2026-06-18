'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { categories, Category } from '@/lib/data';
import { useThemeStore } from '@/lib/store';
import { cn } from '@/lib/utils';

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

interface CategoryCardProps {
  category: any;
  variant?: 'default' | 'compact' | 'large';
}

export function CategoryCard({ category, variant = 'default' }: CategoryCardProps) {
  const Icon = iconMap[category.icon] || Smartphone;
  const { themeId } = useThemeStore();

  // Theme-specific card styles
  const cardStyles = {
    safari: 'rounded-xl',
    ocean: 'rounded-2xl bg-card/60 backdrop-blur-sm border-border/50',
    kilimanjaro: 'rounded-none border-2',
    serengeti: 'rounded-3xl',
  };

  const iconContainerStyles = {
    safari: 'rounded-xl bg-primary/10',
    ocean: 'rounded-full bg-gradient-to-br from-primary/20 to-accent/20',
    kilimanjaro: 'rounded-none bg-primary',
    serengeti: 'rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10',
  };

  const iconStyles = {
    safari: 'text-primary',
    ocean: 'text-primary',
    kilimanjaro: 'text-primary-foreground',
    serengeti: 'text-primary',
  };

  if (variant === 'compact') {
    return (
      <Link href={`/category/${category.slug}`}>
        <div className={cn(
          'flex flex-col items-center gap-2 p-3 hover:bg-muted transition-colors group',
          themeId === 'safari' && 'rounded-xl',
          themeId === 'ocean' && 'rounded-2xl',
          themeId === 'kilimanjaro' && 'rounded-none',
          themeId === 'serengeti' && 'rounded-2xl'
        )}>
          <div className={cn(
            'w-14 h-14 flex items-center justify-center group-hover:scale-105 transition-transform',
            iconContainerStyles[themeId]
          )}>
            <Icon className={cn('w-7 h-7', iconStyles[themeId])} />
          </div>
          <span className={cn(
            'text-sm font-medium text-center',
            themeId === 'kilimanjaro' && 'uppercase text-xs tracking-wide font-bold'
          )}>{category.name}</span>
        </div>
      </Link>
    );
  }

  if (variant === 'large') {
    return (
      <Link href={`/category/${category.slug}`}>
        <Card className={cn(
          'overflow-hidden hover:shadow-lg transition-all group h-full',
          cardStyles[themeId],
          themeId === 'kilimanjaro' && 'hover:border-primary',
          themeId === 'serengeti' && 'hover:-translate-y-1'
        )}>
          <CardContent className={cn(
            'p-6',
            themeId === 'serengeti' && 'p-8'
          )}>
            <div className={cn(
              'w-16 h-16 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform',
              iconContainerStyles[themeId],
              themeId === 'kilimanjaro' && 'w-14 h-14',
              themeId === 'serengeti' && 'w-18 h-18'
            )}>
              <Icon className={cn(
                'w-8 h-8',
                iconStyles[themeId]
              )} />
            </div>
            <h3 className={cn(
              'font-semibold text-lg mb-1',
              themeId === 'kilimanjaro' && 'uppercase tracking-wide',
              themeId === 'serengeti' && 'text-xl'
            )}>{category.name}</h3>
            <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
            <div className="flex items-center justify-between">
              <span className={cn(
                'text-sm text-muted-foreground',
                themeId === 'kilimanjaro' && 'uppercase text-xs font-bold'
              )}>
                {(category.productCount || 0).toLocaleString()} {themeId === 'kilimanjaro' ? 'ADS' : 'ads'}
              </span>
              <ArrowRight className={cn(
                'w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity',
                themeId === 'kilimanjaro' && 'w-5 h-5'
              )} />
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/category/${category.slug}`}>
      <Card className={cn(
        'overflow-hidden hover:shadow-md transition-all group',
        cardStyles[themeId],
        themeId === 'kilimanjaro' && 'hover:border-primary',
        themeId === 'serengeti' && 'hover:-translate-y-0.5'
      )}>
        <CardContent className="p-4 flex items-center gap-4">
          <div className={cn(
            'w-12 h-12 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform',
            iconContainerStyles[themeId]
          )}>
            <Icon className={cn('w-6 h-6', iconStyles[themeId])} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              'font-medium truncate',
              themeId === 'kilimanjaro' && 'uppercase text-sm tracking-wide font-bold'
            )}>{category.name}</h3>
            <p className="text-sm text-muted-foreground">
              {(category.productCount || 0).toLocaleString()} ads
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </CardContent>
      </Card>
    </Link>
  );
}

// Theme-aware Category grid
interface CategoryGridProps {
  variant?: 'default' | 'compact' | 'large';
  limit?: number;
}

export function CategoryGrid({ variant = 'default', limit }: CategoryGridProps) {
  const [fetchedCategories, setFetchedCategories] = useState<any[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setFetchedCategories(data.categories || []);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    fetchCategories();
  }, []);

  // Use fetched categories if available, else fall back to local lib/data for mock presentation before loading
  const baseCategories = fetchedCategories.length > 0 ? fetchedCategories : categories;
  const displayCategories = limit ? baseCategories.slice(0, limit) : baseCategories;
  const { themeId } = useThemeStore();

  // Theme-specific grid gaps
  const gridGaps = {
    safari: 'gap-4',
    ocean: 'gap-6',
    kilimanjaro: 'gap-1',
    serengeti: 'gap-6',
  };

  if (variant === 'compact') {
    return (
      <div className={cn(
        'grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8',
        themeId === 'kilimanjaro' ? 'gap-0' : 'gap-2'
      )}>
        {displayCategories.map((category) => (
          <CategoryCard key={category.id} category={category} variant="compact" />
        ))}
      </div>
    );
  }

  if (variant === 'large') {
    return (
      <div className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
        gridGaps[themeId]
      )}>
        {displayCategories.map((category) => (
          <CategoryCard key={category.id} category={category} variant="large" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn(
      'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
      themeId === 'kilimanjaro' ? 'gap-1' : 'gap-3'
    )}>
      {displayCategories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}

// Subcategory list
interface SubcategoryListProps {
  category: Category;
}

export function SubcategoryList({ category }: SubcategoryListProps) {
  const { themeId } = useThemeStore();

  return (
    <div className="space-y-1">
      {category.subcategories.map((sub) => (
        <Link
          key={sub.id}
          href={`/category/${category.slug}/${sub.slug}`}
          className={cn(
            'block px-3 py-2 hover:bg-muted transition-colors text-sm',
            themeId === 'safari' && 'rounded-lg',
            themeId === 'ocean' && 'rounded-xl',
            themeId === 'kilimanjaro' && 'rounded-none border-l-2 border-transparent hover:border-primary',
            themeId === 'serengeti' && 'rounded-xl'
          )}
        >
          {sub.name}
        </Link>
      ))}
    </div>
  );
}

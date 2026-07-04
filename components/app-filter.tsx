'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Filter } from 'lucide-react';
import { useState } from 'react';

interface FilterState {
  priceRange: [number, number];
  rating: number;
  categories: string[];
  sortBy: 'rating' | 'price' | 'downloads' | 'newest';
}

interface AppFilterProps {
  onFilterChange: (filters: FilterState) => void;
  categories: string[];
}

export function AppFilter({ onFilterChange, categories }: AppFilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 500],
    rating: 0,
    categories: [],
    sortBy: 'rating',
  });

  const handlePriceChange = (value: [number, number]) => {
    const newFilters = { ...filters, priceRange: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    const newFilters = { ...filters, categories: newCategories };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleRatingChange = (rating: number) => {
    const newFilters = { ...filters, rating };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (sortBy: FilterState['sortBy']) => {
    const newFilters = { ...filters, sortBy };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-xl gap-2">
          <Filter className="h-4 w-4" />
          Filtry
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filtry i sortowanie</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Sort */}
          <div>
            <Label className="text-sm font-semibold mb-3 block">Sortuj po</Label>
            <div className="space-y-2">
              {['rating', 'price', 'downloads', 'newest'].map((sort) => (
                <Button
                  key={sort}
                  variant={filters.sortBy === sort ? 'default' : 'outline'}
                  className="w-full justify-start rounded-lg"
                  onClick={() => handleSortChange(sort as FilterState['sortBy'])}
                >
                  {sort === 'rating' && 'Najwyżej oceniane'}
                  {sort === 'price' && 'Najtańsze'}
                  {sort === 'downloads' && 'Najczęściej pobierane'}
                  {sort === 'newest' && 'Najnowsze'}
                </Button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <Label className="text-sm font-semibold mb-3 block">
              Cena: ${filters.priceRange[0]} - ${filters.priceRange[1]}
            </Label>
            <Slider
              value={filters.priceRange}
              onValueChange={handlePriceChange}
              min={0}
              max={500}
              step={10}
              className="w-full"
            />
          </div>

          {/* Rating */}
          <div>
            <Label className="text-sm font-semibold mb-3 block">Minimalna ocena</Label>
            <div className="flex gap-2">
              {[0, 3, 3.5, 4, 4.5, 5].map((rating) => (
                <Button
                  key={rating}
                  variant={filters.rating === rating ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleRatingChange(rating)}
                >
                  {rating === 0 ? 'Wszystkie' : `${rating}+`}
                </Button>
              ))}
            </div>
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div>
              <Label className="text-sm font-semibold mb-3 block">Kategorie</Label>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center gap-2">
                    <Checkbox
                      id={category}
                      checked={filters.categories.includes(category)}
                      onCheckedChange={() => handleCategoryToggle(category)}
                    />
                    <Label htmlFor={category} className="text-sm font-normal cursor-pointer">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

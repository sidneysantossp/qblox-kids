import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Category } from '@/types';

interface ProductFiltersProps {
  categories: Category[];
  selectedCategories: string[];
  priceRange: string;
  onToggleCategory: (categoryName: string) => void;
  onChangePriceRange: (priceRange: string) => void;
  onClearFilters: () => void;
}

const priceRanges = [
  { value: 'all', label: 'Todos os preços' },
  { value: '0-50', label: 'Até R$ 50' },
  { value: '50-100', label: 'R$ 50 - R$ 100' },
  { value: '100-200', label: 'R$ 100 - R$ 200' },
  { value: '200+', label: 'Acima de R$ 200' },
];

export function ProductFilters({
  categories,
  selectedCategories,
  priceRange,
  onToggleCategory,
  onChangePriceRange,
  onClearFilters,
}: ProductFiltersProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-base mb-3">Categorias</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`cat-${category.id}`}
                checked={selectedCategories.includes(category.name)}
                onCheckedChange={() => onToggleCategory(category.name)}
              />
              <Label
                htmlFor={`cat-${category.id}`}
                className="text-sm font-normal cursor-pointer"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold text-base mb-3">Faixa de Preço</h3>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <div key={range.value} className="flex items-center space-x-2">
              <Checkbox
                id={`price-${range.value}`}
                checked={priceRange === range.value}
                onCheckedChange={() => onChangePriceRange(range.value)}
              />
              <Label
                htmlFor={`price-${range.value}`}
                className="text-sm font-normal cursor-pointer"
              >
                {range.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <Button variant="outline" className="w-full" onClick={onClearFilters}>
        Limpar Filtros
      </Button>
    </div>
  );
}

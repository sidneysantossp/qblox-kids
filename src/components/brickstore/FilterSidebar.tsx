import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Star } from 'lucide-react';
import { useState } from 'react';

const categories = [
  { name: 'Heróis', count: 24 },
  { name: 'Aventura', count: 18 },
  { name: 'Espaço', count: 16 },
  { name: 'Cidade', count: 22 },
  { name: 'Colecionáveis', count: 30 },
];

const ratings = [
  { stars: 5, count: 128 },
  { stars: 4, count: 86 },
  { stars: 3, count: 32 },
  { stars: 2, count: 10 },
  { stars: 1, count: 4 },
];

export function FilterSidebar() {
  const [priceRange, setPriceRange] = useState([19.90, 299.90]);
  const [showMoreCategories, setShowMoreCategories] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
      {/* Title */}
      <h3 className="text-[13px] font-extrabold uppercase text-foreground mb-4">
        FILTROS
      </h3>

      {/* Categoria */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-foreground mb-3">Categoria</h4>
        <div className="space-y-2.5">
          {categories.slice(0, showMoreCategories ? categories.length : 5).map((cat) => (
            <div key={cat.name} className="flex items-center gap-2">
              <Checkbox id={`cat-${cat.name}`} />
              <Label
                htmlFor={`cat-${cat.name}`}
                className="text-sm text-foreground cursor-pointer flex-1"
              >
                {cat.name} <span className="text-muted-foreground">({cat.count})</span>
              </Label>
            </div>
          ))}
        </div>
        {!showMoreCategories && (
          <button
            onClick={() => setShowMoreCategories(true)}
            className="text-xs text-primary font-semibold mt-2 hover:underline"
          >
            Ver mais +
          </button>
        )}
      </div>

      {/* Faixa de preço */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-foreground mb-3">Faixa de preço</h4>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={19.90}
            max={299.90}
            step={10}
            className="mb-4"
          />
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground font-medium">
              R$ {priceRange[0].toFixed(2).replace('.', ',')}
            </span>
            <span className="text-muted-foreground">-</span>
            <span className="text-foreground font-medium">
              R$ {priceRange[1].toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>
      </div>

      {/* Avaliação */}
      <div>
        <h4 className="text-sm font-bold text-foreground mb-3">Avaliação</h4>
        <div className="space-y-2.5">
          {ratings.map((rating) => (
            <div key={rating.stars} className="flex items-center gap-2">
              <Checkbox id={`rating-${rating.stars}`} />
              <Label
                htmlFor={`rating-${rating.stars}`}
                className="text-sm cursor-pointer flex items-center gap-1.5 flex-1"
              >
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < rating.stars
                          ? 'fill-[#FFD200] text-[#FFD200]'
                          : 'fill-gray-300 text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground">({rating.count})</span>
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

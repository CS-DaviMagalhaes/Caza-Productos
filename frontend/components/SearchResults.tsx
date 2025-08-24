import { Product } from "@/types/product";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type SearchResultsProps = {
  results: Product[];
  onFavorite: (product: Product) => void;
  favorites: Product[];
};

export function SearchResults({ results, onFavorite, favorites }: SearchResultsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-4xl">
      {results.map((product) => (
        <Card
          key={product.id}
          className="p-4 border border-blue-500 flex flex-col"
        >
          {/* Imagen del producto */}
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-40 object-cover rounded mb-3"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              {product.description}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
              <Button
                variant={favorites.some((fav) => fav.id === product.id) ? "default" : "outline"}
                size="sm"
                onClick={() => onFavorite(product)}
                className="ml-auto"
              >
                {favorites.some((fav) => fav.id === product.id) ? "★ Added" : "★ Add to favorites"}
              </Button>
            </div>
          </div>
          <a
            href={product.imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block text-center text-blue-600 dark:text-blue-400 underline"
          >
            View Product
          </a>
        </Card>
      ))}
    </div>
  );
}
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";

type FavoritesPanelProps = {
  showFav: boolean;
  setShowFav: (show: boolean | ((prev: boolean) => boolean)) => void;
  favorites: Product[];
  onDragStart: (product: Product) => void;
  removeFavorite: (product: Product) => void;
};

export function FavoritesPanel({ 
  showFav, 
  setShowFav, 
  favorites, 
  onDragStart, 
  removeFavorite 
}: FavoritesPanelProps) {
  return (
    <>
      <Button
        variant="secondary"
        className="fixed top-8 right-8 z-20"
        onClick={() => setShowFav((f) => !f)}
      >
        {showFav ? "Close Favorites" : "★ Favorites"}
      </Button>
      <div
        className={`fixed top-0 right-0 h-screen w-80 bg-background border-l border-orange-400 z-30 transition-transform duration-300 ${
          showFav ? "translate-x-0" : "translate-x-96"
        } flex flex-col p-6`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">Favorites</h2>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowFav(false)}
            aria-label="Close favorites"
          >
            ×
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {favorites.length === 0 ? (
            <div className="text-muted-foreground text-sm">
              No favorite products yet.
            </div>
          ) : (
            <ul>
              {favorites.map((product) => (
                <li
                  key={product.id}
                  draggable
                  onDragStart={() => onDragStart(product)}
                  className="flex justify-between items-center mb-2 bg-orange-50 dark:bg-orange-950 rounded px-2 py-1 border border-orange-400 cursor-grab"
                >
                  <span>{product.name}</span>
                  <div className="flex gap-2">
                    <a
                      href={product.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 underline"
                    >
                      View
                    </a>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeFavorite(product)}
                    >
                      ×
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/types/product";
import Image from "next/image";

export function ProductCard({ product }: { product: Product }) {
  const handleClick = () => {
    if (product.url) {
      window.open(product.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Card
      className="w-full cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleClick}
      role={product.url ? "link" : undefined}
    >
      <CardHeader>
        <CardTitle className="truncate">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-4">
        <div className="relative w-24 h-24 flex-shrink-0">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="96px"
            className="object-cover rounded"
          />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-gray-600 line-clamp-3">{product.description}</p>
          {product.url && (
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-sm mt-2 inline-block truncate max-w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {product.url}
            </a>
          )}
          <p className="font-bold mt-2">S/ {product.price.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/types/product";
import Image from "next/image";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
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
        <div>
          <p className="text-sm text-gray-600">{product.description}</p>
          <p className="font-bold mt-2">S/ {product.price.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  );
}

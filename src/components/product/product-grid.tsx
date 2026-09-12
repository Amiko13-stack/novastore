import Link from "next/link";
import type { Product } from "@/types/entities";
import { ProductCard } from "@/components/product/product-card";
import { ArrowRightIcon } from "@/components/ui/icons";

export function ProductGrid({
  products,
  categoryNames = {},
}: {
  products: Product[];
  categoryNames?: Record<string, string>;
}) {
  if (products.length === 0) {
    return (
      <div className="rounded-[28px] border border-dashed border-zinc-300 bg-white/50 px-6 py-20 text-center">
        <div className="mx-auto h-2 w-2 rounded-full bg-zinc-950" />
        <h2 className="mt-6 text-2xl font-medium tracking-[-0.035em]">No products found.</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-600">
          There are no products in this collection yet. Explore the complete NovaStore catalog instead.
        </p>
        <Link href="/products" className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold">
          View all products
          <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-5 xl:gap-y-12">
      {products.map((product) => (
        <ProductCard
          key={product.productId}
          product={product}
          categoryName={categoryNames[product.categoryId]}
        />
      ))}
    </div>
  );
}

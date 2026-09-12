import type { Metadata } from "next";
import Link from "next/link";
import { ProductGrid } from "@/components/product/product-grid";
import { Container } from "@/components/ui/container";
import { getCategories } from "@/services/category.service";
import { getProducts } from "@/services/product.service";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse the complete NovaStore collection.",
};

export const dynamic = "force-dynamic";

type ProductsPageProps = {
  searchParams: Promise<{ categoryId?: string }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { categoryId } = await searchParams;
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(categoryId),
  ]);

  const activeCategory = categoryId
    ? categories.find((category) => category.categoryId === categoryId)
    : undefined;

  const sortedProducts = [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const categoryNames = Object.fromEntries(categories.map((category) => [category.categoryId, category.name]));

  return (
    <main>
      <section className="border-b border-zinc-300/60 py-14 sm:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">The shop</p>
              <h1 className="mt-4 text-5xl font-medium leading-[0.95] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
                {activeCategory?.name ?? "All essentials."}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600">
                {activeCategory?.description ?? "Browse the full NovaStore edit — modern pieces selected for everyday usefulness and clean design."}
              </p>
            </div>

            <div className="text-sm text-zinc-500">
              {sortedProducts.length} {sortedProducts.length === 1 ? "product" : "products"}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-8 sm:py-10">
        <Container>
          <div className="flex flex-col gap-5 border-b border-zinc-300/60 pb-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              <Link
                href="/products"
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  !categoryId ? "bg-zinc-950 text-white" : "border border-zinc-300 bg-transparent hover:bg-white"
                }`}
              >
                All
              </Link>
              {[...categories].sort((a, b) => a.name.localeCompare(b.name)).map((category) => (
                <Link
                  key={category.categoryId}
                  href={`/products?categoryId=${encodeURIComponent(category.categoryId)}`}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    categoryId === category.categoryId
                      ? "bg-zinc-950 text-white"
                      : "border border-zinc-300 bg-transparent hover:bg-white"
                  }`}
                >
                  {category.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span>Sort:</span>
              <span className="font-medium text-zinc-900">Newest first</span>
            </div>
          </div>

          <div className="pt-9 sm:pt-12">
            <ProductGrid products={sortedProducts} categoryNames={categoryNames} />
          </div>
        </Container>
      </section>
    </main>
  );
}

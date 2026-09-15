import type { Metadata } from "next";
import { CatalogControls } from "@/components/catalog/catalog-controls";
import { ProductGrid } from "@/components/product/product-grid";
import { Container } from "@/components/ui/container";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { catalogQuerySchema } from "@/lib/validation/catalog.schema";
import { getCategories } from "@/services/category.service";
import { searchProducts } from "@/services/product.service";
import { getWishlist } from "@/services/wishlist.service";

export const metadata: Metadata = {
  title: "Shop",
  description: "Search, filter and browse the complete NovaStore collection.",
};

export const dynamic = "force-dynamic";

type ProductsPageProps = {
  searchParams: Promise<{
    q?: string;
    categoryId?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const rawParams = await searchParams;
  const parsed = catalogQuerySchema.safeParse(rawParams);
  const filters = parsed.success
    ? parsed.data
    : {
        q: undefined,
        categoryId: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        sort: "newest" as const,
      };

  const [categories, products, wishlist] = await Promise.all([
    getCategories(),
    searchProducts(filters),
    getWishlist(getCurrentUserId()),
  ]);

  const activeCategory = filters.categoryId
    ? categories.find((category) => category.categoryId === filters.categoryId)
    : undefined;
  const categoryNames = Object.fromEntries(
    categories.map((category) => [category.categoryId, category.name]),
  );
  const savedProductIds = wishlist.items.map((item) => item.product.productId);

  const heading = filters.q
    ? `Results for “${filters.q}”`
    : activeCategory?.name ?? "All essentials.";
  const description = filters.q
    ? `A focused search across the NovaStore edit${activeCategory ? ` in ${activeCategory.name}` : ""}.`
    : activeCategory?.description ??
      "Browse the full NovaStore edit — modern pieces selected for everyday usefulness and clean design.";

  return (
    <main>
      <section className="border-b border-black/[0.055] py-14 sm:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-4xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-500">The shop</p>
              <h1 className="mt-4 text-5xl font-medium leading-[0.94] tracking-[-0.06em] sm:text-6xl lg:text-7xl">{heading}</h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600">{description}</p>
            </div>
            <p className="text-sm text-zinc-500">{products.length} {products.length === 1 ? "piece" : "pieces"}</p>
          </div>
        </Container>
      </section>

      <section className="py-8 sm:py-10">
        <Container>
          <CatalogControls
            key={[
              filters.q ?? "",
              filters.categoryId ?? "",
              filters.minPrice ?? "",
              filters.maxPrice ?? "",
              filters.sort,
            ].join("|")}
            categories={categories}
            resultCount={products.length}
            values={filters}
          />

          <div className="pt-10 sm:pt-12">
            <ProductGrid products={products} categoryNames={categoryNames} savedProductIds={savedProductIds} />
          </div>
        </Container>
      </section>
    </main>
  );
}

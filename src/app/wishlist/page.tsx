import type { Metadata } from "next";
import Link from "next/link";
import { ProductGrid } from "@/components/product/product-grid";
import { Container } from "@/components/ui/container";
import { HeartIcon } from "@/components/ui/icons";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { getCategories } from "@/services/category.service";
import { getWishlist } from "@/services/wishlist.service";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Saved NovaStore pieces.",
};

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const [wishlist, categories] = await Promise.all([
    getWishlist(getCurrentUserId()),
    getCategories(),
  ]);

  if (wishlist.items.length === 0) {
    return (
      <main className="py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-xl text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white shadow-sm">
              <HeartIcon className="h-6 w-6" />
            </span>
            <h1 className="mt-7 text-4xl font-medium tracking-[-0.05em] sm:text-5xl">Nothing saved yet.</h1>
            <p className="mt-4 text-sm leading-6 text-zinc-600">
              Save pieces from the collection and they will stay here through DynamoDB persistence.
            </p>
            <Link href="/products" className="mt-8 inline-flex rounded-full bg-zinc-950 px-6 py-3.5 text-sm font-semibold text-white">
              Find something to save
            </Link>
          </div>
        </Container>
      </main>
    );
  }

  const products = wishlist.items.map((item) => item.product);
  const savedProductIds = products.map((product) => product.productId);
  const categoryNames = Object.fromEntries(
    categories.map((category) => [category.categoryId, category.name]),
  );

  return (
    <main>
      <section className="border-b border-black/[0.055] py-14 sm:py-20">
        <Container>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-500">Wishlist</p>
          <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-5xl font-medium leading-[0.94] tracking-[-0.06em] sm:text-6xl lg:text-7xl">Saved pieces.</h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-zinc-600">
                A personal edit that persists in your Wishlist DynamoDB table.
              </p>
            </div>
            <p className="text-sm text-zinc-500">{wishlist.itemCount} {wishlist.itemCount === 1 ? "piece" : "pieces"}</p>
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          <ProductGrid
            products={products}
            categoryNames={categoryNames}
            savedProductIds={savedProductIds}
          />
        </Container>
      </section>
    </main>
  );
}

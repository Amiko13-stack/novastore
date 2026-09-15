import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { ProductGrid } from "@/components/product/product-grid";
import { ScrollToTop } from "@/components/product/scroll-to-top";
import { Container } from "@/components/ui/container";
import { HeartIcon, ShieldIcon, TruckIcon } from "@/components/ui/icons";
import { getCategoryById } from "@/repositories/category.repository";
import { getProductById } from "@/repositories/product.repository";
import { getProducts } from "@/services/product.service";
import { formatCurrency } from "@/utils/format-currency";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{ productId: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { productId } = await params;
  const product = await getProductById(productId);

  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductDetailsPage({ params }: ProductPageProps) {
  const { productId } = await params;
  const product = await getProductById(productId);

  if (!product) notFound();

  const [category, categoryProducts] = await Promise.all([
    getCategoryById(product.categoryId),
    getProducts(product.categoryId),
  ]);

  const relatedProducts = categoryProducts
    .filter((item) => item.productId !== product.productId)
    .slice(0, 4);

  const categoryNames = category ? { [category.categoryId]: category.name } : {};

  return (
    <>
      <ScrollToTop productId={product.productId} />
      <main>
        <Container>
          <nav className="flex flex-wrap items-center gap-2 py-6 text-xs text-zinc-500 sm:py-8">
            <Link href="/" className="transition hover:text-zinc-950">Home</Link>
            <span>/</span>
            <Link href="/products" className="transition hover:text-zinc-950">Shop</Link>
            {category ? (
              <>
                <span>/</span>
                <Link
                  href={`/products?categoryId=${encodeURIComponent(category.categoryId)}`}
                  className="transition hover:text-zinc-950"
                >
                  {category.name}
                </Link>
              </>
            ) : null}
          </nav>

          <section className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14 xl:gap-20">
            <div className="relative aspect-[0.92] overflow-hidden rounded-[30px] border border-black/[0.045] bg-[#ecece8] shadow-[0_18px_55px_rgba(17,17,17,.055)] lg:sticky lg:top-24 lg:self-start">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover saturate-[0.96]"
              />
              {product.featured ? (
                <span className="absolute left-4 top-4 rounded-full border border-black/[0.05] bg-white/90 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.17em] shadow-sm backdrop-blur">
                  Featured
                </span>
              ) : null}
            </div>

            <div className="py-2 lg:py-8 xl:py-14">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                {category?.name ?? "Nova selection"}
              </p>
              <h1 className="mt-4 text-[clamp(2.8rem,5.5vw,5.5rem)] font-medium leading-[0.92] tracking-[-0.065em]">
                {product.name}
              </h1>
              <p className="mt-6 text-[26px] font-medium tracking-[-0.035em]">{formatCurrency(product.price)}</p>

              <div className="mt-9 border-y border-zinc-300/70 py-7">
                <p className="max-w-xl text-[15px] leading-7 text-zinc-600 sm:text-base">{product.description}</p>
              </div>

              <div className="mt-7 flex items-center justify-between gap-4 text-sm">
                <span className="text-zinc-500">Availability</span>
                <span className={`font-medium ${product.stock > 0 ? "text-emerald-700" : "text-red-600"}`}>
                  {product.stock > 0 ? `In stock · ${product.stock} available` : "Currently unavailable"}
                </span>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto]">
                <AddToCartButton
                  productId={product.productId}
                  stock={product.stock}
                />
                <button
                  type="button"
                  disabled
                  title="Wishlist integration is added on Day 6"
                  aria-label="Add to wishlist"
                  className="grid h-14 w-full place-items-center rounded-full border border-zinc-300 bg-white/35 transition hover:bg-white sm:w-14"
                >
                  <HeartIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[22px] border border-zinc-300/70 bg-white/38 p-5">
                  <TruckIcon className="h-5 w-5" />
                  <p className="mt-4 text-sm font-semibold tracking-tight">A calm purchase flow</p>
                  <p className="mt-1.5 text-xs leading-5 text-zinc-500">Cart, quantities and persistent bag state connect next.</p>
                </div>
                <div className="rounded-[22px] border border-zinc-300/70 bg-white/38 p-5">
                  <ShieldIcon className="h-5 w-5" />
                  <p className="mt-4 text-sm font-semibold tracking-tight">Server-side by design</p>
                  <p className="mt-1.5 text-xs leading-5 text-zinc-500">Product data stays behind the application server layer.</p>
                </div>
              </div>

              <div className="mt-8 border-t border-zinc-300/60 pt-5 text-[11px] uppercase tracking-[0.18em] text-zinc-400">
                Product ID · {product.productId}
              </div>
            </div>
          </section>

          {relatedProducts.length > 0 ? (
            <section className="mt-24 border-t border-zinc-300/60 pt-16 sm:mt-32 sm:pt-20">
              <div className="mb-10 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-500">You may also like</p>
                  <h2 className="mt-3 text-[clamp(2.2rem,4vw,4rem)] font-medium leading-[0.95] tracking-[-0.055em]">Related pieces.</h2>
                </div>
                {category ? (
                  <Link
                    href={`/products?categoryId=${encodeURIComponent(category.categoryId)}`}
                    className="hidden border-b border-zinc-300 pb-1 text-sm font-semibold transition hover:border-zinc-900 sm:block"
                  >
                    View category →
                  </Link>
                ) : null}
              </div>
              <ProductGrid products={relatedProducts} categoryNames={categoryNames} />
            </section>
          ) : null}
        </Container>
      </main>
    </>
  );
}

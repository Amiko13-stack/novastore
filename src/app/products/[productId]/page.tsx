import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product/product-grid";
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

  const categoryNames = category
    ? { [category.categoryId]: category.name }
    : {};

  return (
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
          <div className="relative aspect-[0.92] overflow-hidden rounded-[28px] bg-[#ecece8] lg:sticky lg:top-24 lg:self-start">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
            {product.featured ? (
              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] backdrop-blur">
                Featured
              </span>
            ) : null}
          </div>

          <div className="py-2 lg:py-8 xl:py-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
              {category?.name ?? "Nova selection"}
            </p>
            <h1 className="mt-4 text-4xl font-medium leading-[0.98] tracking-[-0.055em] sm:text-5xl xl:text-6xl">
              {product.name}
            </h1>
            <p className="mt-5 text-2xl font-medium tracking-tight">{formatCurrency(product.price)}</p>

            <div className="mt-8 border-y border-zinc-300/70 py-7">
              <p className="text-base leading-7 text-zinc-600">{product.description}</p>
            </div>

            <div className="mt-7 flex items-center justify-between gap-4 text-sm">
              <span className="text-zinc-500">Availability</span>
              <span className={`font-medium ${product.stock > 0 ? "text-emerald-700" : "text-red-600"}`}>
                {product.stock > 0 ? `In stock · ${product.stock} available` : "Currently unavailable"}
              </span>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto]">
              <button
                type="button"
                disabled
                title="Cart integration is added on Day 5"
                className="h-14 rounded-full bg-zinc-950 px-7 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed"
              >
                Add to bag
              </button>
              <button
                type="button"
                disabled
                title="Wishlist integration is added on Day 6"
                aria-label="Add to wishlist"
                className="grid h-14 w-full place-items-center rounded-full border border-zinc-300 bg-transparent sm:w-14"
              >
                <HeartIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-9 divide-y divide-zinc-300/60 border-y border-zinc-300/60">
              <div className="flex gap-4 py-5">
                <TruckIcon className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Built for a clean purchase flow</p>
                  <p className="mt-1 text-xs leading-5 text-zinc-500">Cart persistence and quantities connect on Day 5.</p>
                </div>
              </div>
              <div className="flex gap-4 py-5">
                <ShieldIcon className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Server-side product data</p>
                  <p className="mt-1 text-xs leading-5 text-zinc-500">AWS credentials never need to be exposed in the browser.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-xs text-zinc-400">Product ID · {product.productId}</div>
          </div>
        </section>

        {relatedProducts.length > 0 ? (
          <section className="mt-24 border-t border-zinc-300/60 pt-16 sm:mt-32 sm:pt-20">
            <div className="mb-9 flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">You may also like</p>
                <h2 className="mt-3 text-3xl font-medium tracking-[-0.04em] sm:text-4xl">Related pieces.</h2>
              </div>
              {category ? (
                <Link
                  href={`/products?categoryId=${encodeURIComponent(category.categoryId)}`}
                  className="hidden text-sm font-medium sm:block"
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
  );
}

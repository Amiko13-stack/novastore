import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/entities";
import { ArrowRightIcon } from "@/components/ui/icons";
import { formatCurrency } from "@/utils/format-currency";

export function Hero({ product }: { product?: Product }) {
  return (
    <section className="px-4 pt-4 sm:px-6 lg:px-10 xl:px-12">
      <div className="mx-auto grid min-h-[620px] max-w-[1440px] overflow-hidden rounded-[28px] bg-zinc-950 text-white lg:grid-cols-[0.95fr_1.05fr] lg:rounded-[36px]">
        <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-14 xl:p-16">
          <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
            <span className="h-px w-8 bg-zinc-600" />
            New season · 2026
          </div>

          <div className="py-14 lg:py-16">
            <h1 className="max-w-3xl text-[clamp(3.4rem,7vw,7.4rem)] font-medium leading-[0.9] tracking-[-0.07em]">
              Everyday,
              <br />
              considered.
            </h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-zinc-400 sm:text-lg">
              A curated collection of modern essentials for work, home and everything in between.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
              >
                Shop collection
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/#categories"
                className="inline-flex items-center rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Explore categories
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-5 text-xs text-zinc-500">
            <span>Curated essentials</span>
            <span>Responsive shopping</span>
            <span>Secure server data</span>
          </div>
        </div>

        <div className="relative min-h-[520px] overflow-hidden bg-zinc-900 lg:min-h-full">
          {product ? (
            <>
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover transition duration-700 hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/5" />
              <Link
                href={`/products/${product.productId}`}
                className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 rounded-[22px] border border-white/15 bg-black/35 p-4 backdrop-blur-md sm:bottom-7 sm:left-7 sm:right-7 sm:p-5"
              >
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-300">Featured object</p>
                  <p className="mt-1 text-lg font-medium tracking-tight">{product.name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="hidden text-sm text-zinc-200 sm:inline">{formatCurrency(product.price)}</span>
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-zinc-950">
                    <ArrowRightIcon className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </>
          ) : (
            <div className="absolute inset-0 grid place-items-center p-10 text-center text-zinc-500">
              Your featured product will appear here after the database is seeded.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

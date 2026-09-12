import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/entities";
import { ArrowRightIcon } from "@/components/ui/icons";
import { formatCurrency } from "@/utils/format-currency";

export function Hero({ product }: { product?: Product }) {
  return (
    <section className="px-4 pt-5 sm:px-6 lg:px-10 xl:px-12">
      <div className="mx-auto max-w-[1500px] overflow-hidden rounded-[30px] border border-black/[0.06] bg-[#e8e5dc] lg:rounded-[42px]">
        <div className="grid min-h-[720px] lg:grid-cols-[0.82fr_1.18fr]">
          <div className="relative z-10 flex flex-col justify-between p-7 sm:p-10 lg:p-14 xl:p-16">
            <div className="flex items-center justify-between gap-5">
              <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-zinc-600">
                <span className="h-px w-9 bg-zinc-500" />
                Nova / 2026
              </div>
              <span className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">Curated objects</span>
            </div>

            <div className="py-14 lg:py-20">
              <p className="mb-5 text-sm font-medium text-zinc-600">Modern essentials, edited down.</p>
              <h1 className="max-w-4xl text-[clamp(4rem,8.4vw,8.6rem)] font-medium leading-[0.83] tracking-[-0.082em] text-zinc-950">
                Everyday,
                <br />
                considered.
              </h1>
              <p className="mt-8 max-w-md text-[15px] leading-7 text-zinc-600 sm:text-base">
                Useful things with a point of view — selected across technology, fashion and home.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/products" className="group inline-flex items-center gap-3 rounded-full bg-zinc-950 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(17,17,17,.12)] transition duration-300 hover:-translate-y-0.5 hover:bg-zinc-800">
                  Shop the edit
                  <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link href="/#categories" className="inline-flex items-center rounded-full border border-black/[0.12] bg-white/30 px-6 py-3.5 text-sm font-semibold text-zinc-950 transition hover:bg-white/70">
                  Explore categories
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-5 border-t border-black/[0.10] pt-6 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              <span>01 / Curated</span><span>02 / Responsive</span><span>03 / Live data</span>
            </div>
          </div>

          <div className="relative min-h-[520px] overflow-hidden bg-[#d8d5cd] lg:min-h-full">
            {product ? (
              <>
                <Image src={product.imageUrl} alt={product.name} fill priority sizes="(max-width: 1024px) 100vw, 62vw" className="object-cover saturate-[0.92] transition duration-1000 hover:scale-[1.025]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/5" />
                <div className="absolute left-5 top-5 rounded-full border border-white/30 bg-white/70 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-900 backdrop-blur-md sm:left-7 sm:top-7">Featured / 01</div>
                <Link href={`/products/${product.productId}`} className="group absolute bottom-5 left-5 right-5 grid grid-cols-[1fr_auto] items-end gap-5 rounded-[26px] border border-white/15 bg-black/45 p-5 text-white shadow-[0_18px_60px_rgba(0,0,0,.18)] backdrop-blur-xl sm:bottom-7 sm:left-7 sm:right-7 sm:p-6">
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/60">Object of the week</p>
                    <p className="mt-2 text-xl font-medium tracking-[-0.035em] sm:text-2xl">{product.name}</p>
                    <p className="mt-2 text-sm text-white/65">{formatCurrency(product.price)}</p>
                  </div>
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-zinc-950 transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowRightIcon className="h-4 w-4" />
                  </span>
                </Link>
              </>
            ) : (
              <div className="absolute inset-0 grid place-items-center p-10 text-center text-zinc-500">Seed the database to reveal the featured product.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

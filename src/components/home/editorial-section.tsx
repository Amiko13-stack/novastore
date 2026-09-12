import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/entities";
import { ArrowRightIcon } from "@/components/ui/icons";

export function EditorialSection({ product }: { product?: Product }) {
  return (
    <section className="px-4 py-6 sm:px-6 lg:px-10 xl:px-12">
      <div className="mx-auto grid max-w-[1500px] overflow-hidden rounded-[30px] bg-zinc-950 text-white lg:grid-cols-[0.92fr_1.08fr] lg:rounded-[42px]">
        <div className="flex min-h-[560px] flex-col justify-between p-7 sm:p-10 lg:p-14 xl:p-16">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/45">The Nova edit</p>
            <span className="text-[10px] uppercase tracking-[0.22em] text-white/35">Volume 01</span>
          </div>
          <div className="max-w-2xl py-14">
            <h2 className="text-[clamp(3.8rem,7vw,7.5rem)] font-medium leading-[0.84] tracking-[-0.078em]">Less noise.<br />Better essentials.</h2>
            <p className="mt-7 max-w-md text-base leading-7 text-white/55">Objects chosen for how they work, how they feel and how naturally they fit into everyday life.</p>
          </div>
          <Link href="/products" className="group inline-flex w-fit items-center gap-3 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold transition hover:bg-white hover:text-zinc-950">Explore the edit<ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" /></Link>
        </div>
        <div className="relative min-h-[560px] bg-zinc-900">
          {product ? <Image src={product.imageUrl} alt={product.name} fill sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover saturate-[0.88]" /> : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 rounded-full border border-white/20 bg-black/35 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur sm:bottom-8 sm:left-8">Designed to stay</div>
        </div>
      </div>
    </section>
  );
}

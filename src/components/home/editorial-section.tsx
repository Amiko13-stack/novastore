import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/entities";
import { ArrowRightIcon } from "@/components/ui/icons";

export function EditorialSection({ product }: { product?: Product }) {
  return (
    <section className="px-4 py-4 sm:px-6 lg:px-10 xl:px-12">
      <div className="mx-auto grid max-w-[1440px] overflow-hidden rounded-[28px] bg-[#d9ddd5] lg:grid-cols-2 lg:rounded-[36px]">
        <div className="flex min-h-[480px] flex-col justify-between p-7 sm:p-10 lg:p-14 xl:p-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-600">The Nova edit</p>

          <div className="max-w-xl py-14">
            <h2 className="text-5xl font-medium leading-[0.95] tracking-[-0.06em] text-zinc-950 sm:text-6xl lg:text-7xl">
              Less noise.
              <br />
              Better essentials.
            </h2>
            <p className="mt-6 max-w-md text-base leading-7 text-zinc-700">
              Objects chosen for how they work, how they feel and how naturally they fit into everyday life.
            </p>
          </div>

          <Link href="/products" className="group inline-flex w-fit items-center gap-3 text-sm font-semibold">
            Explore the collection
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="relative min-h-[520px] bg-zinc-300">
          {product ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}

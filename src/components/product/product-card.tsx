import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/entities";
import { ArrowRightIcon, HeartIcon } from "@/components/ui/icons";
import { formatCurrency } from "@/utils/format-currency";

export function ProductCard({ product, categoryName }: { product: Product; categoryName?: string; }) {
  return (
    <article className="group">
      <div className="relative overflow-hidden rounded-[26px] border border-black/[0.055] bg-[#e9e7e0] shadow-[0_14px_34px_rgba(17,17,17,.035)] transition duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_22px_48px_rgba(17,17,17,.08)]">
        <Link href={`/products/${product.productId}`} className="block aspect-[0.88] overflow-hidden">
          <Image src={product.imageUrl} alt={product.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover saturate-[0.94] transition duration-1000 ease-out group-hover:scale-[1.055]" />
          <div className="absolute inset-x-3 bottom-3 flex translate-y-3 items-center justify-between rounded-full bg-zinc-950/90 px-4 py-3 text-xs font-semibold text-white opacity-0 backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <span>View piece</span><ArrowRightIcon className="h-3.5 w-3.5" />
          </div>
        </Link>
        <button type="button" disabled aria-label="Wishlist integration arrives on Day 6" title="Wishlist integration arrives on Day 6" className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full border border-black/[0.06] bg-white/88 text-zinc-900 shadow-sm backdrop-blur transition hover:bg-white"><HeartIcon className="h-[17px] w-[17px]" /></button>
        {product.featured ? <span className="absolute left-3 top-3 rounded-full bg-zinc-950 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-white">Featured</span> : null}
      </div>
      <div className="pt-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.21em] text-zinc-500">{categoryName ?? "Nova selection"}</p>
          <p className="text-sm font-semibold tracking-[-0.02em] text-zinc-950">{formatCurrency(product.price)}</p>
        </div>
        <Link href={`/products/${product.productId}`} className="mt-2 block text-[17px] font-medium tracking-[-0.035em] text-zinc-950 sm:text-lg">{product.name}</Link>
        <p className="mt-1.5 line-clamp-1 text-[13px] leading-5 text-zinc-500">{product.description}</p>
      </div>
    </article>
  );
}

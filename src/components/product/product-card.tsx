import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/entities";
import { ArrowRightIcon, HeartIcon } from "@/components/ui/icons";
import { formatCurrency } from "@/utils/format-currency";

export function ProductCard({
  product,
  categoryName,
}: {
  product: Product;
  categoryName?: string;
}) {
  return (
    <article className="group">
      <div className="relative overflow-hidden rounded-[24px] bg-[#ecece8]">
        <Link href={`/products/${product.productId}`} className="block aspect-[0.86]">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.035]"
          />
        </Link>

        <button
          type="button"
          disabled
          aria-label="Wishlist integration arrives on Day 6"
          title="Wishlist integration arrives on Day 6"
          className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-zinc-900 shadow-sm backdrop-blur transition group-hover:bg-white"
        >
          <HeartIcon className="h-[18px] w-[18px]" />
        </button>

        {product.featured ? (
          <span className="absolute left-3 top-3 rounded-full bg-zinc-950 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
            Featured
          </span>
        ) : null}
      </div>

      <div className="pt-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
          {categoryName ?? "Nova selection"}
        </p>
        <div className="mt-2 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link
              href={`/products/${product.productId}`}
              className="inline-flex items-center gap-2 text-base font-medium tracking-[-0.02em] text-zinc-950"
            >
              <span>{product.name}</span>
              <ArrowRightIcon className="h-3.5 w-3.5 shrink-0 opacity-0 transition duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
            </Link>
            <p className="mt-1 line-clamp-1 text-sm text-zinc-500">{product.description}</p>
          </div>
          <p className="shrink-0 text-sm font-semibold text-zinc-950">{formatCurrency(product.price)}</p>
        </div>
      </div>
    </article>
  );
}

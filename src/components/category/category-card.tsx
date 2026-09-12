import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types/entities";
import { ArrowRightIcon } from "@/components/ui/icons";

export function CategoryCard({ category, index = 0 }: { category: Category; index?: number }) {
  const aspect = index === 0 ? "md:aspect-[0.9]" : "md:aspect-[0.9]";

  return (
    <Link
      href={`/products?categoryId=${encodeURIComponent(category.categoryId)}`}
      className={`group relative aspect-[1.05] overflow-hidden rounded-[26px] bg-zinc-200 ${aspect}`}
    >
      {category.imageUrl ? (
        <Image
          src={category.imageUrl}
          alt={category.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.045]"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-white sm:p-7">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/65">Collection</p>
          <h3 className="mt-2 text-2xl font-medium tracking-[-0.035em] sm:text-3xl">{category.name}</h3>
          <p className="mt-2 max-w-xs text-sm leading-5 text-white/70">{category.description}</p>
        </div>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-zinc-950 transition-transform duration-300 group-hover:translate-x-1">
          <ArrowRightIcon className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

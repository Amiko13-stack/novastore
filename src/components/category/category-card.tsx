import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types/entities";
import { ArrowRightIcon } from "@/components/ui/icons";

export function CategoryCard({ category, index = 0 }: { category: Category; index?: number }) {
  const layout = index === 0 ? "md:col-span-5 md:aspect-[0.84]" : index === 1 ? "md:col-span-4 md:aspect-[0.76] md:translate-y-10" : "md:col-span-3 md:aspect-[0.68] md:translate-y-20";
  return (
    <Link href={`/products?categoryId=${encodeURIComponent(category.categoryId)}`} className={`group relative aspect-[0.95] overflow-hidden rounded-[28px] border border-black/[0.06] bg-zinc-200 shadow-[0_16px_45px_rgba(17,17,17,.05)] ${layout}`}>
      {category.imageUrl ? <Image src={category.imageUrl} alt={category.name} fill sizes="(max-width: 768px) 100vw, 42vw" className="object-cover saturate-[0.92] transition duration-1000 ease-out group-hover:scale-[1.055]" /> : null}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 text-white/70 sm:p-6">
        <span className="text-[9px] font-semibold uppercase tracking-[0.24em]">Collection 0{index + 1}</span>
        <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-7">
        <h3 className="text-3xl font-medium tracking-[-0.055em] sm:text-4xl">{category.name}</h3>
        <div className="mt-4 flex items-end justify-between gap-5">
          <p className="max-w-xs text-sm leading-5 text-white/68">{category.description}</p>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-zinc-950 transition-transform duration-300 group-hover:translate-x-1"><ArrowRightIcon className="h-4 w-4" /></span>
        </div>
      </div>
    </Link>
  );
}

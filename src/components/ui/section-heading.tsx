import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";

export function SectionHeading({ eyebrow, title, description, href, linkLabel = "View all" }: { eyebrow: string; title: string; description?: string; href?: string; linkLabel?: string; }) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-zinc-500">{eyebrow}</p>
        <h2 className="mt-4 text-[clamp(2.5rem,5vw,5.2rem)] font-medium leading-[0.92] tracking-[-0.065em] text-zinc-950">{title}</h2>
        {description ? <p className="mt-5 max-w-2xl text-sm leading-6 text-zinc-600 sm:text-base sm:leading-7">{description}</p> : null}
      </div>
      {href ? (
        <Link href={href} className="group inline-flex w-fit items-center gap-3 rounded-full border border-black/[0.10] bg-white/40 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-white">
          {linkLabel}<ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      ) : null}
    </div>
  );
}

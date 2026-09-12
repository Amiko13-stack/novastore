import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ArrowRightIcon } from "@/components/ui/icons";

export default function NotFound() {
  return (
    <main className="py-16 sm:py-24">
      <Container>
        <div className="overflow-hidden rounded-[32px] bg-zinc-950 px-6 py-20 text-white sm:px-10 sm:py-28 lg:px-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">404 · Not found</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-medium leading-[0.92] tracking-[-0.065em] sm:text-7xl lg:text-8xl">
            Looks like this one left the collection.
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-zinc-400">
            The page or product you were looking for does not exist, or it may have moved somewhere else.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/" className="rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-zinc-950">Back home</Link>
            <Link href="/products" className="group inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold">
              Browse products
              <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}

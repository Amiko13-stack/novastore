import Link from "next/link";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SiteSearch } from "@/components/search/site-search";
import { BagIcon, HeartIcon } from "@/components/ui/icons";
import { Container } from "@/components/ui/container";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.055] bg-[#f3f1eb]/88 backdrop-blur-2xl">
      <Container>
        <div className="flex h-[72px] items-center justify-between gap-5 lg:h-[78px]">
          <div className="flex items-center gap-3">
            <MobileNav />
            <Link href="/" className="group inline-flex items-center gap-2 text-[17px] font-semibold tracking-[-0.055em] text-zinc-950 sm:text-[19px]">
              NOVA<span className="font-normal text-zinc-400 transition-colors group-hover:text-zinc-600">STORE</span>
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-950" />
            </Link>
          </div>

          <nav className="hidden items-center gap-1 rounded-full border border-black/[0.07] bg-white/55 p-1 text-[13px] font-medium text-zinc-600 shadow-[0_8px_30px_rgba(0,0,0,.025)] lg:flex">
            <Link href="/products" className="rounded-full px-5 py-2.5 transition hover:bg-zinc-950 hover:text-white">Shop</Link>
            <Link href="/#new-arrivals" className="rounded-full px-5 py-2.5 transition hover:bg-zinc-950 hover:text-white">New arrivals</Link>
            <Link href="/#categories" className="rounded-full px-5 py-2.5 transition hover:bg-zinc-950 hover:text-white">Categories</Link>
          </nav>

          <div className="flex items-center gap-1">
            <SiteSearch />
            <Link href="/wishlist" aria-label="Wishlist" className="hidden h-10 w-10 place-items-center rounded-full border border-transparent transition duration-300 hover:border-black/[0.06] hover:bg-white hover:shadow-sm sm:grid">
              <HeartIcon className="h-[18px] w-[18px]" />
            </Link>
            <Link href="/cart" aria-label="Shopping bag" className="grid h-10 w-10 place-items-center rounded-full border border-transparent transition duration-300 hover:border-black/[0.06] hover:bg-white hover:shadow-sm">
              <BagIcon className="h-[18px] w-[18px]" />
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}

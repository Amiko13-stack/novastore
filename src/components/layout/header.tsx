import Link from "next/link";
import { MobileNav } from "@/components/layout/mobile-nav";
import { BagIcon, HeartIcon, SearchIcon } from "@/components/ui/icons";
import { Container } from "@/components/ui/container";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-[#f6f6f3]/90 backdrop-blur-xl">
      <Container>
        <div className="flex h-16 items-center justify-between gap-5 lg:h-[72px]">
          <div className="flex items-center gap-3">
            <MobileNav />
            <Link href="/" className="text-lg font-semibold tracking-[-0.045em] text-zinc-950 sm:text-xl">
              NOVA<span className="font-normal text-zinc-400">STORE</span>
            </Link>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-600 lg:flex">
            <Link href="/products" className="transition hover:text-zinc-950">Shop</Link>
            <Link href="/#new-arrivals" className="transition hover:text-zinc-950">New arrivals</Link>
            <Link href="/#categories" className="transition hover:text-zinc-950">Categories</Link>
          </nav>

          <div className="flex items-center gap-1">
            <Link
              href="/products"
              aria-label="Search products"
              className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-white"
            >
              <SearchIcon className="h-[19px] w-[19px]" />
            </Link>
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="hidden h-10 w-10 place-items-center rounded-full transition hover:bg-white sm:grid"
            >
              <HeartIcon className="h-[19px] w-[19px]" />
            </Link>
            <Link
              href="/cart"
              aria-label="Shopping bag"
              className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-white"
            >
              <BagIcon className="h-[19px] w-[19px]" />
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}

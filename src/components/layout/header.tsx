import Link from "next/link";
import { Container } from "@/components/ui/container";

export function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight text-zinc-950">
            NovaStore
          </Link>

          <nav className="flex items-center gap-5 text-sm font-medium text-zinc-700">
            <Link href="/products" className="hover:text-zinc-950">Products</Link>
            <Link href="/wishlist" className="hover:text-zinc-950">Wishlist</Link>
            <Link href="/cart" className="hover:text-zinc-950">Cart</Link>
          </nav>
        </div>
      </Container>
    </header>
  );
}

import Link from "next/link";
import { Container } from "@/components/ui/container";
import { HeartIcon } from "@/components/ui/icons";

export default function WishlistPage() {
  return (
    <main className="py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white shadow-sm">
            <HeartIcon className="h-6 w-6" />
          </span>
          <h1 className="mt-7 text-4xl font-medium tracking-[-0.05em] sm:text-5xl">Nothing saved yet.</h1>
          <p className="mt-4 text-sm leading-6 text-zinc-600">
            Wishlist persistence will connect to DynamoDB on Day 6. For now, this polished empty state keeps the storefront complete.
          </p>
          <Link href="/products" className="mt-8 inline-flex rounded-full bg-zinc-950 px-6 py-3.5 text-sm font-semibold text-white">
            Find something to save
          </Link>
        </div>
      </Container>
    </main>
  );
}

import Link from "next/link";
import { Container } from "@/components/ui/container";
import { BagIcon } from "@/components/ui/icons";

export default function CartPage() {
  return (
    <main className="py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white shadow-sm">
            <BagIcon className="h-6 w-6" />
          </span>
          <h1 className="mt-7 text-4xl font-medium tracking-[-0.05em] sm:text-5xl">Your bag is empty.</h1>
          <p className="mt-4 text-sm leading-6 text-zinc-600">
            The cart interface is ready for the persistence and quantity logic we connect on Day 5.
          </p>
          <Link href="/products" className="mt-8 inline-flex rounded-full bg-zinc-950 px-6 py-3.5 text-sm font-semibold text-white">
            Explore products
          </Link>
        </div>
      </Container>
    </main>
  );
}

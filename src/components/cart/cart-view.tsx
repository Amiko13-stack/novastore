"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Container } from "@/components/ui/container";
import type { CartSnapshot } from "@/types/cart";
import { formatCurrency } from "@/utils/format-currency";

export function CartView({ cart }: { cart: CartSnapshot }) {
  const router = useRouter();
  const [pendingProductId, setPendingProductId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function mutateCart(
    productId: string,
    options: RequestInit,
  ) {
    setPendingProductId(productId);
    setError(null);

    try {
      const response = await fetch(`/api/cart/${encodeURIComponent(productId)}`, options);
      const payload = (await response.json()) as {
        success: boolean;
        error?: string;
      };

      if (!response.ok || !payload.success) {
        throw new Error(payload.error ?? "Could not update your bag");
      }

      window.dispatchEvent(new Event("novastore:cart-updated"));
      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not update your bag",
      );
    } finally {
      setPendingProductId(null);
    }
  }

  function updateQuantity(productId: string, quantity: number) {
    return mutateCart(productId, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity }),
    });
  }

  function removeItem(productId: string) {
    return mutateCart(productId, {
      method: "DELETE",
    });
  }

  if (cart.items.length === 0) {
    return (
      <main className="py-20 sm:py-28">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-500">
              Your bag
            </p>
            <h1 className="mt-5 text-5xl font-medium tracking-[-0.06em] sm:text-7xl">
              Nothing here yet.
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-zinc-600 sm:text-base">
              Build your edit from the NovaStore collection. Anything you add is saved in DynamoDB and will still be here when you return.
            </p>
            <Link
              href="/products"
              className="mt-9 inline-flex rounded-full bg-zinc-950 px-7 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-zinc-800"
            >
              Explore the collection
            </Link>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main>
      <section className="border-b border-black/[0.055] py-14 sm:py-20">
        <Container>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-500">
                Your bag
              </p>
              <h1 className="mt-4 text-5xl font-medium leading-[0.94] tracking-[-0.06em] sm:text-7xl">
                Selected pieces.
              </h1>
            </div>
            <p className="text-sm text-zinc-500">
              {cart.itemCount} {cart.itemCount === 1 ? "item" : "items"}
            </p>
          </div>
        </Container>
      </section>

      <section className="py-10 sm:py-14">
        <Container>
          {error ? (
            <div className="mb-6 rounded-[20px] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700" role="alert">
              {error}
            </div>
          ) : null}

          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start xl:gap-16">
            <div className="divide-y divide-black/[0.07] border-y border-black/[0.07]">
              {cart.items.map((item) => {
                const busy = pendingProductId === item.product.productId;

                return (
                  <article
                    key={item.product.productId}
                    className={`grid gap-5 py-6 transition sm:grid-cols-[150px_1fr] sm:py-8 ${busy ? "opacity-55" : "opacity-100"}`}
                  >
                    <Link
                      href={`/products/${item.product.productId}`}
                      className="relative aspect-square overflow-hidden rounded-[24px] bg-[#e9e7e0]"
                    >
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        sizes="150px"
                        className="object-cover transition duration-700 hover:scale-105"
                      />
                    </Link>

                    <div className="flex min-w-0 flex-col justify-between gap-6">
                      <div className="flex items-start justify-between gap-5">
                        <div>
                          <Link
                            href={`/products/${item.product.productId}`}
                            className="text-xl font-medium tracking-[-0.035em] transition hover:text-zinc-600"
                          >
                            {item.product.name}
                          </Link>
                          <p className="mt-2 line-clamp-2 max-w-xl text-sm leading-6 text-zinc-500">
                            {item.product.description}
                          </p>
                        </div>
                        <p className="shrink-0 text-sm font-semibold tracking-tight">
                          {formatCurrency(item.lineTotal)}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="inline-flex items-center rounded-full border border-black/[0.09] bg-white/45 p-1">
                          <button
                            type="button"
                            aria-label={`Decrease ${item.product.name} quantity`}
                            disabled={busy || item.quantity <= 1}
                            onClick={() => void updateQuantity(item.product.productId, item.quantity - 1)}
                            className="grid h-9 w-9 place-items-center rounded-full text-lg transition hover:bg-zinc-950 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            −
                          </button>
                          <span className="min-w-9 text-center text-sm font-semibold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label={`Increase ${item.product.name} quantity`}
                            disabled={busy || item.quantity >= item.product.stock}
                            onClick={() => void updateQuantity(item.product.productId, item.quantity + 1)}
                            className="grid h-9 w-9 place-items-center rounded-full text-lg transition hover:bg-zinc-950 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => void removeItem(item.product.productId)}
                          className="text-xs font-semibold text-zinc-500 underline decoration-zinc-300 underline-offset-4 transition hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <aside className="rounded-[28px] border border-black/[0.07] bg-white/45 p-6 shadow-[0_20px_55px_rgba(17,17,17,.04)] backdrop-blur sm:p-7 lg:sticky lg:top-28">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Order summary
              </p>

              <div className="mt-6 space-y-4 border-b border-black/[0.07] pb-6 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-zinc-500">Subtotal</span>
                  <span className="font-semibold">{formatCurrency(cart.subtotal)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-zinc-500">Delivery</span>
                  <span className="font-semibold">Free</span>
                </div>
              </div>

              <div className="flex items-end justify-between gap-4 py-6">
                <span className="text-sm font-medium">Estimated total</span>
                <span className="text-2xl font-medium tracking-[-0.04em]">
                  {formatCurrency(cart.subtotal)}
                </span>
              </div>

              <button
                type="button"
                disabled
                title="Payment checkout is outside this internship task"
                className="h-13 w-full rounded-full bg-zinc-950 px-6 py-3.5 text-sm font-semibold text-white opacity-45"
              >
                Checkout
              </button>
              <p className="mt-3 text-center text-[11px] leading-5 text-zinc-400">
                Checkout is intentionally outside the current internship scope.
              </p>

              <Link
                href="/products"
                className="mt-5 block text-center text-xs font-semibold text-zinc-600 underline decoration-zinc-300 underline-offset-4 transition hover:text-zinc-950"
              >
                Continue shopping
              </Link>
            </aside>
          </div>
        </Container>
      </section>
    </main>
  );
}

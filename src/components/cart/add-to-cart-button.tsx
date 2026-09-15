"use client";

import { useState } from "react";

type AddToCartButtonProps = {
  productId: string;
  stock: number;
};

export function AddToCartButton({ productId, stock }: AddToCartButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "added">("idle");
  const [error, setError] = useState<string | null>(null);

  const unavailable = stock < 1;

  async function handleAddToCart() {
    if (unavailable || status === "loading") return;

    setStatus("loading");
    setError(null);

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });

      const payload = (await response.json()) as {
        success: boolean;
        error?: string;
      };

      if (!response.ok || !payload.success) {
        throw new Error(payload.error ?? "Could not add this product to your bag");
      }

      setStatus("added");
      window.dispatchEvent(new Event("novastore:cart-updated"));

      window.setTimeout(() => {
        setStatus("idle");
      }, 1400);
    } catch (caughtError) {
      setStatus("idle");
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not add this product to your bag",
      );
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={unavailable || status === "loading"}
        className="h-14 w-full rounded-full bg-zinc-950 px-7 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(17,17,17,.11)] transition duration-300 hover:-translate-y-0.5 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0"
      >
        {unavailable
          ? "Out of stock"
          : status === "loading"
            ? "Adding…"
            : status === "added"
              ? "Added to bag ✓"
              : "Add to bag"}
      </button>

      {error ? (
        <p className="mt-2 text-xs leading-5 text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

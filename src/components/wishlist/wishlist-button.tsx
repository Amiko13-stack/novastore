"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HeartIcon } from "@/components/ui/icons";

type WishlistButtonProps = {
  productId: string;
  initialSaved?: boolean;
  variant?: "card" | "detail";
};

export function WishlistButton({
  productId,
  initialSaved = false,
  variant = "card",
}: WishlistButtonProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggleWishlist() {
    if (pending) return;

    setPending(true);
    setError(null);

    try {
      const response = await fetch(
        saved ? `/api/wishlist/${encodeURIComponent(productId)}` : "/api/wishlist",
        saved
          ? { method: "DELETE" }
          : {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ productId }),
            },
      );

      const payload = (await response.json()) as {
        success: boolean;
        error?: string;
      };

      if (!response.ok || !payload.success) {
        throw new Error(payload.error ?? "Wishlist could not be updated");
      }

      setSaved((current) => !current);
      window.dispatchEvent(new Event("novastore:wishlist-updated"));
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Wishlist could not be updated");
    } finally {
      setPending(false);
    }
  }

  const common =
    "grid place-items-center transition duration-300 disabled:cursor-wait disabled:opacity-60";
  const variantClass =
    variant === "card"
      ? "absolute right-3 top-3 h-10 w-10 rounded-full border border-black/[0.06] bg-white/90 text-zinc-950 shadow-sm backdrop-blur hover:scale-105 hover:bg-white"
      : "h-14 w-full rounded-full border border-zinc-300 bg-white/45 text-zinc-950 hover:border-zinc-950 hover:bg-white sm:w-14";

  return (
    <button
      type="button"
      onClick={toggleWishlist}
      disabled={pending}
      aria-pressed={saved}
      aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
      title={error ?? (saved ? "Remove from wishlist" : "Add to wishlist")}
      className={`${common} ${variantClass} ${saved ? "bg-zinc-950 text-white hover:bg-zinc-800" : ""}`}
    >
      <HeartIcon
        className="h-[18px] w-[18px]"
        fill={saved ? "currentColor" : "none"}
      />
    </button>
  );
}

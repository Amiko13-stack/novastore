"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BagIcon } from "@/components/ui/icons";

export function CartLink() {
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadCount() {
      try {
        const response = await fetch("/api/cart", { cache: "no-store" });
        const payload = (await response.json()) as {
          success: boolean;
          data?: { itemCount?: number };
        };

        if (active && response.ok && payload.success) {
          setItemCount(payload.data?.itemCount ?? 0);
        }
      } catch {
        // The bag link still works even if its small count badge cannot load.
      }
    }

    void loadCount();

    const handleCartUpdated = () => {
      void loadCount();
    };

    window.addEventListener("novastore:cart-updated", handleCartUpdated);

    return () => {
      active = false;
      window.removeEventListener("novastore:cart-updated", handleCartUpdated);
    };
  }, []);

  return (
    <Link
      href="/cart"
      aria-label={`Shopping bag with ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
      className="relative grid h-10 w-10 place-items-center rounded-full border border-transparent transition duration-300 hover:border-black/[0.06] hover:bg-white hover:shadow-sm"
    >
      <BagIcon className="h-[18px] w-[18px]" />
      {itemCount > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 grid min-h-4 min-w-4 place-items-center rounded-full bg-zinc-950 px-1 text-[9px] font-semibold leading-none text-white ring-2 ring-[#f3f1eb]">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      ) : null}
    </Link>
  );
}

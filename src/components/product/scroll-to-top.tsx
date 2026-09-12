"use client";

import { useEffect } from "react";

export function ScrollToTop({ productId }: { productId: string }) {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [productId]);

  return null;
}

import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { getCart } from "@/services/cart.service";

export const metadata: Metadata = {
  title: "Bag",
  description: "Review and manage the products saved in your NovaStore bag.",
};

export const dynamic = "force-dynamic";

export default async function CartPage() {
  if (process.env.ADMIN_ONLY_MODE === "true") redirect("/admin");
  const cart = await getCart(getCurrentUserId());

  return <CartView cart={cart} />;
}

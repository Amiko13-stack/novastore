import { redirect } from "next/navigation";
import { CategorySection } from "@/components/home/category-section";
import { EditorialSection } from "@/components/home/editorial-section";
import { Hero } from "@/components/home/hero";
import { TrustStrip } from "@/components/home/trust-strip";
import { ProductGrid } from "@/components/product/product-grid";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { getCategories } from "@/services/category.service";
import { getProducts } from "@/services/product.service";
import { getWishlist } from "@/services/wishlist.service";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  if (process.env.ADMIN_ONLY_MODE === "true") redirect("/admin");
  if (!process.env.AWS_REGION) redirect("/admin");
  const [categories, products, wishlist] = await Promise.all([
    getCategories(),
    getProducts(),
    getWishlist(getCurrentUserId()),
  ]);
  const sortedCategories = [...categories].sort((a, b) => a.name.localeCompare(b.name));
  const newest = [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4);
  const featured = [...products].filter((product) => product.featured).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const heroProduct = featured[0] ?? newest[0];
  const editorialProduct = products.find((product) => product.categoryId === "cat-home") ?? featured[1] ?? newest[1];
  const categoryNames = Object.fromEntries(categories.map((category) => [category.categoryId, category.name]));
  const savedProductIds = wishlist.items.map((item) => item.product.productId);

  return (
    <main>
      <Hero product={heroProduct} />
      <CategorySection categories={sortedCategories} />

      <section id="new-arrivals" className="bg-white/58 py-24 sm:py-32 lg:py-36">
        <Container>
          <SectionHeading eyebrow="New arrivals" title="Fresh objects, quietly added." description="The newest pieces in NovaStore, pulled directly from your live DynamoDB catalog." href="/products" linkLabel="Shop all" />
          <div className="mt-12"><ProductGrid products={newest} categoryNames={categoryNames} savedProductIds={savedProductIds} /></div>
        </Container>
      </section>

      <EditorialSection product={editorialProduct} />

      <section className="py-24 sm:py-32 lg:py-36">
        <Container>
          <SectionHeading eyebrow="Selected for you" title="Things worth making room for." description="A focused edit of standout pieces across technology, fashion and home." href="/products" linkLabel="Explore everything" />
          <div className="mt-12"><ProductGrid products={featured.slice(0, 4)} categoryNames={categoryNames} savedProductIds={savedProductIds} /></div>
        </Container>
      </section>
      <TrustStrip />
    </main>
  );
}

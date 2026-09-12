import { CategorySection } from "@/components/home/category-section";
import { EditorialSection } from "@/components/home/editorial-section";
import { Hero } from "@/components/home/hero";
import { TrustStrip } from "@/components/home/trust-strip";
import { ProductGrid } from "@/components/product/product-grid";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCategories } from "@/services/category.service";
import { getProducts } from "@/services/product.service";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  const sortedCategories = [...categories].sort((a, b) => a.name.localeCompare(b.name));
  const newest = [...products]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 4);
  const featured = [...products]
    .filter((product) => product.featured)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const heroProduct = featured[0] ?? newest[0];
  const editorialProduct = products.find((product) => product.categoryId === "cat-home") ?? featured[1] ?? newest[1];
  const categoryNames = Object.fromEntries(categories.map((category) => [category.categoryId, category.name]));

  return (
    <main>
      <Hero product={heroProduct} />

      <CategorySection categories={sortedCategories} />

      <section id="new-arrivals" className="border-y border-zinc-300/60 bg-white/55 py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="New arrivals"
            title="Freshly added to the edit."
            description="The newest pieces in NovaStore, pulled directly from the live DynamoDB catalog."
            href="/products"
            linkLabel="Shop all"
          />
          <div className="mt-10">
            <ProductGrid products={newest} categoryNames={categoryNames} />
          </div>
        </Container>
      </section>

      <EditorialSection product={editorialProduct} />

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Selected for you"
            title="Objects worth keeping around."
            description="A focused edit of standout products across technology, fashion and home."
            href="/products"
            linkLabel="Explore everything"
          />
          <div className="mt-10">
            <ProductGrid products={featured.slice(0, 4)} categoryNames={categoryNames} />
          </div>
        </Container>
      </section>

      <TrustStrip />
    </main>
  );
}

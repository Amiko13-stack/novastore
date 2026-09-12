import type { Category } from "@/types/entities";
import { CategoryCard } from "@/components/category/category-card";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

export function CategorySection({ categories }: { categories: Category[] }) {
  return (
    <section id="categories" className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Shop by category"
          title="Find what fits your day."
          description="Three focused collections, selected around usefulness, simplicity and modern design."
        />

        <div className="mt-10 grid gap-4 md:grid-cols-3 lg:gap-5">
          {categories.map((category, index) => (
            <CategoryCard key={category.categoryId} category={category} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}

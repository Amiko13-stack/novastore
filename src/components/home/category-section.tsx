import type { Category } from "@/types/entities";
import { CategoryCard } from "@/components/category/category-card";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

export function CategorySection({ categories }: { categories: Category[] }) {
  return (
    <section id="categories" className="py-24 sm:py-32 lg:py-36">
      <Container>
        <SectionHeading eyebrow="Shop by category" title="Three worlds. One point of view." description="A focused collection across technology, fashion and home — selected to feel useful, current and easy to live with." />
        <div className="mt-12 grid gap-4 md:grid-cols-12 lg:gap-5">
          {categories.map((category, index) => <CategoryCard key={category.categoryId} category={category} index={index} />)}
        </div>
      </Container>
    </section>
  );
}

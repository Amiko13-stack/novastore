import Link from "next/link";
import { Container } from "@/components/ui/container";

const foundation = [
  "Next.js App Router + TypeScript",
  "Tailwind CSS responsive UI",
  "Server/API layer with Route Handlers",
  "AWS DynamoDB data layer",
  "Reusable components and typed entities",
  "Environment variables for configuration",
];

export default function HomePage() {
  return (
    <main>
      <section className="border-b border-zinc-200 bg-white py-20">
        <Container>
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Software Engineer Internship Project
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              A real full-stack e-commerce application.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
              NovaStore will include products, categories, search, cart, wishlist,
              API logic, validation, error handling, and DynamoDB persistence.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
              >
                Browse products
              </Link>
              <a
                href="/api/health"
                className="rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold hover:bg-zinc-100"
              >
                API health check
              </a>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <h2 className="text-2xl font-bold">Day 1 foundation</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {foundation.map((item) => (
              <div key={item} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                <p className="font-medium">{item}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}

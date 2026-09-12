import { Container } from "@/components/ui/container";

export default function ProductsLoading() {
  return (
    <main className="py-14 sm:py-20">
      <Container>
        <div className="animate-pulse">
          <div className="h-3 w-20 rounded bg-zinc-200" />
          <div className="mt-5 h-14 max-w-xl rounded-xl bg-zinc-200 sm:h-16" />
          <div className="mt-5 h-5 max-w-2xl rounded bg-zinc-200" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index}>
                <div className="aspect-[0.86] rounded-[24px] bg-zinc-200" />
                <div className="mt-4 h-3 w-20 rounded bg-zinc-200" />
                <div className="mt-3 h-5 w-4/5 rounded bg-zinc-200" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}

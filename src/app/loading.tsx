import { Container } from "@/components/ui/container";

export default function Loading() {
  return (
    <main className="py-10 sm:py-14">
      <Container>
        <div className="animate-pulse">
          <div className="h-[520px] rounded-[28px] bg-zinc-200 sm:h-[620px]" />
          <div className="mt-20 h-3 w-28 rounded-full bg-zinc-200" />
          <div className="mt-4 h-10 max-w-lg rounded-xl bg-zinc-200" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index}>
                <div className="aspect-[0.86] rounded-[24px] bg-zinc-200" />
                <div className="mt-4 h-3 w-20 rounded bg-zinc-200" />
                <div className="mt-3 h-5 w-3/4 rounded bg-zinc-200" />
                <div className="mt-2 h-4 w-1/2 rounded bg-zinc-100" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}

import { Container } from "@/components/ui/container";

export default function ProductLoading() {
  return (
    <main className="py-8">
      <Container>
        <div className="grid animate-pulse gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="aspect-[0.92] rounded-[28px] bg-zinc-200" />
          <div className="py-10">
            <div className="h-3 w-28 rounded bg-zinc-200" />
            <div className="mt-5 h-14 w-4/5 rounded-xl bg-zinc-200" />
            <div className="mt-6 h-7 w-28 rounded bg-zinc-200" />
            <div className="mt-10 h-px bg-zinc-200" />
            <div className="mt-8 h-5 rounded bg-zinc-200" />
            <div className="mt-3 h-5 w-5/6 rounded bg-zinc-200" />
            <div className="mt-10 h-14 rounded-full bg-zinc-200" />
          </div>
        </div>
      </Container>
    </main>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="text-center">
        <p className="text-sm font-semibold text-zinc-500">404</p>
        <h1 className="mt-2 text-4xl font-bold">Page not found</h1>
        <p className="mt-3 text-zinc-600">The page you requested does not exist.</p>
        <Link href="/" className="mt-6 inline-block rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white">
          Go home
        </Link>
      </div>
    </main>
  );
}

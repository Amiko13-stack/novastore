"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-[70vh] place-items-center px-4 py-20">
      <div className="max-w-xl text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">Unexpected error</p>
        <h1 className="mt-4 text-5xl font-medium leading-none tracking-[-0.06em] sm:text-6xl">Something went off course.</h1>
        <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-zinc-600">
          NovaStore could not load this page correctly. The application caught the error instead of crashing.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 rounded-full bg-zinc-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
        >
          Try again
        </button>
      </div>
    </main>
  );
}

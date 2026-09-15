"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CloseIcon, SearchIcon } from "@/components/ui/icons";

export function SiteSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => inputRef.current?.focus(), 50);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    setOpen(false);
    router.push(value ? `/products?q=${encodeURIComponent(value)}` : "/products");
  }

  return (
    <>
      <button
        type="button"
        aria-label="Search products"
        onClick={() => setOpen(true)}
        className="grid h-10 w-10 place-items-center rounded-full border border-transparent transition duration-300 hover:border-black/[0.06] hover:bg-white hover:shadow-sm"
      >
        <SearchIcon className="h-[18px] w-[18px]" />
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search NovaStore"
          className="fixed inset-0 z-[100] bg-[#ebe8df]/96 backdrop-blur-2xl"
        >
          <div className="mx-auto flex min-h-full max-w-6xl flex-col px-5 py-6 sm:px-8 sm:py-8">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold tracking-[-0.03em]">
                NOVA<span className="font-normal text-zinc-400">STORE</span>
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close search"
                className="grid h-11 w-11 place-items-center rounded-full border border-black/[0.08] bg-white/60 transition hover:bg-white"
              >
                <CloseIcon className="h-[18px] w-[18px]" />
              </button>
            </div>

            <div className="flex flex-1 items-center py-16">
              <div className="w-full">
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-500">
                  Search the edit
                </p>
                <form onSubmit={submit} className="mt-5 border-b border-zinc-950 pb-4 sm:pb-6">
                  <div className="flex items-center gap-4">
                    <SearchIcon className="h-7 w-7 shrink-0 text-zinc-500 sm:h-9 sm:w-9" />
                    <input
                      ref={inputRef}
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="What are you looking for?"
                      className="min-w-0 flex-1 bg-transparent text-3xl font-medium tracking-[-0.05em] text-zinc-950 outline-none placeholder:text-zinc-400 sm:text-5xl lg:text-6xl"
                    />
                    <button
                      type="submit"
                      className="hidden rounded-full bg-zinc-950 px-6 py-3 text-xs font-semibold text-white sm:block"
                    >
                      Search
                    </button>
                  </div>
                </form>
                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-zinc-500">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                    Try
                  </span>
                  {["headphones", "jacket", "chair", "lamp"].map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        router.push(`/products?q=${encodeURIComponent(term)}`);
                      }}
                      className="transition hover:text-zinc-950"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-xs leading-5 text-zinc-500">
              Search checks product names and descriptions. Press Esc to close.
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}

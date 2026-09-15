"use client";

import { useState, type FormEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Category } from "@/types/entities";
import { CloseIcon, SearchIcon } from "@/components/ui/icons";

type SortValue = "newest" | "price-asc" | "price-desc" | "name-asc";

type CatalogControlsProps = {
  categories: Category[];
  resultCount: number;
  values: {
    q?: string;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    sort: SortValue;
  };
};

function hasPriceFilter(minPrice?: number, maxPrice?: number) {
  return minPrice !== undefined || maxPrice !== undefined;
}

export function CatalogControls({
  categories,
  resultCount,
  values,
}: CatalogControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(values.q ?? "");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(
    values.minPrice !== undefined ? String(values.minPrice) : "",
  );
  const [maxPrice, setMaxPrice] = useState(
    values.maxPrice !== undefined ? String(values.maxPrice) : "",
  );
  function navigate(patch: Record<string, string | number | undefined | null>) {
    const params = new URLSearchParams();

    if (values.q) params.set("q", values.q);
    if (values.categoryId) params.set("categoryId", values.categoryId);
    if (values.minPrice !== undefined)
      params.set("minPrice", String(values.minPrice));
    if (values.maxPrice !== undefined)
      params.set("maxPrice", String(values.maxPrice));
    if (values.sort !== "newest") params.set("sort", values.sort);

    Object.entries(patch).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    const search = params.toString();
    router.push(search ? `${pathname}?${search}` : pathname, { scroll: false });
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate({ q: query.trim() || undefined });
  }

  function applyCustomPrice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate({
      minPrice: minPrice.trim() || undefined,
      maxPrice: maxPrice.trim() || undefined,
    });
    setFiltersOpen(false);
  }

  const activeCategory = categories.find(
    (category) => category.categoryId === values.categoryId,
  );
  const activeCount =
    Number(Boolean(values.q)) +
    Number(Boolean(values.categoryId)) +
    Number(hasPriceFilter(values.minPrice, values.maxPrice));

  return (
    <div className="space-y-5">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-center">
        <form onSubmit={submitSearch} className="relative">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-zinc-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search the collection"
            aria-label="Search products"
            className="h-12 w-full rounded-full border border-black/[0.09] bg-white/65 pl-11 pr-24 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-black/25 focus:bg-white focus:ring-4 focus:ring-black/[0.035]"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 h-9 rounded-full bg-zinc-950 px-4 text-xs font-semibold text-white transition hover:bg-zinc-800"
          >
            Search
          </button>
        </form>

        <button
          type="button"
          onClick={() => setFiltersOpen((open) => !open)}
          className={`h-12 rounded-full border px-5 text-sm font-medium transition ${
            filtersOpen || activeCount > 0
              ? "border-zinc-950 bg-zinc-950 text-white"
              : "border-black/[0.09] bg-white/55 text-zinc-800 hover:bg-white"
          }`}
        >
          Filters{activeCount > 0 ? ` · ${activeCount}` : ""}
        </button>

        <label className="flex h-12 items-center gap-3 rounded-full border border-black/[0.09] bg-white/55 px-4 text-xs text-zinc-500">
          <span>Sort</span>
          <select
            value={values.sort}
            onChange={(event) => navigate({ sort: event.target.value })}
            className="min-w-32 bg-transparent text-sm font-medium text-zinc-950 outline-none"
            aria-label="Sort products"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name-asc">Name: A–Z</option>
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => navigate({ categoryId: undefined })}
          className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
            !values.categoryId
              ? "bg-zinc-950 text-white"
              : "border border-black/[0.09] bg-white/45 text-zinc-700 hover:bg-white"
          }`}
        >
          All
        </button>
        {[...categories]
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((category) => (
            <button
              key={category.categoryId}
              type="button"
              onClick={() => navigate({ categoryId: category.categoryId })}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                values.categoryId === category.categoryId
                  ? "bg-zinc-950 text-white"
                  : "border border-black/[0.09] bg-white/45 text-zinc-700 hover:bg-white"
              }`}
            >
              {category.name}
            </button>
          ))}
        <span className="ml-auto hidden text-xs text-zinc-500 sm:inline">
          {resultCount} {resultCount === 1 ? "result" : "results"}
        </span>
      </div>

      {filtersOpen ? (
        <div className="rounded-[26px] border border-black/[0.07] bg-white/70 p-5 shadow-[0_20px_50px_rgba(17,17,17,.045)] backdrop-blur-xl sm:p-6">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Price
              </p>
              <h3 className="mt-2 text-xl font-medium tracking-[-0.035em]">
                Refine by budget.
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              aria-label="Close filters"
              className="grid h-9 w-9 place-items-center rounded-full border border-black/[0.08] bg-white"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {[
              { label: "Any price", min: undefined, max: undefined },
              { label: "Under $100", min: undefined, max: 100 },
              { label: "$100–$200", min: 100, max: 200 },
              { label: "$200+", min: 200, max: undefined },
            ].map((preset) => {
              const selected =
                values.minPrice === preset.min && values.maxPrice === preset.max;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    navigate({ minPrice: preset.min, maxPrice: preset.max });
                    setFiltersOpen(false);
                  }}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                    selected
                      ? "bg-zinc-950 text-white"
                      : "border border-black/[0.09] bg-[#f5f3ed] text-zinc-700 hover:bg-white"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          <form
            onSubmit={applyCustomPrice}
            className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr_auto]"
          >
            <input
              inputMode="decimal"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
              placeholder="Min price"
              aria-label="Minimum price"
              className="h-11 rounded-full border border-black/[0.09] bg-white px-4 text-sm outline-none focus:border-black/25"
            />
            <input
              inputMode="decimal"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              placeholder="Max price"
              aria-label="Maximum price"
              className="h-11 rounded-full border border-black/[0.09] bg-white px-4 text-sm outline-none focus:border-black/25"
            />
            <button
              type="submit"
              className="h-11 rounded-full bg-zinc-950 px-5 text-xs font-semibold text-white"
            >
              Apply
            </button>
          </form>
        </div>
      ) : null}

      {activeCount > 0 ? (
        <div className="flex flex-wrap items-center gap-2 border-t border-black/[0.055] pt-4">
          <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
            Active
          </span>
          {values.q ? (
            <button
              type="button"
              onClick={() => navigate({ q: undefined })}
              className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-medium shadow-sm"
            >
              Search: “{values.q}” <CloseIcon className="h-3 w-3" />
            </button>
          ) : null}
          {activeCategory ? (
            <button
              type="button"
              onClick={() => navigate({ categoryId: undefined })}
              className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-medium shadow-sm"
            >
              {activeCategory.name} <CloseIcon className="h-3 w-3" />
            </button>
          ) : null}
          {hasPriceFilter(values.minPrice, values.maxPrice) ? (
            <button
              type="button"
              onClick={() => navigate({ minPrice: undefined, maxPrice: undefined })}
              className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-medium shadow-sm"
            >
              {values.minPrice !== undefined && values.maxPrice !== undefined
                ? `$${values.minPrice}–$${values.maxPrice}`
                : values.maxPrice !== undefined
                  ? `Under $${values.maxPrice}`
                  : `$${values.minPrice}+`}
              <CloseIcon className="h-3 w-3" />
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => router.push(pathname, { scroll: false })}
            className="ml-1 text-xs font-semibold text-zinc-500 underline decoration-zinc-300 underline-offset-4 hover:text-zinc-950"
          >
            Clear all
          </button>
        </div>
      ) : null}
    </div>
  );
}

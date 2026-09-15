"use client";

import Link from "next/link";
import { useState } from "react";
import { BagIcon, CloseIcon, HeartIcon, MenuIcon, SearchIcon } from "@/components/ui/icons";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label="Open navigation"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-zinc-100"
      >
        <MenuIcon className="h-5 w-5" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-[80] bg-white">
          <div className="flex h-16 items-center justify-between border-b border-zinc-200 px-4 sm:px-6">
            <Link href="/" onClick={() => setOpen(false)} className="text-lg font-semibold tracking-[-0.04em]">
              NOVA<span className="font-normal text-zinc-400">STORE</span>
            </Link>
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setOpen(false)}
              className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-zinc-100"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex h-[calc(100vh-4rem)] flex-col px-4 py-8 sm:px-6">
            <div className="space-y-1">
              {[
                ["Shop all", "/products"],
                ["New arrivals", "/#new-arrivals"],
                ["Categories", "/#categories"],
                ["My profile", "/account"],
              ].map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-zinc-100 py-4 text-3xl font-medium tracking-[-0.04em]"
                >
                  {label}
                </Link>
              ))}
            </div>

            <div className="mt-auto grid grid-cols-3 gap-2 border-t border-zinc-200 pt-6 text-center text-xs font-medium text-zinc-600">
              <Link href="/products" onClick={() => setOpen(false)} className="rounded-2xl bg-zinc-100 p-4">
                <SearchIcon className="mx-auto mb-2 h-5 w-5" />
                Search
              </Link>
              <Link href="/wishlist" onClick={() => setOpen(false)} className="rounded-2xl bg-zinc-100 p-4">
                <HeartIcon className="mx-auto mb-2 h-5 w-5" />
                Wishlist
              </Link>
              <Link href="/cart" onClick={() => setOpen(false)} className="rounded-2xl bg-zinc-100 p-4">
                <BagIcon className="mx-auto mb-2 h-5 w-5" />
                Bag
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </div>
  );
}

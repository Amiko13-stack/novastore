"use client";

import { FormEvent, useState } from "react";
import type { User } from "@/types/entities";

export function AccountForm({ user }: { user: User }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const payload = (await response.json()) as {
        success: boolean;
        error?: string;
      };

      if (!response.ok || !payload.success) {
        throw new Error(payload.error ?? "Profile could not be saved");
      }

      setMessage("Profile saved to DynamoDB.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Profile could not be saved");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-10 space-y-6">
      <div>
        <label htmlFor="name" className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
          Name
        </label>
        <input
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-2 w-full rounded-[18px] border border-zinc-300 bg-white/65 px-4 py-3.5 text-sm outline-none transition focus:border-zinc-950"
        />
      </div>

      <div>
        <label htmlFor="email" className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 w-full rounded-[18px] border border-zinc-300 bg-white/65 px-4 py-3.5 text-sm outline-none transition focus:border-zinc-950"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-zinc-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-wait disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save profile"}
        </button>
        {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </div>
    </form>
  );
}

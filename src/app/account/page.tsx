import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AccountForm } from "@/components/account/account-form";
import { Container } from "@/components/ui/container";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { getOrCreateUser } from "@/services/user.service";

export const metadata: Metadata = {
  title: "Account",
  description: "Manage the NovaStore demo user profile.",
};

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  if (process.env.ADMIN_ONLY_MODE === "true") redirect("/admin");
  const user = await getOrCreateUser(getCurrentUserId());

  return (
    <main className="py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
            Account
          </p>
          <h1 className="mt-4 text-5xl font-medium leading-[0.95] tracking-[-0.06em] sm:text-6xl">
            Your profile.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-zinc-600">
            This internship demo uses one server-resolved user. Update the profile here and the data is persisted in the Users DynamoDB table.
          </p>

          <div className="mt-10 rounded-[28px] border border-zinc-300/70 bg-white/50 p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4 border-b border-zinc-200 pb-5 text-sm">
              <span className="text-zinc-500">User ID</span>
              <span className="font-medium text-zinc-950">{user.userId}</span>
            </div>
            <AccountForm user={user} />
          </div>
        </div>
      </Container>
    </main>
  );
}

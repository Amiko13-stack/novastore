import Link from "next/link";
import { Container } from "@/components/ui/container";

const footerGroups = [
  {
    title: "Shop",
    links: [
      ["All products", "/products"],
      ["New arrivals", "/#new-arrivals"],
      ["Categories", "/#categories"],
    ],
  },
  {
    title: "Account",
    links: [
      ["Wishlist", "/wishlist"],
      ["Shopping bag", "/cart"],
      ["API status", "/api/health"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 bg-zinc-950 text-white sm:mt-32">
      <Container>
        <div className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.3fr_0.7fr_0.7fr]">
          <div className="max-w-md">
            <p className="text-xl font-semibold tracking-[-0.045em]">
              NOVA<span className="font-normal text-zinc-500">STORE</span>
            </p>
            <p className="mt-5 text-2xl font-medium leading-tight tracking-[-0.035em] text-zinc-200 sm:text-3xl">
              Better everyday objects, thoughtfully selected.
            </p>
            <p className="mt-5 text-sm leading-6 text-zinc-500">
              A modern full-stack storefront built around useful products, clear design and a calm shopping experience.
            </p>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">{group.title}</p>
              <div className="mt-5 space-y-3">
                {group.links.map(([label, href]) => (
                  <Link key={label} href={href} className="block text-sm text-zinc-300 transition hover:text-white">
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 py-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 NovaStore. Internship e-commerce project.</p>
          <p>Next.js · TypeScript · Tailwind CSS · AWS DynamoDB</p>
        </div>
      </Container>
    </footer>
  );
}

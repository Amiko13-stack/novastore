import { Container } from "@/components/ui/container";
import { RefreshIcon, ShieldIcon, TruckIcon } from "@/components/ui/icons";

const items = [
  {
    title: "Thoughtful delivery",
    copy: "A clean purchase flow designed to make ordering straightforward.",
    Icon: TruckIcon,
  },
  {
    title: "Easy returns",
    copy: "Clear shopping states and customer-friendly experiences throughout.",
    Icon: RefreshIcon,
  },
  {
    title: "Secure by design",
    copy: "AWS credentials remain server-side while DynamoDB handles persistent data.",
    Icon: ShieldIcon,
  },
];

export function TrustStrip() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="grid border-y border-zinc-300/70 md:grid-cols-3">
          {items.map(({ title, copy, Icon }, index) => (
            <div
              key={title}
              className={`py-8 md:px-8 ${index > 0 ? "border-t border-zinc-300/70 md:border-l md:border-t-0" : ""}`}
            >
              <Icon className="h-6 w-6" />
              <h3 className="mt-5 text-base font-semibold tracking-tight">{title}</h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-600">{copy}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

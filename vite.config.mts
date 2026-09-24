import vinext from "vinext";
import { defineConfig } from "vite";
import { sites } from "./tooling/sites-vite-plugin";

export default defineConfig(async () => {
  process.env.CLOUDFLARE_CF_FETCH_ENABLED ??= "false";
  process.env.WRANGLER_SEND_METRICS ??= "false";
  process.env.WRANGLER_WRITE_LOGS ??= "false";
  const { cloudflare } = await import("@cloudflare/vite-plugin");
  return {
    plugins: [
      vinext(),
      sites({ mockAuth: false }),
      cloudflare({
        viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
        inspectorPort: false,
        config: {
          name: "novastore-admin",
          main: "vinext/server/fetch-handler",
          compatibility_date: "2026-09-24",
          compatibility_flags: ["nodejs_compat"],
        },
      }),
    ],
  };
});
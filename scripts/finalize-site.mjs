import { writeFileSync, readFileSync, existsSync } from "node:fs";

// Vinext loads the SSR entry as .js, while Vite emits .mjs in this package.
// Keep both entry points explicit so Cloudflare's module upload includes them.
for (const directory of ["dist/server", "dist/server/ssr"]) {
  if (!existsSync(`${directory}/index.mjs`)) {
    throw new Error(`Missing built module: ${directory}/index.mjs`);
  }
  writeFileSync(`${directory}/index.js`, 'export * from "./index.mjs";\nexport { default } from "./index.mjs";\n');
}
const config = JSON.parse(readFileSync("dist/server/wrangler.json", "utf8"));
config.main = "index.js";
writeFileSync("dist/server/wrangler.json", JSON.stringify(config));
console.log("Sites Worker and SSR entry points prepared.");

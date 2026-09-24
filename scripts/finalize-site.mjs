import { writeFileSync, readFileSync } from "node:fs";
writeFileSync("dist/server/index.js", 'export { default } from "./index.mjs";\n');
const config = JSON.parse(readFileSync("dist/server/wrangler.json", "utf8"));
config.main = "index.js";
writeFileSync("dist/server/wrangler.json", JSON.stringify(config));
console.log("Sites Worker entry point prepared.");
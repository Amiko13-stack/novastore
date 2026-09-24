import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";
import ts from "typescript";
import { createHash, timingSafeEqual } from "node:crypto";
const source = fs.readFileSync("src/lib/auth/admin.ts", "utf8");
const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
class AppError extends Error { constructor(message, statusCode) { super(message); this.statusCode = statusCode; } }
const environment = {};
const exportsObject = {};
vm.runInNewContext(output, { exports: exportsObject, process: { env: environment }, require(name) {
  if (name === "node:crypto") return { createHash, timingSafeEqual };
  if (name === "@/lib/http/api-error") return { AppError };
  throw new Error("Unexpected import: " + name);
}});
const check = exportsObject.requireAdmin;
const request = value => new Request("https://example.com/api/admin", { headers: value ? { authorization: value } : {} });
assert.throws(() => check(request()), error => error.statusCode === 503);
environment.ADMIN_ACCESS_KEY = "short";
assert.throws(() => check(request()), error => error.statusCode === 503);
environment.ADMIN_ACCESS_KEY = "a".repeat(40);
for (const value of [undefined, "Bearer wrong", "Basic " + "a".repeat(40), "Bearer "]) {
  assert.throws(() => check(request(value)), error => error.statusCode === 401);
}
assert.doesNotThrow(() => check(request("Bearer " + "a".repeat(40))));
console.log("PASS: absent/short configuration blocks access, invalid/missing credentials rejected, correct bearer credential accepted.");
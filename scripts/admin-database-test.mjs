import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import assert from "node:assert/strict";
import ts from "typescript";
import { DynamoDBClient, CreateTableCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
const loadPackage = createRequire(import.meta.url);
const dynalite = loadPackage("dynalite");
const server = dynalite({ createTableMs: 0 });
await new Promise(done => server.listen(0, "127.0.0.1", done));
const endpoint = "http://127.0.0.1:" + server.address().port;
Object.assign(process.env, { AWS_REGION: "us-east-1", AWS_ACCESS_KEY_ID: "local-test", AWS_SECRET_ACCESS_KEY: "local-test", DYNAMODB_ENDPOINT: endpoint, ADMIN_ACCESS_KEY: "local-test-key-".repeat(4) });
for (const kind of ["USERS", "PRODUCTS", "CATEGORIES", "CART", "WISHLIST"]) process.env["DYNAMODB_" + kind + "_TABLE"] = "test-" + kind.toLowerCase();
const client = new DynamoDBClient({ region: "us-east-1", endpoint, credentials: { accessKeyId: "local-test", secretAccessKey: "local-test" } });
const document = DynamoDBDocumentClient.from(client);
const cache = new Map();
function load(file) {
  const path = resolve(file);
  if (cache.has(path)) return cache.get(path).exports;
  const loadedModule = { exports: {} }; cache.set(path, loadedModule);
  const javascript = ts.transpileModule(readFileSync(path, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const localRequire = name => name.startsWith("@/") ? load("src/" + name.slice(2) + ".ts") : loadPackage(name);
  new Function("exports", "require", "module", javascript)(loadedModule.exports, localRequire, loadedModule);
  return loadedModule.exports;
}
try {
  for (const [kind, pk, sk] of [["users", "userId"], ["products", "productId"], ["categories", "categoryId"], ["cart", "userId", "productId"], ["wishlist", "userId", "productId"]]) {
    await client.send(new CreateTableCommand({
      TableName: "test-" + kind, BillingMode: "PAY_PER_REQUEST",
      AttributeDefinitions: [{ AttributeName: pk, AttributeType: "S" }, ...(sk ? [{ AttributeName: sk, AttributeType: "S" }] : [])],
      KeySchema: [{ AttributeName: pk, KeyType: "HASH" }, ...(sk ? [{ AttributeName: sk, KeyType: "RANGE" }] : [])],
    }));
  }
  const admin = load("src/services/admin.service.ts");
  const products = load("src/services/product.service.ts");
  const productSchema = load("src/lib/validation/product.schema.ts");
  const route = load("src/app/api/admin/manage/route.ts");
  const snapshot = load("src/app/api/admin/route.ts");
  const category = await admin.manageRecord({ resource: "categories", action: "create", values: { name: "Test category", description: "A test" } });
  const updatedCategory = await admin.manageRecord({ resource: "categories", action: "update", id: category.categoryId, values: { name: "Updated category", description: "Updated" } });
  assert.equal(updatedCategory.name, "Updated category");
  const product = await products.createProduct({ categoryId: category.categoryId, name: "Test product", description: "Local integration test product", price: 10, stock: 5, featured: false, imageUrl: "https://example.com/test.jpg" });
  assert.equal((await products.getProduct(product.productId)).stock, 5);
  assert.equal((await products.updateProduct(product.productId, { stock: 2 })).stock, 2);
  assert.equal(productSchema.createProductSchema.safeParse({ ...product, stock: -1 }).success, false);
  await assert.rejects(() => admin.manageRecord({ resource: "categories", action: "delete", id: category.categoryId }), error => error.statusCode === 409);
  const now = new Date().toISOString();
  await document.send(new PutCommand({ TableName: "test-users", Item: { userId: "test-user", name: "Test User", email: "test@example.com", createdAt: now, updatedAt: now } }));
  for (const kind of ["cart", "wishlist"]) await document.send(new PutCommand({ TableName: "test-" + kind, Item: { userId: "test-user", productId: product.productId, quantity: 1, addedAt: now, updatedAt: now } }));
  await assert.rejects(() => products.deleteProduct(product.productId), error => error.statusCode === 409);
  await assert.rejects(() => admin.manageRecord({ resource: "users", action: "delete", id: "test-user" }), error => error.statusCode === 409);
  const user = await admin.manageRecord({ resource: "users", action: "update", id: "test-user", values: { name: "Updated User", email: "updated@example.com" } });
  assert.equal(user.email, "updated@example.com");
  const data = await admin.getAdminData(); assert.equal(data.products.length, 1); assert.equal(data.cart.length, 1);
  const denied = await snapshot.GET(new Request("https://example.com/api/admin"));
  assert.equal(denied.status, 401);
  const authorized = await snapshot.GET(new Request("https://example.com/api/admin", { headers: { authorization: "Bearer " + process.env.ADMIN_ACCESS_KEY } }));
  assert.equal(authorized.status, 200); assert.equal((await authorized.json()).users[0].name, "Updated User");
  const invalid = await route.POST(new Request("https://example.com/api/admin/manage", { method: "POST", headers: { authorization: "Bearer " + process.env.ADMIN_ACCESS_KEY }, body: JSON.stringify({ resource: "users", action: "update", id: "test-user", values: { name: "", email: "bad" } }) }));
  assert.equal(invalid.status, 400);
  for (const kind of ["cart", "wishlist"]) await admin.manageRecord({ resource: kind, action: "delete", id: "test-user", productId: product.productId });
  await products.deleteProduct(product.productId);
  await admin.manageRecord({ resource: "users", action: "delete", id: "test-user" });
  await admin.manageRecord({ resource: "categories", action: "delete", id: category.categoryId });
  await assert.rejects(() => admin.manageRecord({ resource: "categories", action: "delete", id: category.categoryId }), error => error.statusCode === 404);
  process.env.ADMIN_ONLY_MODE = "true";
  const currentUser = load("src/lib/auth/current-user.ts");
  assert.throws(() => currentUser.getCurrentUserId(), error => error.statusCode === 403);
  for (const path of ["cart", "wishlist", "users/me"]) {
    const handler = load("src/app/api/" + path + "/route.ts");
    assert.equal((await handler.GET()).status, 403);
  }
  const health = load("src/app/api/health/database/route.ts");
  assert.equal((await health.GET(new Request("https://example.com/api/health/database"))).status, 401);
  assert.equal((await health.GET(new Request("https://example.com/api/health/database", {headers:{authorization:"Bearer "+process.env.ADMIN_ACCESS_KEY}}))).status, 200);
  delete process.env.ADMIN_ONLY_MODE;
  const empty = await admin.getAdminData(); assert.equal(Object.values(empty).flat().length, 0);
  console.log("PASS: DynamoDB-compatible integration — category/product CRUD, stock, user updates/deletion, relationship guards, cart/wishlist removal, authorization, input validation, empty state, and missing records.");
} finally {
  client.destroy();
  if (cache.has(resolve("src/lib/db/dynamodb.ts"))) cache.get(resolve("src/lib/db/dynamodb.ts")).exports.dynamoDBClient.destroy();
  await new Promise(done => server.close(done));
}

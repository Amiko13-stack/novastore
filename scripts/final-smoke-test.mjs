const baseUrl = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");

const tests = [
  { path: "/", expected: 200, label: "Homepage" },
  { path: "/products", expected: 200, label: "Product listing" },
  { path: "/products?q=chair", expected: 200, label: "Product search" },
  { path: "/products/prod-headphones", expected: 200, label: "Product detail" },
  { path: "/cart", expected: 200, label: "Cart page" },
  { path: "/wishlist", expected: 200, label: "Wishlist page" },
  { path: "/account", expected: 200, label: "Account page" },
  { path: "/api/health", expected: 200, label: "API health" },
  { path: "/api/health/database", expected: 200, label: "Database health" },
  { path: "/api/categories", expected: 200, label: "Categories API" },
  { path: "/api/products?q=chair", expected: 200, label: "Products search API" },
  { path: "/api/cart", expected: 200, label: "Cart API" },
  { path: "/api/wishlist", expected: 200, label: "Wishlist API" },
  { path: "/api/users/me", expected: 200, label: "User API" },
  { path: "/products/does-not-exist", expected: 200, label: "Product 200" },
];

let failed = 0;

console.log(`\nNovaStore final smoke test`);
console.log(`Target: ${baseUrl}\n`);

for (const test of tests) {
  const url = `${baseUrl}${test.path}`;
  try {
    const response = await fetch(url, {
      redirect: "manual",
      headers: { "user-agent": "NovaStore-Final-Smoke-Test/1.0" },
    });

    const ok = response.status === test.expected;
    if (!ok) failed += 1;

    console.log(
      `${ok ? "PASS" : "FAIL"}  ${String(response.status).padEnd(3)}  ${test.label.padEnd(22)} ${test.path}`,
    );
  } catch (error) {
    failed += 1;
    console.log(`FAIL  ERR  ${test.label.padEnd(22)} ${test.path}`);
    console.log(`      ${error instanceof Error ? error.message : String(error)}`);
  }
}

console.log("");
if (failed > 0) {
  console.error(`${failed} smoke test(s) failed.`);
  process.exitCode = 1;
} else {
  console.log("All NovaStore smoke tests passed.");
}

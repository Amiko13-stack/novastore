"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { Product } from "@/types/entities";
import { createProductSchema } from "@/lib/validation/product.schema";
import { sampleData, type AdminData } from "./sample-data";
import { AdminNavIcon } from "./admin-nav-icon";
import { SearchIcon } from "@/components/ui/icons";
import { RecordsPanel } from "./records-panel";
import "./admin.css";

const sections = ["Overview", "Products", "Categories", "Users", "Cart", "Wishlist"] as const;
type Section = typeof sections[number];
const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
const blank = { name: "", description: "", price: "", stock: "", categoryId: "", imageUrl: "", featured: false };

export function AdminDashboard() {
  const [data, setData] = useState<AdminData>(sampleData);
  const [section, setSection] = useState<Section>("Overview");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [page, setPage] = useState(1);
  const [key, setKey] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);
  const [removing, setRemoving] = useState<Product | null>(null);
  const [form, setForm] = useState(blank);
  const [formError, setFormError] = useState("");
  const editor = useRef<HTMLDialogElement>(null);
  const confirmation = useRef<HTMLDialogElement>(null);
  const connection = useRef<HTMLDialogElement>(null);
  const live = Boolean(key);
  const categoryName = (id: string) => data.categories.find(item => item.categoryId === id)?.name ?? "Unknown category";
  const lowStock = data.products.filter(item => item.stock > 0 && item.stock <= 10);
  const filtered = data.products.filter(item =>
    (item.name + " " + item.description).toLowerCase().includes(query.toLowerCase()) &&
    (!category || item.categoryId === category) &&
    (!stockFilter || (stockFilter === "out" ? item.stock === 0 : item.stock > 0 && item.stock <= 10))
  );
  const pages = Math.max(1, Math.ceil(filtered.length / 8));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice((currentPage - 1) * 8, currentPage * 8);
  const selectSection = (value: Section) => {
    setSection(value); setQuery(""); setCategory(""); setStockFilter(""); setPage(1); setError("");
  };
  const openEditor = (product?: Product) => {
    setEditing(product ?? null);
    setForm(product ? { ...product, price: String(product.price), stock: String(product.stock) } : { ...blank, categoryId: data.categories[0]?.categoryId ?? "" });
    setFormError(""); editor.current?.showModal();
  };
  async function request(path: string, method: string, body?: unknown) {
    const response = await fetch(path, {
      method,
      headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error ?? "The request failed. Please try again.");
    return result;
  }
  async function connect(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const response = await fetch("/api/admin", { headers: { Authorization: "Bearer " + keyInput }, cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not connect to the store.");
      setData(result); setKey(keyInput); setKeyInput(""); connection.current?.close();
      setNotice("Connected to your store. Changes now update live data.");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not connect."); }
    finally { setBusy(false); }
  }
  async function save(event: React.FormEvent) {
    event.preventDefault(); setFormError("");
    const parsed = createProductSchema.safeParse({ ...form, price: Number(form.price), stock: form.stock.trim() === "" ? NaN : Number(form.stock) });
    if (!parsed.success) { setFormError(parsed.error.issues.map(item => item.path.join(".") + ": " + item.message).join(" · ")); return; }
    setBusy(true);
    try {
      const now = new Date().toISOString();
      const product: Product = live
        ? (await request(editing ? "/api/products/" + encodeURIComponent(editing.productId) : "/api/products", editing ? "PATCH" : "POST", parsed.data)).data
        : { ...parsed.data, productId: editing?.productId ?? crypto.randomUUID(), slug: parsed.data.name.toLowerCase().replaceAll(" ", "-"), createdAt: editing?.createdAt ?? now, updatedAt: now };
      setData(current => ({ ...current, products: editing ? current.products.map(item => item.productId === product.productId ? product : item) : [product, ...current.products] }));
      setNotice(product.name + (editing ? " updated." : " added.") + (live ? "" : " Sample data only."));
      editor.current?.close();
    } catch (reason) { setFormError(reason instanceof Error ? reason.message : "Could not save the product."); }
    finally { setBusy(false); }
  }
  async function remove() {
    if (!removing) return;
    setBusy(true); setFormError("");
    try {
      if ([...data.cart, ...data.wishlist].some(item => item.productId === removing.productId)) throw new Error("Remove this product from carts and wishlists before deleting it.");
      if (live) await request("/api/products/" + encodeURIComponent(removing.productId), "DELETE");
      setData(current => ({ ...current, products: current.products.filter(item => item.productId !== removing.productId) }));
      setNotice(removing.name + " deleted." + (live ? "" : " Sample data only."));
      confirmation.current?.close(); setRemoving(null);
    } catch (reason) { setFormError(reason instanceof Error ? reason.message : "Could not delete the product."); }
    finally { setBusy(false); }
  }
  function productTable(products: Product[]) {
    return <div className="admin-table-wrap"><table className="admin-product-table"><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead>
      <tbody>{products.map(product => <tr key={product.productId}>
        <td><div className="admin-product"><span className="admin-monogram" aria-hidden="true">{product.name.split(" ").map(word => word[0]).slice(0, 2).join("")}</span><div><strong>{product.name}</strong><small>{product.featured ? "Featured product" : product.slug}</small></div></div></td>
        <td data-label="Category">{categoryName(product.categoryId)}</td><td data-label="Price">{money(product.price)}</td><td data-label="Stock">{product.stock}</td>
        <td><span className={"admin-badge " + (product.stock === 0 ? "danger" : product.stock <= 10 ? "warning" : "success")}>{product.stock === 0 ? "Out of stock" : product.stock <= 10 ? "Low stock" : "In stock"}</span></td>
        <td><div className="admin-actions"><button onClick={() => openEditor(product)} aria-label={"Edit " + product.name}>Edit</button><button className="admin-delete" aria-label={"Delete " + product.name} onClick={() => { setRemoving(product); setFormError(""); confirmation.current?.showModal(); }}>Delete</button></div></td>
      </tr>)}</tbody></table>{products.length === 0 && <div className="admin-empty"><h3>No products found</h3><p>Try another search or add your first product.</p></div>}</div>;
  }

  return <div className="admin-app">
    <aside className="admin-sidebar">
      <Link className="admin-brand" href="/admin"><span aria-hidden="true">N</span> NovaStore</Link>
      <p className="admin-nav-label">STORE MANAGEMENT</p>
      <nav aria-label="Admin navigation">{sections.map((item, index) => <button key={item} aria-current={section === item ? "page" : undefined} onClick={() => selectSection(item)}><span aria-hidden="true"><AdminNavIcon index={index} /></span>{item}{item === "Products" && <small>{data.products.length}</small>}</button>)}</nav>
      <div className="admin-sidebar-bottom"><Link href="/">Visit storefront ↗</Link><div className="admin-profile"><span>NS</span><div><strong>Store administration</strong><small>{live ? "Connected session" : "Sample workspace"}</small></div></div></div>
    </aside>
    <div className="admin-main">
      <header className="admin-topbar"><span>Workspace <b>/</b> <strong>{section}</strong></span><span className="admin-badge">{live ? "Live store" : "Preview mode"}</span></header>
      <main className="admin-content">
        <div className={"admin-banner" + (live ? " live" : "")}><div><strong>{live ? "You are managing live store data." : "Explore with sample data"}</strong><span>{live ? "Product changes are saved to your store." : "Try product changes safely. Preview changes reset when you reload."}</span></div>
          {live ? <button onClick={() => { setKey(""); setData(sampleData); setNotice("Disconnected. Sample data restored."); }}>Disconnect</button> : <button onClick={() => { setError(""); connection.current?.showModal(); }}>Connect store</button>}
        </div>
        <div className="admin-heading"><div><p className="admin-eyebrow">STORE ADMINISTRATION</p><h1>{section === "Overview" ? "Store overview" : section}</h1><p>{section === "Overview" ? "Your catalog, customers, and inventory at a glance." : section === "Products" ? "Keep your catalog organised and your stock up to date." : "Browse your store’s " + section.toLowerCase() + " data."}</p></div>
          {(section === "Overview" || section === "Products") && <button className="admin-primary" onClick={() => openEditor()}>+ Add product</button>}
        </div>
        {notice && <div className="admin-notice" role="status">{notice}<button aria-label="Dismiss notification" onClick={() => setNotice("")}>×</button></div>}
        {section === "Overview" && <>
          <div className="admin-stats">{[["Products", data.products.length, "Products"], ["Categories", data.categories.length, "Categories"], ["Users", data.users.length, "Users"], ["Cart items", data.cart.reduce((total, item) => total + item.quantity, 0), "Cart"], ["Wishlist items", data.wishlist.length, "Wishlist"]].map(([label, total, target]) => <button key={label} className="admin-stat" onClick={() => selectSection(target as Section)}><span>{label}</span><strong>{total}</strong><small>View {String(label).toLowerCase()} ↗</small></button>)}</div>
          <div className="admin-overview-grid"><section className="admin-panel"><div className="admin-panel-heading"><h2>Inventory by category</h2><span>{data.products.length} products</span></div><div className="admin-bars">{data.categories.map(item => {
            const count = data.products.filter(product => product.categoryId === item.categoryId).length;
            return <div key={item.categoryId}><div><span>{item.name}</span><strong>{count}</strong></div><div className="admin-bar"><span style={{ width: (data.products.length ? count / data.products.length * 100 : 0) + "%" }} /></div></div>;
          })}</div></section><section className="admin-panel admin-attention"><span className="admin-eyebrow">INVENTORY WATCH</span><h2>{lowStock.length} products<br />running low</h2><p>{data.products.filter(item => item.stock === 0).length} {data.products.filter(item => item.stock === 0).length === 1 ? "product is" : "products are"} currently out of stock.</p><button onClick={() => { selectSection("Products"); setStockFilter("low"); }}>Review low stock →</button></section></div>
          <section className="admin-panel"><div className="admin-panel-heading"><h2>Recently updated products</h2><button onClick={() => selectSection("Products")}>View all products →</button></div>{productTable([...data.products].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5))}</section>
        </>}
        {section === "Products" && <section className="admin-panel">
          <div className="admin-filters"><label className="admin-search"><SearchIcon /><span className="sr-only">Search products</span><input placeholder="Search products…" value={query} onChange={event => { setQuery(event.target.value); setPage(1); }} /></label><label><span className="sr-only">Filter category</span><select value={category} onChange={event => { setCategory(event.target.value); setPage(1); }}><option value="">All categories</option>{data.categories.map(item => <option key={item.categoryId} value={item.categoryId}>{item.name}</option>)}</select></label><label><span className="sr-only">Filter stock</span><select value={stockFilter} onChange={event => { setStockFilter(event.target.value); setPage(1); }}><option value="">All stock levels</option><option value="low">Low stock</option><option value="out">Out of stock</option></select></label></div>
          {productTable(visible)}<div className="admin-pagination"><span>{filtered.length} products · Page {currentPage} of {pages}</span><div><button disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Previous</button><button disabled={currentPage === pages} onClick={() => setPage(currentPage + 1)}>Next</button></div></div>
        </section>}
        {section !== "Overview" && section !== "Products" && <RecordsPanel key={section} resource={section.toLowerCase() as "categories" | "users" | "cart" | "wishlist"} data={data} setData={setData} live={live} execute={command => request("/api/admin/manage", "POST", command)} notify={setNotice} />}
        <footer className="admin-footer">NovaStore administration <span>{live ? "Connected to DynamoDB" : "Sample data · No store connection"}</span></footer>
      </main>
    </div>
    <dialog ref={editor} className="admin-dialog" onCancel={event => { if (busy) event.preventDefault(); }}>
      <form onSubmit={save}><div className="admin-dialog-heading"><h2>{editing ? "Edit product" : "Add product"}</h2><button type="button" disabled={busy} aria-label="Close product form" onClick={() => editor.current?.close()}>×</button></div><p>{live ? "Save changes to your store." : "Changes apply to this sample preview."}</p>
        <label>Product name<input autoFocus required minLength={2} maxLength={120} value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} /></label>
        <label>Description<textarea required minLength={10} maxLength={2000} rows={3} value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} /></label>
        <div className="admin-form-grid"><label>Price (USD)<input required type="number" min="0.01" step="0.01" value={form.price} onChange={event => setForm({ ...form, price: event.target.value })} /></label><label>Stock quantity<input required type="number" min="0" step="1" value={form.stock} onChange={event => setForm({ ...form, stock: event.target.value })} /></label></div>
        <label>Category<select required value={form.categoryId} onChange={event => setForm({ ...form, categoryId: event.target.value })}><option value="">Select category</option>{data.categories.map(item => <option key={item.categoryId} value={item.categoryId}>{item.name}</option>)}</select></label>
        <label>Image URL<input required type="url" value={form.imageUrl} placeholder="https://…" onChange={event => setForm({ ...form, imageUrl: event.target.value })} /></label>
        <label className="admin-checkbox"><input type="checkbox" checked={form.featured} onChange={event => setForm({ ...form, featured: event.target.checked })} />Featured product</label>
        {formError && <p className="admin-error" role="alert">{formError}</p>}<div className="admin-dialog-actions"><button type="button" disabled={busy} onClick={() => editor.current?.close()}>Cancel</button><button className="admin-primary" disabled={busy}>{busy ? "Saving…" : "Save product"}</button></div>
      </form>
    </dialog>
    <dialog ref={confirmation} className="admin-dialog" onCancel={event => { if (busy) event.preventDefault(); }}><h2>Delete product?</h2><p><strong>{removing?.name}</strong> will be removed from {live ? "your live catalog" : "the sample catalog"}. This cannot be undone.</p><p>Products still used in carts or wishlists cannot be deleted.</p>{formError && <p className="admin-error" role="alert">{formError}</p>}<div className="admin-dialog-actions"><button autoFocus disabled={busy} onClick={() => confirmation.current?.close()}>Keep product</button><button className="admin-danger-button" disabled={busy} onClick={remove}>{busy ? "Deleting…" : "Delete product"}</button></div></dialog>
    <dialog ref={connection} className="admin-dialog" onCancel={event => { if (busy) event.preventDefault(); }}><form onSubmit={connect}><h2>Connect your store</h2><p>Live access needs the store’s database connection and an administrator access key. You can keep exploring the sample workspace while setup is completed.</p><label>Administrator access key<input type="password" autoComplete="off" required minLength={32} value={keyInput} onChange={event => setKeyInput(event.target.value)} /></label>{error && <p className="admin-error" role="alert">{error}</p>}<div className="admin-dialog-actions"><button type="button" disabled={busy} onClick={() => { connection.current?.close(); setKeyInput(""); }}>Keep exploring</button><button className="admin-primary" disabled={busy}>{busy ? "Connecting…" : "Connect"}</button></div></form></dialog>
  </div>;
}

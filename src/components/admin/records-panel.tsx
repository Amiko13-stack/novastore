"use client";
import { useRef, useState } from "react";
import type { AdminData } from "./sample-data";
import type { Category, User } from "@/types/entities";
import { createCategorySchema } from "@/lib/validation/category.schema";
import { updateUserSchema } from "@/lib/validation/user.schema";

type Resource = "categories" | "users" | "cart" | "wishlist";
type Command = { resource: Resource; action: "create" | "update" | "delete"; id?: string; productId?: string; values?: Record<string, unknown> };
type Props = { resource: Resource; data: AdminData; setData: React.Dispatch<React.SetStateAction<AdminData>>; live: boolean; execute: (command: Command) => Promise<{ data: unknown }>; notify: (message: string) => void };

export function RecordsPanel({ resource, data, setData, live, execute, notify }: Props) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [current, setCurrent] = useState<Category | User | null>(null);
  const [values, setValues] = useState({ name: "", email: "", description: "", imageUrl: "" });
  const [pending, setPending] = useState<{ id: string; productId?: string; label: string } | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const editor = useRef<HTMLDialogElement>(null);
  const deletion = useRef<HTMLDialogElement>(null);
  const details = useRef<HTMLDialogElement>(null);
  const userName = (id: string) => data.users.find(item => item.userId === id)?.name ?? id;
  const productName = (id: string) => data.products.find(item => item.productId === id)?.name ?? id;
  const rows = resource === "categories" ? data.categories.map(item => ({ id: item.categoryId, title: item.name, secondary: item.description || "—", value: data.products.filter(p => p.categoryId === item.categoryId).length + " products", item }))
    : resource === "users" ? data.users.map(item => ({ id: item.userId, title: item.name, secondary: item.email, value: item.createdAt.slice(0, 10), item }))
    : data[resource].map(item => ({ id: item.userId, title: userName(item.userId), secondary: productName(item.productId), value: resource === "cart" ? String("quantity" in item ? item.quantity : "") : item.addedAt.slice(0, 10), productId: item.productId }));
  const filtered = rows.filter(item => (item.id + item.title + item.secondary).toLowerCase().includes(search.toLowerCase()));
  const pages = Math.max(1, Math.ceil(filtered.length / 8));
  const currentPage = Math.min(page, pages);
  function edit(item: Category | User | null) {
    setCurrent(item); setError("");
    setValues({ name: item?.name ?? "", email: item && "email" in item ? item.email : "", description: item && "description" in item ? item.description ?? "" : "", imageUrl: item && "imageUrl" in item ? item.imageUrl ?? "" : "" });
    editor.current?.showModal();
  }
  async function save(event: React.FormEvent) {
    event.preventDefault(); setError("");
    const parsed = resource === "users" ? updateUserSchema.safeParse(values) : createCategorySchema.safeParse({ name: values.name, description: values.description, imageUrl: values.imageUrl || undefined });
    if (!parsed.success) { setError(parsed.error.issues.map(item => item.message).join(" · ")); return; }
    setBusy(true);
    try {
      const id = current ? "categoryId" in current ? current.categoryId : current.userId : undefined;
      const command: Command = { resource, action: current ? "update" : "create", id, values: parsed.data };
      if (resource === "categories") {
        const record = live ? (await execute(command)).data as Category : { ...parsed.data, categoryId: id ?? crypto.randomUUID(), name: values.name.trim(), description: values.description, imageUrl: values.imageUrl || undefined, slug: values.name.trim().toLowerCase().replaceAll(" ", "-"), createdAt: current?.createdAt ?? new Date().toISOString() } as Category;
        setData(previous => ({ ...previous, categories: current ? previous.categories.map(item => item.categoryId === id ? record : item) : [...previous.categories, record] }));
      } else {
        const record = live ? (await execute(command)).data as User : { ...current, ...parsed.data, updatedAt: new Date().toISOString() } as User;
        setData(previous => ({ ...previous, users: previous.users.map(item => item.userId === id ? record : item) }));
      }
      notify(values.name + " saved." + (live ? "" : " Sample data only.")); editor.current?.close();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not save. Please try again."); }
    finally { setBusy(false); }
  }
  async function remove() {
    if (!pending) return;
    setError(""); setBusy(true);
    try {
      if (resource === "categories" && data.products.some(item => item.categoryId === pending.id)) throw new Error("Move or remove this category’s products before deleting the category.");
      if (resource === "users" && [...data.cart, ...data.wishlist].some(item => item.userId === pending.id)) throw new Error("Remove this user’s cart and wishlist items before deleting the user.");
      if (live) await execute({ resource, action: "delete", id: pending.id, productId: pending.productId });
      setData(previous => {
        if (resource === "categories") return { ...previous, categories: previous.categories.filter(item => item.categoryId !== pending.id) };
        if (resource === "users") return { ...previous, users: previous.users.filter(item => item.userId !== pending.id) };
        return { ...previous, [resource]: previous[resource].filter(item => item.userId !== pending.id || item.productId !== pending.productId) };
      });
      notify(pending.label + " removed." + (live ? "" : " Sample data only.")); deletion.current?.close();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not remove this record."); }
    finally { setBusy(false); }
  }
  return <section className="admin-panel">
    <div className="admin-panel-heading"><h2>{resource === "categories" ? "Product categories" : resource === "users" ? "Store users" : resource === "cart" ? "User carts" : "Saved products"}</h2>{resource === "categories" && <button className="admin-primary" onClick={() => edit(null)}>+ Add category</button>}</div>
    <div className="admin-filters"><label className="admin-search"><span className="sr-only">Search {resource}</span><input value={search} placeholder={"Search " + resource + "…"} onChange={event => { setSearch(event.target.value); setPage(1); }} /></label></div>
    <div className="admin-table-wrap"><table className="admin-record-table"><thead><tr><th>{resource === "categories" ? "Category" : "User"}</th><th>{resource === "categories" ? "Description" : resource === "users" ? "Email" : "Product"}</th><th>{resource === "categories" ? "Catalog" : resource === "cart" ? "Quantity" : resource === "users" ? "Joined" : "Added"}</th><th>Actions</th></tr></thead><tbody>{filtered.slice((currentPage - 1) * 8, currentPage * 8).map(row => <tr key={row.id + ("productId" in row ? row.productId : "")}><td><strong>{row.title}</strong></td><td>{row.secondary}</td><td>{row.value}</td><td><div className="admin-actions">
      {resource === "users" && "item" in row && <button aria-label={"Details for " + row.title} onClick={() => { setCurrent(row.item); details.current?.showModal(); }}>Details</button>}
      {"item" in row && <button aria-label={"Edit " + row.title} onClick={() => edit(row.item)}>Edit</button>}
      <button className="admin-delete" aria-label={"Remove " + row.title + ("productId" in row ? " " + row.secondary : "")} onClick={() => { setPending({ id: row.id, productId: "productId" in row ? row.productId : undefined, label: row.title }); setError(""); deletion.current?.showModal(); }}>Remove</button>
    </div></td></tr>)}</tbody></table>{!filtered.length && <div className="admin-empty"><h3>No records found</h3><p>Try another search.</p></div>}</div>
    <div className="admin-pagination"><span>{filtered.length} records · Page {currentPage} of {pages}</span><div><button disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Previous</button><button disabled={currentPage === pages} onClick={() => setPage(currentPage + 1)}>Next</button></div></div>
    <dialog ref={editor} className="admin-dialog" aria-label={resource === "categories" ? "Category editor" : "User editor"} onCancel={event => { if (busy) event.preventDefault(); }}><form onSubmit={save}><h2>{current ? "Edit " : "Add "}{resource === "categories" ? "category" : "user"}</h2><p>{live ? "Changes are saved to your store." : "Changes apply to sample data."}</p><label>Name<input autoFocus required minLength={2} maxLength={80} value={values.name} onChange={event => setValues({ ...values, name: event.target.value })} /></label>
      {resource === "users" ? <label>Email<input type="email" required maxLength={160} value={values.email} onChange={event => setValues({ ...values, email: event.target.value })} /></label> : <><label>Description<textarea maxLength={500} value={values.description} onChange={event => setValues({ ...values, description: event.target.value })} /></label><label>Image URL (optional)<input type="url" value={values.imageUrl} onChange={event => setValues({ ...values, imageUrl: event.target.value })} /></label></>}
      {error && <p role="alert" className="admin-error">{error}</p>}<div className="admin-dialog-actions"><button type="button" disabled={busy} onClick={() => editor.current?.close()}>Cancel</button><button disabled={busy} className="admin-primary">{busy ? "Saving…" : "Save changes"}</button></div></form></dialog>
    <dialog ref={deletion} className="admin-dialog" aria-label="Confirm removal" onCancel={event => { if (busy) event.preventDefault(); }}><h2>Remove this record?</h2><p>{pending?.label} will be removed from {live ? "your live store" : "the sample data"}. This cannot be undone.</p>{error && <p role="alert" className="admin-error">{error}</p>}<div className="admin-dialog-actions"><button autoFocus disabled={busy} onClick={() => deletion.current?.close()}>Keep record</button><button disabled={busy} className="admin-danger-button" onClick={remove}>{busy ? "Removing…" : "Remove record"}</button></div></dialog>
    <dialog ref={details} className="admin-dialog" aria-label="User details"><h2>{current?.name}</h2>{current && "email" in current && <><p>{current.email}</p><dl className="admin-details"><dt>User ID</dt><dd>{current.userId}</dd><dt>Created</dt><dd>{current.createdAt}</dd><dt>Updated</dt><dd>{current.updatedAt}</dd><dt>Cart items</dt><dd>{data.cart.filter(item => item.userId === current.userId).map(item => productName(item.productId) + " × " + item.quantity).join(", ") || "None"}</dd><dt>Wishlist</dt><dd>{data.wishlist.filter(item => item.userId === current.userId).map(item => productName(item.productId)).join(", ") || "None"}</dd></dl></>}<div className="admin-dialog-actions"><button onClick={() => details.current?.close()}>Close details</button></div></dialog>
  </section>;
}

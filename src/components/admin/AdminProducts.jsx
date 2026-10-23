import { useMemo, useState } from "react";
import { Package, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { PRODUCT_CATEGORIES, formatPrice } from "../../data/productUtils";
import ProductImage from "../ProductImage";

export default function AdminProducts({ products, busy, onEdit, onDelete, onCreate }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = category === "all" || product.category === category;
      const searchable = `${product.name} ${product.nameUz} ${product.nameRu} ${product.brand}`.toLowerCase();
      return matchesCategory && (!normalized || searchable.includes(normalized));
    });
  }, [category, products, query]);

  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-gold">Inventory</p>
          <h2 className="mt-1 text-lg font-extrabold text-ink">Mahsulotlar ro'yxati</h2>
        </div>
        <button type="button" onClick={onCreate} className="btn btn-primary btn-sm self-start">
          <Plus size={15} aria-hidden="true" />
          Yangi mahsulot
        </button>
      </div>

      <div className="flex flex-col gap-2.5 border-b border-line bg-canvas/50 px-5 py-3 sm:flex-row sm:items-center sm:px-6">
        <label className="relative block flex-1">
          <span className="sr-only">Mahsulot qidirish</span>
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-10 w-full rounded-full border border-line bg-white pl-10 pr-3 text-sm outline-none transition focus:border-gold"
            placeholder="Mahsulot qidirish..."
          />
        </label>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="h-10 cursor-pointer rounded-full border border-line bg-white px-3 text-xs font-bold text-ink outline-none focus:border-gold sm:w-40"
        >
          <option value="all">Barcha kategoriyalar</option>
          {PRODUCT_CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <span className="rounded-full bg-white px-3 py-1.5 text-center text-[11px] font-extrabold text-muted">
          {filtered.length} / {products.length}
        </span>
      </div>

      {filtered.length ? (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted">
                  <th className="px-6 py-3.5">Mahsulot</th>
                  <th className="px-3 py-3.5">Kategoriya</th>
                  <th className="px-3 py-3.5">Narx</th>
                  <th className="px-3 py-3.5">Ombor</th>
                  <th className="px-3 py-3.5">Holat</th>
                  <th className="px-6 py-3.5 text-right">Amal</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => {
                  const outOfStock = product.stock != null && product.stock <= 0;
                  return (
                    <tr key={product.id} className="border-b border-line transition-colors last:border-0 hover:bg-gold/[0.04]">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="media size-12 shrink-0 overflow-hidden rounded-xl border border-line">
                            <ProductImage product={product} alt={product.name} className="size-full" sizes="48px" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-extrabold text-ink">{product.name}</p>
                            <p className="mt-0.5 text-[10px] font-semibold text-muted">
                              {product.brand || "Soft Shoes"} · ID {product.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-xs font-semibold text-muted">{product.category}</td>
                      <td className="px-3 py-3.5 text-xs font-extrabold text-ink">{formatPrice(product.price)}</td>
                      <td className="px-3 py-3.5 text-xs font-semibold text-muted">
                        {product.stock == null ? "∞" : product.stock}
                      </td>
                      <td className="px-3 py-3.5">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${
                            outOfStock
                              ? "bg-rose-50 text-rose-700"
                              : product.stock != null && product.stock <= 3
                                ? "bg-amber-50 text-amber-700"
                                : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {outOfStock ? "Tugagan" : product.featured ? "Featured" : "Mavjud"}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => onEdit(product)}
                            className="grid size-9 place-items-center rounded-lg border border-line text-muted transition hover:border-gold hover:text-gold"
                            aria-label="Tahrirlash"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(product)}
                            disabled={busy}
                            className="grid size-9 place-items-center rounded-lg border border-line text-muted transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                            aria-label="O'chirish"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-line md:hidden">
            {filtered.map((product) => (
              <article key={product.id} className="p-4">
                <div className="flex gap-3">
                  <div className="media size-16 shrink-0 overflow-hidden rounded-xl border border-line">
                    <ProductImage product={product} alt={product.name} className="size-full" sizes="64px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-extrabold text-ink">{product.name}</p>
                    <p className="mt-1 text-[10px] font-semibold text-muted">
                      {product.category} · {product.stock == null ? "∞" : product.stock} dona
                    </p>
                    <p className="mt-1.5 text-xs font-extrabold text-ink">{formatPrice(product.price)} so'm</p>
                  </div>
                </div>
                <div className="mt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(product)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-xs font-bold text-muted"
                  >
                    <Pencil size={14} /> Tahrirlash
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(product)}
                    disabled={busy}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-red-100 px-3 text-xs font-bold text-red-600 disabled:opacity-40"
                  >
                    <Trash2 size={14} /> O'chirish
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      ) : (
        <div className="grid min-h-64 place-items-center p-8 text-center">
          <div>
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-canvas text-muted">
              <Package size={22} />
            </span>
            <p className="mt-4 text-sm font-extrabold text-ink">
              {products.length ? "Filtrga mos mahsulot yo'q" : "Hali mahsulot qo'shilmagan"}
            </p>
            <p className="mt-1 text-xs text-muted">
              {products.length ? "Qidiruv yoki kategoriyani o'zgartiring." : "Forma orqali birinchi mahsulotni qo'shing."}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

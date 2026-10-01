import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowDownUp, ArrowRight, Search, SlidersHorizontal, X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { PRODUCT_CATEGORIES } from "../data/productUtils";
import { useProducts } from "../context/useProducts";
import { translations } from "../data/translations";
import ProductCard from "../components/ProductCard";
import Reveal from "../components/motion/Reveal";

export default function ProductsPage() {
  const { lang } = useLanguage();
  const t = translations[lang] ?? translations.uz;
  const { products } = useProducts();
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");

  // Faqat amaldagi mahsulotlarda mavjud bo'lgan kategoriyalar ko'rsatiladi —
  // aks holda filtr bosilganda bo'sh ro'yxat chiqib, sayt buzilgan ko'rinadi.
  const categories = useMemo(() => {
    const existing = PRODUCT_CATEGORIES.filter((item) =>
      products.some((product) => product.category === item),
    );
    if (existing.length < 2) return [];
    return [{ value: "all", label: t.products.all }, ...existing.map((item) => ({ value: item, label: item }))];
  }, [products, t.products.all]);

  const activeCategory = categories.some((item) => item.value === category) ? category : "all";

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const result = products.filter((product) => {
      const matchesCategory = activeCategory === "all" || product.category === activeCategory;
      const searchable = `${product.name} ${product.descriptionUz} ${product.descriptionRu}`.toLowerCase();
      return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
    return [...result].sort((first, second) => {
      if (sort === "price-low") return first.price - second.price;
      if (sort === "price-high") return second.price - first.price;
      if (sort === "name") return first.name.localeCompare(second.name);
      return new Date(second.createdAt) - new Date(first.createdAt);
    });
  }, [activeCategory, products, query, sort]);

  const clearFilters = () => {
    setCategory("all");
    setQuery("");
    setSort("newest");
  };

  return (
    <div>
      {/* ---------- HEADER ---------- */}
      <section className="border-b border-line bg-white">
        <div className="shell py-10 lg:py-12">
          <p className="eyebrow">{t.products.eyebrow}</p>
          <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="h-display">{t.products.title}</h1>
              <p className="lede mt-3 max-w-lg">{t.products.subtitle}</p>
            </div>
            <p className="shrink-0 rounded-full border border-line bg-canvas px-3.5 py-2 text-xs font-bold text-muted">
              {filteredProducts.length} {t.products.result}
            </p>
          </div>
        </div>
      </section>

      {/* ---------- FILTERS + GRID ---------- */}
      <section className="section bg-canvas">
        <div className="shell">
          <Reveal
            from="up"
            className={`flex flex-col gap-4 border-b border-line pb-5 lg:flex-row lg:items-center lg:justify-between ${
              categories.length ? "" : "border-b-0 pb-0"
            }`}
          >
            {categories.length ? (
              <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
                {categories.map((item) => {
                  const active = activeCategory === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setCategory(item.value)}
                      aria-pressed={active}
                      className={`min-h-10 shrink-0 whitespace-nowrap rounded-full border px-4 text-xs font-bold transition-colors duration-200 ${
                        active
                          ? "border-ink bg-ink text-white"
                          : "border-line bg-white text-muted hover:border-ink/30 hover:text-ink"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            ) : (
              <span aria-hidden="true" />
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="group relative block sm:w-60">
                <span className="sr-only">{t.products.search}</span>
                <Search
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted transition-colors duration-200 group-focus-within:text-gold"
                />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t.products.search}
                  className="h-11 w-full rounded-full border border-line bg-white pl-11 pr-10 text-sm text-ink outline-none transition-colors duration-200 placeholder:text-muted focus:border-gold"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full text-muted transition-colors duration-200 hover:bg-canvas hover:text-ink"
                    aria-label={t.products.clear}
                  >
                    <X size={14} />
                  </button>
                ) : null}
              </label>

              <label className="group relative block sm:w-48">
                <span className="sr-only">{t.products.sort}</span>
                <SlidersHorizontal
                  size={15}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted transition-colors duration-200 group-focus-within:text-gold"
                />
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="h-11 w-full cursor-pointer appearance-none rounded-full border border-line bg-white pl-11 pr-9 text-xs font-bold text-ink outline-none transition-colors duration-200 focus:border-gold"
                >
                  <option value="newest">{t.products.sortNewest}</option>
                  <option value="price-low">{t.products.sortPriceLow}</option>
                  <option value="price-high">{t.products.sortPriceHigh}</option>
                  <option value="name">{t.products.sortName}</option>
                </select>
                <ArrowDownUp
                  size={14}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted"
                />
              </label>
            </div>
          </Reveal>

          {filteredProducts.length ? (
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <Reveal from="fade" className="mx-auto max-w-md py-20 text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-white text-gold shadow-card">
                <Search size={22} aria-hidden="true" />
              </span>
              <h2 className="h-section mt-5">{t.products.emptyTitle}</h2>
              <p className="lede mt-3">{t.products.emptyText}</p>
              <button type="button" onClick={clearFilters} className="btn btn-primary mt-6">
                <X size={16} aria-hidden="true" />
                {t.products.clear}
              </button>
            </Reveal>
          )}

          {/* ---------- HELP CTA ---------- */}
          <Reveal from="up" className="mt-14">
            <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-ink p-7 text-white sm:flex-row sm:items-center sm:p-9">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold-soft">
                  {lang === "ru" ? "Нужна помощь?" : "Yordam kerakmi?"}
                </p>
                <h2 className="h-section mt-2">
                  {lang === "ru" ? "Подберём размер и модель" : "O'lcham va modelni tanlab beramiz"}
                </h2>
              </div>
              <Link to="/contact" className="btn btn-on-dark shrink-0">
                {lang === "ru" ? "Связаться" : "Bog'lanish"}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

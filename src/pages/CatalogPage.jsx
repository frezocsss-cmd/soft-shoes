import { useDeferredValue, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowDownUp,
  ArrowRight,
  PackageSearch,
  RefreshCw,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useProducts } from "../context/useProducts";
import { PRODUCT_CATEGORIES } from "../data/productUtils";
import { translations } from "../data/translations";
import ProductCard from "../components/ProductCard";
import Reveal from "../components/motion/Reveal";

function FilterGroup({ title, children }) {
  return (
    <div>
      <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted">{title}</p>
      <div className="mt-2.5 flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

export default function CatalogPage() {
  const { lang } = useLanguage();
  const t = translations[lang] ?? translations.uz;
  const { products, syncStatus, syncError, refreshProducts } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [brand, setBrand] = useState("all");
  const [size, setSize] = useState("all");
  const [sort, setSort] = useState("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const category = searchParams.get("category") || "all";

  const setCategory = (value) => {
    const next = new URLSearchParams(searchParams);
    if (value === "all") next.delete("category");
    else next.set("category", value);
    setSearchParams(next, { replace: true });
  };

  const categories = useMemo(() => {
    const existing = PRODUCT_CATEGORIES.filter((item) =>
      products.some((product) => product.category === item),
    );
    if (existing.length < 2) return [];
    return [
      { value: "all", label: t.products.all },
      ...existing.map((item) => ({ value: item, label: item })),
    ];
  }, [products, t.products.all]);

  const brands = useMemo(
    () => [...new Set(products.map((product) => product.brand).filter(Boolean))].sort(),
    [products],
  );

  const sizes = useMemo(
    () => [...new Set(products.flatMap((product) => product.sizes || []))].sort((a, b) => a - b),
    [products],
  );

  const activeCategory = categories.some((item) => item.value === category) ? category : "all";
  const activeBrand = brands.includes(brand) ? brand : "all";
  const activeSize = sizes.includes(Number(size)) ? Number(size) : "all";

  const filteredProducts = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();
    const result = products.filter((product) => {
      const matchesCategory =
        activeCategory === "all" || product.category === activeCategory;
      const matchesBrand = activeBrand === "all" || product.brand === activeBrand;
      const matchesSize = activeSize === "all" || product.sizes?.includes(activeSize);
      const searchable =
        `${product.name} ${product.nameUz} ${product.nameRu} ${product.brand} ${product.category} ${product.descriptionUz} ${product.descriptionRu}`.toLowerCase();
      const matchesQuery = !normalizedQuery || searchable.includes(normalizedQuery);
      return matchesCategory && matchesBrand && matchesSize && matchesQuery;
    });

    return [...result].sort((first, second) => {
      if (sort === "price-low") return first.price - second.price;
      if (sort === "price-high") return second.price - first.price;
      if (sort === "name") return first.name.localeCompare(second.name);
      return new Date(second.createdAt || 0) - new Date(first.createdAt || 0);
    });
  }, [activeBrand, activeCategory, activeSize, deferredQuery, products, sort]);

  const activeFilterCount = [
    activeCategory !== "all",
    activeBrand !== "all",
    activeSize !== "all",
    Boolean(query.trim()),
  ].filter(Boolean).length;

  const clearFilters = () => {
    setCategory("all");
    setBrand("all");
    setSize("all");
    setQuery("");
    setSort("newest");
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshProducts();
    } catch {
      /* error is rendered from context */
    } finally {
      setRefreshing(false);
    }
  };

  const isLoading = syncStatus === "loading" && products.length === 0;
  const hasError = syncStatus === "error" && products.length === 0;

  return (
    <div>
      <section className="border-b border-line bg-white">
        <div className="shell py-10 lg:py-14">
          <nav className="flex items-center gap-2 text-xs font-semibold text-muted" aria-label="Breadcrumb">
            <Link to="/" className="transition-colors hover:text-ink">
              {t.nav.home}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-ink">{t.nav.catalog}</span>
          </nav>

          <div className="mt-6 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">{t.products.eyebrow}</p>
              <h1 className="h-display mt-3">{t.products.title}</h1>
              <p className="lede mt-3 max-w-xl">{t.products.subtitle}</p>
            </div>
            <p className="shrink-0 self-start rounded-full border border-line bg-canvas px-4 py-2 text-xs font-bold text-muted md:self-auto">
              {isLoading ? t.common.loading : `${filteredProducts.length} ${t.products.result}`}
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-canvas">
        <div className="shell">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row">
              <label className="group relative block flex-1 lg:max-w-sm">
                <span className="sr-only">{t.products.search}</span>
                <Search
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted transition-colors group-focus-within:text-gold"
                />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t.products.search}
                  className="h-11 w-full rounded-full border border-line bg-white pl-11 pr-10 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-gold"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full text-muted transition-colors hover:bg-canvas hover:text-ink"
                    aria-label={t.products.clear}
                  >
                    <X size={14} />
                  </button>
                ) : null}
              </label>

              <button
                type="button"
                onClick={() => setFiltersOpen((value) => !value)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-line bg-white px-4 text-xs font-bold text-ink transition-colors hover:border-ink/30 lg:hidden"
                aria-expanded={filtersOpen}
              >
                <SlidersHorizontal size={15} aria-hidden="true" />
                {t.products.mobileFilters}
                {activeFilterCount ? (
                  <span className="grid size-5 place-items-center rounded-full bg-ink text-[10px] text-white">
                    {activeFilterCount}
                  </span>
                ) : null}
              </button>
            </div>

            <div className="flex gap-2">
              <label className="group relative block flex-1 sm:w-52 sm:flex-none">
                <span className="sr-only">{t.products.sort}</span>
                <ArrowDownUp
                  size={15}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                />
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="h-11 w-full cursor-pointer appearance-none rounded-full border border-line bg-white pl-11 pr-9 text-xs font-bold text-ink outline-none transition-colors focus:border-gold"
                >
                  <option value="newest">{t.products.sortNewest}</option>
                  <option value="price-low">{t.products.sortPriceLow}</option>
                  <option value="price-high">{t.products.sortPriceHigh}</option>
                  <option value="name">{t.products.sortName}</option>
                </select>
              </label>

              {activeFilterCount ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="grid size-11 shrink-0 place-items-center rounded-full border border-line bg-white text-muted transition-colors hover:border-ink/30 hover:text-ink"
                  aria-label={t.common.reset}
                  title={t.common.reset}
                >
                  <RotateCcw size={15} />
                </button>
              ) : null}
            </div>
          </div>

          <div
            className={`mt-4 overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 ${
              filtersOpen ? "block" : "hidden lg:block"
            }`}
          >
            <div className="flex flex-col gap-5 p-4 sm:flex-row sm:flex-wrap sm:items-start sm:gap-8 sm:p-5">
              {categories.length ? (
                <FilterGroup title={t.products.category}>
                  {categories.map((item) => {
                    const active = activeCategory === item.value;
                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setCategory(item.value)}
                        aria-pressed={active}
                        className={`rounded-full border px-3 py-1.5 text-[11px] font-bold transition-colors ${
                          active
                            ? "border-ink bg-ink text-white"
                            : "border-line bg-white text-muted hover:border-ink/30 hover:text-ink"
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </FilterGroup>
              ) : null}

              {brands.length > 0 ? (
                <FilterGroup title={t.common.brand}>
                  <button
                    type="button"
                    onClick={() => setBrand("all")}
                    aria-pressed={activeBrand === "all"}
                    className={`rounded-full border px-3 py-1.5 text-[11px] font-bold transition-colors ${
                      activeBrand === "all"
                        ? "border-ink bg-ink text-white"
                        : "border-line bg-white text-muted hover:border-ink/30 hover:text-ink"
                    }`}
                  >
                    {t.common.allBrands}
                  </button>
                  {brands.map((item) => {
                    const active = activeBrand === item;
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setBrand(item)}
                        aria-pressed={active}
                        className={`rounded-full border px-3 py-1.5 text-[11px] font-bold transition-colors ${
                          active
                            ? "border-ink bg-ink text-white"
                            : "border-line bg-white text-muted hover:border-ink/30 hover:text-ink"
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </FilterGroup>
              ) : null}

              {sizes.length > 1 ? (
                <FilterGroup title={t.products.size}>
                  <button
                    type="button"
                    onClick={() => setSize("all")}
                    aria-pressed={activeSize === "all"}
                    className={`rounded-full border px-3 py-1.5 text-[11px] font-bold transition-colors ${
                      activeSize === "all"
                        ? "border-ink bg-ink text-white"
                        : "border-line bg-white text-muted hover:border-ink/30 hover:text-ink"
                    }`}
                  >
                    {t.products.anySize}
                  </button>
                  {sizes.map((item) => {
                    const active = activeSize === item;
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setSize(String(item))}
                        aria-pressed={active}
                        className={`min-w-9 rounded-full border px-2.5 py-1.5 text-[11px] font-bold transition-colors ${
                          active
                            ? "border-ink bg-ink text-white"
                            : "border-line bg-white text-muted hover:border-ink/30 hover:text-ink"
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </FilterGroup>
              ) : null}
            </div>
          </div>

          {syncError && products.length > 0 ? (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-800">
              <AlertTriangle size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
              <span>{syncError}</span>
            </div>
          ) : null}

          {isLoading ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-busy="true">
              {Array.from({ length: 8 }, (_, index) => (
                <div key={index}>
                  <div className="skeleton aspect-[4/5] rounded-[1.25rem]" />
                  <div className="skeleton mt-3 h-3 w-2/3 rounded-full" />
                  <div className="skeleton mt-2 h-3 w-1/3 rounded-full" />
                </div>
              ))}
            </div>
          ) : hasError ? (
            <Reveal from="fade" className="mx-auto max-w-md py-20 text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-white text-rose-600 shadow-card">
                <AlertTriangle size={22} aria-hidden="true" />
              </span>
              <h2 className="h-section mt-5">{t.common.errorTitle}</h2>
              <p className="lede mt-3">{t.products.errorText}</p>
              <button type="button" onClick={handleRefresh} disabled={refreshing} className="btn btn-primary mt-6">
                <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} aria-hidden="true" />
                {t.common.retry}
              </button>
            </Reveal>
          ) : filteredProducts.length ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <Reveal from="fade" className="mx-auto max-w-md py-20 text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-white text-gold shadow-card">
                <PackageSearch size={22} aria-hidden="true" />
              </span>
              <h2 className="h-section mt-5">{t.products.emptyTitle}</h2>
              <p className="lede mt-3">{t.products.emptyText}</p>
              <button type="button" onClick={clearFilters} className="btn btn-primary mt-6">
                <X size={16} aria-hidden="true" />
                {t.products.clear}
              </button>
            </Reveal>
          )}

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

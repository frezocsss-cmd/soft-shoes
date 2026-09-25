import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowDownUp, ArrowRight, Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { PRODUCT_CATEGORIES } from "../data/productUtils";
import { useProducts } from "../context/useProducts";
import ProductCard from "../components/ProductCard";

export default function ProductsPage() {
  const { lang } = useLanguage();
  const t = lang === "ru" ? copy.ru : copy.uz;
  const { products } = useProducts();
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const categories = [
    { value: "all", label: t.all },
    ...PRODUCT_CATEGORIES.map((item) => ({ value: item, label: item })),
  ];

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const result = products.filter((product) => {
      const matchesCategory = category === "all" || product.category === category;
      const searchable = `${product.name} ${product.descriptionUz} ${product.descriptionRu}`.toLowerCase();
      return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
    });

    return [...result].sort((first, second) => {
      if (sort === "price-low") return first.price - second.price;
      if (sort === "price-high") return second.price - first.price;
      if (sort === "name") return first.name.localeCompare(second.name);
      return new Date(second.createdAt) - new Date(first.createdAt);
    });
  }, [category, products, query, sort]);

  const clearFilters = () => {
    setCategory("all");
    setQuery("");
    setSort("newest");
  };

  return (
    <div>
      <section className="border-b border-ink/10 bg-[#ebe7dd]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-gold">{t.eyebrow}</p>
          <div className="mt-3 flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div>
              <h1 className="font-display text-5xl font-semibold leading-none text-ink sm:text-6xl">{t.title}</h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-muted sm:text-base">{t.subtitle}</p>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted">
              <span className="grid size-10 place-items-center rounded-full bg-white text-gold"><Sparkles size={18} /></span>
              <span><strong className="text-ink">{products.length}</strong> {t.result}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="flex flex-col gap-4 border-b border-ink/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setCategory(item.value)}
                className={`whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-bold transition ${
                  category === item.value ? "bg-ink text-white" : "bg-white text-muted hover:bg-ink/5 hover:text-ink"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative block sm:w-64">
              <span className="sr-only">{t.search}</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={17} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t.search}
                className="h-11 w-full rounded-full border border-ink/10 bg-white pl-11 pr-10 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-gold"
              />
              {query && <button type="button" onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink" aria-label="Qidiruvni tozalash"><X size={16} /></button>}
            </label>
            <label className="relative block sm:w-52">
              <span className="sr-only">{t.sort}</span>
              <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <select value={sort} onChange={(event) => setSort(event.target.value)} className="h-11 w-full appearance-none rounded-full border border-ink/10 bg-white pl-11 pr-8 text-xs font-bold text-ink outline-none transition focus:border-gold">
                <option value="newest">{t.sortNewest}</option>
                <option value="price-low">{t.sortPriceLow}</option>
                <option value="price-high">{t.sortPriceHigh}</option>
                <option value="name">{t.sortName}</option>
              </select>
              <ArrowDownUp className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted" size={14} />
            </label>
          </div>
        </div>

        {filteredProducts.length ? (
          <>
            <div className="mt-7 flex items-center justify-between text-xs font-semibold text-muted">
              <span>{filteredProducts.length} {t.result}</span>
              <span className="hidden items-center gap-2 sm:flex"><span className="size-1.5 rounded-full bg-gold" /> {t.sort}</span>
            </div>
            <div className="mt-5 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          </>
        ) : (
          <div className="mx-auto max-w-md py-24 text-center">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#ebe7dd] text-gold"><Search size={24} /></span>
            <h2 className="mt-6 font-display text-3xl font-semibold text-ink">{t.emptyTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-muted">{t.emptyText}</p>
            <button type="button" onClick={clearFilters} className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white transition hover:bg-olive">
              <X size={16} /> {t.clear}
            </button>
          </div>
        )}

        <div className="mt-20 rounded-[1.5rem] bg-ink p-7 text-white sm:flex sm:items-center sm:justify-between sm:p-10">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-gold">{lang === "ru" ? "Нужна помощь?" : "Yordam kerakmi?"}</p>
            <h2 className="mt-2 font-display text-2xl font-semibold">{lang === "ru" ? "Подберём размер и модель" : "O'lcham va modelni tanlab beramiz"}</h2>
          </div>
          <Link to="/contact" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-gold transition hover:text-white sm:mt-0">
            {lang === "ru" ? "Связаться" : "Bog'lanish"} <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}

const copy = {
  uz: {
    eyebrow: "Soft Shoes kolleksiyasi",
    title: "Barcha mahsulotlar",
    subtitle: "Kerakli modelni tanlang. Buyurtma uchun Telegram orqali yozing.",
    search: "Mahsulot qidirish",
    all: "Barchasi",
    sort: "Tartib",
    sortNewest: "Eng yangilari",
    sortPriceLow: "Narx: pastdan yuqoriga",
    sortPriceHigh: "Narx: yuqoridan pastga",
    sortName: "Nomi bo'yicha",
    result: "ta mahsulot",
    emptyTitle: "Mahsulot topilmadi",
    emptyText: "Qidiruv shartini o'zgartirib yana urinib ko'ring.",
    clear: "Filtrni tozalash",
  },
  ru: {
    eyebrow: "Коллекция Soft Shoes",
    title: "Все товары",
    subtitle: "Выберите модель. Для заказа напишите нам в Telegram.",
    search: "Поиск товаров",
    all: "Все",
    sort: "Сортировка",
    sortNewest: "Сначала новые",
    sortPriceLow: "Цена: по возрастанию",
    sortPriceHigh: "Цена: по убыванию",
    sortName: "По названию",
    result: "товаров",
    emptyTitle: "Товары не найдены",
    emptyText: "Измените условия поиска и попробуйте ещё раз.",
    clear: "Сбросить фильтры",
  },
};

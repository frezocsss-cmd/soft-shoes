import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowDownUp, ArrowRight, Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { PRODUCT_CATEGORIES } from "../data/productUtils";
import { useProducts } from "../context/useProducts";
import ProductCard from "../components/ProductCard";
import Reveal from "../components/motion/Reveal";
import ScrambleText from "../components/motion/ScrambleText";
import CharFlip from "../components/motion/CharFlip";
import CountUp from "../components/motion/CountUp";
import MagneticButton from "../components/motion/MagneticButton";
import { useParallax } from "../hooks/useScroll";

export default function ProductsPage() {
  const { lang } = useLanguage();
  const t = lang === "ru" ? copy.ru : copy.uz;
  const { products } = useProducts();
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const heroRef = useParallax(40);

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
      {/* ---------- HERO ---------- */}
      <section className="noise relative overflow-hidden border-b border-ink/10 bg-[#ebe7dd]">
        <div
          className="blob pointer-events-none absolute -right-24 -top-24 size-[420px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(181,138,69,0.3), transparent 70%)", "--blob-speed": "23s" }}
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute inset-0 grid-lines opacity-60" aria-hidden="true" />

        <div ref={heroRef} className="parallax relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <Reveal from="up">
            <ScrambleText
              text={t.eyebrow}
              className="block text-[11px] font-extrabold uppercase tracking-[0.24em] text-gold"
            />
          </Reveal>

          <div className="mt-3 flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div>
              <h1 className="font-display text-5xl font-semibold leading-none text-ink sm:text-6xl">
                <CharFlip text={t.title} as="span" startDelay={80} delayStep={28} />
              </h1>
              <Reveal from="up" delay={260}>
                <p className="mt-5 max-w-xl text-pretty text-sm leading-7 text-muted sm:text-base">{t.subtitle}</p>
              </Reveal>
            </div>

            <Reveal from="right" delay={200}>
              <div
                className="conic-ring flex items-center gap-3 rounded-2xl border border-ink/5 bg-white/80 px-5 py-4 shadow-card backdrop-blur-md"
                style={{ "--ring-speed": "9s" }}
              >
                <span className="grid size-11 place-items-center rounded-full bg-gold/15 text-gold">
                  <Sparkles size={19} className="animate-float" />
                </span>
                <span className="text-sm text-muted">
                  <strong className="font-display text-xl text-ink">
                    <CountUp value={products.length} />
                  </strong>{" "}
                  {t.result}
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- FILTERS ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Reveal from="up" className="flex flex-col gap-4 border-b border-ink/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
            {categories.map((item, index) => {
              const active = category === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setCategory(item.value)}
                  style={{ transitionDelay: `${index * 20}ms` }}
                  className={`press relative whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-bold transition-all duration-500 ${
                    active
                      ? "text-white shadow-lift"
                      : "bg-white text-muted hover:-translate-y-0.5 hover:bg-ink/5 hover:text-ink hover:shadow-card"
                  }`}
                >
                  {active && (
                    <span
                      className="absolute inset-0 -z-10 animate-pop overflow-hidden rounded-full bg-ink"
                      aria-hidden="true"
                    >
                      <span className="beam absolute inset-0 block" />
                    </span>
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="group relative block sm:w-64">
              <span className="sr-only">{t.search}</span>
              <Search
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted transition-colors duration-500 group-focus-within:text-gold"
                size={17}
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t.search}
                className="h-11 w-full rounded-full border border-ink/10 bg-white pl-11 pr-10 text-sm text-ink outline-none transition-all duration-500 placeholder:text-muted/70 focus:border-gold focus:shadow-soft"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full text-muted transition-colors duration-400 hover:bg-ink/5 hover:text-ink"
                  aria-label="Qidiruvni tozalash"
                >
                  <X size={14} />
                </button>
              )}
            </label>

            <label className="group relative block sm:w-52">
              <span className="sr-only">{t.sort}</span>
              <SlidersHorizontal
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted transition-colors duration-500 group-focus-within:text-gold"
                size={16}
              />
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="h-11 w-full cursor-pointer appearance-none rounded-full border border-ink/10 bg-white pl-11 pr-8 text-xs font-bold text-ink outline-none transition-all duration-500 focus:border-gold focus:shadow-soft"
              >
                <option value="newest">{t.sortNewest}</option>
                <option value="price-low">{t.sortPriceLow}</option>
                <option value="price-high">{t.sortPriceHigh}</option>
                <option value="name">{t.sortName}</option>
              </select>
              <ArrowDownUp
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted"
                size={14}
              />
            </label>
          </div>
        </Reveal>

        {filteredProducts.length ? (
          <>
            <Reveal from="fade" className="mt-7 flex items-center justify-between text-xs font-semibold text-muted">
              <span>
                <CountUp value={filteredProducts.length} /> {t.result}
              </span>
              <span className="hidden items-center gap-2 sm:flex">
                <span className="size-1.5 animate-blink rounded-full bg-gold" /> {t.sort}
              </span>
            </Reveal>

            <div className="mt-6 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </>
        ) : (
          <Reveal from="scale-up" className="mx-auto max-w-md py-24 text-center">
            <span className="mx-auto grid size-16 animate-float place-items-center rounded-full bg-[#ebe7dd] text-gold">
              <Search size={24} />
            </span>
            <h2 className="mt-6 font-display text-3xl font-semibold text-ink">{t.emptyTitle}</h2>
            <p className="mt-3 text-pretty text-sm leading-7 text-muted">{t.emptyText}</p>
            <button
              type="button"
              onClick={clearFilters}
              className="group mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white transition-all duration-500 hover:bg-olive hover:shadow-lift"
            >
              <X size={16} className="transition-transform duration-500 group-hover:rotate-90" /> {t.clear}
            </button>
          </Reveal>
        )}

        {/* ---------- HELP CTA ---------- */}
        <Reveal from="up" className="mt-20">
          <div className="noise relative overflow-hidden rounded-[1.5rem] bg-ink p-7 text-white sm:flex sm:items-center sm:justify-between sm:p-10">
            <div
              className="pointer-events-none absolute -right-16 -top-16 size-56 animate-drift rounded-full blur-3xl"
              style={{ background: "radial-gradient(circle, rgba(181,138,69,0.35), transparent 70%)" }}
              aria-hidden="true"
            />
            <div className="relative">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-gold">
                {lang === "ru" ? "Нужна помощь?" : "Yordam kerakmi?"}
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold">
                {lang === "ru" ? "Подберём размер и модель" : "O'lcham va modelni tanlab beramiz"}
              </h2>
            </div>
            <MagneticButton
              as={Link}
              to="/contact"
              strength={0.2}
              className="group relative mt-6 items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-gold transition-all duration-500 hover:border-gold hover:bg-gold hover:text-ink sm:mt-0"
            >
              {lang === "ru" ? "Связаться" : "Bog'lanish"}
              <ArrowRight size={16} className="transition-transform duration-500 group-hover:translate-x-1.5" />
            </MagneticButton>
          </div>
        </Reveal>
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

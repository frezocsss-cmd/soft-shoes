import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock3,
  MessageCircle,
  PackageCheck,
  Ruler,
  Store,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useProducts } from "../context/useProducts";
import { MAPS_LINK, TELEGRAM_LINK } from "../data/config";
import { formatPrice } from "../data/productUtils";
import { translations } from "../data/translations";
import ProductCard from "../components/ProductCard";
import ProductImage from "../components/ProductImage";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/motion/Reveal";

export default function HomePage() {
  const { lang } = useLanguage();
  const t = translations[lang] ?? translations.uz;
  const { products } = useProducts();

  const featured = products.filter((product) => product.featured);
  const displayProducts = (featured.length ? featured : products).slice(0, 4);
  const hero = products[0];

  const isRussian = lang === "ru";

  const categoryCards = [
    {
      key: "Erkaklar",
      title: isRussian ? "Мужская коллекция" : "Erkaklar kolleksiyasi",
      caption: isRussian ? "Классика и комфорт" : "Klassik va qulaylik",
      product: products[1] ?? products[0],
    },
    {
      key: "Ayollar",
      title: isRussian ? "Женская коллекция" : "Ayollar kolleksiyasi",
      caption: isRussian ? "Мягкие образы" : "Nafis va yumshoq",
      product: products[2] ?? products[0],
    },
    {
      key: "Unisex",
      title: isRussian ? "Unisex" : "Unisex kollektsiya",
      caption: isRussian ? "Свобода стиля" : "Stil chegarasi yo'q",
      product: products[4] ?? products[0],
    },
  ];

  // Kategoriya karti faqat o'sha kategoriyada mahsulot bo'lsa ko'rsatiladi,
  // aks holda link bo'sh ro'yxatga olib keladi.
  const categories = categoryCards.filter((item) =>
    products.some((product) => product.category === item.key),
  );
  const showCategories = categories.length >= 2;

  const trust = [
    { icon: MessageCircle, title: t.home.trust1Title, text: t.home.trust1Text },
    { icon: Ruler, title: t.home.trust2Title, text: t.home.trust2Text },
    { icon: PackageCheck, title: t.home.trust3Title, text: t.home.trust3Text },
    { icon: Store, title: t.home.trust4Title, text: t.home.trust4Text },
  ];

  const steps = [
    { title: t.home.step1Title, text: t.home.step1Text },
    { title: t.home.step2Title, text: t.home.step2Text },
    { title: t.home.step3Title, text: t.home.step3Text },
  ];

  const benefits = [
    { icon: Check, title: t.home.benefit1Title, text: t.home.benefit1Text },
    { icon: Check, title: t.home.benefit2Title, text: t.home.benefit2Text },
    { icon: Check, title: t.home.benefit3Title, text: t.home.benefit3Text },
  ];

  const stats = [
    { value: `${products.length || 5}+`, label: lang === "ru" ? "моделей" : "model" },
    { value: "2", label: lang === "ru" ? "языка" : "til" },
    { value: "10–21", label: lang === "ru" ? "работаем" : "ish vaqti" },
  ];

  const heroName = hero ? hero.name || (lang === "ru" ? hero.nameRu : hero.nameUz) : null;

  return (
    <div>
      {/* ================= HERO ================= */}
      <section className="border-b border-line bg-white">
        <div className="shell grid items-center gap-10 py-12 lg:grid-cols-2 lg:gap-14 lg:py-16">
          <div>
            <Reveal from="up">
              <p className="eyebrow inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-3 py-1.5">
                {t.home.eyebrow}
              </p>
            </Reveal>

            <Reveal from="up" delay={60}>
              <h1 className="h-display mt-5 text-ink">
                {t.home.title}{" "}
                <span className="text-gold underline decoration-gold/40 decoration-2 underline-offset-[6px]">
                  {t.home.titleAccent}
                </span>
              </h1>
            </Reveal>

            <Reveal from="up" delay={110}>
              <p className="lede mt-5 max-w-md">{t.home.subtitle}</p>
            </Reveal>

            <Reveal from="up" delay={160}>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link to="/products" className="btn btn-primary btn-lg">
                  {t.home.primary}
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
                <a href={TELEGRAM_LINK} className="btn btn-outline btn-lg">
                  <MessageCircle size={17} aria-hidden="true" />
                  {t.home.secondary}
                </a>
              </div>
            </Reveal>

            <Reveal from="up" delay={210}>
              <dl className="mt-9 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-5">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                      <span className="block text-xl font-extrabold text-ink">{stat.value}</span>
                      <span className="mt-0.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
                        {stat.label}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <Reveal from="up" delay={120} className="lg:justify-self-end">
            <div className="w-full max-w-md lg:max-w-none">
              <div className="media aspect-square rounded-3xl border border-line lg:aspect-[4/5]">
                {hero ? (
                  <ProductImage
                    product={hero}
                    alt={heroName ?? "Soft Shoes"}
                    className="size-full"
                    sizes="(min-width: 1024px) 44vw, 92vw"
                    priority
                    rootMargin="600px"
                  />
                ) : (
                  <div className="grid size-full place-items-center text-sm font-bold text-muted">
                    Soft Shoes
                  </div>
                )}
              </div>

              {hero ? (
                <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-line bg-canvas px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
                      {t.home.floatingLabel}
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-ink">{heroName}</p>
                  </div>
                  <span className="shrink-0 text-sm font-extrabold text-ink">
                    {formatPrice(hero.price)} <span className="text-[11px] text-muted">so'm</span>
                  </span>
                </div>
              ) : null}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= TRUST STRIP ================= */}
      <section className="border-b border-line bg-canvas">
        <div className="shell py-8 lg:py-10">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-line">
            {trust.map(({ icon: Icon, title, text }, index) => (
              <Reveal
                key={title}
                from="up"
                delay={index * 50}
                className="flex items-start gap-3 lg:px-6 lg:first:pl-0"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-gold shadow-card">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-bold text-ink">{title}</p>
                  <p className="mt-1 text-[13px] leading-5 text-muted">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      {showCategories ? (
        <section className="section bg-white">
          <div className="shell">
            <SectionHeading
              eyebrow={t.home.categoriesEyebrow}
              title={t.home.categoriesTitle}
              subtitle={t.home.categoriesSubtitle}
              action={
                <Link to="/products" className="link-quiet text-sm">
                  {t.common.viewAll}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              }
            />

            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {categories.map((category, index) => (
                <Reveal key={category.key} from="up" delay={index * 60}>
                  <Link
                    to={`/products?category=${encodeURIComponent(category.key)}`}
                    className="card card-hover group flex h-full flex-col overflow-hidden"
                  >
                    <div className="media aspect-[5/4]">
                      {category.product ? (
                        <ProductImage
                          product={category.product}
                          alt={category.title}
                          className="size-full transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                          sizes="(min-width: 640px) 32vw, 90vw"
                        />
                      ) : null}
                    </div>
                    <div className="flex flex-1 items-center justify-between gap-3 px-4 py-4">
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
                          {category.caption}
                        </p>
                        <h3 className="mt-1 text-[15px] font-extrabold text-ink">{category.title}</h3>
                      </div>
                      <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line text-ink transition-colors duration-200 group-hover:border-ink group-hover:bg-ink group-hover:text-white">
                        <ArrowUpRight size={15} aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ================= FEATURED ================= */}
      <section className="section bg-canvas">
        <div className="shell">
          <SectionHeading
            eyebrow={t.home.featuredEyebrow}
            title={t.home.featuredTitle}
            subtitle={t.home.featuredSubtitle}
            action={
              <Link to="/products" className="btn btn-outline btn-sm">
                {t.common.viewAll}
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            }
          />

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {displayProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= STEPS ================= */}
      <section className="section bg-white">
        <div className="shell">
          <SectionHeading
            eyebrow={t.home.stepsEyebrow}
            title={t.home.stepsTitle}
            subtitle={t.home.stepsSubtitle}
          />

          <ol className="mt-8 grid gap-5 md:grid-cols-3">
            {steps.map((step, index) => (
              <Reveal key={step.title} as="li" from="up" delay={index * 60}>
                <div className="card h-full p-5">
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-gold">
                    0{index + 1}
                  </span>
                  <h3 className="mt-3 text-[15px] font-extrabold text-ink">{step.title}</h3>
                  <p className="mt-2 text-[13px] leading-6 text-muted">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ================= BENEFITS ================= */}
      <section className="section bg-canvas">
        <div className="shell">
          <SectionHeading eyebrow={t.home.benefitsEyebrow} title={t.home.benefitsTitle} />

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {benefits.map(({ icon: Icon, title, text }, index) => (
              <Reveal key={title} from="up" delay={index * 60}>
                <div className="flex h-full items-start gap-3">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-ink text-white">
                    <Icon size={12} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-sm font-extrabold text-ink">{title}</h3>
                    <p className="mt-1.5 text-[13px] leading-6 text-muted">{text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= STORE ================= */}
      <section className="section bg-white">
        <div className="shell">
          <div className="card grid overflow-hidden lg:grid-cols-2">
            <div className="media min-h-[240px] lg:min-h-[360px]">
              {products[4] ? (
                <ProductImage
                  product={products[4]}
                  alt={t.home.storeEyebrow}
                  className="size-full"
                  sizes="(min-width: 1024px) 48vw, 92vw"
                />
              ) : null}
            </div>

            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              <p className="eyebrow">{t.home.storeEyebrow}</p>
              <h2 className="h-section mt-3">{t.home.storeTitle}</h2>
              <p className="lede mt-4">{t.home.storeText}</p>

              <ul className="mt-6 space-y-2.5 text-sm text-muted">
                <li className="flex items-start gap-2.5">
                  <Store size={16} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                  {t.home.storeAddress}
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock3 size={16} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                  {t.home.storeHours}
                </li>
              </ul>

              <a
                href={MAPS_LINK}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary mt-7 self-start"
              >
                {t.home.storeButton}
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TELEGRAM CTA ================= */}
      <section className="section bg-ink text-white">
        <div className="shell flex flex-col items-start justify-between gap-7 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold-soft">
              {t.home.telegramEyebrow}
            </p>
            <h2 className="h-section mt-3">{t.home.telegramTitle}</h2>
            <p className="mt-3 text-sm leading-6 text-white/65">{t.home.telegramText}</p>
          </div>
          <a href={TELEGRAM_LINK} className="btn btn-lg shrink-0 bg-white text-ink hover:bg-gold-soft">
            <MessageCircle size={18} aria-hidden="true" />
            {t.nav.order}
          </a>
        </div>
      </section>
    </div>
  );
}

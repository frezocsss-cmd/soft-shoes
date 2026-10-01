import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useProducts } from "../context/useProducts";
import { MAPS_LINK, TELEGRAM_LINK } from "../data/config";
import SectionHeading from "../components/SectionHeading";
import ProductCard from "../components/ProductCard";
import Reveal from "../components/motion/Reveal";
import SplitText from "../components/motion/SplitText";
import Marquee from "../components/motion/Marquee";
import CountUp from "../components/motion/CountUp";
import TiltCard from "../components/motion/TiltCard";
import MagneticButton from "../components/motion/MagneticButton";
import ScrambleText from "../components/motion/ScrambleText";
import CharFlip from "../components/motion/CharFlip";
import StickyRail from "../components/motion/StickyRail";
import PinnedScene from "../components/motion/PinnedScene";
import ProductImage from "../components/ProductImage";
import { useParallax } from "../hooks/useScrollMotion";
import { subscribeFrame } from "../lib/scrollEngine";

export default function HomePage() {
  const { lang } = useLanguage();
  const t = lang === "ru" ? translations.ru : translations.uz;
  const { products } = useProducts();
  const featured = products.filter((product) => product.featured).slice(0, 4);
  const displayProducts = featured.length ? featured : products.slice(0, 4);
  const hero = products[0];
  const heroRef = useRef(null);

  /**
   * Hero fade/parallax — avval `useScrollY()` har kadrda setState
   * qilib butun HomePage'ni qayta render qilardi. Endi markaziy
   * scrollEngine'dan olingan qiymat to'g'ridan-to'g'ri DOM
   * uslubiga yoziladi (transform + opacity).
   */
  useEffect(() => {
    const node = heroRef.current;
    if (!node) return undefined;
    let height = 0;
    let pendingTransform = "";
    let pendingOpacity = "";

    const measure = () => {
      height = node.getBoundingClientRect().height;
    };
    measure();

    let observer;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(measure);
      observer.observe(node);
    }

    return subscribeFrame({
      read: ({ y }) => {
        if (!height) measure();
        if (!height) return;
        const progress = Math.min(1, Math.max(0, y / (height * 0.85)));
        pendingOpacity = (1 - progress * 0.55).toFixed(3);
        pendingTransform =
          progress < 1 ? `translate3d(0, ${(y * 0.16).toFixed(1)}px, 0)` : "translate3d(0, 0, 0)";
      },
      write: () => {
        if (!pendingOpacity) return;
        node.style.opacity = pendingOpacity;
        node.style.transform = pendingTransform;
      },
    });
  }, []);

  const heroVisualRef = useParallax(70);
  const heroGlowRef = useParallax(-40);
  const storyRef = useParallax(50);
  const storeRef = useParallax(45);

  const categoryCards = [
    {
      title: lang === "ru" ? "Мужская коллекция" : "Erkaklar kolleksiyasi",
      caption: lang === "ru" ? "Классика и комфорт" : "Klassik va qulaylik",
      product: products[1] ?? products[0],
      to: "/products?category=Erkaklar",
      span: "col-span-6 md:col-span-4",
    },
    {
      title: lang === "ru" ? "Женская коллекция" : "Ayollar kolleksiyasi",
      caption: lang === "ru" ? "Нежные образы" : "Nafis va yumshoq",
      product: products[2] ?? products[0],
      to: "/products?category=Ayollar",
      span: "col-span-6 md:col-span-4",
    },
    {
      title: lang === "ru" ? "Unisex" : "Unisex kollektsiya",
      caption: lang === "ru" ? "Свобода стиля" : "Stil chegarasi yo'q",
      product: products[4] ?? products[0],
      to: "/products?category=Unisex",
      span: "col-span-12 md:col-span-4",
    },
  ];

  const benefits = [
    { icon: Sparkles, title: t.home.benefit1Title, text: t.home.benefit1Text },
    { icon: ShieldCheck, title: t.home.benefit2Title, text: t.home.benefit2Text },
    { icon: MessageCircle, title: t.home.benefit3Title, text: t.home.benefit3Text },
  ];

  const storyPoints = [t.home.storyPoint1, t.home.storyPoint2, t.home.storyPoint3];

  const marqueeItems = [
    "Soft-soled comfort",
    "Everyday elegance",
    "Telegram ordering",
    "Made for your steps",
    (lang === "ru" ? "Премиум качество" : "Premium sifat"),
    (lang === "ru" ? "Доставка по Ташкенту" : "Toshkent bo'ylab yetkazib berish"),
  ];

  const stats = [
    { value: products.length || 5, suffix: "+", label: lang === "ru" ? "моделей" : "model" },
    { value: 2, suffix: "", label: lang === "ru" ? "языка" : "til" },
    { value: 10, suffix: "-21", label: lang === "ru" ? "работаем" : "ish vaqti" },
  ];

  return (
    <div>
      {/* ================= 1. HERO ================= */}
      <section
        ref={heroRef}
        className="noise relative overflow-hidden will-change-transform"
      >
        {/* ambient blob morph + glow */}
        <div
          ref={heroGlowRef}
          className="parallax blob pointer-events-none absolute -right-32 -top-40 size-[560px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(181,138,69,0.28), transparent 70%)", "--blob-speed": "24s" }}
          aria-hidden="true"
        />
        <div
          className="blob blob-2 pointer-events-none absolute -left-40 top-1/3 size-[460px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(89,98,74,0.18), transparent 70%)", "--blob-speed": "31s" }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:px-8 lg:pb-24 lg:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
            <div className="max-w-xl">
              <Reveal from="up" delay={60}>
                <div className="inline-flex items-center gap-2.5 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-olive backdrop-blur-sm">
                  <span className="relative flex size-1.5">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-gold opacity-75" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-gold" />
                  </span>
                  <ScrambleText text={t.home.eyebrow} />
                </div>
              </Reveal>

              <h1 className="mt-7 text-balance font-display text-5xl font-semibold leading-[0.98] tracking-[-0.03em] text-ink sm:text-6xl lg:text-7xl">
                <CharFlip text={t.home.title} as="span" startDelay={140} delayStep={30} />
                <br />
                <span className="text-gold-gradient inline-block">
                  <CharFlip text={t.home.titleAccent} as="span" startDelay={420} delayStep={30} />
                </span>
              </h1>

              <Reveal from="up" delay={520}>
                <p className="mt-7 max-w-md text-pretty text-base leading-8 text-muted sm:text-lg">
                  {t.home.subtitle}
                </p>
              </Reveal>

              <Reveal from="up" delay={640} className="mt-9 flex flex-col gap-3 sm:flex-row">
                <MagneticButton
                  as={Link}
                  to="/products"
                  strength={0.22}
                  className="beam group h-14 items-center justify-center gap-3 rounded-full bg-ink px-7 text-sm font-bold text-white transition-all duration-500 hover:bg-olive hover:shadow-lift"
                >
                  <span className="relative z-10">{t.home.primary}</span>
                  <ArrowRight size={17} className="relative z-10 transition-transform duration-500 group-hover:translate-x-1.5" />
                </MagneticButton>

                <MagneticButton
                  href={TELEGRAM_LINK}
                  strength={0.22}
                  rippleLight
                  className="group h-14 items-center justify-center gap-2 rounded-full border border-ink/15 bg-white/70 px-6 text-sm font-bold text-ink backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-gold hover:shadow-soft"
                >
                  <MessageCircle size={17} className="transition-transform duration-500 group-hover:rotate-12" />
                  {t.home.secondary}
                </MagneticButton>
              </Reveal>

              <Reveal from="up" delay={760} className="mt-12">
                <div className="grid max-w-md grid-cols-3 gap-5 border-t border-ink/10 pt-6">
                  {stats.map((stat) => (
                    <div key={stat.label} className="group">
                      <p className="font-display text-2xl font-semibold text-ink transition-colors duration-500 group-hover:text-gold">
                        <CountUp value={stat.value} suffix={stat.suffix} />
                      </p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* HERO VISUAL */}
            <div ref={heroVisualRef} className="relative mx-auto w-full max-w-[620px] lg:mx-0 lg:ml-auto">
              <div
                className="absolute -right-5 -top-5 size-28 animate-float rounded-full bg-gold/25 blur-2xl"
                aria-hidden="true"
              />
              {/* conic aylanuvchi halqa + velocity skew */}
              <div
                className="tilt-press conic-ring vel-skew group relative overflow-hidden rounded-[2rem] bg-[#dfdbd0] shadow-soft"
                style={{ "--ring-speed": "7s" }}
              >
                <div className="fx-zoom aspect-[0.92] overflow-hidden">
                  {hero ? (
                    <ProductImage
                      product={hero}
                      alt={hero.nameUz}
                      className="sv-drift size-full"
                      sizes="(min-width: 1024px) 52vw, 92vw"
                      priority
                      rootMargin="600px"
                    />
                  ) : (
                    <div className="grid size-full place-items-center text-sm text-muted">Soft Shoes</div>
                  )}
                  {/* scanline sweep — mobil'da ham ko'rinadi */}
                  <div className="pointer-events-none absolute inset-0 scanline" aria-hidden="true" />
                </div>

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 rounded-2xl border border-white/20 bg-ink/80 p-4 text-white backdrop-blur-md sm:inset-x-6 sm:bottom-6 sm:p-5">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-gold">{t.home.floatingLabel}</p>
                    <p className="mt-1 font-display text-xl font-semibold">{t.home.floatingTitle}</p>
                    <div className="mt-2 flex items-end gap-[3px]">
                      {[10, 14, 8, 12, 6].map((h, star) => (
                        <span
                          key={star}
                          className="eq-bar block w-[3px] rounded-full bg-gold/80"
                          style={{ height: h, "--eq-delay": `${star * 130}ms`, "--eq-speed": `${1 + star * 0.22}s` }}
                          aria-hidden="true"
                        />
                      ))}
                      <span className="sr-only">5 stars</span>
                    </div>
                  </div>
                  <Link
                    to="/products"
                    className="group/arrow press grid size-11 shrink-0 place-items-center rounded-full bg-white text-ink transition-all duration-500 hover:rotate-45 hover:bg-gold hover:text-white"
                  >
                    <ArrowUpRight size={18} />
                  </Link>
                </div>
              </div>

              {/* floating comfort chip — mobil'da ham ko'rinadi */}
              <div className="conic-ring-ink conic-ring absolute -bottom-6 -left-4 animate-float-slow rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 shadow-card backdrop-blur-md sm:-left-6">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-full bg-[#e8f0e7] text-olive">
                    <Check size={17} />
                  </span>
                  <div>
                    <p className="text-xs font-extrabold text-ink">100% comfort</p>
                    <p className="text-[10px] text-muted">{lang === "ru" ? "для каждого дня" : "har kuni uchun"}</p>
                  </div>
                </div>
              </div>

              {/* spinning ring badge — orbit nuqtasi bilan */}
              <div className="pointer-events-none absolute -left-8 -top-8 hidden size-24 animate-spin-slow lg:block" aria-hidden="true">
                <svg viewBox="0 0 100 100" className="size-full">
                  <defs>
                    <path id="heroCircle" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" fill="none" />
                  </defs>
                  <text className="fill-gold text-[11px] font-bold uppercase tracking-[0.28em]">
                    <textPath href="#heroCircle">
                      {lang === "ru" ? "SOFT SHOES • КОМФОРТ • " : "SOFT SHOES • QULAY • "}
                    </textPath>
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-canvas to-transparent"
          aria-hidden="true"
        />
      </section>

      {/* ================= 2. MARQUEE ================= */}
      <div className="relative overflow-hidden border-y border-ink/10 bg-white py-4">
        <Marquee
          items={marqueeItems}
          speed={38}
          className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-muted"
        />
      </div>

      {/* ================= 3. CATEGORY CARDS ================= */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading
          eyebrow={t.home.categoriesEyebrow}
          title={t.home.categoriesTitle}
          subtitle={t.home.categoriesSubtitle}
        />
        <div className="mt-12 grid grid-cols-6 gap-4 sm:gap-5">
          {categoryCards.map((category, index) => (
            <Reveal
              key={category.to}
              as="div"
              from="up"
              delay={index * 140}
              className={category.span}
            >
              <TiltCard
                max={9}
                scale={1.02}
                className="conic-ring group h-full overflow-hidden rounded-[1.5rem] bg-[#dfdbd0]"
                style={{ "--ring-speed": `${8 + index * 3}s` }}
              >
                <Link to={category.to} className="press relative block h-full">
                  <div className="fx-zoom aspect-[0.92] overflow-hidden">
                    {category.product ? (
                      <ProductImage
                        product={category.product}
                        alt=""
                        className="sv-drift size-full"
                        sizes="(min-width: 768px) 32vw, 90vw"
                      />
                    ) : null}
                  </div>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent transition-opacity duration-700 group-hover:from-ink/90" />

                  {/* orbit nuqtasi */}
                  <span
                    className="orbit absolute right-6 top-6 size-2 rounded-full bg-gold/70"
                    style={{ "--orbit-r": "26px", "--orbit-speed": "11s" }}
                    aria-hidden="true"
                  />

                  <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3 text-white">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/65">{category.caption}</p>
                      <h3 className="mt-1 font-display text-2xl font-semibold">{category.title}</h3>
                      <span className="mt-3 block h-px w-0 bg-gold transition-all duration-700 group-hover:w-24" />
                    </div>
                    <span className="press grid size-11 shrink-0 place-items-center rounded-full bg-white text-ink transition-all duration-500 group-hover:rotate-45 group-hover:bg-gold group-hover:text-white">
                      <ArrowUpRight size={17} />
                    </span>
                  </div>
                </Link>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= 4. FEATURED PRODUCTS (sticky rail) ================= */}
      <section className="noise relative overflow-hidden bg-[#ebe7dd] py-16 lg:py-24">
        <div className="pointer-events-none absolute inset-0 dots opacity-40" aria-hidden="true" />
        <div
          className="blob pointer-events-none absolute -left-24 top-10 size-72 rounded-full bg-gold/15 blur-3xl"
          style={{ "--blob-speed": "20s" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
            <SectionHeading
              eyebrow={t.home.featuredEyebrow}
              title={t.home.featuredTitle}
              subtitle={t.home.featuredSubtitle}
            />
            <Reveal from="left" delay={200}>
              <MagneticButton
                as={Link}
                to="/products"
                strength={0.2}
                className="group shrink-0 items-center gap-2 rounded-full border border-ink/15 bg-white px-5 py-3 text-sm font-extrabold text-ink transition-all duration-500 hover:border-gold hover:shadow-soft"
              >
                {t.common.viewAll}
                <ArrowRight size={17} className="transition-transform duration-500 group-hover:translate-x-1.5" />
              </MagneticButton>
            </Reveal>
          </div>

          {/* mobil: normal grid / desktop: sticky gorizontal rail */}
          <div className="mt-12 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:hidden">
            {displayProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>

        <StickyRail className="hidden lg:block" railLabel={t.home.featuredTitle}>
          {displayProducts.map((product) => (
            <div key={product.id} className="w-[340px] shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
          <Link
            to="/products"
            className="press group grid w-[240px] shrink-0 place-items-center rounded-[1.5rem] border border-dashed border-gold/40 bg-white/50 text-center transition-colors duration-500 hover:border-gold hover:bg-white"
          >
            <div>
              <span className="mx-auto grid size-12 place-items-center rounded-full bg-ink text-white transition-all duration-500 group-hover:rotate-45 group-hover:bg-gold">
                <ArrowUpRight size={18} />
              </span>
              <p className="mt-4 text-sm font-extrabold text-ink">{t.common.viewAll}</p>
            </div>
          </Link>
        </StickyRail>
      </section>

      {/* ================= 5. STORY (pinned scene) ================= */}
      <PinnedScene
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        height="260vh"
        progressMap={[
          { at: 0, transform: "translate3d(0, 46px, 0) scale(0.94)", opacity: 0.35 },
          { at: 0.32, transform: "translate3d(0, 0, 0) scale(1)", opacity: 1 },
          { at: 0.72, transform: "translate3d(0, 0, 0) scale(1)", opacity: 1 },
          { at: 1, transform: "translate3d(0, -34px, 0) scale(0.97)", opacity: 0.4 },
        ]}
      >
        <div className="grid items-center gap-12 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div ref={storyRef} className="relative mx-auto w-full max-w-md lg:mx-0">
            <div className="conic-ring group relative overflow-hidden rounded-[2rem] bg-[#dedbd1] shadow-soft" style={{ "--ring-speed": "11s" }}>
              <div className="fx-zoom aspect-[0.86] overflow-hidden">
                {products[3] ? (
                  <ProductImage product={products[3]} alt={t.home.storyEyebrow} className="sv-drift size-full" sizes="(min-width: 1024px) 34vw, 90vw" />
                ) : null}
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent" />
              <div className="pointer-events-none absolute inset-0 scanline" aria-hidden="true" />
            </div>

            <div className="absolute -bottom-6 -right-4 grid size-28 place-items-center rounded-full border border-ink/10 bg-white text-center shadow-soft sm:-right-8">
              <span
                className="absolute inset-2 animate-spin-slower rounded-full border border-dashed border-gold/40"
                aria-hidden="true"
              />
              <span className="font-display text-3xl font-semibold text-gold">01</span>
            </div>
          </div>

          <div>
            <Reveal from="right">
              <ScrambleText
                text={t.home.storyEyebrow}
                className="block text-[11px] font-extrabold uppercase tracking-[0.24em] text-gold"
              />
            </Reveal>
            <h2 className="mt-3 text-balance font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
              <SplitText text={t.home.storyTitle} as="span" delay={100} />
            </h2>
            <Reveal from="up" delay={260}>
              <p className="mt-6 max-w-xl text-pretty text-sm leading-8 text-muted sm:text-base">{t.home.storyText}</p>
            </Reveal>

            <ul className="mt-8 space-y-4">
              {storyPoints.map((point, index) => (
                <Reveal as="li" key={point} from="left" delay={index * 130}>
                  <span className="group flex items-start gap-3 text-sm font-semibold text-ink">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-olive text-white transition-all duration-500 group-hover:scale-125 group-hover:bg-gold">
                      <Check size={12} />
                    </span>
                    <span className="fx-link">{point}</span>
                  </span>
                </Reveal>
              ))}
            </ul>

            <Reveal from="up" delay={420}>
              <MagneticButton
                as={Link}
                to="/about"
                strength={0.2}
                className="group mt-9 items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-white transition-all duration-500 hover:bg-olive hover:shadow-lift"
              >
                {t.about.eyebrow}
                <ArrowRight size={17} className="transition-transform duration-500 group-hover:translate-x-1.5" />
              </MagneticButton>
            </Reveal>
          </div>
        </div>
      </PinnedScene>

      {/* ================= 6. BENEFITS ================= */}
      <section className="noise relative overflow-hidden bg-ink py-16 text-white lg:py-24">
        <div className="pointer-events-none absolute inset-0 grid-lines-dark opacity-50" aria-hidden="true" />
        <div
          className="blob pointer-events-none absolute right-0 top-0 size-[420px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(181,138,69,0.25), transparent 70%)", "--blob-speed": "25s" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow={t.home.benefitsEyebrow} title={t.home.benefitsTitle} />

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {benefits.map(({ icon: Icon, title, text }, index) => (
              <Reveal key={title} as="div" from="up" delay={index * 140}>
                <TiltCard
                  max={8}
                  scale={1.015}
                  glow={false}
                  style={{ "--ring-speed": `${10 + index * 2}s` }}
                  className="conic-ring conic-ring-ink group h-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm sm:p-9"
                >
                  <div className="flex items-start justify-between">
                    <span className="grid size-12 place-items-center rounded-2xl bg-gold/15 text-gold transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                      <Icon size={22} />
                    </span>
                    <span className="font-display text-2xl text-white/15">0{index + 1}</span>
                  </div>
                  <h3 className="mt-6 text-lg font-extrabold transition-colors duration-500 group-hover:text-gold">{title}</h3>
                  <p className="mt-3 text-pretty text-sm leading-7 text-white/55">{text}</p>
                  <span className="mt-6 block h-px w-0 bg-gold/60 transition-all duration-700 group-hover:w-full" />
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 7. STORE ================= */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="tilt-press conic-ring group grid overflow-hidden rounded-[2rem] border border-ink/5 bg-[#ded8cc] shadow-soft lg:grid-cols-[1fr_0.8fr]">
          <div ref={storeRef} className="relative min-h-[320px] overflow-hidden lg:min-h-[440px]">
            <div className="sv-drift absolute inset-0">
              {products[4] ? (
                <ProductImage product={products[4]} alt={t.home.storeEyebrow} className="size-full" sizes="(min-width: 1024px) 52vw, 100vw" />
              ) : null}
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 to-transparent" />
            <div className="absolute bottom-6 left-6 flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-bold text-white backdrop-blur-md">
              <MapPin size={16} className="text-gold" />
              {lang === "ru" ? "Ташкент" : "Toshkent"}
            </div>
          </div>

          <div className="flex flex-col justify-center p-7 sm:p-12 lg:p-16">
            <Reveal from="right">
              <ScrambleText
                text={t.home.storeEyebrow}
                className="block text-[11px] font-extrabold uppercase tracking-[0.24em] text-gold"
              />
            </Reveal>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
              <SplitText text={t.home.storeTitle} as="span" delay={100} />
            </h2>
            <Reveal from="up" delay={200}>
              <p className="mt-5 text-pretty text-sm leading-7 text-muted sm:text-base">{t.home.storeText}</p>
            </Reveal>
            <Reveal from="up" delay={320}>
              <MagneticButton
                href={MAPS_LINK}
                target="_blank"
                rel="noreferrer"
                strength={0.2}
                className="group mt-8 items-center gap-3 rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-white transition-all duration-500 hover:bg-olive hover:shadow-lift"
              >
                {t.home.storeButton}
                <ArrowUpRight size={17} className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </MagneticButton>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================= 8. TELEGRAM CTA ================= */}
      <section className="noise relative overflow-hidden bg-[#d8dfd0] py-14 lg:py-20">
        <div className="pointer-events-none absolute inset-0 dots opacity-50" aria-hidden="true" />
        <div
          className="blob blob-2 pointer-events-none absolute -right-20 bottom-0 size-72 rounded-full bg-olive/20 blur-3xl"
          style={{ "--blob-speed": "19s" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div>
            <Reveal from="left">
              <ScrambleText
                text={t.home.telegramEyebrow}
                className="block text-[11px] font-extrabold uppercase tracking-[0.24em] text-olive"
              />
            </Reveal>
            <h2 className="mt-3 max-w-2xl text-balance font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
              <SplitText text={t.home.telegramTitle} as="span" delay={120} />
            </h2>
            <Reveal from="up" delay={260}>
              <p className="mt-3 max-w-xl text-pretty text-sm leading-7 text-muted">{t.home.telegramText}</p>
            </Reveal>
          </div>
          <Reveal from="right" delay={200}>
            <MagneticButton
              href={TELEGRAM_LINK}
              strength={0.28}
              className="conic-ring conic-ring-ink group shrink-0 items-center gap-3 rounded-full bg-ink px-6 py-4 text-sm font-bold text-white transition-all duration-500 hover:bg-olive hover:shadow-lift"
            >
              <MessageCircle size={18} className="relative z-10 transition-transform duration-500 group-hover:rotate-12" />
              <span className="relative z-10">{t.nav.order}</span>
              <ArrowUpRight size={16} className="relative z-10 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </MagneticButton>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

const translations = {
  uz: {
    nav: { order: "Telegramda buyurtma" },
    common: { viewAll: "Barchasini ko'rish" },
    home: {
      eyebrow: "2026 yangi kollektsiya",
      title: "Qadam boshingiz",
      titleAccent: "boshqacha bo'lsin",
      subtitle: "Zamonaviy dizayn, yumshoq his va kundalik hayotga moslangan qulay poyabzallar.",
      primary: "Kolleksiyani ko'rish",
      secondary: "Telegramda maslahat",
      floatingLabel: "Yangi model",
      floatingTitle: "Soft Steps Collection",
      categoriesEyebrow: "Har bir uslub uchun",
      categoriesTitle: "Kolleksiyadan tanlang",
      categoriesSubtitle: "Erkaklar, ayollar va unisex modellari bir joyda.",
      featuredEyebrow: "Tanlangan mahsulotlar",
      featuredTitle: "Hamma yoqqan modellar",
      featuredSubtitle: "Eng ko'p tanlanayotgan qulay va zamonaviy poyabzallarimiz.",
      storyEyebrow: "Soft Shoes",
      storyTitle: "Ishonchli qulaylik har bir detallarda",
      storyText: "Biz har bir modelni uzoq muddatli foydalanish, yumshoq his va kundalik hayotga moslik uchun tanlaymiz. Oddiy dizayn va o'ylangan detallar kombinatsiyasi kundalik uslubni yangilaydi.",
      storyPoint1: "Qulay shakl va to'g'ri qo'llab-quvvatlash",
      storyPoint2: "Kundalik foydalanishga tayyor materiallar",
      storyPoint3: "Har bir buyurtma Telegram orqali qo'llab-quvvatlanadi",
      benefitsEyebrow: "Nega Soft Shoes?",
      benefitsTitle: "Sizning qulayligingiz bizning ustuvorligimiz",
      benefit1Title: "Yumshoq his",
      benefit1Text: "Kun bo'yi qulay kiyish uchun tekshirilgan materiallar.",
      benefit2Title: "Aniq o'lcham",
      benefit2Text: "Har bir model uchun aniq o'lchamlar ro'yxati.",
      benefit3Title: "Tez javob",
      benefit3Text: "Savol va buyurtmalar uchun Telegram orqali bog'lanish.",
      storeEyebrow: "Bizning do'kon",
      storeTitle: "Kelayotganingizda",
      storeText: "Toshkent markazidagi do'konimizda modellarni yanada yaqinroq ko'ring.",
      storeButton: "Xaritada ochish",
      telegramEyebrow: "Tezkor buyurtma",
      telegramTitle: "Tanlagan modelni Telegram orqali buyurtma qiling",
      telegramText:
        "Saytdagi har bir mahsulotdagi buyurtma tugmasi sizni Soft Shoes Telegram guruhiga olib boradi.",
    },
    about: { eyebrow: "Biz haqimizda" },
  },
  ru: {
    nav: { order: "Заказать в Telegram" },
    common: { viewAll: "Смотреть все" },
    home: {
      eyebrow: "Новая коллекция 2026",
      title: "Пусть каждый шаг",
      titleAccent: "будет другим",
      subtitle: "Современный дизайн, мягкие ощущения и комфортная обувь для повседневной жизни.",
      primary: "Смотреть коллекцию",
      secondary: "Консультация в Telegram",
      floatingLabel: "Новая модель",
      floatingTitle: "Soft Steps Collection",
      categoriesEyebrow: "Для каждого стиля",
      categoriesTitle: "Выберите из коллекции",
      categoriesSubtitle: "Мужские, женские и unisex-модели в одном месте.",
      featuredEyebrow: "Выбранные товары",
      featuredTitle: "Модели, которые нравятся всем",
      featuredSubtitle: "Самые популярные комфортные и современные модели.",
      storyEyebrow: "Soft Shoes",
      storyTitle: "Надёжный комфорт в каждой детали",
      storyText:
        "Мы выбираем каждую модель для долгой носки, мягких ощущений и реальной повседневной жизни. Продуманные детали и простой дизайн обновляют образ каждый день.",
      storyPoint1: "Удобная форма и правильная поддержка",
      storyPoint2: "Материалы, готовые к ежедневной носке",
      storyPoint3: "Каждый заказ поддерживается через Telegram",
      benefitsEyebrow: "Почему Soft Shoes?",
      benefitsTitle: "Ваш комфорт — наш приоритет",
      benefit1Title: "Мягкие ощущения",
      benefit1Text: "Проверенные материалы для комфорта в течение всего дня.",
      benefit2Title: "Точные размеры",
      benefit2Text: "Для каждой модели указаны доступные размеры.",
      benefit3Title: "Быстрый ответ",
      benefit3Text: "Свяжитесь по вопросам и заказам через Telegram.",
      storeEyebrow: "Наш магазин",
      storeTitle: "Мы ждём вас",
      storeText: "Посмотрите модели ещё ближе в нашем магазине в центре Ташкента.",
      storeButton: "Открыть карту",
      telegramEyebrow: "Быстрый заказ",
      telegramTitle: "Закажите выбранную модель через Telegram",
      telegramText: "Кнопка заказа на каждом товаре ведёт в группу Soft Shoes в Telegram.",
    },
    about: { eyebrow: "О нас" },
  },
};

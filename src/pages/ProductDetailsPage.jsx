import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, MessageCircle, PackageCheck, Ruler, ShieldCheck } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { formatPrice } from "../data/productUtils";
import { useProducts } from "../context/useProducts";
import { TELEGRAM_LINK } from "../data/config";
import ProductCard from "../components/ProductCard";
import Reveal from "../components/motion/Reveal";
import SplitText from "../components/motion/SplitText";
import ScrambleText from "../components/motion/ScrambleText";
import CharFlip from "../components/motion/CharFlip";
import MagneticButton from "../components/motion/MagneticButton";
import TiltCard from "../components/motion/TiltCard";
import { useParallax } from "../hooks/useScroll";

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const { lang } = useLanguage();
  const t = lang === "ru" ? copy.ru : copy.uz;
  const { products } = useProducts();
  const product = products.find((item) => String(item.id) === String(productId));
  const imageRef = useParallax(35);

  if (!product) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-24 text-center">
        <Reveal from="scale">
          <span className="block animate-float text-6xl font-display text-gold-gradient">404</span>
        </Reveal>
        <Reveal from="up" delay={140}>
          <h1 className="mt-5 font-display text-3xl font-semibold text-ink">{t.notFound}</h1>
        </Reveal>
        <Reveal from="up" delay={260}>
          <Link
            to="/products"
            className="group mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white transition-all duration-500 hover:bg-olive hover:shadow-lift"
          >
            <ArrowLeft size={16} className="transition-transform duration-500 group-hover:-translate-x-1" />
            {t.breadcrumb}
          </Link>
        </Reveal>
      </section>
    );
  }

  const name = product.name || (lang === "ru" ? product.nameRu : product.nameUz);
  const description = lang === "ru" ? product.descriptionRu : product.descriptionUz;
  const isAvailable = product.stock == null || product.stock > 0;
  const related = products.filter((item) => item.id !== product.id).slice(0, 3);

  const perks = [
    { icon: PackageCheck, title: t.delivery, text: t.deliveryText },
    { icon: Ruler, title: t.sizes, text: t.helpText },
    { icon: ShieldCheck, title: t.help, text: t.helpText },
  ];

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs font-semibold text-muted" aria-label="Breadcrumb">
          <Link to="/" className="fx-link transition hover:text-ink">
            {lang === "ru" ? "Главная" : "Bosh sahifa"}
          </Link>
          <span className="text-line">/</span>
          <Link to="/products" className="fx-link transition hover:text-ink">
            {t.breadcrumb}
          </Link>
          <span className="text-line">/</span>
          <span className="truncate text-ink">{name}</span>
        </nav>
      </div>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:px-8 lg:py-16">
        <Reveal from="left">
          <div
            className="conic-ring group relative overflow-hidden rounded-[2rem] bg-[#e9e5dc] shadow-soft"
            style={{ "--ring-speed": "9s" }}
          >
            <div ref={imageRef} className="parallax relative aspect-[0.9] overflow-hidden">
              <div className="fx-zoom sv-drift absolute inset-0">
                <img src={product.image_url} alt={name} className="size-full object-cover" />
              </div>
              {/* sweep — mobil'da ham ko'rinadi */}
              <div className="pointer-events-none absolute inset-0 scanline" aria-hidden="true" />
            </div>

            <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-ink/5" />

            {product.badge && (
              <span className="absolute left-5 top-5 animate-pop rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-ink shadow-card backdrop-blur">
                {product.badge === "sale" ? t.common.sale : t.common[product.badge]}
              </span>
            )}

            <div className="pointer-events-none absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-ink/70 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white backdrop-blur-md">
              <span className={`size-1.5 rounded-full ${isAvailable ? "animate-blink bg-olive" : "bg-rose-500"}`} />
              {isAvailable ? t.inStock : t.outOfStock}
            </div>
          </div>
        </Reveal>

        <div className="flex flex-col justify-center">
          <Reveal from="right">
            <ScrambleText
              text={product.category}
              className="block text-[11px] font-extrabold uppercase tracking-[0.24em] text-gold"
            />
          </Reveal>

          <h1 className="mt-3 text-balance font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
            <CharFlip text={name} as="span" startDelay={80} delayStep={24} />
          </h1>

          <Reveal from="up" delay={220}>
            <div className="mt-6 flex flex-wrap items-end gap-3">
              <span className="text-2xl font-extrabold text-ink">
                {formatPrice(product.price)} <span className="text-sm font-semibold text-muted">so'm</span>
              </span>
              {product.oldPrice && (
                <span className="text-sm text-muted line-through">{formatPrice(product.oldPrice)} so'm</span>
              )}
            </div>
          </Reveal>

          <Reveal from="up" delay={300}>
            <p className="mt-6 max-w-lg text-pretty text-sm leading-8 text-muted sm:text-base">{description}</p>
          </Reveal>

          <Reveal from="up" delay={380}>
            <div className="mt-8 border-y border-ink/10 py-5">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-bold text-ink">{t.availability}</span>
                <span
                  className={`inline-flex items-center gap-2 text-xs font-bold transition-colors duration-500 ${
                    isAvailable ? "text-olive" : "text-rose-600"
                  }`}
                >
                  <span
                    className={`size-2 rounded-full ${isAvailable ? "animate-blink bg-olive" : "bg-rose-500"}`}
                  />
                  {isAvailable ? t.inStock : t.outOfStock}
                </span>
              </div>

              <div className="mt-5 flex items-center justify-between gap-4">
                <span className="text-sm font-bold text-ink">{t.sizes}</span>
                <div className="flex flex-wrap justify-end gap-2">
                  {product.sizes?.map((size, index) => (
                    <span
                      key={size}
                      style={{ transitionDelay: `${index * 45}ms` }}
                      className="grid min-w-9 cursor-pointer place-items-center rounded-lg border border-ink/10 bg-white px-2 py-1.5 text-xs font-bold text-ink transition-all duration-400 hover:-translate-y-1 hover:border-gold hover:bg-gold hover:text-white hover:shadow-gold"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal from="up" delay={460}>
            <MagneticButton
              href={TELEGRAM_LINK}
              strength={0.18}
              className="fx-sheen group relative mt-8 h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-ink px-6 text-sm font-extrabold text-white transition-all duration-500 hover:bg-olive hover:shadow-lift"
            >
              <span className="relative z-10 flex items-center gap-3">
                <MessageCircle size={19} className="transition-transform duration-500 group-hover:rotate-12" />
                {t.orderHint}
                <ArrowRight size={17} className="transition-transform duration-500 group-hover:translate-x-1.5" />
              </span>
            </MagneticButton>
          </Reveal>

          <Reveal from="fade" delay={540}>
            <p className="mt-3 text-center text-xs text-muted">{t.orderText}</p>
          </Reveal>

          <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {perks.map(({ icon: Icon, title, text }, index) => (
              <Reveal key={title} from="up" delay={600 + index * 100}>
                <TiltCard max={7} scale={1.02} className="flex h-full gap-3 rounded-2xl bg-white p-4 shadow-card">
                  <Icon size={18} className="shrink-0 text-gold" />
                  <div>
                    <p className="text-xs font-extrabold text-ink">{title}</p>
                    <p className="mt-1 text-[11px] leading-5 text-muted">{text}</p>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- RELATED ---------- */}
      <section className="noise relative overflow-hidden border-t border-ink/10 bg-[#ebe7dd] py-14 lg:py-20">
        <div className="pointer-events-none absolute inset-0 dots opacity-40" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-5">
            <div>
              <Reveal from="left">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-gold">{t.breadcrumb}</p>
              </Reveal>
              <h2 className="mt-2 font-display text-3xl font-semibold text-ink">
                <SplitText text={lang === "ru" ? "Вам понравится" : "Sizga yoqishi mumkin"} as="span" delay={100} />
              </h2>
            </div>
            <Reveal from="right">
              <Link
                to="/products"
                className="fx-link hidden items-center gap-2 text-sm font-bold text-ink transition hover:text-gold sm:flex"
              >
                {t.common.viewAll} <ArrowRight size={16} />
              </Link>
            </Reveal>
          </div>

          <div className="mt-8 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, index) => (
              <ProductCard key={item.id} product={item} index={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const copy = {
  uz: {
    breadcrumb: "Mahsulotlar",
    notFound: "Bunday mahsulot topilmadi.",
    availability: "Mavjudligi",
    inStock: "Mavjud",
    outOfStock: "Tugagan",
    sizes: "O'lchamlar",
    orderHint: "Telegram orqali buyurtma bering",
    orderText: "O'lcham va rangni Telegram'da aniqlashtiring.",
    delivery: "Yetkazib berish",
    deliveryText: "Toshkent bo'ylab yetkazib berish mavjud.",
    help: "Yordam",
    helpText: "O'lchamni tanlashda biz yordam beramiz.",
    common: {
      sale: "Aksiya",
      new: "Yangi",
      bestseller: "Eng ko'p sotilgan",
      limited: "Cheklangan",
      viewAll: "Barchasini ko'rish",
    },
  },
  ru: {
    breadcrumb: "Товары",
    notFound: "Такой товар не найден.",
    availability: "Наличие",
    inStock: "В наличии",
    outOfStock: "Нет в наличии",
    sizes: "Размеры",
    orderHint: "Закажите через Telegram",
    orderText: "Уточните размер и цвет в Telegram.",
    delivery: "Доставка",
    deliveryText: "Доставка по Ташкенту доступна.",
    help: "Помощь",
    helpText: "Поможем выбрать размер.",
    common: {
      sale: "Скидка",
      new: "Новинка",
      bestseller: "Хит продаж",
      limited: "Лимитированная",
      viewAll: "Смотреть все",
    },
  },
};

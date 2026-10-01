import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Check, Eye, HandHeart, Target } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useProducts } from "../context/useProducts";
import { translations } from "../data/translations";
import ProductImage from "../components/ProductImage";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/motion/Reveal";

export default function AboutPage() {
  const { lang } = useLanguage();
  const t = translations[lang] ?? translations.uz;
  const { products } = useProducts();

  const values = [
    { icon: Target, title: t.about.value1Title, text: t.about.value1Text },
    { icon: Eye, title: t.about.value2Title, text: t.about.value2Text },
    { icon: HandHeart, title: t.about.value3Title, text: t.about.value3Text },
  ];

  const promises =
    lang === "ru"
      ? ["Понятная навигация", "Реальные размеры и наличие", "Помощь в Telegram"]
      : ["Aniq va tushunarli navigatsiya", "Haqiqiy o'lcham va mavjudlik", "Telegram orqali yordam"];

  return (
    <div>
      {/* ---------- HEADER ---------- */}
      <section className="border-b border-line bg-white">
        <div className="shell grid items-center gap-10 py-12 lg:grid-cols-2 lg:gap-14 lg:py-16">
          <div>
            <p className="eyebrow">{t.about.eyebrow}</p>
            <h1 className="h-display mt-4">{t.about.title}</h1>
            <p className="lede mt-5 max-w-lg">{t.about.subtitle}</p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/products" className="btn btn-primary">
                {t.about.cta}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link to="/contact" className="btn btn-outline">
                {t.nav.contact}
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Reveal from="up" className="media aspect-[4/5] rounded-2xl border border-line">
              {products[0] ? (
                <ProductImage
                  product={products[0]}
                  alt="Soft Shoes"
                  className="size-full"
                  sizes="(min-width: 1024px) 26vw, 45vw"
                />
              ) : null}
            </Reveal>
            <Reveal from="up" delay={80} className="media mt-8 aspect-[4/5] rounded-2xl border border-line">
              {products[2] ? (
                <ProductImage
                  product={products[2]}
                  alt="Soft Shoes collection"
                  className="size-full"
                  sizes="(min-width: 1024px) 26vw, 45vw"
                />
              ) : null}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- STORY ---------- */}
      <section className="section bg-canvas">
        <div className="shell grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow">Soft Shoes</p>
            <h2 className="h-section mt-3">{t.about.storyTitle}</h2>
          </div>

          <div>
            <p className="lede">{t.about.storyText}</p>

            <ul className="mt-7 space-y-3">
              {promises.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm font-semibold text-ink">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-ink text-white">
                    <Check size={12} aria-hidden="true" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <Link to="/products" className="btn btn-primary mt-8">
              {t.about.cta}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- VALUES ---------- */}
      <section className="section border-y border-line bg-white">
        <div className="shell">
          <SectionHeading eyebrow={t.home.benefitsEyebrow} title={t.home.benefitsTitle} />

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {values.map(({ icon: Icon, title, text }, index) => (
              <Reveal key={title} from="up" delay={index * 60}>
                <div className="card card-hover h-full p-6">
                  <span className="grid size-11 place-items-center rounded-xl bg-canvas text-gold">
                    <Icon size={19} aria-hidden="true" />
                  </span>
                  <p className="mt-5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted">
                    0{index + 1}
                  </p>
                  <h3 className="mt-1.5 text-base font-extrabold text-ink">{title}</h3>
                  <p className="mt-2 text-[13px] leading-6 text-muted">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="section bg-canvas">
        <div className="shell">
          <div className="card flex flex-col items-start justify-between gap-6 p-7 sm:flex-row sm:items-center sm:p-9">
            <div>
              <h2 className="h-section">
                {lang === "ru" ? "Подберём размер вместе" : "O'lchamni birga tanlaymiz"}
              </h2>
              <p className="lede mt-2 max-w-md">
                {lang === "ru"
                  ? "Напишите нам в Telegram — подскажем размер и модель."
                  : "Telegram orqali yozing — o'lcham va modelni birga tanlaymiz."}
              </p>
            </div>
            <Link to="/contact" className="btn btn-primary shrink-0">
              {t.nav.order}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

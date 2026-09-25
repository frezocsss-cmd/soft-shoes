import { Link } from "react-router-dom";
import { ArrowRight, Check, Eye, HandHeart, Target } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useProducts } from "../context/useProducts";
import { translations } from "../data/translations";

export default function AboutPage() {
  const { lang } = useLanguage();
  const t = translations[lang] ?? translations.uz;
  const { products } = useProducts();
  const values = [
    { icon: Target, title: t.about.value1Title, text: t.about.value1Text },
    { icon: Eye, title: t.about.value2Title, text: t.about.value2Text },
    { icon: HandHeart, title: t.about.value3Title, text: t.about.value3Text },
  ];

  return (
    <div>
      <section className="overflow-hidden bg-ink text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8 lg:py-24">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-gold">{t.about.eyebrow}</p>
            <h1 className="mt-4 text-balance font-display text-5xl font-semibold leading-[1.05] sm:text-6xl">{t.about.title}</h1>
            <p className="mt-6 max-w-xl text-sm leading-8 text-white/60 sm:text-base">{t.about.subtitle}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="aspect-[0.78] overflow-hidden rounded-[1.5rem] bg-white/5">
              {products[0] ? <img src={products[0].image} alt="Soft Shoes" className="size-full object-cover" /> : null}
            </div>
            <div className="mt-10 aspect-[0.78] overflow-hidden rounded-[1.5rem] bg-white/5">
              {products[2] ? <img src={products[2].image} alt="Soft Shoes collection" className="size-full object-cover" /> : null}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8 lg:py-24">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-gold">Soft Shoes</p>
          <h2 className="mt-3 text-balance font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">{t.about.storyTitle}</h2>
        </div>
        <div>
          <p className="text-base leading-8 text-muted">{t.about.storyText}</p>
          <div className="mt-8 space-y-3">
            {(lang === "ru"
              ? ["Понятная навигация", "Реальные размеры и наличие", "Помощь в Telegram"]
              : ["Aniq va tushunarli navigatsiya", "Haqiqiy o'lcham va mavjudlik", "Telegram orqali yordam"]
            ).map((item) => (
              <p key={item} className="flex items-center gap-3 text-sm font-bold text-ink"><span className="grid size-6 place-items-center rounded-full bg-olive text-white"><Check size={13} /></span>{item}</p>
            ))}
          </div>
          <Link to="/products" className="mt-9 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-olive">
            {t.about.cta} <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <section className="bg-[#ebe7dd] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl"><p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-gold">{t.home.benefitsEyebrow}</p><h2 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">{t.home.benefitsTitle}</h2></div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {values.map(({ icon: Icon, title, text }, index) => (
              <article key={title} className="rounded-[1.5rem] border border-ink/5 bg-white p-7 shadow-card sm:p-8">
                <div className="flex items-center justify-between"><span className="grid size-12 place-items-center rounded-2xl bg-ink text-gold"><Icon size={21} /></span><span className="font-display text-2xl text-ink/20">0{index + 1}</span></div>
                <h3 className="mt-6 text-lg font-extrabold text-ink">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

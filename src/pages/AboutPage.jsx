import { Link } from "react-router-dom";
import { ArrowRight, Check, Eye, HandHeart, Target } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useProducts } from "../context/useProducts";
import { translations } from "../data/translations";
import Reveal from "../components/motion/Reveal";
import SplitText from "../components/motion/SplitText";
import ScrambleText from "../components/motion/ScrambleText";
import CharFlip from "../components/motion/CharFlip";
import TiltCard from "../components/motion/TiltCard";
import MagneticButton from "../components/motion/MagneticButton";
import Marquee from "../components/motion/Marquee";
import { useParallax } from "../hooks/useScrollMotion";
import ProductImage from "../components/ProductImage";

export default function AboutPage() {
  const { lang } = useLanguage();
  const t = translations[lang] ?? translations.uz;
  const { products } = useProducts();
  const leftRef = useParallax(30);
  const rightRef = useParallax(-30);
  const badgeRef = useParallax(-60);

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
      {/* ---------- HERO ---------- */}
      <section className="noise relative overflow-hidden bg-ink text-white">
        <div className="pointer-events-none absolute inset-0 grid-lines-dark opacity-50" aria-hidden="true" />
        <div
          className="blob pointer-events-none absolute -left-32 -top-24 size-[460px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(181,138,69,0.3), transparent 70%)", "--blob-speed": "22s" }}
          aria-hidden="true"
        />
        <div
          className="blob blob-2 pointer-events-none absolute -right-24 bottom-0 size-[380px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(89,98,74,0.32), transparent 70%)", "--blob-speed": "27s" }}
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8 lg:py-24">
          <div>
            <Reveal from="up">
              <ScrambleText
                text={t.about.eyebrow}
                className="block text-[11px] font-extrabold uppercase tracking-[0.24em] text-gold"
              />
            </Reveal>

            <h1 className="mt-4 text-balance font-display text-5xl font-semibold leading-[1.05] sm:text-6xl">
              <CharFlip text={t.about.title} as="span" startDelay={100} delayStep={26} />
            </h1>

            <Reveal from="up" delay={320}>
              <p className="mt-6 max-w-xl text-pretty text-sm leading-8 text-white/60 sm:text-base">
                {t.about.subtitle}
              </p>
            </Reveal>

            <Reveal from="up" delay={420}>
              <div className="mt-9 flex flex-wrap gap-3">
                <MagneticButton
                  as={Link}
                  to="/products"
                  strength={0.2}
                  className="beam beam-ink group h-12 items-center gap-2 rounded-full bg-gold px-6 text-sm font-extrabold text-ink transition-all duration-500 hover:shadow-gold"
                >
                  <span className="relative z-10">{t.about.cta}</span>
                  <ArrowRight size={17} className="relative z-10 transition-transform duration-500 group-hover:translate-x-1.5" />
                </MagneticButton>

                <MagneticButton
                  as={Link}
                  to="/contact"
                  strength={0.2}
                  className="group h-12 items-center gap-2 rounded-full border border-white/20 px-6 text-sm font-bold text-white transition-all duration-500 hover:border-white/50 hover:bg-white/10"
                >
                  {t.nav.contact}
                </MagneticButton>
              </div>
            </Reveal>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Reveal from="right" delay={120}>
              <div
                className="conic-ring conic-ring-ink group relative overflow-hidden rounded-[1.5rem] bg-white/5"
                style={{ "--ring-speed": "10s" }}
              >
                <div ref={leftRef} className="parallax relative aspect-[0.78]">
                  <div className="fx-zoom sv-drift absolute inset-0">
                    {products[0] ? <ProductImage product={products[0]} alt="Soft Shoes" className="size-full" sizes="(min-width: 1024px) 30vw, 90vw" /> : null}
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-0 scanline" aria-hidden="true" />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
              </div>
            </Reveal>

            <Reveal from="right" delay={280}>
              <div
                className="conic-ring conic-ring-ink group relative mt-10 overflow-hidden rounded-[1.5rem] bg-white/5"
                style={{ "--ring-speed": "14s" }}
              >
                <div ref={rightRef} className="parallax relative aspect-[0.78]">
                  <div className="fx-zoom sv-drift absolute inset-0">
                    {products[2] ? (
                      <ProductImage product={products[2]} alt="Soft Shoes collection" className="size-full" sizes="(min-width: 1024px) 24vw, 90vw" />
                    ) : null}
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
              </div>
            </Reveal>

            <div
              ref={badgeRef}
              className="parallax pointer-events-none absolute right-6 hidden animate-spin-slow lg:block"
              style={{ top: "18%" }}
              aria-hidden="true"
            >
              <svg viewBox="0 0 100 100" className="size-24">
                <defs>
                  <path id="aboutCircle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" fill="none" />
                </defs>
                <text className="fill-gold text-[10px] font-bold uppercase tracking-[0.3em]">
                  <textPath href="#aboutCircle">
                    {lang === "ru" ? "SOFT SHOES • SINCE 2026 • " : "SOFT SHOES • 2026 DAN • "}
                  </textPath>
                </text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- MARQUEE ---------- */}
      <div className="overflow-hidden border-b border-ink/10 bg-white py-4">
        <Marquee
          items={promises}
          speed={30}
          className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-muted"
        />
      </div>

      {/* ---------- STORY ---------- */}
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8 lg:py-24">
        <div>
          <Reveal from="left">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-gold">Soft Shoes</p>
          </Reveal>
          <h2 className="mt-3 text-balance font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
            <SplitText text={t.about.storyTitle} as="span" delay={100} />
          </h2>
        </div>

        <div>
          <Reveal from="right">
            <p className="text-pretty text-base leading-8 text-muted">{t.about.storyText}</p>
          </Reveal>

          <div className="mt-8 space-y-3">
            {promises.map((item, index) => (
              <Reveal key={item} from="right" delay={120 + index * 120}>
                <p className="group flex items-center gap-3 text-sm font-bold text-ink">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-olive text-white transition-all duration-500 group-hover:scale-125 group-hover:bg-gold">
                    <Check size={13} />
                  </span>
                  <span className="fx-link">{item}</span>
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal from="up" delay={420}>
            <MagneticButton
              as={Link}
              to="/products"
              strength={0.2}
              className="group mt-9 items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-white transition-all duration-500 hover:bg-olive hover:shadow-lift"
            >
              {t.about.cta}
              <ArrowRight size={17} className="transition-transform duration-500 group-hover:translate-x-1.5" />
            </MagneticButton>
          </Reveal>
        </div>
      </section>

      {/* ---------- VALUES ---------- */}
      <section className="noise relative overflow-hidden bg-[#ebe7dd] py-16 lg:py-24">
        <div
          className="pointer-events-none absolute -right-24 top-16 size-80 animate-float-slow rounded-full bg-gold/15 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <Reveal from="up">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-gold">{t.home.benefitsEyebrow}</p>
            </Reveal>
            <h2 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">
              <SplitText text={t.home.benefitsTitle} as="span" delay={100} />
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {values.map(({ icon: Icon, title, text }, index) => (
              <Reveal key={title} from="up" delay={index * 140}>
                <TiltCard
                  max={9}
                  scale={1.02}
                  style={{ "--ring-speed": `${9 + index * 3}s` }}
                  className="conic-ring group h-full rounded-[1.5rem] border border-ink/5 bg-white p-7 shadow-card sm:p-8"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid size-12 place-items-center rounded-2xl bg-ink text-gold transition-all duration-500 group-hover:rotate-[-8deg] group-hover:bg-gold group-hover:text-ink">
                      <Icon size={21} />
                    </span>
                    <span className="font-display text-2xl text-ink/20 transition-colors duration-500 group-hover:text-gold/50">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-6 text-lg font-extrabold text-ink">{title}</h3>
                  <p className="mt-3 text-pretty text-sm leading-7 text-muted">{text}</p>
                  <span className="mt-6 block h-px w-0 bg-gold transition-all duration-700 group-hover:w-full" />
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

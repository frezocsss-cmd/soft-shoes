import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../data/translations";
import Reveal from "../components/motion/Reveal";
import CharFlip from "../components/motion/CharFlip";
import MagneticButton from "../components/motion/MagneticButton";

export default function NotFoundPage() {
  const { lang } = useLanguage();
  const t = translations[lang] ?? translations.uz;

  return (
    <section className="noise relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-60" aria-hidden="true" />
      <div
        className="blob pointer-events-none absolute left-1/2 top-1/3 size-[520px] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(181,138,69,0.22), transparent 70%)", "--blob-speed": "17s" }}
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 py-24 text-center">
        <Reveal from="scale" className="relative">
          <p className="font-display text-8xl font-semibold text-gold-gradient sm:text-9xl">
            <CharFlip text={t.notFound.code} as="span" startDelay={100} delayStep={150} />
          </p>
          <span className="pointer-events-none absolute inset-0 -z-10 animate-pulse-ring rounded-full bg-gold/20" aria-hidden="true" />
        </Reveal>

        <Reveal from="up" delay={320}>
          <h1 className="mt-5 font-display text-4xl font-semibold text-ink">{t.notFound.title}</h1>
        </Reveal>

        <Reveal from="up" delay={420}>
          <p className="mt-4 max-w-md text-pretty text-sm leading-7 text-muted">{t.notFound.text}</p>
        </Reveal>

        <Reveal from="up" delay={520}>
          <MagneticButton
            as={Link}
            to="/"
            strength={0.22}
            className="conic-ring group mt-8 items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-white transition-all duration-500 hover:bg-olive hover:shadow-lift"
          >
            <ArrowLeft size={16} className="relative z-10 transition-transform duration-500 group-hover:-translate-x-1.5" />
            <span className="relative z-10">{t.common.backHome}</span>
          </MagneticButton>
        </Reveal>
      </div>
    </section>
  );
}

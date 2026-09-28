import { ArrowUpRight, Clock3, MapPin, MessageCircle, Phone } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import {
  MAPS_EMBED,
  MAPS_LINK,
  PHONE_HREF,
  PHONE_NUMBER,
  STORE_ADDRESS,
  TELEGRAM_LINK,
} from "../data/config";
import { translations } from "../data/translations";
import Reveal from "../components/motion/Reveal";
import ScrambleText from "../components/motion/ScrambleText";
import CharFlip from "../components/motion/CharFlip";
import TiltCard from "../components/motion/TiltCard";
import MagneticButton from "../components/motion/MagneticButton";

export default function ContactPage() {
  const { lang } = useLanguage();
  const t = translations[lang] ?? translations.uz;
  const address = lang === "ru" ? "Ташкент, Мирабадский район, ул. Нукусская, 3" : STORE_ADDRESS;

  const contacts = [
    {
      icon: MessageCircle,
      title: t.contact.telegramTitle,
      text: t.contact.telegramText,
      value: "@soft_shoes_uz",
      href: TELEGRAM_LINK,
      external: true,
    },
    {
      icon: Phone,
      title: t.contact.phoneTitle,
      text: t.contact.phoneText,
      value: PHONE_NUMBER,
      href: PHONE_HREF,
      external: false,
    },
    {
      icon: MapPin,
      title: t.contact.addressTitle,
      text: t.contact.addressText,
      value: address,
      href: MAPS_LINK,
      external: true,
    },
    {
      icon: Clock3,
      title: t.contact.hoursTitle,
      text: lang === "ru" ? "Ежедневно" : "Har kuni",
      value: t.contact.hoursText,
      href: MAPS_LINK,
      external: true,
    },
  ];

  return (
    <div>
      {/* ---------- HERO ---------- */}
      <section className="noise relative overflow-hidden bg-ink text-white">
        <div className="pointer-events-none absolute inset-0 grid-lines-dark opacity-50" aria-hidden="true" />
        <div
          className="blob pointer-events-none absolute -right-28 -top-24 size-[440px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(181,138,69,0.3), transparent 70%)", "--blob-speed": "24s" }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <Reveal from="up">
            <p className="flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.24em] text-gold">
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold" />
              <ScrambleText text={t.contact.eyebrow} />
            </p>
          </Reveal>

          <h1 className="mt-4 max-w-3xl text-balance font-display text-5xl font-semibold sm:text-6xl">
            <CharFlip text={t.contact.title} as="span" startDelay={100} delayStep={26} />
          </h1>

          <Reveal from="up" delay={320}>
            <p className="mt-5 max-w-xl text-pretty text-sm leading-7 text-white/60 sm:text-base">
              {t.contact.subtitle}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------- CARDS + MAP ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {contacts.map(({ icon: Icon, title, text, value, href, external }, index) => (
            <Reveal key={title} from="up" delay={index * 120}>
              <TiltCard
                max={9}
                scale={1.02}
                style={{ "--ring-speed": `${9 + index * 2}s` }}
                className="conic-ring h-full rounded-[1.35rem]"
              >
                <a
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                  className="group block h-full rounded-[1.35rem] border border-ink/10 bg-white p-5 shadow-card"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-2xl bg-[#ebe7dd] text-olive transition-all duration-500 group-hover:rotate-[-10deg] group-hover:bg-gold group-hover:text-ink">
                      <Icon size={19} />
                    </span>
                    <ArrowUpRight
                      size={16}
                      className="text-muted transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold"
                    />
                  </div>
                  <p className="mt-5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-gold">{title}</p>
                  <p className="mt-2 text-pretty text-sm font-extrabold leading-6 text-ink">{value}</p>
                  <p className="mt-1 text-xs leading-5 text-muted">{text}</p>
                  <span className="mt-4 block h-px w-0 bg-gold transition-all duration-700 group-hover:w-full" />
                </a>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        <Reveal from="scale-up" className="mt-10">
          <div className="group relative overflow-hidden rounded-[2rem] border border-ink/10 bg-[#e7e2d8] shadow-card">
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-ink/5" />
            <iframe
              title={t.contact.mapTitle}
              src={MAPS_EMBED}
              className="h-[420px] w-full border-0 grayscale-[25%] transition-all duration-700 group-hover:grayscale-0 sm:h-[520px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>

        <Reveal from="up" className="mt-10">
          <div className="noise relative overflow-hidden rounded-[1.5rem] bg-[#d8dfd0] p-7 sm:flex sm:items-center sm:justify-between sm:p-10">
            <div
              className="pointer-events-none absolute -left-16 -top-16 size-52 animate-drift rounded-full bg-olive/20 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-olive">Telegram</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-ink">{t.contact.ctaTitle}</h2>
            </div>
            <MagneticButton
              href={TELEGRAM_LINK}
              strength={0.25}
              className="group relative mt-6 shrink-0 items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-white transition-all duration-500 hover:bg-olive hover:shadow-lift sm:mt-0"
            >
              <MessageCircle size={17} className="transition-transform duration-500 group-hover:rotate-12" />
              {t.nav.order}
              <ArrowUpRight size={16} className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </MagneticButton>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

import { ArrowUpRight, Clock3, MapPin, MessageCircle, Phone } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import {
  MAPS_EMBED,
  MAPS_LINK,
  PHONE_HREF,
  PHONE_NUMBER,
  TELEGRAM_LINK,
} from "../data/config";
import { translations } from "../data/translations";
import Reveal from "../components/motion/Reveal";

export default function ContactPage() {
  const { lang } = useLanguage();
  const t = translations[lang] ?? translations.uz;
  const isRussian = lang === "ru";

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
      value: t.home.storeAddress,
      href: MAPS_LINK,
      external: true,
    },
    {
      icon: Clock3,
      title: t.contact.hoursTitle,
      text: isRussian ? "Ежедневно" : "Har kuni",
      value: t.home.storeHours,
      href: MAPS_LINK,
      external: true,
    },
  ];

  return (
    <div>
      {/* ---------- HEADER ---------- */}
      <section className="border-b border-line bg-white">
        <div className="shell py-12 lg:py-14">
          <p className="eyebrow">{t.contact.eyebrow}</p>
          <h1 className="h-display mt-4">{t.contact.title}</h1>
          <p className="lede mt-4 max-w-xl">{t.contact.subtitle}</p>
        </div>
      </section>

      {/* ---------- CARDS + MAP ---------- */}
      <section className="section bg-canvas">
        <div className="shell">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {contacts.map(({ icon: Icon, title, text, value, href, external }, index) => (
              <Reveal key={title} from="up" delay={index * 50}>
                <a
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                  className="card card-hover group flex h-full flex-col p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid size-10 place-items-center rounded-xl bg-canvas text-gold">
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <ArrowUpRight
                      size={15}
                      className="mt-1 text-muted transition-colors duration-200 group-hover:text-ink"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
                    {title}
                  </p>
                  <p className="mt-1.5 text-sm font-extrabold leading-6 text-ink">{value}</p>
                  <p className="mt-1 text-xs leading-5 text-muted">{text}</p>
                </a>
              </Reveal>
            ))}
          </div>

          <Reveal from="fade" className="mt-8">
            <div className="media h-[320px] rounded-3xl border border-line sm:h-[420px]">
              <iframe
                title={t.contact.mapTitle}
                src={MAPS_EMBED}
                className="size-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>

          <Reveal from="up" className="mt-8">
            <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-ink p-7 text-white sm:flex-row sm:items-center sm:p-9">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold-soft">
                  Telegram
                </p>
                <h2 className="h-section mt-2">{t.contact.ctaTitle}</h2>
              </div>
              <a href={TELEGRAM_LINK} className="btn btn-lg shrink-0 bg-white text-ink hover:bg-gold-soft">
                <MessageCircle size={18} aria-hidden="true" />
                {t.nav.order}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

import { ArrowUpRight, Clock3, MapPin, MessageCircle, Phone } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { MAPS_EMBED, MAPS_LINK, PHONE_HREF, PHONE_NUMBER, STORE_ADDRESS, TELEGRAM_LINK } from "../data/config";
import { translations } from "../data/translations";

export default function ContactPage() {
  const { lang } = useLanguage();
  const t = translations[lang] ?? translations.uz;
  const address = lang === "ru" ? "Ташкент, Мирабадский район, ул. Нукусская, 3" : STORE_ADDRESS;
  const contacts = [
    { icon: MessageCircle, title: t.contact.telegramTitle, text: t.contact.telegramText, value: "@soft_shoes_uz", href: TELEGRAM_LINK, external: true },
    { icon: Phone, title: t.contact.phoneTitle, text: t.contact.phoneText, value: PHONE_NUMBER, href: PHONE_HREF, external: false },
    { icon: MapPin, title: t.contact.addressTitle, text: t.contact.addressText, value: address, href: MAPS_LINK, external: true },
    { icon: Clock3, title: t.contact.hoursTitle, text: lang === "ru" ? "Ежедневно" : "Har kuni", value: t.contact.hoursText, href: MAPS_LINK, external: true },
  ];

  return (
    <div>
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-gold">{t.contact.eyebrow}</p>
          <h1 className="mt-4 text-balance font-display text-5xl font-semibold sm:text-6xl">{t.contact.title}</h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/60 sm:text-base">{t.contact.subtitle}</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {contacts.map(({ icon: Icon, title, text, value, href, external }) => (
            <a key={title} href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} className="group rounded-[1.35rem] border border-ink/10 bg-white p-5 shadow-card transition hover:-translate-y-1 hover:border-gold/40">
              <div className="flex items-center justify-between"><span className="grid size-11 place-items-center rounded-2xl bg-[#ebe7dd] text-olive"><Icon size={19} /></span><ArrowUpRight size={16} className="text-muted transition group-hover:text-gold" /></div>
              <p className="mt-5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-gold">{title}</p>
              <p className="mt-2 text-sm font-extrabold leading-6 text-ink">{value}</p>
              <p className="mt-1 text-xs leading-5 text-muted">{text}</p>
            </a>
          ))}
        </div>
        <div className="mt-8 overflow-hidden rounded-[2rem] border border-ink/10 bg-[#e7e2d8] shadow-card">
          <iframe title={t.contact.mapTitle} src={MAPS_EMBED} className="h-[420px] w-full border-0 grayscale-[25%] sm:h-[520px]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-6 rounded-[1.5rem] bg-[#d8dfd0] p-7 sm:flex-row sm:items-center sm:p-10">
          <div><p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-olive">Telegram</p><h2 className="mt-2 font-display text-3xl font-semibold text-ink">{t.contact.ctaTitle}</h2></div>
          <a href={TELEGRAM_LINK} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-white transition hover:bg-olive"><MessageCircle size={17} /> {t.nav.order} <ArrowUpRight size={16} /></a>
        </div>
      </section>
    </div>
  );
}

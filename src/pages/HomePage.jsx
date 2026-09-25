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

export default function HomePage() {
  const { lang } = useLanguage();
  const t = lang === "ru" ? translations.ru : translations.uz;
  const { products } = useProducts();
  const featured = products.filter((product) => product.featured).slice(0, 4);
  const displayProducts = featured.length ? featured : products.slice(0, 4);
  const hero = products[0];
  const categoryCards = [
    {
      title: lang === "ru" ? "Мужская коллекция" : "Erkaklar kolleksiyasi",
      caption: lang === "ru" ? "Классика и комфорт" : "Klassik va qulaylik",
      image: products[1]?.image || products[0]?.image,
      to: "/products?category=Erkaklar",
    },
    {
      title: lang === "ru" ? "Женская коллекция" : "Ayollar kolleksiyasi",
      caption: lang === "ru" ? "Нежные образы" : "Nafis va yumshoq",
      image: products[2]?.image || products[0]?.image,
      to: "/products?category=Ayollar",
    },
    {
      title: lang === "ru" ? "Unisex" : "Unisex kollektsiya",
      caption: lang === "ru" ? "Свобода стиля" : "Stil chegarasi yo'q",
      image: products[4]?.image || products[0]?.image,
      to: "/products?category=Unisex",
    },
  ];
  const benefits = [
    { icon: Sparkles, title: t.home.benefit1Title, text: t.home.benefit1Text },
    { icon: ShieldCheck, title: t.home.benefit2Title, text: t.home.benefit2Text },
    { icon: MessageCircle, title: t.home.benefit3Title, text: t.home.benefit3Text },
  ];
  const storyPoints = [t.home.storyPoint1, t.home.storyPoint2, t.home.storyPoint3];

  return (
    <div>
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12 lg:px-8 lg:pb-24 lg:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-olive">
              <span className="size-1.5 rounded-full bg-gold" />
              {t.home.eyebrow}
            </div>
            <h1 className="mt-7 text-balance font-display text-5xl font-semibold leading-[0.98] tracking-[-0.03em] text-ink sm:text-6xl lg:text-7xl">
              {t.home.title} <em className="text-gold">{t.home.titleAccent}</em>
            </h1>
            <p className="mt-7 max-w-md text-base leading-8 text-muted sm:text-lg">{t.home.subtitle}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/products"
                className="inline-flex h-14 items-center justify-center gap-3 rounded-full bg-ink px-6 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-olive"
              >
                {t.home.primary}
                <ArrowRight size={17} />
              </Link>
              <a
                href={TELEGRAM_LINK}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-ink/15 bg-white px-6 text-sm font-bold text-ink transition hover:-translate-y-0.5 hover:border-ink/30"
              >
                <MessageCircle size={17} />
                {t.home.secondary}
              </a>
            </div>
            <div className="mt-12 grid max-w-md grid-cols-3 gap-5 border-t border-ink/10 pt-6">
              {[
                ["5+", lang === "ru" ? "моделей" : "model"],
                ["2", lang === "ru" ? "языка" : "til"],
                ["Telegram", lang === "ru" ? "заказ" : "buyurtma"],
              ].map(([value, label]) => (
                <div key={label}>
                  <p className="font-display text-2xl font-semibold text-ink">{value}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[620px] lg:mx-0 lg:ml-auto">
            <div className="absolute -right-5 -top-5 size-28 rounded-full bg-gold/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] bg-[#dfdbd0] shadow-soft">
              <div className="aspect-[0.92] overflow-hidden">
                {hero ? (
                  <img src={hero.image} alt={hero.nameUz} className="size-full object-cover" />
                ) : (
                  <div className="grid size-full place-items-center text-sm text-muted">Soft Shoes</div>
                )}
              </div>
              <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 rounded-2xl border border-white/20 bg-ink/80 p-4 text-white backdrop-blur-md sm:inset-x-6 sm:bottom-6 sm:p-5">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-gold">{t.home.floatingLabel}</p>
                  <p className="mt-1 font-display text-xl font-semibold">{t.home.floatingTitle}</p>
                </div>
                <Link to="/products" className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-ink transition hover:bg-gold hover:text-white">
                  <ArrowUpRight size={18} />
                </Link>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-4 hidden rounded-2xl border border-ink/10 bg-white px-4 py-3 shadow-card sm:block">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-full bg-[#e8f0e7] text-olive"><Check size={17} /></span>
                <div>
                  <p className="text-xs font-extrabold text-ink">100% comfort</p>
                  <p className="text-[10px] text-muted">{lang === "ru" ? "для каждого дня" : "har kuni uchun"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-y border-ink/10 bg-white py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 text-[10px] font-extrabold uppercase tracking-[0.2em] text-muted sm:justify-between sm:px-6 lg:px-8">
          <span>Soft-soled comfort</span>
          <span className="text-gold">✦</span>
          <span>Everyday elegance</span>
          <span className="text-gold">✦</span>
          <span>Telegram ordering</span>
          <span className="text-gold">✦</span>
          <span>Made for your steps</span>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading eyebrow={t.home.categoriesEyebrow} title={t.home.categoriesTitle} subtitle={t.home.categoriesSubtitle} />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {categoryCards.map((category) => (
            <Link key={category.to} to={category.to} className="group relative overflow-hidden rounded-[1.5rem] bg-[#dfdbd0]">
              <div className="aspect-[0.92] overflow-hidden">
                {category.image ? <img src={category.image} alt="" loading="lazy" className="size-full object-cover transition duration-700 group-hover:scale-105" /> : null}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3 text-white">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/65">{category.caption}</p>
                  <h3 className="mt-1 font-display text-2xl font-semibold">{category.title}</h3>
                </div>
                <span className="grid size-10 place-items-center rounded-full bg-white text-ink transition group-hover:bg-gold group-hover:text-white"><ArrowUpRight size={17} /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#ebe7dd] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
            <SectionHeading eyebrow={t.home.featuredEyebrow} title={t.home.featuredTitle} subtitle={t.home.featuredSubtitle} />
            <Link to="/products" className="inline-flex shrink-0 items-center gap-2 text-sm font-extrabold text-ink transition hover:text-gold">
              {t.common.viewAll} <ArrowRight size={17} />
            </Link>
          </div>
          <div className="mt-10 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {displayProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="relative mx-auto w-full max-w-md lg:mx-0">
            <div className="aspect-[0.86] overflow-hidden rounded-[2rem] bg-[#dedbd1]">
              {products[3] ? <img src={products[3].image} alt={t.home.storyEyebrow} loading="lazy" className="size-full object-cover" /> : null}
            </div>
            <div className="absolute -bottom-5 -right-4 grid size-28 place-items-center rounded-full border border-ink/10 bg-white text-center shadow-soft sm:-right-7">
              <span className="font-display text-3xl font-semibold text-gold">01</span>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-gold">{t.home.storyEyebrow}</p>
            <h2 className="mt-3 max-w-xl text-balance font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">{t.home.storyTitle}</h2>
            <p className="mt-6 max-w-xl text-sm leading-8 text-muted sm:text-base">{t.home.storyText}</p>
            <ul className="mt-8 space-y-4">
              {storyPoints.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm font-semibold text-ink">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-olive text-white"><Check size={12} /></span>
                  {point}
                </li>
              ))}
            </ul>
            <Link to="/about" className="mt-9 inline-flex items-center gap-2 text-sm font-extrabold text-ink transition hover:text-gold">
              {t.about.eyebrow} <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-ink py-16 text-white lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow={t.home.benefitsEyebrow} title={t.home.benefitsTitle} />
          <div className="mt-10 grid gap-px overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/10 md:grid-cols-3">
            {benefits.map(({ icon: Icon, title, text }) => (
              <div key={title} className="bg-ink p-7 sm:p-9">
                <span className="grid size-12 place-items-center rounded-2xl bg-gold/15 text-gold"><Icon size={22} /></span>
                <h3 className="mt-6 text-lg font-extrabold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/55">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid overflow-hidden rounded-[2rem] bg-[#ded8cc] lg:grid-cols-[1fr_0.8fr]">
          <div className="relative min-h-[320px] overflow-hidden lg:min-h-[440px]">
            {products[4] ? <img src={products[4].image} alt={t.home.storeEyebrow} loading="lazy" className="absolute inset-0 size-full object-cover" /> : null}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/45 to-transparent" />
            <div className="absolute bottom-6 left-6 flex items-center gap-2 text-xs font-bold text-white"><MapPin size={16} /> {lang === "ru" ? "Ташкент" : "Toshkent"}</div>
          </div>
          <div className="flex flex-col justify-center p-7 sm:p-12 lg:p-16">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-gold">{t.home.storeEyebrow}</p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">{t.home.storeTitle}</h2>
            <p className="mt-5 text-sm leading-7 text-muted sm:text-base">{t.home.storeText}</p>
            <a href={MAPS_LINK} target="_blank" rel="noreferrer" className="mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-white transition hover:bg-olive">
              {t.home.storeButton} <ArrowUpRight size={17} />
            </a>
          </div>
        </div>
      </section>

      <section className="bg-[#d8dfd0] py-14 lg:py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-olive">{t.home.telegramEyebrow}</p>
            <h2 className="mt-3 max-w-2xl text-balance font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">{t.home.telegramTitle}</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-muted">{t.home.telegramText}</p>
          </div>
          <a href={TELEGRAM_LINK} className="inline-flex shrink-0 items-center gap-3 rounded-full bg-ink px-6 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-olive">
            <MessageCircle size={18} /> {t.nav.order} <ArrowUpRight size={16} />
          </a>
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
      telegramText: "Saytdagi har bir mahsulotdagi buyurtma tugmasi sizni Soft Shoes Telegram guruhiga olib boradi.",
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
      storyText: "Мы выбираем каждую модель для долгой носки, мягких ощущений и реальной повседневной жизни. Продуманные детали и простой дизайн обновляют образ каждый день.",
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

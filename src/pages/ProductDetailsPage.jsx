import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, MessageCircle, PackageCheck, Ruler, ShieldCheck } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { formatPrice } from "../data/productUtils";
import { useProducts } from "../context/useProducts";
import { TELEGRAM_LINK } from "../data/config";
import ProductCard from "../components/ProductCard";

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const { lang } = useLanguage();
  const t = lang === "ru" ? copy.ru : copy.uz;
  const { products } = useProducts();
  const product = products.find((item) => String(item.id) === String(productId));

  if (!product) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-24 text-center">
        <span className="text-6xl font-display text-gold">404</span>
        <h1 className="mt-5 font-display text-3xl font-semibold text-ink">{t.notFound}</h1>
        <Link to="/products" className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white">
          <ArrowLeft size={16} /> {t.breadcrumb}
        </Link>
      </section>
    );
  }

  const name = product.name || (lang === "ru" ? product.nameRu : product.nameUz);
  const description = lang === "ru" ? product.descriptionRu : product.descriptionUz;
  const isAvailable = product.stock == null || product.stock > 0;
  const related = products.filter((item) => item.id !== product.id).slice(0, 3);

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs font-semibold text-muted" aria-label="Breadcrumb">
          <Link to="/" className="transition hover:text-ink">{lang === "ru" ? "Главная" : "Bosh sahifa"}</Link>
          <span>/</span>
          <Link to="/products" className="transition hover:text-ink">{t.breadcrumb}</Link>
          <span>/</span>
          <span className="truncate text-ink">{name}</span>
        </nav>
      </div>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:px-8 lg:py-16">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#e9e5dc]">
          <div className="aspect-[0.9] overflow-hidden">
            <img src={product.image_url} alt={name} className="size-full object-cover" />
          </div>
          {product.badge && <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-ink">{product.badge === "sale" ? t.common.sale : t.common[product.badge]}</span>}
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-gold">{product.category}</p>
          <h1 className="mt-3 text-balance font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">{name}</h1>
          <div className="mt-6 flex flex-wrap items-end gap-3">
            <span className="text-2xl font-extrabold text-ink">{formatPrice(product.price)} <span className="text-sm font-semibold text-muted">so'm</span></span>
            {product.oldPrice && <span className="text-sm text-muted line-through">{formatPrice(product.oldPrice)} so'm</span>}
          </div>
          <p className="mt-6 max-w-lg text-sm leading-8 text-muted sm:text-base">{description}</p>
          <div className="mt-8 border-y border-ink/10 py-5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-bold text-ink">{t.availability}</span>
              <span className={`inline-flex items-center gap-2 text-xs font-bold ${isAvailable ? "text-olive" : "text-rose-600"}`}>
                <span className={`size-2 rounded-full ${isAvailable ? "bg-olive" : "bg-rose-500"}`} />
                {isAvailable ? t.inStock : t.outOfStock}
              </span>
            </div>
            <div className="mt-5 flex items-center justify-between gap-4">
              <span className="text-sm font-bold text-ink">{t.sizes}</span>
              <div className="flex flex-wrap justify-end gap-2">
                {product.sizes?.map((size) => <span key={size} className="grid min-w-9 place-items-center rounded-lg border border-ink/10 bg-white px-2 py-1.5 text-xs font-bold text-ink">{size}</span>)}
              </div>
            </div>
          </div>
          <a href={TELEGRAM_LINK} className="mt-8 inline-flex h-14 items-center justify-center gap-3 rounded-full bg-ink px-6 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-olive">
            <MessageCircle size={19} /> {t.orderHint}
            <ArrowRight size={17} />
          </a>
          <p className="mt-3 text-center text-xs text-muted">{t.orderText}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <div className="flex gap-3 rounded-2xl bg-white p-4"><PackageCheck size={18} className="shrink-0 text-gold" /><div><p className="text-xs font-extrabold text-ink">{t.delivery}</p><p className="mt-1 text-[11px] leading-5 text-muted">{t.deliveryText}</p></div></div>
            <div className="flex gap-3 rounded-2xl bg-white p-4"><Ruler size={18} className="shrink-0 text-gold" /><div><p className="text-xs font-extrabold text-ink">{t.sizes}</p><p className="mt-1 text-[11px] leading-5 text-muted">{t.helpText}</p></div></div>
            <div className="flex gap-3 rounded-2xl bg-white p-4"><ShieldCheck size={18} className="shrink-0 text-gold" /><div><p className="text-xs font-extrabold text-ink">{t.help}</p><p className="mt-1 text-[11px] leading-5 text-muted">{t.helpText}</p></div></div>
          </div>
        </div>
      </section>
      <section className="border-t border-ink/10 bg-[#ebe7dd] py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-5">
            <div><p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-gold">{t.breadcrumb}</p><h2 className="mt-2 font-display text-3xl font-semibold text-ink">{lang === "ru" ? "Вам понравится" : "Sizga yoqishi mumkin"}</h2></div>
            <Link to="/products" className="hidden items-center gap-2 text-sm font-bold text-ink transition hover:text-gold sm:flex">{t.common.viewAll} <ArrowRight size={16} /></Link>
          </div>
          <div className="mt-8 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div>
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
    common: { sale: "Aksiya", new: "Yangi", bestseller: "Eng ko'p sotilgan", limited: "Cheklangan", viewAll: "Barchasini ko'rish" },
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
    common: { sale: "Скидка", new: "Новинка", bestseller: "Хит продаж", limited: "Лимитированная", viewAll: "Смотреть все" },
  },
};

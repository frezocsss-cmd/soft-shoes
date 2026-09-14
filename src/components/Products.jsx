import { useLanguage } from "../context/LanguageContext";
import { translations } from "../data/translations";
import { products } from "../data/products";
import Reveal from "./Reveal";
import ProductCard from "./ProductCard";

function Products() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <section id="collection" className="collection">
      <Reveal className="section__head">
        <span className="section__eyebrow">{t.products.eyebrow}</span>
        <h2 className="section__title">
          {t.products.title1} <em>{t.products.title2}</em>
        </h2>
        <p className="section__subtitle">{t.products.subtitle}</p>
      </Reveal>

      <div className="collection__grid">
        {products.map((p, i) => (
          <Reveal key={p.id} delay={(i % 3) * 90}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default Products;
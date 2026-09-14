import { Heart } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../data/translations";

function ProductCard({ product }) {
  const { lang } = useLanguage();
  const t = translations[lang];

  const name = lang === "uz" ? product.nameUz : product.nameRu;
  const description = lang === "uz" ? product.descriptionUz : product.descriptionRu;

  return (
    <article className="product-card">
      <span className={`product-card__tag product-card__tag--${product.tag}`}>
        {t.products.tags[product.tag]}
      </span>
      <button className="product-card__fav" aria-label="Избранное">
        <Heart size={18} />
      </button>

      <div className="product-card__media">
        <img src={product.image} alt={name} className="product-card__img" />
      </div>

      <div className="product-card__body">
        <div className="product-card__info">
          <h3 className="product-card__name">{name}</h3>
          <p className="product-card__desc">{description}</p>
          <div className="product-card__price-row">
            <span className="product-card__price">{product.price} so'm</span>
            {product.oldPrice && (
              <span className="product-card__old">{product.oldPrice} so'm</span>
            )}
          </div>
        </div>
        <a href="#contact" className="product-card__btn">
          {t.products.view}
        </a>
      </div>
    </article>
  );
}

export default ProductCard;
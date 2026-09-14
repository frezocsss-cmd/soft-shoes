import { useLanguage } from "../context/LanguageContext";
import { translations } from "../data/translations";
import { partners } from "../data/partners";
import InstagramIcon from "./InstagramIcon";
import Reveal from "./Reveal";

function Partners() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <section id="partners" className="features">
      <Reveal className="section__head">
        <span className="section__eyebrow">{t.partners.eyebrow}</span>
        <h2 className="section__title">
          {t.partners.title1} <em>{t.partners.title2}</em>
        </h2>
        <p className="section__subtitle">{t.partners.subtitle}</p>
      </Reveal>

      <div className="partners__grid">
        {partners.map((p) => {
          const name = lang === "uz" ? p.nameUz : p.nameRu;
          const desc = lang === "uz" ? p.descriptionUz : p.descriptionRu;

          return (
            <Reveal key={p.id}>
              <article className="partner-card">
                <div className="partner-card__logo-area">
                  <img
                    src={p.logo}
                    alt={`${name} logo`}
                    className="partner-card__logo"
                  />
                </div>

                <div className="partner-card__info">
                  <h3 className="partner-card__name">{name}</h3>
                  <p className="partner-card__desc">{desc}</p>

                  <div className="partner-card__instagram">
                    <InstagramIcon size={14} />
                    <span>@{p.instagramUsername}</span>
                  </div>

                  <a
                    href={p.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="partner-card__cta"
                  >
                    {t.partners.igLabel} <InstagramIcon size={15} />
                  </a>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

export default Partners;
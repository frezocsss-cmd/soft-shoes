import { MapPin, ExternalLink } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../data/translations";
import { MAPS_LINK, MAPS_EMBED } from "../data/config";
import Reveal from "./Reveal";

function Location() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <section id="location" className="contact">
      <Reveal className="section__head">
        <span className="section__eyebrow">{t.location.eyebrow}</span>
        <h2 className="section__title">
          {t.location.title1} <em>{t.location.title2}</em>
        </h2>
        <p className="section__subtitle">{t.location.subtitle}</p>
      </Reveal>

      <Reveal>
        <div className="contact__card glass location-card">
          <div className="location-card__head">
            <div className="cta-card__icon">
              <MapPin size={22} />
            </div>
            <p className="location-card__address">{t.footer.address}</p>
          </div>

          <div className="map-frame">
            <iframe
              title="Soft Shoes map"
              src={MAPS_EMBED}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          <a href={MAPS_LINK} target="_blank" rel="noreferrer" className="btn btn--ghost">
            <ExternalLink size={18} /> {t.location.btn}
          </a>
        </div>
      </Reveal>
    </section>
  );
}

export default Location;
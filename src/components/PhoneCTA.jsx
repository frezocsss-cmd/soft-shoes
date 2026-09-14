import { Phone } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../data/translations";
import { PHONE_NUMBER, PHONE_HREF } from "../data/config";
import Reveal from "./Reveal";

function PhoneCTA() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <section id="phone" className="contact">
      <Reveal>
        <div className="contact__card glass cta-card">
          <div className="cta-card__icon">
            <Phone size={26} />
          </div>
          <h2 className="cta-card__title">{t.phoneCta.title}</h2>
          <p className="cta-card__text">{t.phoneCta.text}</p>

          <span className="cta-card__number">{PHONE_NUMBER}</span>

          <a href={PHONE_HREF} className="btn btn--gold">
            <Phone size={18} /> {t.phoneCta.btn}
          </a>
        </div>
      </Reveal>
    </section>
  );
}

export default PhoneCTA;
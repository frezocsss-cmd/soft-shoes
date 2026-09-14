import { Send } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../data/translations";
import { TELEGRAM_LINK } from "../data/config";
import Reveal from "./Reveal";

function TelegramCTA() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <section id="telegram" className="contact">
      <Reveal>
        <div className="contact__card glass cta-card">
          <div className="cta-card__icon cta-card__icon--telegram">
            <Send size={26} />
          </div>
          <h2 className="cta-card__title">{t.telegramCta.title}</h2>
          <p className="cta-card__text">{t.telegramCta.text}</p>
          <a
            href={TELEGRAM_LINK}
            target="_blank"
            rel="noreferrer"
            className="btn btn--telegram"
          >
            <Send size={18} /> {t.telegramCta.btn}
          </a>
        </div>
      </Reveal>
    </section>
  );
}

export default TelegramCTA;
import { useLanguage } from "../context/LanguageContext";

export default function LanguageToggle({ inverted = false }) {
  const { lang, setLang } = useLanguage();

  return (
    <div
      className={`relative inline-flex rounded-full border p-1 transition-all duration-500 ${
        inverted ? "border-white/15 bg-white/5" : "border-ink/10 bg-white"
      }`}
      aria-label="Tilni tanlash"
    >
      {[
        { code: "uz", label: "UZ" },
        { code: "ru", label: "RU" },
      ].map((item) => {
        const active = lang === item.code;
        return (
          <button
            key={item.code}
            type="button"
            onClick={() => setLang(item.code)}
            className={`relative z-10 rounded-full px-3 py-1 text-xs font-bold transition-colors duration-400 ${
              active
                ? inverted
                  ? "text-ink"
                  : "text-white"
                : inverted
                  ? "text-white/60 hover:text-white"
                  : "text-muted hover:text-ink"
            }`}
          >
            {active && (
              <span
                className={`absolute inset-0 -z-10 animate-pop rounded-full ${
                  inverted ? "bg-white" : "bg-ink"
                }`}
              />
            )}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

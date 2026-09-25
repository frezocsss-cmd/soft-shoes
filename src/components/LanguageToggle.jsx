import { useLanguage } from "../context/LanguageContext";

export default function LanguageToggle({ inverted = false }) {
  const { lang, setLang } = useLanguage();

  return (
    <div
      className={`inline-flex rounded-full border p-1 ${
        inverted ? "border-white/15 bg-white/5" : "border-ink/10 bg-white"
      }`}
      aria-label="Tilni tanlash"
    >
      {[
        { code: "uz", label: "UZ" },
        { code: "ru", label: "RU" },
      ].map((item) => (
        <button
          key={item.code}
          type="button"
          onClick={() => setLang(item.code)}
          className={`rounded-full px-3 py-1 text-xs font-bold transition ${
            lang === item.code
              ? inverted
                ? "bg-white text-ink"
                : "bg-ink text-white"
              : inverted
                ? "text-white/60 hover:text-white"
                : "text-muted hover:text-ink"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

import { useLanguage } from "../context/LanguageContext";

const OPTIONS = [
  { code: "uz", label: "UZ" },
  { code: "ru", label: "RU" },
];

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div
      className="inline-flex items-center gap-0.5 rounded-full border border-line bg-white p-0.5"
      role="group"
      aria-label="Tilni tanlash"
    >
      {OPTIONS.map((item) => {
        const active = lang === item.code;
        return (
          <button
            key={item.code}
            type="button"
            onClick={() => setLang(item.code)}
            aria-pressed={active}
            className={`min-w-10 rounded-full px-3 py-2 text-[11px] font-extrabold transition-colors duration-200 ${
              active ? "bg-ink text-white" : "text-muted hover:text-ink"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

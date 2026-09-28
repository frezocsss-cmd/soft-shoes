import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { TELEGRAM_LINK } from "../data/config";

export default function FloatingTelegram() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 260);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={TELEGRAM_LINK}
      aria-label="Telegram orqali bog'lanish"
      className={`group fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-[#229ED9] text-white shadow-[0_10px_30px_rgba(34,158,217,0.35)] transition-all duration-500 hover:-translate-y-1 hover:bg-[#1b8ac0] sm:bottom-7 sm:right-7 ${
        visible ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-6 scale-75 opacity-0"
      }`}
    >
      <span className="absolute inset-0 animate-pulse-ring rounded-full bg-[#229ED9]/50" aria-hidden="true" />
      <span
        className="absolute inset-0 rounded-full ring-1 ring-white/40 opacity-0 transition-all duration-700 group-hover:scale-150 group-hover:opacity-0"
        aria-hidden="true"
      />
      <Send size={22} className="relative transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full bg-ink px-4 py-2 text-xs font-bold text-white opacity-0 transition-all duration-500 group-hover:-translate-x-1 group-hover:opacity-100 sm:block">
        Telegram
      </span>
    </a>
  );
}

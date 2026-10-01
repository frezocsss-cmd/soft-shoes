import { useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { TELEGRAM_LINK } from "../data/config";
import { subscribeScroll } from "../lib/scrollEngine";

export default function FloatingTelegram() {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    let visible = false;

    return subscribeScroll(({ y }) => {
      const next = y > 260;
      if (next === visible) return;
      visible = next;
      node.dataset.visible = String(next);
    });
  }, []);

  return (
    <a
      ref={ref}
      href={TELEGRAM_LINK}
      aria-label="Telegram orqali bog'lanish"
      data-visible="false"
      className="floating-tg group fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-[#229ED9] text-white shadow-[0_10px_30px_rgba(34,158,217,0.35)] transition-all duration-500 hover:-translate-y-1 hover:bg-[#1b8ac0] sm:bottom-7 sm:right-7"
    >
      <span className="absolute inset-0 animate-pulse-ring rounded-full bg-[#229ED9]/50" aria-hidden="true" />
      <span
        className="absolute inset-0 rounded-full ring-1 ring-white/40 opacity-0 transition-all duration-700 group-hover:scale-150 group-hover:opacity-0"
        aria-hidden="true"
      />
      <Send size={22} className="relative transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full bg-ink px-4 py-2 text-xs font-bold text-white opacity-0 transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-100 sm:block">
        Telegram
      </span>
    </a>
  );
}

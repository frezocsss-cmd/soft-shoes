import { useEffect, useRef } from "react";
import { ArrowUp, Send } from "lucide-react";
import { TELEGRAM_LINK } from "../data/config";

/**
 * Bitta komponentda ikki taqdimot: Telegram va "yuqoriga".
 * Bitta rAF-throttle scroll tinglovchisi — render va JS minimal.
 */
export default function FloatingActions() {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    let visible = false;
    let ticking = false;

    const update = () => {
      ticking = false;
      const next = window.scrollY > 420;
      if (next === visible) return;
      visible = next;
      node.dataset.visible = String(next);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollUp = () => {
    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <div ref={ref} className="float-actions" data-visible="false">
      <a
        href={TELEGRAM_LINK}
        className="float-btn float-btn-tg"
        aria-label="Telegram orqali buyurtma berish"
      >
        <Send size={19} />
      </a>
      <button type="button" onClick={scrollUp} className="float-btn float-btn-top" aria-label="Yuqoriga qaytish">
        <ArrowUp size={18} />
      </button>
    </div>
  );
}

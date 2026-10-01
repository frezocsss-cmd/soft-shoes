import { useEffect, useRef } from "react";
import { ArrowUp } from "lucide-react";
import { subscribeScroll } from "../../lib/scrollEngine";

export default function BackToTop() {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    let visible = false;

    return subscribeScroll(({ y }) => {
      const next = y > window.innerHeight * 0.8;
      if (next === visible) return;
      visible = next;
      node.dataset.visible = String(next);
    });
  }, []);

  return (
    <button
      ref={ref}
      type="button"
      data-visible="false"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Yuqoriga"
      className="back-to-top group fixed bottom-6 left-5 z-40 grid size-12 place-items-center overflow-hidden rounded-full border border-ink/10 bg-white/90 text-ink shadow-card transition-all duration-500 hover:-translate-y-1 hover:border-gold hover:text-gold sm:bottom-7 sm:left-7 sm:size-14"
    >
      <span className="absolute inset-0 -z-10 rounded-full bg-gold/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <span className="absolute inset-0 -z-10 rounded-full ring-1 ring-gold/40 opacity-0 transition-all duration-700 group-hover:scale-150 group-hover:opacity-0" />
      <ArrowUp size={20} className="transition-transform duration-500 group-hover:-translate-y-0.5" />
    </button>
  );
}

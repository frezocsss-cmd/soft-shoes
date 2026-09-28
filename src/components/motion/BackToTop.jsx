import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const compute = () => {
      frame = 0;
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Yuqoriga"
      className={`group fixed bottom-6 left-5 z-40 grid size-12 place-items-center overflow-hidden rounded-full border border-ink/10 bg-white/85 text-ink shadow-card backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-gold hover:text-gold sm:bottom-7 sm:left-7 sm:size-14 ${
        visible ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-5 scale-75 opacity-0"
      }`}
    >
      <span className="absolute inset-0 -z-10 rounded-full bg-gold/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <span className="absolute inset-0 -z-10 rounded-full ring-1 ring-gold/40 opacity-0 transition-all duration-700 group-hover:scale-150 group-hover:opacity-0" />
      <ArrowUp size={20} className="transition-transform duration-500 group-hover:-translate-y-0.5" />
    </button>
  );
}

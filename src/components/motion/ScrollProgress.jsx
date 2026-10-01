import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../../hooks/useInView";
import { subscribeScroll } from "../../lib/scrollEngine";

/**
 * Yuqoridagi scroll progress chizig'i.
 *
 * Eski versiya har kadrda `setState` qilardi (progress + velocity),
 * ya'ni 60 fps da React render. Endi to'g'ridan-to'g'ri DOM'ga
 * `transform` yoziladi — render umuman bo'lmaydi.
 */
export default function ScrollProgress({ className = "" }) {
  const barRef = useRef(null);
  const dotRef = useRef(null);
  const wrapRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;
    const bar = barRef.current;
    const dot = dotRef.current;
    const wrap = wrapRef.current;
    if (!bar || !dot || !wrap) return undefined;

    let lastProgress = -1;
    let lastSpeed = -1;

    return subscribeScroll(({ progress, velocity }) => {
      if (Math.abs(progress - lastProgress) > 0.001) {
        lastProgress = progress;
        const speed = Math.min(1, Math.abs(velocity));
        bar.style.transform = `scaleX(${progress}) skewX(${(velocity * -9).toFixed(2)}deg)`;
        bar.style.boxShadow = `0 0 ${(12 + speed * 22).toFixed(0)}px rgba(181,138,69,${(0.55 + speed * 0.4).toFixed(2)})`;
        dot.style.left = `${(progress * 100).toFixed(2)}%`;
        dot.style.opacity = progress > 0.01 ? "0.9" : "0";
        dot.style.transform = `translate(-50%, -50%) scale(${(1 + speed * 1.6).toFixed(2)})`;
      }
      if (Math.abs(Math.abs(velocity) - lastSpeed) > 0.01) {
        lastSpeed = Math.abs(velocity);
        wrap.style.height = `${(3 + Math.min(1, Math.abs(velocity)) * 5).toFixed(1)}px`;
      }
    });
  }, [reduced]);

  return (
    <div
      ref={wrapRef}
      className={`pointer-events-none fixed inset-x-0 top-0 z-[60] ${className}`}
      style={{ height: reduced ? 3 : undefined }}
      aria-hidden="true"
    >
      <div
        ref={barRef}
        className="h-full origin-left rounded-r-full bg-gradient-to-r from-gold via-gold-soft to-olive will-change-transform"
        style={{ transform: "scaleX(0)" }}
      />
      <div
        ref={dotRef}
        className="absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-gold-soft"
        style={{ left: "0%", opacity: 0 }}
      />
    </div>
  );
}

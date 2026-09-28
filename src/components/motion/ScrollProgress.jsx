import { useEffect, useState } from "react";
import { useScrollVelocity } from "../../hooks/useScrollMotion";
import { usePrefersReducedMotion } from "../../hooks/useInView";

/**
 * Yuqoridagi scroll progress chizig'i. Tezlikka qarab yorqinligi
 * va balandligi o'zgaradi (skew effekt).
 */
export default function ScrollProgress({ className = "" }) {
  const [progress, setProgress] = useState(0);
  const velocity = useScrollVelocity();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    let frame = 0;
    const compute = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const speed = reduced ? 0 : Math.min(1, Math.abs(velocity));
  const height = 3 + speed * 5;
  const skew = reduced ? 0 : velocity * -9;

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 top-0 z-[60] ${className}`}
      style={{ height: `${height}px` }}
      aria-hidden="true"
    >
      <div
        className="h-full origin-left rounded-r-full bg-gradient-to-r from-gold via-gold-soft to-olive will-change-transform"
        style={{
          transform: `scaleX(${progress}) skewX(${skew}deg)`,
          boxShadow: `0 0 ${12 + speed * 22}px rgba(181,138,69,${0.55 + speed * 0.4})`,
        }}
      />
      {/* tezlik indikator nuqtasi */}
      <div
        className="absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-gold-soft"
        style={{
          left: `${progress * 100}%`,
          opacity: progress > 0.01 ? 0.9 : 0,
          transform: `translate(-50%, -50%) scale(${1 + speed * 1.6})`,
        }}
      />
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { useFinePointer, usePrefersReducedMotion } from "../../hooks/useInView";

/**
 * Sticky gorizontal rail: vertikal scroll boshqarilganda ichki track
 * gorizontal siljiydi. Touch qurilmalarda native swipe + scroll-snap
 * ishlatiladi (JS transform o'chiriladi).
 */
export default function StickyRail({
  children,
  className = "",
  railLabel,
}) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [shift, setShift] = useState(0);
  const [maxShift, setMaxShift] = useState(0);
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const native = !fine || reduced;

  useEffect(() => {
    if (native) return undefined;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return undefined;

    let frame = 0;
    let last = -1;

    const compute = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const trackWidth = track.scrollWidth;
      const viewWidth = window.innerWidth;
      const distance = Math.max(0, trackWidth - viewWidth);

      setMaxShift(distance);

      /* section track uzunligiga qarab balandlashadi — aks holda
         scroll qilinadigan oraliq bo'lmaydi va rail qimirmaydi */
      const need = distance + window.innerHeight * 0.25;
      const wanted = `${Math.round(window.innerHeight + need)}px`;
      if (section.style.height !== wanted) section.style.height = wanted;

      const scrollable = Math.max(0, rect.height - window.innerHeight);
      const progress = scrollable > 0 ? Math.max(0, Math.min(1, -rect.top / scrollable)) : 0;
      const next = progress * distance;

      if (Math.abs(next - last) < 0.5) return;
      last = next;
      setShift(next);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [native]);

  if (native) {
    return (
      <div
        className={`-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 ${className}`}
        style={{ scrollbarWidth: "none" }}
      >
        {children}
      </div>
    );
  }

  return (
    <section ref={sectionRef} className={`relative ${className}`} aria-label={railLabel}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div
          ref={trackRef}
          className="sticky-rail-track will-change-transform px-5"
          style={{ transform: `translate3d(${-shift}px, 0, 0)` }}
        >
          {children}
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-10 left-1/2 z-10 w-40 -translate-x-1/2">
        <div className="h-px w-full bg-ink/12">
          <div
            className="h-px bg-gold transition-[width] duration-150"
            style={{ width: `${maxShift ? Math.min(100, (shift / maxShift) * 100) : 0}%` }}
          />
        </div>
      </div>
    </section>
  );
}

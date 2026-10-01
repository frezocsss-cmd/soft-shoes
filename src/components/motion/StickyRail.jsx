import { useEffect, useRef } from "react";
import { useFinePointer, usePrefersReducedMotion } from "../../hooks/useInView";
import { subscribeFrame } from "../../lib/scrollEngine";

/**
 * Sticky gorizontal rail: vertikal scroll boshqarilganda ichki track
 * gorizontal siljiydi. Touch qurilmalarda native swipe + scroll-snap
 * ishlatiladi (JS transform umuman ishlamaydi).
 */
export default function StickyRail({ children, className = "", railLabel }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const barRef = useRef(null);
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const native = !fine || reduced;

  useEffect(() => {
    if (native) return undefined;
    const section = sectionRef.current;
    const track = trackRef.current;
    const bar = barRef.current;
    if (!section || !track) return undefined;

    let pendingShift = 0;
    let lastShift = -1;
    let lastMax = -1;
    let appliedHeight = "";

    return subscribeFrame({
      /* o'qish */
      read: () => {
        const rect = section.getBoundingClientRect();
        const distance = Math.max(0, track.scrollWidth - window.innerWidth);

        if (distance !== lastMax) {
          lastMax = distance;
          const need = distance + window.innerHeight * 0.25;
          appliedHeight = `${Math.round(window.innerHeight + need)}px`;
        }

        const scrollable = Math.max(0, rect.height - window.innerHeight);
        const progress = scrollable > 0 ? Math.max(0, Math.min(1, -rect.top / scrollable)) : 0;
        pendingShift = progress * distance;
      },
      /* yozish */
      write: () => {
        if (appliedHeight && section.style.height !== appliedHeight) {
          section.style.height = appliedHeight;
        }
        const next = Math.round(pendingShift);
        if (Math.abs(next - lastShift) < 0.5) return;
        lastShift = next;
        track.style.transform = `translate3d(${-next}px, 0, 0)`;
        if (bar) bar.style.width = `${lastMax ? Math.min(100, (next / lastMax) * 100) : 0}%`;
      },
    });
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
        <div ref={trackRef} className="sticky-rail-track will-change-transform px-5">
          {children}
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-10 left-1/2 z-10 w-40 -translate-x-1/2">
        <div className="h-px w-full bg-ink/12">
          <div ref={barRef} className="h-px bg-gold" style={{ width: "0%" }} />
        </div>
      </div>
    </section>
  );
}

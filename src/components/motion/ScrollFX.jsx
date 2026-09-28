import { useEffect } from "react";
import { useScrollVelocity } from "../../hooks/useScrollMotion";
import { usePrefersReducedMotion } from "../../hooks/useInView";

/**
 * Global scroll effektlari boshqaruvchisi.
 *
 * 1) Scroll tezligini CSS var --velocity / --vel-y / --ring-speed ga yozadi
 *    (vel-skew, vel-lag, conic halqa tezligi shundan foydalanadi).
 * 2) Faqat ekranda ko'rinayotgan .conic-ring elementlarini aylantiradi —
 *    offscreen halqalar to'xtaydi, bu mobil'da GPU yukini kesadi.
 */
export default function ScrollFX() {
  const velocity = useScrollVelocity();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const root = document.documentElement;
    const v = reduced ? 0 : velocity;

    root.style.setProperty("--velocity", v.toFixed(4));
    root.style.setProperty("--vel-y", `${(v * -14).toFixed(2)}px`);
    root.style.setProperty("--ring-speed", `${(6 - Math.abs(v) * 2.4).toFixed(2)}s`);
  }, [velocity, reduced]);

  useEffect(() => {
    if (reduced) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      document.querySelectorAll(".conic-ring").forEach((n) => n.classList.add("ring-live"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("ring-live", entry.isIntersecting);
        });
      },
      { rootMargin: "120px 0px", threshold: 0.01 }
    );

    const scan = () => {
      observer.disconnect();
      document.querySelectorAll(".conic-ring").forEach((node) => observer.observe(node));
    };

    scan();
    /* yangi sahifaga o'tganda yangi kartalar topiladi */
    const timer = setInterval(scan, 1200);
    return () => {
      clearInterval(timer);
      observer.disconnect();
    };
  }, [reduced]);

  return null;
}

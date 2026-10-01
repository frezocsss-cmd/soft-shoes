import { useEffect } from "react";
import { usePrefersReducedMotion } from "../../hooks/useInView";
import { useScrollVelocityVar } from "../../hooks/useScrollMotion";

/**
 * Global scroll effektlari boshqaruvchisi.
 *
 * 1) Scroll tezligini CSS var --velocity / --vel-y ga yozadi
 *    (vel-skew, vel-lag shundan foydalanadi). Bitta markaziy
 *    scrollEngine loop'idan olinadi — qo'shimcha listener yo'q.
 * 2) Faqat ekranda ko'rinayotgan .conic-ring elementlarini aylantiradi.
 *    Yangi kartalar MutationObserver orqali topiladi (avval har
 *    1.2 soniyada butun DOM skan qilinardi).
 */
export default function ScrollFX() {
  const reduced = usePrefersReducedMotion();
  useScrollVelocityVar(typeof document === "undefined" ? null : document.documentElement);

  useEffect(() => {
    if (reduced) return undefined;
    if (typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("ring-live", entry.isIntersecting);
        });
      },
      { rootMargin: "120px 0px", threshold: 0.01 },
    );

    const scan = () => {
      document.querySelectorAll(".conic-ring:not([data-ring-seen])").forEach((node) => {
        node.dataset.ringSeen = "true";
        observer.observe(node);
      });
    };

    /* DOM tez-tez o'zgarganda (route o'tishi, kartochka qo'shish)
       skan har mutation'da emas, kadrga bittadan yig'ilib bajariladi. */
    let queued = 0;
    const schedule = () => {
      if (queued) return;
      queued = requestAnimationFrame(() => {
        queued = 0;
        scan();
      });
    };

    schedule();
    const mutations = new MutationObserver(schedule);
    mutations.observe(document.body, { childList: true, subtree: true });
    return () => {
      mutations.disconnect();
      observer.disconnect();
      if (queued) cancelAnimationFrame(queued);
    };
  }, [reduced]);

  return null;
}

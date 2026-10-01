import { useEffect, useRef, useState } from "react";

/**
 * Element ko'rinishga kirganda bir marta `true` qaytaradi.
 * IntersectionObserver yo'q muhitda `fallbackMs` dan keyin ham ishlaydi —
 * shunda kontent hech qachon ko'rinmasdan qolmaydi.
 */
export function useInView({ threshold = 0.15, rootMargin = "0px 0px -12% 0px", once = true, fallbackMs = 700 } = {}) {
  const supported = typeof IntersectionObserver !== "undefined";
  const ref = useRef(null);
  const [inView, setInView] = useState(!supported);

  useEffect(() => {
    if (inView) return undefined;
    const timer = setTimeout(() => setInView(true), fallbackMs);
    return () => clearTimeout(timer);
  }, [inView, fallbackMs]);

  useEffect(() => {
    const node = ref.current;
    if (!node || !supported) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setInView(false);
          }
        });
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once, supported]);

  return [ref, inView];
}

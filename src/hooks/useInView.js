import { useEffect, useRef, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia(QUERY).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const media = window.matchMedia(QUERY);
    const onChange = (event) => setReduced(event.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/** Aniq kursorli (mous) qurilma — render paytida aniqlanadi. */
export function useFinePointer() {
  const [fine, setFine] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const onChange = (event) => setFine(event.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return fine;
}

export function useInView({ threshold = 0.15, rootMargin = "0px 0px -12% 0px", once = true, fallbackMs = 900 } = {}) {
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

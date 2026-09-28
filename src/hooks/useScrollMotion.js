import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./useInView";

/**
 * Scroll tezligini (px/frame) kuzatib, -1..1 oraliqda smooth qiymat qaytaradi.
 * Boshqa komponentlar shu qiymatni CSS var --velocity ga yozadi.
 */
export function useScrollVelocity({ smoothing = 0.12, maxVelocity = 45 } = {}) {
  const [velocity, setVelocity] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;

    let frame = 0;
    let lastY = window.scrollY;
    let lastTime = performance.now();
    let current = 0;

    const tick = (now) => {
      frame = 0;
      const y = window.scrollY;
      const dt = Math.max(1, now - lastTime);
      const delta = y - lastY;
      const perFrame = (delta / dt) * 16.67;
      const normalized = Math.max(-1, Math.min(1, perFrame / maxVelocity));

      current += (normalized - current) * smoothing;
      if (Math.abs(current) < 0.0015) current = 0;

      setVelocity(current);
      lastY = y;
      lastTime = now;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduced, smoothing, maxVelocity]);

  return velocity;
}

export function useScrollDirection({ threshold = 6 } = {}) {
  const [direction, setDirection] = useState("down");

  useEffect(() => {
    const lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      if (Math.abs(delta) >= threshold) {
        setDirection(delta > 0 ? "down" : "up");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return direction;
}

/**
 * Element ichida 0..1 progress (scroll bilan). Sticky rail va pinned
 * sahnalar uchun.
 */
export function useElementScrollProgress({ axis = "y" } = {}) {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    let frame = 0;
    let last = -1;

    const compute = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight;
      const vw = window.innerWidth;

      let value;
      if (axis === "x") {
        const total = rect.width - vw;
        value = total > 0 ? -rect.left / total : 0;
      } else {
        // "stikieda turish" oralig'i: element top'i header'da to'xtaydi,
        // pastki chekkasi viewport'dan chiqqanda tugaydi
        const start = rect.top;
        const end = start + rect.height - vh;
        value = end > start ? -start / (end - start) : 0;
      }

      value = Math.max(0, Math.min(1, value));
      if (Math.abs(value - last) < 0.0008) return;
      last = value;
      setProgress(value);
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
  }, [axis]);

  return [ref, progress];
}

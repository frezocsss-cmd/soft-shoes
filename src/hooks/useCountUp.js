import { useEffect, useRef, useState } from "react";
import { useInView, usePrefersReducedMotion } from "./useInView";

export function useCountUp(target, { duration = 1600, decimals = 0 } = {}) {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const reduced = usePrefersReducedMotion();
  const total = Number(target) || 0;
  const [value, setValue] = useState(0);
  const frameRef = useRef(0);

  useEffect(() => {
    if (!reduced || !inView) return undefined;

    let mounted = true;
    queueMicrotask(() => {
      if (mounted) setValue(total);
    });
    return () => {
      mounted = false;
    };
  }, [inView, total, reduced]);

  useEffect(() => {
    if (reduced || !inView) return undefined;

    const start = performance.now();
    const to = Number(target) || 0;

    const tick = (now) => {
      const elapsed = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - elapsed) ** 4;
      setValue(to * eased);
      if (elapsed < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        frameRef.current = 0;
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [inView, target, duration, reduced]);

  return { ref, value: value.toFixed(decimals) };
}

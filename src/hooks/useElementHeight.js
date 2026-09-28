import { useEffect, useState } from "react";

export function useElementHeight(ref) {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const measure = () => setHeight(node.getBoundingClientRect().height);

    let frame = 0;
    const onResize = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(measure);
      observer.observe(node);
      return () => {
        if (frame) window.cancelAnimationFrame(frame);
        observer.disconnect();
      };
    }
    window.addEventListener("resize", onResize);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, [ref]);

  return height;
}

export function useHeroFade(ref, scrollY, maxFade = 0.55) {
  const height = useElementHeight(ref);
  if (!height) return 1;
  const progress = Math.min(1, Math.max(0, scrollY / (height * 0.85)));
  return 1 - progress * maxFade;
}

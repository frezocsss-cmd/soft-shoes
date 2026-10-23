import { useEffect, useRef } from "react";

/**
 * Pointer-responsive perspective tilt for product cards. Only runs on
 * devices with a fine pointer and when reduced motion is not requested.
 */
export function useTilt({ maxTilt = 7 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const finePointer = window.matchMedia?.("(hover: hover) and (pointer: fine)").matches;
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reducedMotion) return undefined;

    let frame = 0;
    let nextEvent = null;

    const apply = () => {
      frame = 0;
      if (!nextEvent) return;
      const { clientX, clientY } = nextEvent;
      const rect = node.getBoundingClientRect();
      const px = (clientX - rect.left) / rect.width;
      const py = (clientY - rect.top) / rect.height;

      node.style.setProperty("--tilt-x", `${((0.5 - py) * maxTilt).toFixed(2)}deg`);
      node.style.setProperty("--tilt-y", `${((px - 0.5) * maxTilt).toFixed(2)}deg`);
      node.style.setProperty("--glow-x", `${(px * 100).toFixed(1)}%`);
      node.style.setProperty("--glow-y", `${(py * 100).toFixed(1)}%`);
      node.style.setProperty("--glow-opacity", "1");
      node.dataset.tilting = "true";
    };

    const onPointerMove = (event) => {
      nextEvent = event;
      if (frame) return;
      frame = window.requestAnimationFrame(apply);
    };

    const reset = () => {
      nextEvent = null;
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      node.dataset.tilting = "false";
      node.style.setProperty("--tilt-x", "0deg");
      node.style.setProperty("--tilt-y", "0deg");
      node.style.setProperty("--glow-opacity", "0");
    };

    node.addEventListener("pointermove", onPointerMove);
    node.addEventListener("pointerleave", reset);
    node.addEventListener("blur", reset);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      node.removeEventListener("pointermove", onPointerMove);
      node.removeEventListener("pointerleave", reset);
      node.removeEventListener("blur", reset);
    };
  }, [maxTilt]);

  return ref;
}

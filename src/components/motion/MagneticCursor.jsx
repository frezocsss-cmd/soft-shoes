import { useEffect, useRef } from "react";
import { useFinePointer, usePrefersReducedMotion } from "../../hooks/useInView";

/**
 * Global kursor: kichik dot (tez) + halqa (sekin, spring bilan).
 * Faqat aniq kursorli qurilmalarda ko'rinadi.
 */
export default function MagneticCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!fine || reduced) return undefined;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const dot = { ...target };
    const ring = { ...target };
    let ringSize = 34;
    let targetSize = 34;
    let visible = false;
    let frame = 0;
    let hovered = false;

    const interactiveSelector =
      'a, button, [role="button"], input, textarea, select, [data-cursor="hover"]';

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        visible = true;
        if (dotRef.current) dotRef.current.style.opacity = "1";
        if (ringRef.current) ringRef.current.style.opacity = "1";
      }
      const el = e.target instanceof Element ? e.target.closest(interactiveSelector) : null;
      hovered = Boolean(el);
      targetSize = hovered ? 62 : 34;
    };

    const onLeave = () => {
      visible = false;
      if (dotRef.current) dotRef.current.style.opacity = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
    };

    const tick = () => {
      frame = requestAnimationFrame(tick);
      dot.x += (target.x - dot.x) * 0.55;
      dot.y += (target.y - dot.y) * 0.55;
      ring.x += (target.x - ring.x) * 0.16;
      ring.y += (target.y - ring.y) * 0.16;
      ringSize += (targetSize - ringSize) * 0.15;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dot.x - 4}px, ${dot.y - 4}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.width = `${ringSize}px`;
        ringRef.current.style.height = `${ringSize}px`;
        ringRef.current.style.transform = `translate3d(${ring.x - ringSize / 2}px, ${ring.y - ringSize / 2}px, 0)`;
        ringRef.current.style.borderColor = hovered
          ? "rgba(181,138,69,0.95)"
          : "rgba(181,138,69,0.55)";
      }
    };

    frame = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [fine, reduced]);

  if (!fine || reduced) return null;

  return (
    <>
      <div ref={ringRef} className="cursor-ring" style={{ opacity: 0 }} aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" style={{ opacity: 0, width: 8, height: 8 }} aria-hidden="true" />
    </>
  );
}

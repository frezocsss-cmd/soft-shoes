import { useEffect, useRef } from "react";
import { useFinePointer, usePrefersReducedMotion } from "../hooks/useInView";

export default function CursorGlow() {
  const ref = useRef(null);
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || !fine || reduced) return undefined;

    let frame = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 3;
    let cx = x;
    let cy = y;
    let running = false;

    const loop = () => {
      cx += (x - cx) * 0.12;
      cy += (y - cy) * 0.12;
      node.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0) translate(-50%, -50%)`;
      if (Math.abs(x - cx) > 0.5 || Math.abs(y - cy) > 0.5) {
        frame = requestAnimationFrame(loop);
      } else {
        running = false;
        frame = 0;
      }
    };

    const onMove = (event) => {
      x = event.clientX;
      y = event.clientY;
      node.style.opacity = "1";
      if (!running) {
        running = true;
        frame = requestAnimationFrame(loop);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, [fine, reduced]);

  if (!fine || reduced) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-0 size-[520px] rounded-full opacity-0 blur-3xl transition-opacity duration-700"
      style={{
        background:
          "radial-gradient(circle, rgba(181,138,69,0.16) 0%, rgba(181,138,69,0.07) 40%, transparent 70%)",
      }}
    />
  );
}

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "./useInView";

const FINE_POINTER = "(hover: hover) and (pointer: fine)";

export function usePointerGlow() {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (typeof window === "undefined" || !window.matchMedia(FINE_POINTER).matches) return undefined;

    let frame = 0;
    const apply = (event) => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      node.style.setProperty("--glow-x", `${x.toFixed(2)}%`);
      node.style.setProperty("--glow-y", `${y.toFixed(2)}%`);
    };

    const onMove = (event) => {
      if (!frame) frame = window.requestAnimationFrame(() => apply(event));
    };
    const onEnter = () => node.style.setProperty("--glow-opacity", "1");
    const onLeave = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      node.style.setProperty("--glow-opacity", "0");
    };

    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerenter", onEnter);
    node.addEventListener("pointerleave", onLeave);
    return () => {
      onLeave();
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerenter", onEnter);
      node.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return ref;
}

export function useTilt({ max = 12, scale = 1.02, perspective = 1000, glare = true } = {}) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (reduced || typeof window === "undefined" || !window.matchMedia(FINE_POINTER).matches) {
      return undefined;
    }

    let frame = 0;

    const apply = (event) => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      node.style.setProperty("--tilt-y", `${(px - 0.5) * max * 2}deg`);
      node.style.setProperty("--tilt-x", `${(0.5 - py) * max * 2}deg`);
      node.style.setProperty("--tilt-p", `${perspective}px`);
      if (glare) {
        node.style.setProperty("--glare-x", `${(px * 100).toFixed(1)}%`);
        node.style.setProperty("--glare-y", `${(py * 100).toFixed(1)}%`);
      }
    };

    const onMove = (event) => {
      if (!frame) frame = window.requestAnimationFrame(() => apply(event));
    };
    const onEnter = () => {
      node.classList.add("is-active");
      node.style.setProperty("--tilt-scale", String(scale));
    };
    const onLeave = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      node.classList.remove("is-active");
      node.style.setProperty("--tilt-x", "0deg");
      node.style.setProperty("--tilt-y", "0deg");
      node.style.setProperty("--tilt-scale", "1");
    };

    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerenter", onEnter);
    node.addEventListener("pointerleave", onLeave);
    return () => {
      onLeave();
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerenter", onEnter);
      node.removeEventListener("pointerleave", onLeave);
    };
  }, [max, scale, perspective, glare, reduced]);

  return ref;
}

export function useMagnetic(strength = 0.32, { rippleLight = false } = {}) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (reduced || typeof window === "undefined" || !window.matchMedia(FINE_POINTER).matches) {
      return undefined;
    }

    let frame = 0;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let running = false;

    const loop = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      node.style.setProperty("--mag-x", `${currentX.toFixed(2)}px`);
      node.style.setProperty("--mag-y", `${currentY.toFixed(2)}px`);

      if (Math.abs(targetX - currentX) > 0.15 || Math.abs(targetY - currentY) > 0.15) {
        frame = window.requestAnimationFrame(loop);
      } else {
        running = false;
        frame = 0;
      }
    };

    const start = () => {
      if (!running) {
        running = true;
        frame = window.requestAnimationFrame(loop);
      }
    };

    const onMove = (event) => {
      const rect = node.getBoundingClientRect();
      targetX = (event.clientX - (rect.left + rect.width / 2)) * strength;
      targetY = (event.clientY - (rect.top + rect.height / 2)) * strength * 0.7;
      start();
    };
    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      start();
    };

    /* Touch/click ripple — hover bilan cheklanmasligi uchun */
    const onDown = (event) => {
      if (typeof document === "undefined") return;
      if (event.pointerType === "mouse" && event.button !== 0) return;
      const rect = node.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2.2;
      const px = event.clientX ?? rect.left + rect.width / 2;
      const py = event.clientY ?? rect.top + rect.height / 2;

      const span = document.createElement("span");
      span.className = rippleLight ? "ripple ripple-light absolute" : "ripple absolute";
      span.style.width = `${size}px`;
      span.style.height = `${size}px`;
      span.style.left = `${px - rect.left - size / 2}px`;
      span.style.top = `${py - rect.top - size / 2}px`;
      node.appendChild(span);
      span.addEventListener("animationend", () => span.remove(), { once: true });
    };

    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerleave", onLeave);
    node.addEventListener("pointerdown", onDown);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", onLeave);
      node.removeEventListener("pointerdown", onDown);
    };
  }, [strength, reduced, rippleLight]);

  return ref;
}

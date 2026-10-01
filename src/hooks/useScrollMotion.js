import { useEffect, useRef } from "react";
import { usePrefersReducedMotion, useFinePointer } from "./useInView";
import { subscribeFrame } from "../lib/scrollEngine";

/** Sahifa progress chizig'i (0..1) — kam render bilan. */
export function useScrollProgress() {
  const progressRef = useRef(0);
  return progressRef;
}

/**
 * Scroll Y — ref orqali. Har kadrda o'zgaradi; state'ga yozilsa
 * butun sahifa qayta render bo'lardi.
 */
export function useScrollYRef() {
  const ref = useRef(0);
  useEffect(
    () =>
      subscribeFrame({
        read: ({ y }) => {
          ref.current = y;
        },
      }),
    [],
  );
  return ref;
}

/**
 * Scroll tezligini (-1..1) CSS custom property sifatida yozadi.
 * Hech qanday React render yo'q.
 */
export function useScrollVelocityVar(target) {
  const reduced = usePrefersReducedMotion();
  const targetRef = useRef(target);
  useEffect(() => {
    targetRef.current = target;
  }, [target]);

  useEffect(() => {
    const node = targetRef.current;
    if (!node) return undefined;
    if (reduced) {
      node.style.setProperty("--velocity", "0");
      node.style.setProperty("--vel-y", "0px");
      return undefined;
    }

    let last = -99;
    return subscribeFrame({
      write: ({ velocity }) => {
        if (Math.abs(velocity - last) < 0.01) return;
        last = velocity;
        node.style.setProperty("--velocity", velocity.toFixed(3));
        node.style.setProperty("--vel-y", `${(velocity * -14).toFixed(2)}px`);
      },
    });
  }, [reduced]);
}

/**
 * Scroll yo'nalishini `data-direction` atributiga yozadi (render'siz).
 */
export function useScrollDirectionAttr({ threshold = 6 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    let lastY = window.scrollY;
    return subscribeFrame({
      write: ({ y }) => {
        const delta = y - lastY;
        lastY = y;
        if (Math.abs(delta) < threshold) return;
        if (ref.current) ref.current.dataset.direction = delta > 0 ? "down" : "up";
      },
    });
  }, [threshold]);

  return ref;
}

/**
 * Element ichida 0..1 progress. `apply(value, node)` — render emas,
 * to'g'ridan-to'g'ri style yozish (faqat transform/opacity).
 */
export function useElementScrollProgress({ axis = "y", apply } = {}) {
  const ref = useRef(null);
  const applyRef = useRef(apply);
  useEffect(() => {
    applyRef.current = apply;
  }, [apply]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    let lastApplied = -1;
    let pending = 0;
    let dirty = false;

    return subscribeFrame({
      /* o'qish — barcha o'chovlar bir-biridan oldin bajariladi */
      read: () => {
        const rect = node.getBoundingClientRect();
        let value;
        if (axis === "x") {
          const total = rect.width - window.innerWidth;
          value = total > 0 ? -rect.left / total : 0;
        } else {
          const start = rect.top;
          const end = start + rect.height - window.innerHeight;
          value = end > start ? -start / (end - start) : 0;
        }
        pending = Math.max(0, Math.min(1, value));
        dirty = Math.abs(pending - lastApplied) >= 0.0008;
      },
      /* yozish */
      write: () => {
        if (!dirty) return;
        dirty = false;
        lastApplied = pending;
        if (applyRef.current) applyRef.current(pending, node);
      },
    });
  }, [axis]);

  return ref;
}

/**
 * Parallax: `--parallax` CSS var'ini yozadi (transform, render'siz).
 * Offscreen elementlar uchun hisob-kitob bajarilmaydi.
 */
export function useParallax(amount = 60) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const fine = useFinePointer();

  useEffect(() => {
    const node = ref.current;
    /* Touch qurilmalarda parallax GPU yukini oshiradi, lekin
       ko'rinishi deyarli bir xil — o'chiriladi */
    if (!node || reduced || !fine) return undefined;

    let visible = false;
    let pending = 0;
    let last = -999;
    let dirty = false;
    let observer;

    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          visible = entries.some((entry) => entry.isIntersecting);
        },
        { rootMargin: "200px 0px" },
      );
      observer.observe(node);
    } else {
      visible = true;
    }

    const unsubscribe = subscribeFrame({
      read: () => {
        if (!visible) return;
        const rect = node.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return;
        const progress = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
        pending = Number((progress * amount).toFixed(1));
        dirty = pending !== last;
      },
      write: () => {
        if (!dirty) return;
        dirty = false;
        last = pending;
        node.style.setProperty("--parallax", `${pending}px`);
      },
    });

    return () => {
      unsubscribe();
      if (observer) observer.disconnect();
    };
  }, [amount, reduced, fine]);

  return ref;
}

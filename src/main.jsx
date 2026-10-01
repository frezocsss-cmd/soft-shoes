import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

/**
 * Qurilma imkoniyatiga qarab `data-fx` belgisini qo'yadi:
 *   - "lite" → GPU ga qimmat effektlar (blur blob, conic ring,
 *     mix-blend, backdrop-filter) o'chiriladi. Transform/opacity
 *     animatsiyalari saqlanadi.
 *   - "full" → barcha effektlar.
 *
 * Ataylab (JS yuklanishidan oldin) aniqlanadi — shuning uchun
 * CSS birinchi kadrda to'g'ri rejimni qo'llaydi va layout
 * siljishi bo'lmaydi.
 */
const detectFx = () => {
  if (typeof window === "undefined") return "full";

  const coarse = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cores = navigator.hardwareConcurrency ?? 8;
  const memory = navigator.deviceMemory ?? 8;
  const saveData = navigator.connection?.saveData === true;
  const slowLink = /^(slow-)?2g$/.test(navigator.connection?.effectiveType ?? "");

  const lite = reduced || saveData || slowLink || (coarse && (cores <= 4 || memory <= 4));
  return lite ? "lite" : "full";
};

document.documentElement.dataset.fx = detectFx();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

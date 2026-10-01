/**
 * Yagona scroll "mexanizmi": bitta rAF loop, bitta scroll listener.
 *
 * Oldingi holatda har bir komponent o'z scroll listener'ini va o'z
 * rAF loop'ini ro'yxatdan o'tkazardi (6-8 ta), har biri
 * `getBoundingClientRect()` chaqirib layout'ni majburlashga majbur edi.
 * Endi barchasi bitta markaziy loop'dan foydalanadi, React esa
 * scroll'da umuman render bo'lmaydi — faqat CSS o'zgaradi.
 *
 * MUHIM: layout thrashing (read -> write -> read) bo'lmasligi uchun
 * kadr ikki bosqichli bajariladi:
 *   1. `read`  — barcha `getBoundingClientRect()` o'lchovlari
 *   2. `write` — barcha style yozuvlari
 * Agar bitta komponent o'z ichida o'qib-yozsa, har yozuv keyingi
 * o'qish uchun butun layout'ni qayta hisoblashga majbur qiladi.
 */

const frameSubscribers = new Set();

let frame = 0;
let lastY = -1;
let lastTime = 0;
let velocity = 0;
let docHeight = 0;
let viewport = 0;

const measure = () => {
  docHeight = document.documentElement.scrollHeight;
  viewport = window.innerHeight;
};

const currentState = () => {
  const max = Math.max(0, docHeight - viewport);
  const y = window.scrollY;
  return {
    y,
    velocity,
    docHeight,
    viewport,
    max,
    progress: max > 0 ? Math.min(1, Math.max(0, y / max)) : 0,
  };
};

const flush = () => {
  frame = 0;
  const now = performance.now();
  const y = window.scrollY;

  if (y !== lastY) {
    const dt = Math.max(1, now - lastTime);
    const delta = y - lastY;
    lastY = y;
    lastTime = now;

    const perFrame = (delta / dt) * 16.67;
    const normalized = Math.max(-1, Math.min(1, perFrame / 45));
    velocity += (normalized - velocity) * 0.14;
    if (Math.abs(velocity) < 0.0015) velocity = 0;
  } else {
    velocity *= 0.9;
    if (Math.abs(velocity) < 0.0015) velocity = 0;
  }

  const state = currentState();

  /* 1-bosqich: o'qish (layout'ni har safar majburlamasligi uchun
     barcha o'chovlar shu bosqichda bajariladi) */
  for (const subscriber of frameSubscribers) {
    if (subscriber.read) subscriber.read(state);
  }
  /* 2-bosqich: yozish */
  for (const subscriber of frameSubscribers) {
    if (subscriber.write) subscriber.write(state);
  }
};

const request = () => {
  if (!frame) frame = requestAnimationFrame(flush);
};

const onScroll = () => request();

const onResize = () => {
  measure();
  request();
};

let resizeObserver = null;

const start = () => {
  if (frameSubscribers.size !== 1) return;

  lastY = window.scrollY;
  lastTime = performance.now();
  measure();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });

  /* Sahifa balandligi lazy rasm / route o'zgarishi bilan o'zgaradi —
     har scroll'da o'lchash kerak emas, faqat o'zgarganda. */
  if (typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(() => {
      measure();
      request();
    });
    resizeObserver.observe(document.documentElement);
  }

  request();
};

const stop = () => {
  if (frameSubscribers.size > 0) return;
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onResize);
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
};

/**
 * Ikki bosqichli obuna: `{ read, write }`.
 * `read` — faqat o'qish (rect/offset o'lchovi), `write` — style yozish.
 * Ikkalasini bitta funksiya sifatida bersangiz `read` sifatida ishlaydi
 * (moslashuvchanlik uchun).
 */
export const subscribeFrame = ({ read, write } = {}) => {
  const entry = { read: read ?? write, write: read && write ? write : undefined };
  frameSubscribers.add(entry);
  start();

  const state = currentState();
  if (entry.read) entry.read(state);
  if (entry.write) entry.write(state);

  return () => {
    frameSubscribers.delete(entry);
    stop();
  };
};

/**
 * Sodda obuna — handler butun kadr holatini oladi.
 *
 * Bu yerga `getBoundingClientRect()` ishlatmang: handler `write`
 * bosqichida ishlaydi, ya'ni boshqa komponentlarning barcha
 * o'chovlaridan KEYIN. Kerak bo'lsa `subscribeFrame({ read, write })`
 * dan foydalaning.
 */
export const subscribeScroll = (handler) =>
  subscribeFrame({
    write: (state) => handler(state),
  });

export const refreshScrollMetrics = () => {
  measure();
  request();
};

export const getScrollState = () => currentState();

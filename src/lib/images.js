import { optimizedImages } from "../generated/images";

/**
 * Build paytida Vite barcha webp variantlarni URL'ga aylantiradi
 * (hash qo'shiladi, `dist/assets` ga chiqadi).
 */
const files = import.meta.glob("../generated/images/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
});

const urlOf = (name, width) => files[`../generated/images/${name}-${width}.webp`];

const cache = new Map();

/**
 * Bitta rasm uchun { src, srcSet, placeholder, width, height } qaytaradi.
 * Kiritilgan nom `src/assets` fayl nomi (kengliksiz) bo'lishi kerak,
 * masalan "photo_2026-09-14_17-53-15".
 */
export const getImage = (name) => {
  if (!name) return null;
  if (cache.has(name)) return cache.get(name);

  const meta = optimizedImages[name];
  if (!meta) return null;

  const widths = meta.widths.filter((width) => urlOf(meta.file, width));
  if (!widths.length) return null;

  const largest = widths[widths.length - 1];
  const result = {
    src: urlOf(meta.file, largest),
    srcSet: widths.map((width) => `${urlOf(meta.file, width)} ${width}w`).join(", "),
    placeholder: meta.placeholder,
    width: meta.width,
    height: meta.height,
  };

  cache.set(name, result);
  return result;
};

/* Statik rasmlar uchun qulay nomlar (import qilish o'rniga). */
export const PRODUCT_IMAGES = {
  aurora: "photo_2026-09-14_17-53-15",
  noir: "photo_2026-09-14_17-53-21",
  velvet: "photo_2026-09-14_17-53-33",
  hazelnut: "photo_2026-09-14_17-54-41",
  ivory: "photo_2026-09-14_17-54-46",
  logo: "logo",
};

/**
 * Supabase Storage URL'larini optimallashtiradi.
 * Supabase Image Transformation yoqilgan bo'lsa — kichik webp qaytaradi,
 * yo'q bo'lsa (transformatsiya xatosi) asl rasm qaytariladi.
 */
const SUPABASE_HOST = /supabase\.(co|in)/;

export const isRemoteTransformable = (url) =>
  Boolean(url) && typeof url === "string" && !url.startsWith("data:") && SUPABASE_HOST.test(url);

export const withImageTransform = (url, width = 900, quality = 72) => {
  if (!url || typeof url !== "string") return null;
  if (url.startsWith("data:")) return url;
  if (!SUPABASE_HOST.test(url)) return url;

  const [base, hash] = url.split("#");
  const query = `width=${width}&quality=${quality}&format=webp`;
  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}${query}${hash ?? ""}`;
};

/**
 * Bu loyihada Supabase Image Transformation **yoqiq** bo'lishi mumkin:
 * transformatsiya o'chirilgan bo'lsa, `?width=...&quality=...&format=webp`
 * qo'shilgan URL asl rasmni qaytaradi (bir xil og'irlik, tur JSON'dan
 * boshqa). Bunday holatda `srcset` yolg'on bo'lib qoladi va brauzer
 * turli kenglikda bir xil katta faylni qayta-qayta yuklab oladi.
 *
 * Shuning uchun bir marta 32px "proba" so'raladi: transformation
 * ishlayotgan bo'lsa `content-type: image/webp` qaytadi. Natija
 * butun sessiya davomida keshlanadi (bitta kichik so'rov).
 */
let transformSupported = null;
let transformProbe = null;

export const supportsRemoteTransform = (url) => {
  if (transformSupported !== null) return Promise.resolve(transformSupported);
  if (!isRemoteTransformable(url)) {
    transformSupported = false;
    return Promise.resolve(false);
  }

  transformProbe ??= (async () => {
    try {
      const response = await fetch(withImageTransform(url, 32, 30), {
        method: "GET",
        cache: "force-cache",
      });
      const type = response.headers.get("content-type") ?? "";
      transformSupported = response.ok && type.includes("webp");
    } catch {
      transformSupported = false;
    }
    return transformSupported;
  })();

  return transformProbe;
};

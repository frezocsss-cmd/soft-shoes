import { memo, useEffect, useRef, useState } from "react";
import {
  getImage,
  isRemoteTransformable,
  supportsRemoteTransform,
  withImageTransform,
} from "../lib/images";

/**
 * Rasm komponenti — mobil'da og'irlik qilmaydi:
 *
 *  1. `src` faqat rasm ekronga yaqinlashganda (IntersectionObserver)
 *     o'rnatiladi — barcha katta rasmlar bir vaqtda yuklanmaydi.
 *  2. Yuklanayotgan paytda 20px webp placeholder (LQIP) ko'rinadi,
 *     rasm tayyor bo'lgach `opacity` bilan ochiladi.
 *  3. `srcset`/`sizes` — telefon ekraniga mos eng kichik variant yuklanadi.
 *  4. Supabase URL'lariga avtomatik transform (webp + width) qo'shiladi,
 *     transformatsiya ishlamasa asl rasmga qaytadi.
 *  5. `width`/`height` — layout siljishi (CLS) yo'qoladi.
 *
 * `priority` — faqat LCP (hero) rasm uchun: darhol yuklanadi.
 */
const TRANSFORM_WIDTHS = [400, 640, 900, 1200];

const buildRemoteSources = (url, useTransform) => {
  if (!url) return null;
  if (!useTransform) return { src: url, srcSet: undefined };

  const variants = TRANSFORM_WIDTHS.map((width) => ({
    w: width,
    url: withImageTransform(url, width, 72),
  })).filter((variant) => variant.url && variant.url !== url);

  if (!variants.length) return { src: url, srcSet: undefined };
  return {
    src: variants[variants.length - 1].url,
    srcSet: variants.map((variant) => `${variant.url} ${variant.w}w`).join(", "),
  };
};

const SmartImage = memo(function SmartImage({
  name,
  src,
  alt = "",
  className = "",
  sizes = "(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 620px",
  priority = false,
  rootMargin = "400px 0px",
  style,
  ...rest
}) {
  const holderRef = useRef(null);
  /* `priority` render paytida boshlang'ich qiymat beradi — mount'dan
     oldin allaqachon yuklash kerak bo'lgan rasm uchun. */
  const [shouldLoad, setShouldLoad] = useState(() => priority);
  const [loaded, setLoaded] = useState(false);
  const [useOriginal, setUseOriginal] = useState(false);
  const [transformOk, setTransformOk] = useState(null);

  const local = getImage(name);

  /* Tashqi rasm uchun bir marta tekshiriladi: Supabase'da image
     transformation yoqiq bo'lsa — `srcset` qo'yilmaydi. */
  useEffect(() => {
    if (local || !isRemoteTransformable(src) || transformOk !== null) return undefined;
    let active = true;
    supportsRemoteTransform(src).then((supported) => {
      if (active) setTransformOk(supported);
    });
    return () => {
      active = false;
    };
  }, [local, src, transformOk]);

  const useTransform = transformOk === true && !useOriginal;
  const remote = useOriginal ? null : buildRemoteSources(src, useTransform);
  const hasImage = Boolean(local || remote || src);

  /* LCP rasm — darhol; qolganlari viewport'ga yaqinlashganda */
  useEffect(() => {
    if (shouldLoad) return undefined;
    const node = holderRef.current;
    if (!node) return undefined;

    if (typeof IntersectionObserver === "undefined") {
      const settle = window.setTimeout(() => setShouldLoad(true), 0);
      return () => window.clearTimeout(settle);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, shouldLoad]);

  const currentSrc = local ? local.src : (remote?.src ?? src);
  const currentSrcSet = local ? local.srcSet : remote?.srcSet;

  if (!hasImage) return <span className={`smart-img smart-img-fallback ${className}`} style={style} {...rest} />;

  return (
    <span
      ref={holderRef}
      className={`smart-img ${className}`}
      data-loaded={loaded ? "true" : "false"}
      style={style}
      {...rest}
    >
      {local?.placeholder ? (
        <span
          className="smart-img-ph"
          style={{ backgroundImage: `url("${local.placeholder}")` }}
          aria-hidden="true"
        />
      ) : null}

      {shouldLoad ? (
        <img
          className="smart-img-el"
          src={currentSrc}
          srcSet={currentSrcSet}
          sizes={currentSrcSet ? sizes : undefined}
          alt={alt}
          width={local?.width}
          height={local?.height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          onLoad={() => setLoaded(true)}
          onError={() => {
            /* Supabase transformatsiyasi yoqiq bo'lsa — asl rasmga qaytamiz */
            if (!local && !useOriginal && src && currentSrc !== src) {
              setUseOriginal(true);
              return;
            }
            setLoaded(true);
          }}
          draggable={false}
        />
      ) : null}
    </span>
  );
});

export default SmartImage;

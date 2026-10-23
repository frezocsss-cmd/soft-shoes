import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import ProductImage from "./ProductImage";
import SmartImage from "./SmartImage";

const buildSlides = (product) => {
  const slides = [];
  const gallery = Array.isArray(product.galleryUrls) ? product.galleryUrls.filter(Boolean) : [];

  if (product.image_url && !gallery.includes(product.image_url)) {
    slides.push({ key: "primary", kind: "product", src: product.image_url });
  }

  gallery.forEach((src, index) => {
    if (src && !slides.some((slide) => slide.src === src)) {
      slides.push({ key: `gallery-${index}`, kind: "remote", src });
    }
  });

  return slides;
};

export default function ProductGallery({ product, alt, className = "" }) {
  const slides = useMemo(() => buildSlides(product), [product]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive(0);
  }, [product?.id]);

  if (!slides.length) {
    return (
      <div className={`media grid aspect-[4/5] place-items-center rounded-3xl border border-line ${className}`}>
        <div className="text-center text-muted">
          <ImageOff className="mx-auto" size={26} aria-hidden="true" />
          <p className="mt-2 text-xs font-bold">Soft Shoes</p>
        </div>
      </div>
    );
  }

  const current = slides[Math.min(active, slides.length - 1)];
  const hasMany = slides.length > 1;

  const go = (direction) => {
    setActive((value) => (value + direction + slides.length) % slides.length);
  };

  return (
    <div className={className}>
      <div
        className="media group relative aspect-[4/5] touch-pan-y overflow-hidden rounded-3xl border border-line"
        tabIndex={hasMany ? 0 : undefined}
        onKeyDown={(event) => {
          if (!hasMany) return;
          if (event.key === "ArrowLeft") go(-1);
          if (event.key === "ArrowRight") go(1);
        }}
        aria-roledescription="carousel"
        aria-label={alt}
      >
        <div key={current.key} className="gallery-slide absolute inset-0">
          {current.kind === "product" ? (
            <ProductImage
              product={product}
              alt={alt}
              className="size-full"
              sizes="(min-width: 1024px) 48vw, 92vw"
              priority
              rootMargin="400px"
            />
          ) : (
            <SmartImage
              src={current.src}
              alt={alt}
              className="size-full"
              sizes="(min-width: 1024px) 48vw, 92vw"
              priority
              rootMargin="400px"
            />
          )}
        </div>

        {hasMany ? (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-white/50 bg-white/85 text-ink shadow-card backdrop-blur-sm transition-transform duration-200 hover:-translate-y-[calc(50%+2px)]"
              aria-label="Oldingi rasm"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-white/50 bg-white/85 text-ink shadow-card backdrop-blur-sm transition-transform duration-200 hover:-translate-y-[calc(50%+2px)]"
              aria-label="Keyingi rasm"
            >
              <ChevronRight size={18} />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-ink/75 px-2.5 py-1 text-[10px] font-bold text-white">
              {active + 1} / {slides.length}
            </span>
          </>
        ) : null}
      </div>

      {hasMany ? (
        <div className="mt-3 grid grid-cols-5 gap-2" role="group" aria-label="Mahsulot rasmlari">
          {slides.map((slide, index) => {
            const isActive = index === active;
            return (
              <button
                key={slide.key}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`${index + 1}-rasm`}
                aria-pressed={isActive}
                className={`media aspect-square overflow-hidden rounded-xl border transition-all duration-200 ${
                  isActive ? "border-ink opacity-100" : "border-line opacity-65 hover:opacity-100"
                }`}
              >
                {slide.kind === "product" ? (
                  <ProductImage product={product} alt="" className="size-full" sizes="90px" />
                ) : (
                  <SmartImage src={slide.src} alt="" className="size-full" sizes="90px" />
                )}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

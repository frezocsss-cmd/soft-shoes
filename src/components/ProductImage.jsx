import SmartImage from "./SmartImage";

/**
 * Mahsulot rasmi — lokal optimallashtirilgan webp yoki tashqi URL.
 *
 * Mahsulot obyekti `imageName` (manifest kaliti) va `image_url`
 * (to'liq URL) maydonlarini saqlaydi; bu komponent ularni
 * SmartImage uchun to'g'ri prop'larga aylantiradi.
 */
export default function ProductImage({
  product,
  alt,
  className = "",
  sizes,
  priority = false,
  ...rest
}) {
  const name = product?.imageName ?? null;
  const src = name ? undefined : product?.image_url ?? product?.image ?? null;
  const label = alt ?? product?.name ?? "Soft Shoes";

  if (!name && !src) {
    return <span className={`block bg-ink/5 ${className}`} aria-hidden="true" />;
  }

  return (
    <SmartImage
      name={name ?? undefined}
      src={src ?? undefined}
      alt={label}
      className={className}
      sizes={sizes}
      priority={priority}
      {...rest}
    />
  );
}

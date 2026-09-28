import { useMagnetic } from "../../hooks/usePointer";

/**
 * Barcha qurilmalarda ishlaydigan CTA tugma:
 * - desktop: kursorga magnit tortiladi
 * - mobil/touch: boshgananda ripple (barcha qurilmalarda ishlaydi)
 * - `.press` klassi bosilganda scale beradi
 */
export default function MagneticButton({
  as: Tag = "a",
  strength = 0.3,
  rippleLight = false,
  className = "",
  children,
  ...rest
}) {
  const ref = useMagnetic(strength, { rippleLight });

  return (
    <Tag
      ref={ref}
      className={`fx-magnetic press relative isolate inline-flex overflow-hidden will-change-transform ${className}`}
      style={{ "--mag-x": "0px", "--mag-y": "0px" }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

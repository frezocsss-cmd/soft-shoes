import { useInView } from "../../hooks/useInView";

const VARIANTS = {
  up: "up",
  down: "down",
  left: "left",
  right: "right",
  scale: "scale",
  fade: "fade",
};

/**
 * Yengil scroll-reveal: faqat opacity + 12px joylashuv, 380ms.
 * `prefers-reduced-motion` CSS'da to'liq o'chiriladi.
 */
export default function Reveal({
  as: Tag = "div",
  from = "up",
  delay = 0,
  className = "",
  style,
  children,
  once = true,
  threshold = 0.12,
  ...rest
}) {
  const [ref, inView] = useInView({ once, threshold, rootMargin: "0px 0px -8% 0px" });

  return (
    <Tag
      ref={ref}
      data-from={VARIANTS[from] ?? VARIANTS.up}
      className={`reveal ${inView ? "is-visible" : ""} ${className}`.trim()}
      style={{ "--reveal-delay": `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

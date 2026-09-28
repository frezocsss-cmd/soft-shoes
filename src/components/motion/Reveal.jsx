import { useInView } from "../../hooks/useInView";

const VARIANTS = {
  up: "up",
  down: "down",
  left: "left",
  right: "right",
  scale: "scale",
  scaleUp: "scale-up",
  blur: "blur",
  flip: "flip",
  fade: "fade",
};

export default function Reveal({
  as: Tag = "div",
  from = "up",
  delay = 0,
  duration,
  className = "",
  style,
  children,
  once = true,
  threshold = 0.12,
  ...rest
}) {
  const [ref, inView] = useInView({ once, threshold, rootMargin: "0px 0px -10% 0px" });
  const classes = `reveal ${inView ? "is-visible" : ""} ${className}`.trim();

  return (
    <Tag
      ref={ref}
      data-from={VARIANTS[from] ?? VARIANTS.up}
      className={classes}
      style={{
        "--reveal-delay": `${delay}ms`,
        ...(duration ? { transitionDuration: `${duration}ms` } : null),
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

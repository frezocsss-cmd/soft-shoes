import { useCallback } from "react";
import { useTilt, usePointerGlow } from "../../hooks/usePointer";

export default function TiltCard({
  as: Tag = "div",
  children,
  className = "",
  max = 12,
  scale = 1.02,
  glare = true,
  glow = true,
  style,
  ...rest
}) {
  const tiltRef = useTilt({ max, scale, glare });
  const glowRef = usePointerGlow();

  const setRefs = useCallback(
    (node) => {
      tiltRef.current = node;
      glowRef.current = node;
    },
    [tiltRef, glowRef]
  );

  const classes = [
    "tilt",
    "tilt-press",
    "fx-card",
    glow ? "fx-glow" : "",
    glare ? "glare" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag ref={setRefs} className={classes} style={style} {...rest}>
      {children}
    </Tag>
  );
}


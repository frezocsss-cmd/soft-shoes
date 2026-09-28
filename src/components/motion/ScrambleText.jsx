import { useEffect, useState } from "react";
import { useInView, usePrefersReducedMotion } from "../../hooks/useInView";
import { useTextScramble } from "../../hooks/useTextScramble";

/**
 * Matn decode/scramble animatsiyasi bilan ochiladi.
 * Sahifaga kirganda yoki ko'rinishga kirganda ishga tushadi.
 */
export default function ScrambleText({
  text,
  as: Tag = "span",
  className = "",
  delay = 0,
  playOnView = true,
  speed = 40,
  ...rest
}) {
  const reduced = usePrefersReducedMotion();
  const [ref, inView] = useInView({ threshold: 0.35, once: true, fallbackMs: 1500 });
  const [started, setStarted] = useState(!playOnView);
  const output = useTextScramble(started ? text : "", { speed, enabled: started });

  useEffect(() => {
    if (!started && inView) {
      const id = setTimeout(() => setStarted(true), delay);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [inView, started, delay]);

  if (reduced || !playOnView) {
    return (
      <Tag ref={playOnView ? ref : undefined} className={className} {...rest}>
        {playOnView ? output || text : text}
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref}
      className={`scramble ${className}`}
      style={started ? undefined : { opacity: 0 }}
      {...rest}
    >
      {output || "\u00a0"}
    </Tag>
  );
}

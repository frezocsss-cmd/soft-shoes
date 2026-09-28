import { useEffect, useState } from "react";
import { useInView, usePrefersReducedMotion } from "../../hooks/useInView";

/**
 * Har bir belgi alohida 3D flip bilan ochiladi — hero sarlavhalari uchun.
 * Word bo'shlig'i saqlanadi.
 */
export default function CharFlip({
  text,
  as: Tag = "span",
  className = "",
  delayStep = 34,
  startDelay = 0,
  perspective = 700,
  playOnView = true,
  ...rest
}) {
  const reduced = usePrefersReducedMotion();
  const [ref, inView] = useInView({ threshold: 0.2, once: true, fallbackMs: 900 });
  const [done, setDone] = useState(!playOnView);

  useEffect(() => {
    if (!playOnView) return undefined;
    if (inView && !done) {
      const id = setTimeout(() => setDone(true), startDelay);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [inView, done, startDelay, playOnView]);

  if (reduced) {
    return (
      <Tag className={className} {...rest}>
        {text}
      </Tag>
    );
  }

  const words = String(text).split(" ");
  let charIndex = 0;

  return (
    <Tag
      ref={playOnView ? ref : undefined}
      className={`inline-block ${className}`}
      style={{ perspective: `${perspective}px` }}
      {...rest}
    >
      {words.map((word, wi) => (
        // eslint-disable-next-line react/no-array-index-key
        <span key={`${word}-${wi}`} className="inline-block whitespace-nowrap">
          {[...word].map((ch) => {
            const i = charIndex;
            charIndex += 1;
            return (
              <span
                // eslint-disable-next-line react/no-array-index-key
                key={`${ch}-${i}`}
                className="char"
                style={{
                  "--char-delay": done ? `${startDelay + i * delayStep}ms` : "99999ms",
                  animationPlayState: done ? "running" : "paused",
                }}
              >
                {ch}
              </span>
            );
          })}
          {wi < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}

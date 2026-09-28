import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "./useInView";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&*+=/\\<>[]{}";

/**
 * Matn "decode/scramble" effekti: tasodifiy belgilar orqali
 * haqiqiy matnga o'tadi. `enabled=false` bo'lsa bo'sh qaytaradi.
 */
export function useTextScramble(text, { speed = 42, scrambleCount = 9, enabled = true } = {}) {
  const reduced = usePrefersReducedMotion();
  const [output, setOutput] = useState("");
  const settled = !enabled || reduced || !text;

  useEffect(() => {
    if (settled) return undefined;

    let raf = 0;
    let start = 0;
    let cancelled = false;
    const chars = [...text];

    const step = (now) => {
      if (cancelled) return;
      if (!start) start = now;
      const elapsed = (now - start) / speed;

      let result = "";
      for (let i = 0; i < chars.length; i += 1) {
        const ch = chars[i];
        if (ch === " ") {
          result += " ";
          continue;
        }
        const revealAt = i * 0.32;
        if (elapsed > revealAt) {
          result += ch;
        } else if (elapsed > revealAt - scrambleCount) {
          result += GLYPHS[(Math.random() * GLYPHS.length) | 0];
        } else {
          result += GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
      }
      setOutput(result);

      if (elapsed < chars.length * 0.32 + scrambleCount) {
        raf = requestAnimationFrame(step);
      } else {
        setOutput(text);
      }
    };

    raf = requestAnimationFrame(step);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [text, speed, scrambleCount, settled]);

  if (settled) return text;
  return output;
}

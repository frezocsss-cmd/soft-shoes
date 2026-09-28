import { useElementScrollProgress } from "../../hooks/useScrollMotion";
import { useFinePointer, usePrefersReducedMotion } from "../../hooks/useInView";

/**
 * Pinned sahna: element viewport'da "yopishib" turadi va scroll
 * progress'ga qarab ichida transform o'zgaradi.
 *
 * Touch/reduced-motion qurilmalarda pinning o'chiriladi — oddiy
 * statik ko'rinish qoladi (mobil'da 260vh bo'sh joy qolmasin).
 */
export default function PinnedScene({
  children,
  className = "",
  progressMap,
  style,
  height = "220vh",
}) {
  const [ref, progress] = useElementScrollProgress();
  const reduced = usePrefersReducedMotion();
  const fine = useFinePointer();
  const pinned = fine && !reduced;

  const resolved = { transform: "none", opacity: 1, ...(style || {}) };
  if (pinned && progressMap?.length) {
    const sorted = [...progressMap].sort((a, b) => a.at - b.at);
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    let segment = first;
    let local = 0;
    if (progress <= first.at) {
      segment = first;
      local = 0;
    } else if (progress >= last.at) {
      segment = last;
      local = 1;
    } else {
      for (let i = 0; i < sorted.length - 1; i += 1) {
        const a = sorted[i];
        const b = sorted[i + 1];
        if (progress >= a.at && progress <= b.at) {
          segment = a;
          local = (progress - a.at) / Math.max(0.0001, b.at - a.at);
          break;
        }
      }
    }
    const interpolate = (prop, fallback) => {
      const from = segment[prop] ?? fallback;
      const to = sorted[Math.min(sorted.indexOf(segment) + 1, sorted.length - 1)][prop] ?? from;
      if (typeof from === "number" && typeof to === "number") {
        return from + (to - from) * local;
      }
      return local > 0.5 ? to : from;
    };
    resolved.transform = interpolate("transform", "none");
    resolved.opacity = interpolate("opacity", 1);
  }

  if (!pinned) {
    return (
      <div className={`relative ${className}`}>
        <div className="w-full">{children}</div>
      </div>
    );
  }

  return (
    <div ref={ref} className={`relative ${className}`} style={{ height }}>
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <div className="w-full will-change-transform" style={resolved}>
          {children}
        </div>
      </div>
    </div>
  );
}

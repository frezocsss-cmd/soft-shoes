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
  const reduced = usePrefersReducedMotion();
  const fine = useFinePointer();
  const pinned = fine && !reduced;

  const ref = useElementScrollProgress({
    apply: (progress, node) => {
      const stage = node.firstElementChild?.firstElementChild;
      if (!stage || !progressMap?.length) return;

      const sorted = [...progressMap].sort((a, b) => a.at - b.at);
      const first = sorted[0];
      const last = sorted[sorted.length - 1];

      let index = 0;
      if (progress <= first.at) {
        index = 0;
      } else if (progress >= last.at) {
        index = sorted.length - 1;
      } else {
        for (let i = 0; i < sorted.length - 1; i += 1) {
          if (progress >= sorted[i].at && progress <= sorted[i + 1].at) {
            index = i;
            break;
          }
        }
      }

      const segment = sorted[index];
      const next = sorted[Math.min(index + 1, sorted.length - 1)];
      const local =
        index === 0
          ? Math.min(1, progress / Math.max(0.0001, next.at - segment.at))
          : (progress - segment.at) / Math.max(0.0001, next.at - segment.at);

      const blend = (a, b) => (typeof a === "number" && typeof b === "number" ? a + (b - a) * local : local > 0.5 ? b : a);

      stage.style.transform = blend(segment.transform ?? "none", next.transform ?? "none");
      stage.style.opacity = String(blend(segment.opacity ?? 1, next.opacity ?? 1));
    },
  });

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
        <div className="w-full will-change-transform" style={style}>
          {children}
        </div>
      </div>
    </div>
  );
}

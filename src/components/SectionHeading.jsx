import { useInView } from "../hooks/useInView";
import SplitText from "./motion/SplitText";
import Reveal from "./motion/Reveal";

export default function SectionHeading({ eyebrow, title, subtitle, align = "left", accent }) {
  const [lineRef, lineIn] = useInView({ threshold: 0.4 });

  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <Reveal from="up" className="flex items-center gap-3" style={align === "center" ? { justifyContent: "center" } : undefined}>
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold" />
          <span className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-gold">{eyebrow}</span>
        </Reveal>
      )}

      <h2 className="mt-3 text-balance font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl lg:text-5xl">
        <SplitText text={title} as="span" />
        {accent && (
          <>
            {" "}
            <span className="text-gold-gradient">
              <SplitText text={accent} as="span" delay={220} />
            </span>
          </>
        )}
      </h2>

      <div
        ref={lineRef}
        data-origin={align === "center" ? "center" : "left"}
        className={`reveal-line mt-5 h-px w-24 bg-gradient-to-r from-gold/70 to-transparent ${lineIn ? "is-visible" : ""}`}
      />

      {subtitle && (
        <Reveal from="up" delay={120} className="mt-4 block">
          <p className="max-w-xl text-pretty text-sm leading-7 text-muted sm:text-base">{subtitle}</p>
        </Reveal>
      )}
    </div>
  );
}

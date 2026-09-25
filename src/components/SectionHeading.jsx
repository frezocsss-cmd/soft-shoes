export default function SectionHeading({ eyebrow, title, subtitle, align = "left" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-gold">{eyebrow}</p>
      <h2 className="mt-3 text-balance font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl lg:text-5xl">{title}</h2>
      {subtitle && <p className="mt-4 max-w-xl text-sm leading-7 text-muted sm:text-base">{subtitle}</p>}
    </div>
  );
}

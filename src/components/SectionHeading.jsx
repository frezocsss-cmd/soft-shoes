export default function SectionHeading({ eyebrow, title, subtitle, align = "left", action }) {
  const centered = align === "center";

  return (
    <div
      className={
        centered
          ? "mx-auto flex max-w-2xl flex-col items-center text-center"
          : "flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10"
      }
    >
      <div className={centered ? "" : "max-w-2xl"}>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 className={`h-section mt-3 ${centered ? "" : "text-ink"}`}>{title}</h2>
        {subtitle ? <p className="lede mt-4 text-pretty">{subtitle}</p> : null}
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

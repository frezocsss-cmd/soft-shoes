export default function Marquee({ items, speed = 34, reverse = false, className = "", separator = "✦" }) {
  const row = [...items, ...items];
  return (
    <div className={`group relative flex overflow-hidden ${className}`}>
      <div
        className={`flex w-max shrink-0 items-center ${reverse ? "animate-marquee-rev" : "animate-marquee"} group-hover:[animation-play-state:paused]`}
        style={{ animationDuration: `${speed}s` }}
      >
        {row.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center">
            <span className="px-5">{item}</span>
            <span className="text-gold" aria-hidden="true">
              {separator}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

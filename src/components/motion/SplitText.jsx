import { useInView } from "../../hooks/useInView";

export default function SplitText({
  text,
  as: Tag = "span",
  className = "",
  wordClassName = "",
  stagger = 70,
  delay = 0,
  once = true,
}) {
  const [ref, inView] = useInView({ once, threshold: 0.2 });
  const words = String(text ?? "").split(" ");

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="inline-block overflow-hidden align-bottom"
          aria-hidden="true"
        >
          <span
            className={`inline-block will-change-transform ${wordClassName}`}
            style={{
              transform: inView ? "translateY(0)" : "translateY(110%)",
              opacity: inView ? 1 : 0,
              filter: inView ? "blur(0px)" : "blur(6px)",
              transition: `transform .95s var(--ease-out-expo) ${delay + index * stagger}ms, opacity .7s ease ${delay + index * stagger}ms, filter .7s ease ${delay + index * stagger}ms`,
            }}
          >
            {word}
            {index < words.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}

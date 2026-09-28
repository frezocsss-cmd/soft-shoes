import { useCountUp } from "../../hooks/useCountUp";

export default function CountUp({ value, decimals = 0, suffix = "", prefix = "", className = "" }) {
  const { ref, value: display } = useCountUp(value, { decimals });
  return (
    <span ref={ref} data-countup="" className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

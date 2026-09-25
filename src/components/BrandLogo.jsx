import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";

export default function BrandLogo({ inverted = false, onClick }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className="inline-flex items-center gap-3"
      aria-label="Soft Shoes bosh sahifasi"
    >
      <span
        className={`grid size-10 place-items-center overflow-hidden rounded-full border ${
          inverted ? "border-white/20 bg-white" : "border-ink/10 bg-white"
        }`}
      >
        <img src={logo} alt="Soft Shoes" className="size-full object-cover" />
      </span>
      <span className={`flex flex-col leading-none ${inverted ? "text-white" : "text-ink"}`}>
        <span className="text-[15px] font-extrabold tracking-[0.24em]">SOFT</span>
        <span className="mt-1 text-[10px] font-semibold tracking-[0.42em] opacity-60">SHOES</span>
      </span>
    </Link>
  );
}

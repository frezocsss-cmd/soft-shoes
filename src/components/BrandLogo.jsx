import { Link } from "react-router-dom";
import SmartImage from "./SmartImage";
import { PRODUCT_IMAGES } from "../lib/images";

export default function BrandLogo({ inverted = false, onClick }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className="group inline-flex items-center gap-3"
      aria-label="Soft Shoes bosh sahifasi"
    >
      <span
        className={`relative grid size-10 place-items-center overflow-hidden rounded-full border transition-all duration-500 group-hover:rotate-[18deg] group-hover:scale-110 ${
          inverted ? "border-white/20 bg-white" : "border-ink/10 bg-white"
        }`}
      >
        <span className="absolute inset-0 rounded-full bg-gold/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <SmartImage
          name={PRODUCT_IMAGES.logo}
          alt="Soft Shoes"
          priority
          sizes="40px"
          className="relative size-full"
          rootMargin="0px"
        />
      </span>
      <span className={`flex flex-col leading-none ${inverted ? "text-white" : "text-ink"}`}>
        <span className="text-[15px] font-extrabold tracking-[0.24em] transition-colors duration-500 group-hover:text-gold">
          SOFT
        </span>
        <span className="mt-1 text-[10px] font-semibold tracking-[0.42em] opacity-60">SHOES</span>
      </span>
    </Link>
  );
}

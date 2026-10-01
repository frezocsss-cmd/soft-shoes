import { Link } from "react-router-dom";
import SmartImage from "./SmartImage";
import { PRODUCT_IMAGES } from "../lib/images";

export default function BrandLogo({ onClick }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className="inline-flex shrink-0 items-center gap-2.5"
      aria-label="Soft Shoes — bosh sahifa"
    >
      <span className="block size-9 shrink-0 overflow-hidden rounded-xl border border-line bg-white">
        <SmartImage
          name={PRODUCT_IMAGES.logo}
          alt="Soft Shoes"
          priority
          sizes="36px"
          className="size-full"
          rootMargin="0px"
        />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-extrabold tracking-[-0.01em] text-ink">Soft Shoes</span>
        <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.28em] text-muted">Kolleksiya 2026</span>
      </span>
    </Link>
  );
}

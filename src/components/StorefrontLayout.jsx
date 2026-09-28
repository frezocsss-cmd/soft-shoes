import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import FloatingTelegram from "./FloatingTelegram";
import ScrollProgress from "./motion/ScrollProgress";
import BackToTop from "./motion/BackToTop";
import CursorGlow from "./CursorGlow";
import MagneticCursor from "./motion/MagneticCursor";
import ScrollFX from "./motion/ScrollFX";
import ScrollToTop from "./ScrollToTop";

export default function StorefrontLayout() {
  const { pathname } = useLocation();

  return (
    <div className="relative min-h-screen bg-canvas text-ink">
      <ScrollToTop />
      <ScrollFX />
      <CursorGlow />
      <MagneticCursor />
      <ScrollProgress />

      {/* ambient dekorativ qatlamlar */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="grid-lines absolute inset-0 opacity-70" />
        <div className="dots absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,#000_25%,transparent_72%)]" />
        <div className="blob absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-gold/10 blur-3xl [--blob-speed:22s]" />
        <div className="blob blob-2 absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-olive/10 blur-3xl [--blob-speed:28s]" />
        <div className="blob absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-gold/10 blur-3xl [--blob-speed:31s]" />
      </div>

      <Header />

      <main key={pathname} className="animate-page-in relative min-h-[60vh]">
        <Outlet />
      </main>

      <Footer />
      <FloatingTelegram />
      <BackToTop />
    </div>
  );
}

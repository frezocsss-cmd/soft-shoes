import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import FloatingActions from "./FloatingActions";
import CartDrawer from "./CartDrawer";
import ScrollProgress from "./motion/ScrollProgress";
import SiteBottomNav from "./SiteBottomNav";

export default function StorefrontLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <ScrollProgress />
      <Header />

      <main className="flex-1 pb-[calc(6.5rem+env(safe-area-inset-bottom,0px))] lg:pb-0">
        <Outlet />
      </main>

      <Footer />
      <FloatingActions />
      <CartDrawer />
      <SiteBottomNav />
    </div>
  );
}

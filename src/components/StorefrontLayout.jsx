import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import FloatingActions from "./FloatingActions";
import ScrollProgress from "./motion/ScrollProgress";

export default function StorefrontLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <ScrollProgress />
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}

import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import FloatingTelegram from "./FloatingTelegram";

export default function StorefrontLayout() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <Header />
      <main className="min-h-[60vh]">
        <Outlet />
      </main>
      <Footer />
      <FloatingTelegram />
    </div>
  );
}

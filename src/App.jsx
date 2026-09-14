import { LanguageProvider } from "./context/LanguageContext";
import Navbar from "./components/Navbar";
import ProfileHeader from "./components/ProfileHeader";
import Products from "./components/Products";
import Partners from "./components/Partners";
import TelegramCTA from "./components/TelegramCTA";
import PhoneCTA from "./components/PhoneCTA";
import Location from "./components/Location";
import Footer from "./components/Footer";
import FloatingContact from "./components/FloatingContact";
import "./App.css";

function App() {
  return (
    <LanguageProvider>
      <div className="site">
        <Navbar />
        <main>
          <ProfileHeader />
          <Products />
          <Partners />
          <TelegramCTA />
          <PhoneCTA />
          <Location />
        </main>
        <Footer />
        <FloatingContact />
      </div>
    </LanguageProvider>
  );
}

export default App;
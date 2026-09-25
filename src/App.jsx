import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { ProductProvider } from "./context/ProductContext";
import StorefrontLayout from "./components/StorefrontLayout";
import ScrollToTop from "./components/ScrollToTop";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AdminPage from "./pages/AdminPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <LanguageProvider>
      <ProductProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route element={<StorefrontLayout />}>
              <Route index element={<HomePage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/:productId" element={<ProductDetailsPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
            <Route path="admin" element={<AdminPage />} />
          </Routes>
        </BrowserRouter>
      </ProductProvider>
    </LanguageProvider>
  );
}

export default App;

import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { LanguageProvider } from "./context/LanguageContext";
import { ProductProvider } from "./context/ProductContext";
import StorefrontLayout from "./components/StorefrontLayout";
import ScrollToTop from "./components/ScrollToTop";
import HomePage from "./pages/HomePage";
import RouteFallback from "./components/RouteFallback";

/* Sahifalar alohida yuklanadi — bosh sahifada faqat kerakli JS
   tushadi, qolgani "fon"da yuklanib boradi. */
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const ProductDetailsPage = lazy(() => import("./pages/ProductDetailsPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function App() {
  return (
    <LanguageProvider>
      <ProductProvider>
        <BrowserRouter>
          <Analytics />
          <ScrollToTop />
          <Suspense fallback={<RouteFallback />}>
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
          </Suspense>
        </BrowserRouter>
      </ProductProvider>
    </LanguageProvider>
  );
}

export default App;

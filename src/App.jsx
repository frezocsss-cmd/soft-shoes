import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { LanguageProvider } from "./context/LanguageContext";
import { ProductProvider } from "./context/ProductContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import StorefrontLayout from "./components/StorefrontLayout";
import ScrollToTop from "./components/ScrollToTop";
import HomePage from "./pages/HomePage";
import RouteFallback from "./components/RouteFallback";

const CatalogPage = lazy(() => import("./pages/CatalogPage"));
const ProductDetailsPage = lazy(() => import("./pages/ProductDetailsPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function LegacyProductRedirect() {
  const { productId } = useParams();
  return <Navigate to={productId ? `/product/${productId}` : "/catalog"} replace />;
}

function App() {
  return (
    <LanguageProvider>
      <ProductProvider>
        <CartProvider>
          <AuthProvider>
            <BrowserRouter>
              <Analytics />
              <ScrollToTop />
              <Suspense fallback={<RouteFallback />}>
                <Routes>
                  <Route element={<StorefrontLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="catalog" element={<CatalogPage />} />
                    <Route path="product/:productId" element={<ProductDetailsPage />} />
                    <Route path="products" element={<Navigate to="/catalog" replace />} />
                    <Route path="products/:productId" element={<LegacyProductRedirect />} />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="contact" element={<ContactPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                  <Route path="admin/reset-password" element={<ResetPasswordPage />} />
                  <Route path="admin/*" element={<AdminPage />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </AuthProvider>
        </CartProvider>
      </ProductProvider>
    </LanguageProvider>
  );
}

export default App;

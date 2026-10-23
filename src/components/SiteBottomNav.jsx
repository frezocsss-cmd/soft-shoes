import { NavLink } from "react-router-dom";
import { Home, LayoutGrid, ShoppingBag, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const items = [
  { to: "/", label: "Bosh sahifa", icon: Home, end: true },
  { to: "/catalog", label: "Katalog", icon: LayoutGrid },
  { to: "/cart", label: "Savat", icon: ShoppingBag, badgeKey: "cart" },
  { to: "/admin", label: "Admin", icon: ShieldCheck, requireAdmin: true },
];

function Badge({ count }) {
  if (!count) return null;
  return (
    <span className="site-bottom-nav-badge" key={count} aria-label={`${count} ta mahsulot savatda`}>
      {count > 99 ? "99+" : count}
    </span>
  );
}

export default function SiteBottomNav() {
  const { isAdmin } = useAuth();
  const { count } = useCart();

  return (
    <nav className="site-bottom-nav lg:hidden" aria-label="Asosiy mobil navigatsiya">
      <span className="site-bottom-nav-highlight" aria-hidden="true" />
      {items.map(({ to, label, icon: Icon, end, badgeKey, requireAdmin }) => {
        if (requireAdmin && !isAdmin) return null;
        const badge = badgeKey === "cart" ? count : 0;
        return (
          <NavLink key={to} to={to} end={end} className="site-bottom-nav-item">
            {({ isActive }) => (
              <>
                <span className="site-bottom-nav-active" aria-hidden="true" />
                <span className="site-bottom-nav-icon">
                  <Icon size={20} strokeWidth={isActive ? 2.15 : 1.9} aria-hidden="true" />
                  <Badge count={badge} />
                </span>
                <span className="site-bottom-nav-label">{label}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}

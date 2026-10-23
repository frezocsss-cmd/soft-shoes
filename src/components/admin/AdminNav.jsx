import { NavLink } from "react-router-dom";
import { ClipboardList, LayoutDashboard, Package, Settings } from "lucide-react";

const ADMIN_NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Mahsulotlar", icon: Package },
  { to: "/admin/orders", label: "Buyurtmalar", icon: ClipboardList, badgeKey: "orders" },
  { to: "/admin/settings", label: "Sozlamalar", icon: Settings },
];

function badgeCountFor(item, newOrdersCount) {
  return item.badgeKey === "orders" ? newOrdersCount : 0;
}

function NavBadge({ count, className = "" }) {
  if (!count) return null;
  return (
    <span
      key={count}
      className={`admin-nav-badge ${className}`}
      aria-label={`${count} ta yangi buyurtma`}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

export function AdminDesktopNav({ newOrdersCount = 0 }) {
  return (
    <nav className="relative mt-10 space-y-1.5" aria-label="Admin navigatsiyasi">
      {ADMIN_NAV_ITEMS.map(({ to, label, icon: Icon, end, ...item }) => {
        const count = badgeCountFor(item, newOrdersCount);
        return (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-bold transition-all duration-300 ${
                isActive
                  ? "bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                  : "text-white/50 hover:translate-x-0.5 hover:bg-white/[0.06] hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`absolute left-0 top-1/2 h-6 w-[2px] -translate-y-1/2 rounded-full bg-gold-soft transition-all duration-300 ${
                    isActive ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
                  }`}
                  aria-hidden="true"
                />
                <Icon
                  size={18}
                  strokeWidth={isActive ? 2.2 : 1.8}
                  className={`transition-transform duration-300 ${isActive ? "text-gold-soft" : "group-hover:scale-105"}`}
                  aria-hidden="true"
                />
                <span>{label}</span>
                <NavBadge count={count} className="ml-auto" />
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}

export function AdminMobileNav({ newOrdersCount = 0 }) {
  return (
    <nav className="admin-bottom-nav lg:hidden" aria-label="Admin mobil navigatsiyasi">
      <span className="admin-bottom-highlight" aria-hidden="true" />
      {ADMIN_NAV_ITEMS.map(({ to, label, icon: Icon, end, ...item }) => {
        const count = badgeCountFor(item, newOrdersCount);
        return (
          <NavLink key={to} to={to} end={end} className="admin-bottom-item">
            <span className="admin-bottom-active" aria-hidden="true" />
            <span className="admin-bottom-icon">
              <Icon size={20} strokeWidth={1.9} aria-hidden="true" />
              <NavBadge count={count} className="admin-bottom-badge" />
            </span>
            <span className="admin-bottom-label">{label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

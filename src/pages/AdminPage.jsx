import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  Cloud,
  Database,
  ExternalLink,
  LogOut,
  MessageCircle,
  Package,
  Plus,
  RefreshCw,
  Settings,
  ShieldCheck,
  TriangleAlert,
  UserRound,
} from "lucide-react";
import BrandLogo from "../components/BrandLogo";
import AdminLogin from "../components/admin/AdminLogin";
import AdminProducts from "../components/admin/AdminProducts";
import ProductForm from "../components/admin/ProductForm";
import { AdminDesktopNav, AdminMobileNav } from "../components/admin/AdminNav";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/useProducts";
import { TELEGRAM_LINK } from "../data/config";

const SECTIONS = new Set(["overview", "products", "settings"]);

const SECTION_META = {
  overview: { eyebrow: "Store overview", title: "Boshqaruv paneli" },
  products: { eyebrow: "Inventory", title: "Mahsulotlar" },
  settings: { eyebrow: "Workspace", title: "Sozlamalar" },
};


function AdminSetup() {
  return (
    <div className="grid min-h-screen place-items-center bg-ink px-4 py-12 text-white">
      <div className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-white/[0.05] p-7 shadow-2xl backdrop-blur-xl sm:p-10">
        <BrandLogo inverted />
        <span className="mt-10 grid size-14 place-items-center rounded-2xl bg-gold/15 text-gold-soft">
          <Database size={24} aria-hidden="true" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-semibold">Supabase Auth sozlanmagan</h1>
        <p className="mt-3 text-sm leading-7 text-white/55">
          Admin panelga kirish va rasm saqlash uchun Supabase ulanishini qo'shing.
        </p>
        <div className="mt-6 space-y-3 rounded-2xl bg-black/20 p-4 font-mono text-xs text-white/70">
          <p>VITE_SUPABASE_URL</p>
          <p>VITE_SUPABASE_PUBLISHABLE_KEY</p>
        </div>
        <p className="mt-4 text-xs leading-6 text-white/40">
          Qiymatlarni <code>.env.local</code> fayliga yozing va{" "}
          <code>supabase/fix_admin_auth.sql</code> hamda <code>supabase/storage_setup.sql</code>{" "}
          fayllarini Supabase SQL Editor'da bajaring.
        </p>
        <Link
          to="/"
          className="mt-7 inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-ink"
        >
          <ExternalLink size={16} aria-hidden="true" /> Saytni ko'rish
        </Link>
      </div>
    </div>
  );
}

function AdminLoading() {
  return (
    <div className="grid min-h-screen place-items-center bg-canvas text-ink">
      <div className="text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-white shadow-card">
          <Cloud className="animate-pulse text-gold" size={24} aria-hidden="true" />
        </span>
        <p className="mt-4 text-sm font-bold text-muted">Admin huquqi tekshirilmoqda...</p>
      </div>
    </div>
  );
}

function StatCard({ label, value, hint, icon: Icon, tone, delay = 0 }) {
  return (
    <article
      style={{ animationDelay: `${delay}ms` }}
      className="animate-rise fx-glow fx-lift-soft rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <span className={`grid size-10 place-items-center rounded-xl ${tone}`}>
          <Icon size={18} aria-hidden="true" />
        </span>
        <span className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{value}</span>
      </div>
      <p className="mt-4 text-[11px] font-extrabold text-ink sm:text-xs">{label}</p>
      <p className="mt-1 text-[10px] font-semibold text-muted">{hint}</p>
    </article>
  );
}

export default function AdminPage() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { configured, isAdmin, loading, user, signOut } = useAuth();
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts,
    dataSource,
    syncStatus,
    syncError,
  } = useProducts();

  const segment = pathname.replace(/^\/admin\/?/, "").split("/")[0];
  const section = SECTIONS.has(segment) ? segment : "overview";
  const meta = SECTION_META[section];

  const [editingProduct, setEditingProduct] = useState(null);
  const [operationBusy, setOperationBusy] = useState(false);
  const [notice, setNotice] = useState(null);

  const noticeTimer = useRef(null);
  const formRef = useRef(null);

  const showNotice = useCallback((type, text) => {
    window.clearTimeout(noticeTimer.current);
    setNotice({ type, text });
    noticeTimer.current = window.setTimeout(() => setNotice(null), 4200);
  }, []);

  useEffect(() => () => window.clearTimeout(noticeTimer.current), []);

  const productsReady = syncStatus === "ready" || syncStatus === "local";
  const totalStock = useMemo(
    () => products.reduce((sum, product) => sum + (product.stock ?? 0), 0),
    [products],
  );
  const lowStock = useMemo(
    () => products.filter((product) => product.stock != null && product.stock <= 3),
    [products],
  );

  const goToForm = () => {
    window.requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handleCreate = () => {
    setEditingProduct(null);
    if (section !== "products") navigate("/admin/products");
    goToForm();
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    if (section !== "products") navigate("/admin/products");
    goToForm();
  };

  const handleProductSubmit = async (payload) => {
    setOperationBusy(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
        showNotice("success", "Mahsulot yangilandi.");
        setEditingProduct(null);
      } else {
        await addProduct(payload);
        showNotice("success", "Yangi mahsulot qo'shildi.");
      }
    } finally {
      setOperationBusy(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`“${product.name}” mahsulotini o'chirilsinmi?`)) return;
    setOperationBusy(true);
    try {
      await deleteProduct(product.id);
      if (String(editingProduct?.id) === String(product.id)) setEditingProduct(null);
      showNotice("success", "Mahsulot o'chirildi.");
    } catch (error) {
      showNotice("error", error.message || "Mahsulotni o'chirib bo'lmadi");
    } finally {
      setOperationBusy(false);
    }
  };


  const handleRefresh = async () => {
    setOperationBusy(true);
    try {
      await refreshProducts();
      showNotice("success", "Ma'lumotlar yangilandi.");
    } catch (error) {
      showNotice("error", error.message || "Ma'lumotlarni yangilab bo'lmadi");
    } finally {
      setOperationBusy(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin", { replace: true });
  };

  if (!configured) return <AdminSetup />;
  if (loading) return <AdminLoading />;
  if (!isAdmin) return <AdminLogin />;

  const stats = [
    {
      label: "Mahsulotlar",
      value: productsReady ? products.length : "—",
      hint:
        syncStatus === "loading"
          ? "MockAPI yuklanmoqda..."
          : syncStatus === "error"
            ? "MockAPI'dan olinmadi"
            : dataSource === "local"
              ? "MockAPI sozlanmagan"
              : "Katalogdagi pozitsiyalar",
      icon: Package,
      tone: "bg-blue-50 text-blue-700",
    },
    {
      label: "Ombordagi dona",
      value: productsReady ? totalStock : "—",
      hint: productsReady
        ? `${lowStock.length} ta mahsulot kam qolgan`
        : syncStatus === "loading"
          ? "Yuklanmoqda..."
          : "Inventar mavjud emas",
      icon: Boxes,
      tone: "bg-emerald-50 text-emerald-700",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f3f4f0] text-ink">
      <aside className="noise admin-side-glass fixed inset-y-0 left-0 z-40 hidden w-[264px] flex-col overflow-hidden border-r border-white/10 p-6 text-white lg:flex">
        <div className="pointer-events-none absolute inset-0 grid-lines-dark opacity-40" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -left-24 top-1/4 size-64 rounded-full opacity-70 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(200,168,107,0.26), transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative">
          <BrandLogo inverted />
          <p className="mt-2 pl-[52px] text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
            Store manager
          </p>
        </div>

        <AdminDesktopNav />

        <div className="relative mt-auto space-y-3">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-[11px] font-bold text-white/65 transition hover:border-white/30 hover:text-white"
          >
            <ExternalLink size={13} aria-hidden="true" /> Saytni ko'rish
          </Link>

          <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-black/15 p-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/10 text-gold-soft">
              <UserRound size={14} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[10px] font-bold text-white/70">{user?.email}</p>
              <p className="text-[9px] font-semibold text-white/30">Administrator</p>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="grid size-8 place-items-center rounded-lg text-white/40 transition hover:bg-white/10 hover:text-white"
              aria-label="Chiqish"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-[264px]">
        <header className="sticky top-0 z-30 border-b border-line/80 bg-[#f3f4f0]/85 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between gap-3 px-4 sm:px-6 lg:h-20 lg:px-10">
            <div className="flex min-w-0 items-center gap-3">
              <div className="lg:hidden">
                <BrandLogo />
              </div>
              <div className="hidden lg:block">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-muted">{meta.eyebrow}</p>
                <h1 className="mt-0.5 text-sm font-extrabold text-ink">{meta.title}</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`hidden items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-extrabold sm:inline-flex ${
                  syncStatus === "ready"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : syncStatus === "loading"
                      ? "border-line bg-white text-muted"
                      : "border-amber-200 bg-amber-50 text-amber-700"
                }`}
              >
                <span
                  className={`size-1.5 rounded-full ${
                    syncStatus === "ready"
                      ? "bg-emerald-500"
                      : syncStatus === "loading"
                        ? "animate-pulse bg-muted/50"
                        : "bg-amber-500"
                  }`}
                  aria-hidden="true"
                />
                {syncStatus === "ready"
                  ? "MockAPI ulangan"
                  : syncStatus === "loading"
                    ? "MockAPI yuklanmoqda..."
                    : syncStatus === "error"
                      ? "MockAPI xatosi"
                      : "MockAPI sozlanmagan"}
              </span>
              <button
                type="button"
                onClick={handleRefresh}
                disabled={operationBusy}
                className="grid size-10 place-items-center rounded-full border border-line bg-white text-muted transition hover:-translate-y-0.5 hover:border-gold hover:text-gold disabled:opacity-50"
                aria-label="Ma'lumotlarni yangilash"
              >
                <RefreshCw size={15} className={operationBusy ? "animate-spin" : ""} />
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className="grid size-10 place-items-center rounded-full border border-line bg-white text-muted transition hover:border-red-200 hover:text-red-600 lg:hidden"
                aria-label="Chiqish"
              >
                <LogOut size={15} />
              </button>
              <Link
                to="/"
                className="hidden h-10 items-center gap-2 rounded-full bg-ink px-4 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-ink-soft hover:shadow-lift sm:inline-flex"
              >
                Sayt <ExternalLink size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </header>

        <main className="admin-content mx-auto max-w-[1500px] px-4 pt-6 sm:px-6 lg:px-10 lg:pt-9">
          {notice ? (
            <div
              className={`animate-pop fixed right-4 top-20 z-50 flex max-w-sm items-start gap-2.5 rounded-2xl border px-4 py-3 text-xs font-semibold shadow-xl sm:right-7 lg:top-24 ${
                notice.type === "error"
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
              }`}
              role="status"
            >
              {notice.type === "error" ? (
                <TriangleAlert size={17} className="mt-0.5 shrink-0" />
              ) : (
                <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
              )}
              {notice.text}
            </div>
          ) : null}

          {syncError ? (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <TriangleAlert className="mt-0.5 shrink-0" size={18} />
              <div>
                <p className="font-bold">Mahsulotlar sinxronizatsiyasida xatolik</p>
                <p className="mt-1 text-xs font-semibold">{syncError}</p>
              </div>
            </div>
          ) : null}

          {section === "overview" ? (
            <div className="space-y-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="eyebrow">Xush kelibsiz</p>
                  <h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">Do'kon holati</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={handleCreate} className="btn btn-primary btn-sm">
                    <Plus size={15} aria-hidden="true" /> Mahsulot qo'shish
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                {stats.map((stat, index) => (
                  <StatCard key={stat.label} {...stat} delay={index * 70} />
                ))}
              </div>

              {dataSource === "local" ? (
                <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  <TriangleAlert className="mt-0.5 shrink-0" size={18} />
                  <div>
                    <p className="font-bold">MockAPI sozlanmagan</p>
                    <p className="mt-1 text-xs font-semibold leading-5">
                      Mahsulotlar va inventar MockAPI'dan olinadi.{" "}
                      <code className="rounded bg-white/60 px-1">VITE_MOCKAPI_BASE_URL</code> qiymatini{" "}
                      <code className="rounded bg-white/60 px-1">.env.local</code> fayliga qo'shing.
                    </p>
                  </div>
                </div>
              ) : null}

              <section className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
                <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-gold">Inventory</p>
                    <h3 className="mt-1 text-base font-extrabold text-ink">Kam qolgan mahsulotlar</h3>
                  </div>
                  <Link
                    to="/admin/products"
                    className="inline-flex items-center gap-1 text-[11px] font-extrabold text-gold hover:text-gold-deep"
                  >
                    Katalog <ArrowUpRight size={13} aria-hidden="true" />
                  </Link>
                </div>

                {lowStock.length ? (
                  <ul className="divide-y divide-line">
                    {lowStock.slice(0, 5).map((product) => (
                      <li key={product.id} className="flex items-center gap-3 px-5 py-3.5">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-extrabold text-ink">{product.name}</p>
                          <p className="mt-0.5 text-[10px] font-semibold text-muted">
                            {product.category}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${
                            product.stock <= 0
                              ? "bg-rose-50 text-rose-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {product.stock <= 0 ? "Tugagan" : `${product.stock} dona`}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="grid min-h-52 place-items-center p-6 text-center">
                    <div>
                      <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                        <CheckCircle2 size={20} />
                      </span>
                      <p className="mt-3 text-xs font-extrabold text-ink">Ombor holati yaxshi</p>
                      <p className="mt-1 text-[10px] text-muted">Kam qolgan mahsulotlar yo'q.</p>
                    </div>
                  </div>
                )}
              </section>
            </div>
          ) : null}

          {section === "products" ? (
            <div className="grid items-start gap-6 xl:grid-cols-[410px_minmax(0,1fr)]">
              <div ref={formRef} className="scroll-mt-24 xl:sticky xl:top-24">
                <ProductForm
                  key={editingProduct?.id ?? "new"}
                  product={editingProduct}
                  busy={operationBusy}
                  onSubmit={handleProductSubmit}
                  onCancel={() => setEditingProduct(null)}
                />
              </div>
              <AdminProducts
                products={products}
                busy={operationBusy}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onCreate={handleCreate}
              />
            </div>
          ) : null}


          {section === "settings" ? (
            <div className="space-y-5">
              <div>
                <p className="eyebrow">Workspace</p>
                <h2 className="mt-1 text-2xl font-extrabold tracking-tight">Sozlamalar</h2>
                <p className="mt-1 text-xs text-muted">Hisob, ulanish va xavfsizlik holati.</p>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <section className="rounded-2xl border border-line bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-9 place-items-center rounded-xl bg-blue-50 text-blue-700">
                      <UserRound size={17} />
                    </span>
                    <h3 className="text-sm font-extrabold text-ink">Hisob</h3>
                  </div>
                  <dl className="mt-4 space-y-3 text-xs">
                    <div className="flex items-center justify-between gap-3">
                      <dt className="font-semibold text-muted">Email</dt>
                      <dd className="truncate font-bold text-ink">{user?.email}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="font-semibold text-muted">Rol</dt>
                      <dd className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-extrabold text-emerald-700">
                        Administrator
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="font-semibold text-muted">Auth</dt>
                      <dd className="font-bold text-ink">Supabase Auth</dd>
                    </div>
                  </dl>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="mt-5 inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 text-xs font-bold text-muted transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                  >
                    <LogOut size={14} /> Hisobdan chiqish
                  </button>
                </section>

                <section className="rounded-2xl border border-line bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-9 place-items-center rounded-xl bg-amber-50 text-amber-700">
                      <Database size={17} />
                    </span>
                    <h3 className="text-sm font-extrabold text-ink">Ma'lumotlar ulanishi</h3>
                  </div>
                  <dl className="mt-4 space-y-3 text-xs">
                    <div className="flex items-center justify-between gap-3">
                      <dt className="font-semibold text-muted">Manba</dt>
                      <dd className="font-bold uppercase text-ink">{dataSource}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="font-semibold text-muted">Holat</dt>
                      <dd className="font-bold text-ink">
                        {syncStatus === "loading"
                          ? "Yuklanmoqda..."
                          : syncStatus === "error"
                            ? "Xatolik"
                            : syncStatus === "ready"
                              ? "Ulangan"
                              : "Mahalliy (MockAPI yo'q)"}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="font-semibold text-muted">Rasmlar</dt>
                      <dd className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-extrabold text-emerald-700">
                        Supabase Storage (product-images)
                      </dd>
                    </div>
                  </dl>
                  <button
                    type="button"
                    onClick={handleRefresh}
                    disabled={operationBusy}
                    className="mt-5 inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 text-xs font-bold text-muted transition hover:border-gold hover:text-gold disabled:opacity-50"
                  >
                    <RefreshCw size={14} className={operationBusy ? "animate-spin" : ""} /> Sinxronlash
                  </button>
                </section>

                <section className="rounded-2xl border border-line bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                      <ShieldCheck size={17} />
                    </span>
                    <h3 className="text-sm font-extrabold text-ink">Xavfsizlik</h3>
                  </div>
                  <p className="mt-3 text-xs leading-6 text-muted">
                    Admin amallari Supabase Auth sessiyasi, <code>is_store_admin()</code> tekshiruvi va
                    Row Level Security siyosatlari bilan himoyalangan. Maxfiy kalitlar frontendda
                    saqlanmaydi.
                  </p>
                </section>

                <section className="rounded-2xl border border-line bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-9 place-items-center rounded-xl bg-violet-50 text-violet-700">
                      <Settings size={17} />
                    </span>
                    <h3 className="text-sm font-extrabold text-ink">Tezkor havolalar</h3>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link to="/" className="btn btn-outline btn-sm">
                      <ExternalLink size={14} /> Saytni ko'rish
                    </Link>
                    <a href={TELEGRAM_LINK} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                      <MessageCircle size={14} /> Telegram
                    </a>
                  </div>
                  <p className="mt-3 text-[10px] leading-5 text-muted">
                    Buyurtmalar saytdan keladi; Telegram havolasi mijozlar bilan bog'lanish uchun.
                  </p>
                </section>
              </div>
            </div>
          ) : null}
        </main>
      </div>

      <AdminMobileNav />
    </div>
  );
}

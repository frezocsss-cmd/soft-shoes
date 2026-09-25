import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Boxes,
  CircleDollarSign,
  Cloud,
  Database,
  ExternalLink,
  ImagePlus,
  KeyRound,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Mail,
  MessageCircle,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Send,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import BrandLogo from "../components/BrandLogo";
import { formatPrice } from "../data/productUtils";
import { useProducts } from "../context/useProducts";
import { TELEGRAM_LINK } from "../data/config";
import { supabase } from "../lib/supabase";

const emptyProduct = {
  name: "",
  price: "",
  image: "",
};

const inputClass =
  "mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#b58a45] focus:ring-4 focus:ring-[#b58a45]/10";

function Field({ label, ...props }) {
  return (
    <label className="block text-xs font-bold text-slate-600">
      {label}
      <input className={inputClass} {...props} />
    </label>
  );
}

function readProductImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Rasmni o'qib bo'lmadi"));
    reader.onload = () => {
      const image = new globalThis.Image();
      image.onerror = () => reject(new Error("Rasm formati qo'llab-quvvatlanmaydi"));
      image.onload = () => {
        const maxSide = 1100;
        const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.naturalWidth * scale);
        canvas.height = Math.round(image.naturalHeight * scale);
        const context = canvas.getContext("2d");
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function productToForm(product) {
  return {
    name: product.name || product.nameUz || product.nameRu,
    price: String(product.price),
    image: product.image_url || product.image,
  };
}

function AdminSetup() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#191a16] px-4 py-12 text-white">
      <div className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 shadow-2xl sm:p-10">
        <BrandLogo inverted />
        <span className="mt-10 grid size-14 place-items-center rounded-2xl bg-[#b58a45]/15 text-[#d8ad68]"><Database size={24} /></span>
        <h1 className="mt-6 font-display text-3xl font-semibold">Supabase sozlanmagan</h1>
        <p className="mt-3 text-sm leading-7 text-white/55">Admin panel va umumiy mahsulot bazasi uchun Supabase ulanishini qo'shing.</p>
        <div className="mt-6 space-y-3 rounded-2xl bg-black/20 p-4 font-mono text-xs text-white/70">
          <p>VITE_SUPABASE_URL</p>
          <p>VITE_SUPABASE_PUBLISHABLE_KEY</p>
        </div>
        <p className="mt-4 text-xs leading-6 text-white/40">Qiymatlarni `.env.local` fayliga yozing va `supabase/schema.sql` hamda `supabase/admin_auth.sql` fayllarini Supabase SQL Editor'da bajariring.</p>
        <Link to="/" className="mt-7 inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-[#191a16]"><ExternalLink size={16} /> Saytni ko'rish</Link>
      </div>
    </div>
  );
}

function AdminLogin({ error, onError, onSession }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    onError("");
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        onError(signInError.message);
        return;
      }

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        onError(sessionError.message);
        return;
      }

      const session = sessionData.session;
      console.log("SESSION:", session);
      console.log("USER:", session?.user);
      console.log("EMAIL:", session?.user?.email);

      if (!session) {
        onError("Admin login required");
        return;
      }
      if (!session.user?.email) {
        onError("Sessionda email yo'q, qayta kiring");
        return;
      }

      onSession(session);
    } catch (error) {
      onError(error.message || "Login paytida xatolik yuz berdi");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-[#eceee8] lg:grid-cols-[0.9fr_1.1fr]">
      <div className="hidden bg-[#191a16] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <BrandLogo inverted />
        <div className="max-w-lg"><p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-[#d8ad68]">Soft Shoes Store Manager</p><h1 className="mt-4 font-display text-5xl font-semibold leading-tight">Mahsulotlaringizni barcha mijozlarga ko'rsating.</h1><p className="mt-5 text-sm leading-7 text-white/50">Supabase orqali qo'shilgan mahsulotlar saytning barcha qurilmalarida darhol ko'rinadi.</p></div>
        <p className="text-xs text-white/30">Xavfsiz admin kirish</p>
      </div>
      <div className="grid place-items-center px-4 py-12 sm:px-8">
        <form onSubmit={handleSubmit} className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-7 shadow-xl sm:p-10">
          <div className="lg:hidden"><BrandLogo /></div>
          <span className="mt-9 grid size-12 place-items-center rounded-2xl bg-[#191a16] text-[#d8ad68] lg:mt-0"><LockKeyhole size={21} /></span>
          <h2 className="mt-6 text-2xl font-extrabold text-slate-900">Admin panelga kirish</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">Faqat store_admins ro‘yxatidagi email kirish huquqiga ega.</p>
          {error && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">{error}</div>}
          <label className="mt-6 block text-xs font-bold text-slate-600">Email<div className="relative mt-2"><Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" className={`${inputClass} mt-0 pl-10`} placeholder="owner@example.com" /></div></label>
          <label className="mt-4 block text-xs font-bold text-slate-600">Parol<div className="relative mt-2"><KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" className={`${inputClass} mt-0 pl-10`} placeholder="••••••••" /></div></label>
          <button type="submit" disabled={busy} className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#191a16] text-sm font-extrabold text-white transition hover:bg-[#59624a] disabled:opacity-50">{busy ? "Kiritilmoqda..." : "Admin panelga kirish"}</button>
          <Link to="/" className="mt-5 flex items-center justify-center gap-2 text-xs font-bold text-slate-500 transition hover:text-slate-900"><ExternalLink size={14} /> Bosh sahifaga qaytish</Link>
        </form>
      </div>
    </div>
  );
}

function AdminLoading() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#eceee8] text-[#191a16]">
      <div className="text-center"><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-white shadow-card"><Cloud className="animate-pulse text-[#b58a45]" size={24} /></span><p className="mt-4 text-sm font-bold text-slate-500">Supabase bilan ulanmoqda...</p></div>
    </div>
  );
}

export default function AdminPage() {
  const navigate = useNavigate();
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts,
    isCloudEnabled,
    syncStatus,
    syncError,
  } = useProducts();
  const formRef = useRef(null);
  const fileInputRef = useRef(null);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [notice, setNotice] = useState(null);
  const [imageBusy, setImageBusy] = useState(false);
  const [operationBusy, setOperationBusy] = useState(false);
  const [session, setSession] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    if (!supabase) return undefined;
    let active = true;
    supabase.auth.getSession()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) setAuthError(error.message || "Auth sessionini olishda xatolik yuz berdi");
        console.log("SESSION:", data.session);
        console.log("USER:", data.session?.user);
        console.log("EMAIL:", data.session?.user?.email);
        setSession(data.session);
        setAuthLoading(false);
      })
      .catch((error) => {
        if (!active) return;
        setAuthError(error.message || "Auth sessionini olishda xatolik yuz berdi");
        setAuthLoading(false);
      });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      setSession(nextSession);
      setAuthorized(false);
      setAuthLoading(false);
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!supabase || authLoading || !session) return undefined;

    let active = true;
    supabase
      .rpc("is_store_admin")
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          setAuthError(`Admin huquqini tekshirish xatosi: ${error.message}`);
          setSession(null);
          supabase.auth.signOut();
          return;
        }
        if (!data) {
          setAuthError("Bu email store_admins jadvalida yo'q. Admin panelga kirish huquqi berilmagan.");
          setSession(null);
          supabase.auth.signOut();
          return;
        }
        setAuthError("");
        setAuthorized(true);
      })
      .catch((error) => {
        if (!active) return;
        setAuthError(`Admin huquqini tekshirish xatosi: ${error.message}`);
        setSession(null);
        supabase.auth.signOut();
      });

    return () => {
      active = false;
    };
  }, [authLoading, session]);

  useEffect(() => {
    if (authorized) navigate("/admin", { replace: true });
  }, [authorized, navigate]);

  if (!isCloudEnabled) return <AdminSetup />;
  if (authLoading || (session && !authorized)) return <AdminLoading />;
  if (!authorized) return <AdminLogin error={authError} onError={setAuthError} onSession={setSession} />;

  const totalStock = products.reduce((sum, product) => sum + (product.stock ?? 0), 0);
  const lowStock = products.filter((product) => product.stock != null && product.stock > 0 && product.stock <= 3).length;
  const categoryCount = new Set(products.map((product) => product.category)).size;

  const showNotice = (type, text) => {
    setNotice({ type, text });
    window.setTimeout(() => setNotice(null), 4000);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showNotice("error", "Faqat rasm faylini tanlang.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showNotice("error", "Rasm hajmi 5 MB dan kam bo'lishi kerak.");
      return;
    }

    setImageBusy(true);
    try {
      const image = await readProductImage(file);
      setForm((current) => ({ ...current, image }));
      showNotice("success", "Rasm tayyorlandi.");
    } catch (error) {
      showNotice("error", error.message);
    } finally {
      setImageBusy(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isCloudEnabled) {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        showNotice("error", "Admin login required");
        return;
      }
    }

    const name = form.name.trim();
    const price = Number(form.price);
    const image = form.image.trim();

    if (!name || !image || !Number.isSafeInteger(price) || price <= 0) {
      showNotice("error", "Name, price va rasmni to'ldiring. Price butun son bo'lishi kerak.");
      return;
    }

    const product = {
      name,
      price,
      image,
      image_url: image,
    };

    setOperationBusy(true);
    try {
      if (editingId !== null) {
        await updateProduct(editingId, product);
        showNotice("success", "Mahsulot yangilandi.");
      } else {
        await addProduct(product);
        showNotice("success", "Yangi mahsulot qo'shildi.");
      }
      setForm(emptyProduct);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setEditingId(null);
    } catch (error) {
      showNotice("error", error.message || "Mahsulotni saqlab bo'lmadi");
    } finally {
      setOperationBusy(false);
    }
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setForm(productToForm(product));
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyProduct);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`“${product.name}” mahsulotini o'chirilsinmi?`)) return;
    setOperationBusy(true);
    try {
      await deleteProduct(product.id);
      if (String(editingId) === String(product.id)) cancelEdit();
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
    await supabase.auth.signOut();
    setAuthError("");
    setAuthorized(false);
    setSession(null);
  };

  const stats = [
    { label: "Mahsulotlar", value: products.length, icon: Package, color: "bg-blue-50 text-blue-700" },
    { label: "Ombordagi dona", value: totalStock, icon: Boxes, color: "bg-emerald-50 text-emerald-700" },
    { label: "Kam qolgan", value: lowStock, icon: TriangleAlert, color: "bg-amber-50 text-amber-700" },
    { label: "Kategoriyalar", value: categoryCount, icon: CircleDollarSign, color: "bg-violet-50 text-violet-700" },
  ];

  return (
    <div className="min-h-screen bg-[#f3f4f0] text-slate-900 lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="hidden min-h-screen flex-col bg-[#191a16] p-6 text-white lg:fixed lg:inset-y-0 lg:flex lg:w-[250px]">
        <BrandLogo inverted />
        <p className="mt-2 pl-[52px] text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">Store manager</p>
        <nav className="mt-12 space-y-2">
          <a href="#overview" className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm font-bold"><LayoutDashboard size={18} /> Boshqaruv paneli</a>
          <a href="#products" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/60 transition hover:bg-white/5 hover:text-white"><Package size={18} /> Mahsulotlar</a>
          <a href={TELEGRAM_LINK} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/60 transition hover:bg-white/5 hover:text-white"><MessageCircle size={18} /> Buyurtmalar <ExternalLink size={13} className="ml-auto" /></a>
        </nav>
        <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-gold"><Send size={14} /> Telegram buyurtma</div>
          <p className="mt-2 text-[11px] leading-5 text-white/45">Yangi buyurtmalar faqat Telegram orqali qabul qilinadi.</p>
        </div>
        <Link to="/" className="mt-4 flex items-center justify-center gap-2 rounded-full border border-white/15 px-4 py-3 text-xs font-bold text-white/70 transition hover:border-white/30 hover:text-white"><ExternalLink size={14} /> Saytni ko'rish</Link>
      </aside>

      <div className="lg:col-start-2">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-[#f3f4f0]/90 backdrop-blur-xl">
          <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-10">
            <div className="flex items-center justify-between gap-3 lg:hidden"><BrandLogo /><button type="button" onClick={handleSignOut} className="grid size-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-600"><LogOut size={16} /></button></div>
            <div className="hidden lg:block"><p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400">Soft Shoes / Admin</p><p className="mt-1 text-sm font-extrabold text-slate-900">Mahsulotlar boshqaruvi</p></div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={handleRefresh} disabled={operationBusy} className="grid size-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:text-slate-900 disabled:opacity-50" aria-label="Yangilash"><RefreshCw size={15} className={operationBusy ? "animate-spin" : ""} /></button>
              <button type="button" onClick={handleSignOut} className="hidden h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 transition hover:border-red-200 hover:text-red-600 sm:inline-flex"><LogOut size={15} /> Chiqish</button>
              <Link to="/" className="inline-flex h-10 items-center gap-2 rounded-full bg-[#191a16] px-4 text-xs font-bold text-white transition hover:bg-[#59624a]">Sayt <ExternalLink size={14} /></Link>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1500px] px-4 py-7 sm:px-6 lg:px-10 lg:py-10">
          {notice && (
            <div className={`fixed right-4 top-24 z-50 flex max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-xl sm:right-7 ${notice.type === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
              {notice.type === "error" ? <TriangleAlert size={18} /> : <Save size={18} />}{notice.text}
            </div>
          )}
          <div className={`mb-6 flex items-start gap-3 rounded-2xl border p-4 text-sm ${syncError ? "border-amber-200 bg-amber-50 text-amber-800" : "border-emerald-100 bg-emerald-50 text-emerald-800"}`}>
            {syncError ? <TriangleAlert className="mt-0.5 shrink-0" size={18} /> : <Cloud className="mt-0.5 shrink-0" size={18} />}
            <div>
              <p><strong>Supabase ulangan:</strong> {session.user.email} sifatida kirgansiz. Qo‘shilgan mahsulotlar barcha mijozlarda ko‘rinadi.</p>
              {syncError && <p className="mt-1 text-xs font-semibold">{syncError}</p>}
              {syncStatus === "loading" && <p className="mt-1 text-xs font-semibold">Ma’lumotlar yuklanmoqda...</p>}
            </div>
          </div>

          <section id="overview">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div><p className="text-xs font-bold text-[#b58a45]">Xush kelibsiz</p><h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">Do'kon holati</h1></div>
              <p className="text-xs text-slate-400">Oxirgi yangilanish: {new Date().toLocaleDateString("uz-UZ")}</p>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map(({ label, value, icon: Icon, color }) => (
                <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between"><span className={`grid size-10 place-items-center rounded-xl ${color}`}><Icon size={18} /></span><span className="font-display text-3xl font-semibold text-slate-900">{value}</span></div>
                  <p className="mt-4 text-xs font-bold text-slate-500">{label}</p>
                </article>
              ))}
            </div>
          </section>

          <div className="mt-7 grid items-start gap-6 xl:grid-cols-[390px_minmax(0,1fr)]">
            <section ref={formRef} className="scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div><p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#b58a45]">Katalog</p><h2 className="mt-1 text-lg font-extrabold">{editingId ? "Mahsulotni tahrirlash" : "Yangi mahsulot"}</h2></div>
                {editingId && <button type="button" onClick={cancelEdit} className="grid size-9 place-items-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"><X size={16} /></button>}
              </div>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <span className="text-xs font-bold text-slate-600">Image</span>
                  <label className="mt-2 flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-3 transition hover:border-[#b58a45] hover:bg-amber-50/40">
                    <div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-white text-slate-400 shadow-sm">
                      {form.image ? <img src={form.image} alt="Product preview" className="size-full object-cover" /> : <ImagePlus size={20} />}
                    </div>
                    <div><p className="text-xs font-extrabold text-slate-800">{imageBusy ? "Rasm tayyorlanmoqda..." : "Image faylni tanlash"}</p><p className="mt-1 text-[10px] leading-4 text-slate-400">JPG, PNG yoki WebP · max 5 MB</p></div>
                    <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImage} className="sr-only" disabled={imageBusy || operationBusy} />
                  </label>
                </div>
                <Field name="name" value={form.name} onChange={handleChange} required placeholder="Product name" label="Name" />
                <Field name="price" type="number" min="1" step="1" value={form.price} onChange={handleChange} required placeholder="590000" label="Price (so'm)" />
                <button type="submit" disabled={imageBusy || operationBusy} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#191a16] text-sm font-extrabold text-white transition hover:bg-[#59624a] disabled:opacity-50">
                  {editingId ? <Save size={17} /> : <Plus size={17} />} {editingId ? "Save Product" : "Add Product"}
                </button>
              </form>
            </section>

            <section id="products" className="scroll-mt-28 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-6">
                <div><p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#b58a45]">Inventory</p><h2 className="mt-1 text-lg font-extrabold">Mahsulotlar ro'yxati</h2></div>
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-extrabold text-slate-600">{products.length} dona</span>
              </div>
              {products.length ? (
                <>
                  <div className="hidden overflow-x-auto md:block">
                    <table className="w-full min-w-[560px] border-collapse text-left">
                      <thead><tr className="border-b border-slate-100 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400"><th className="px-6 py-4">Product</th><th className="px-4 py-4">Price</th><th className="px-6 py-4 text-right">Amal</th></tr></thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70">
                            <td className="px-6 py-4"><div className="flex items-center gap-3"><img src={product.image_url} alt={product.name} className="size-12 rounded-xl object-cover" /><p className="text-sm font-extrabold text-slate-900">{product.name}</p></div></td>
                            <td className="px-4 py-4 text-xs font-extrabold text-slate-800">{formatPrice(product.price)} so'm</td>
                            <td className="px-6 py-4"><div className="flex justify-end gap-2"><button type="button" onClick={() => startEdit(product)} className="grid size-9 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-[#b58a45] hover:text-[#b58a45]" aria-label="Tahrirlash"><Pencil size={15} /></button><button type="button" onClick={() => handleDelete(product)} className="grid size-9 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600" aria-label="O'chirish"><Trash2 size={15} /></button></div></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="divide-y divide-slate-100 md:hidden">
                    {products.map((product) => (
                      <article key={product.id} className="p-4">
                        <div className="flex gap-3"><img src={product.image_url} alt={product.name} className="size-16 rounded-xl object-cover" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-extrabold text-slate-900">{product.name}</p><p className="mt-2 text-xs font-extrabold text-slate-700">{formatPrice(product.price)} so'm</p></div></div>
                        <div className="mt-3 flex justify-end gap-2"><button type="button" onClick={() => startEdit(product)} className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-600"><Pencil size={14} /> Tahrirlash</button><button type="button" onClick={() => handleDelete(product)} className="inline-flex h-9 items-center gap-2 rounded-lg border border-red-100 px-3 text-xs font-bold text-red-600"><Trash2 size={14} /> O'chirish</button></div>
                      </article>
                    ))}
                  </div>
                </>
              ) : (
                <div className="grid min-h-72 place-items-center p-8 text-center"><div><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-slate-100 text-slate-400"><Package size={22} /></span><p className="mt-4 text-sm font-extrabold text-slate-800">Supabase’da hali mahsulot yo‘q</p><p className="mt-1 text-xs text-slate-400">Chapdagi shakl orqali yangi mahsulot qo‘shing.</p></div></div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

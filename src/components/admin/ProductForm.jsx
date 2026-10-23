import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, Plus, RefreshCw, Save, Star, Trash2, X } from "lucide-react";
import { PRODUCT_BADGES, PRODUCT_CATEGORIES } from "../../data/productUtils";
import { useAuth } from "../../context/AuthContext";
import { isProductImageUrl, removeProductImage, uploadProductImage } from "../../lib/imageStorage";

const inputClass =
  "mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-gold focus:ring-4 focus:ring-gold/10";

const textareaClass =
  "mt-1.5 w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-gold focus:ring-4 focus:ring-gold/10";

const emptyForm = {
  nameUz: "",
  nameRu: "",
  descriptionUz: "",
  descriptionRu: "",
  price: "",
  oldPrice: "",
  category: "Unisex",
  brand: "",
  sizes: "",
  stock: "",
  badge: "",
  featured: false,
  image: "",
  galleryUrls: [],
};

const productToForm = (product) => {
  if (!product) return emptyForm;
  return {
    nameUz: product.nameUz || product.name || "",
    nameRu: product.nameRu || "",
    descriptionUz: product.descriptionUz || "",
    descriptionRu: product.descriptionRu || "",
    price: String(product.price ?? ""),
    oldPrice: product.oldPrice ? String(product.oldPrice) : "",
    category: product.category || "Unisex",
    brand: product.brand || "",
    sizes: (product.sizes || []).join(", "),
    stock: product.stock == null ? "" : String(product.stock),
    badge: product.badge || "",
    featured: Boolean(product.featured),
    image: product.image_url || product.image || "",
    galleryUrls: Array.isArray(product.galleryUrls) ? [...product.galleryUrls] : [],
  };
};

function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Rasmni o'qib bo'lmadi"));
    reader.onload = () => {
      const image = new globalThis.Image();
      image.onerror = () => reject(new Error("Rasm formati qo'llab-quvvatlanmaydi"));
      image.onload = () => {
        const maxSide = 1400;
        const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.naturalWidth * scale);
        canvas.height = Math.round(image.naturalHeight * scale);
        const context = canvas.getContext("2d");
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function Field({ label, required, hint, children }) {
  return (
    <label className="block text-xs font-bold text-slate-600">
      <span>
        {label}
        {required ? <span className="text-gold"> *</span> : null}
      </span>
      {children}
      {hint ? <span className="mt-1 block text-[10px] font-medium leading-4 text-slate-400">{hint}</span> : null}
    </label>
  );
}

export default function ProductForm({ product = null, busy = false, onSubmit, onCancel }) {
  const { isAdmin } = useAuth();
  const [form, setForm] = useState(() => productToForm(product));
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [imageBusy, setImageBusy] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [replacing, setReplacing] = useState(false);
  const [deletingImage, setDeletingImage] = useState(false);
  const [originalImage, setOriginalImage] = useState(product?.image_url || product?.image || "");
  const primaryInputRef = useRef(null);
  const replaceInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  useEffect(() => {
    const nextForm = productToForm(product);
    setForm(nextForm);
    setOriginalImage(product?.image_url || product?.image || "");
    setError("");
    setNotice("");
    setReplacing(false);
    if (primaryInputRef.current) primaryInputRef.current.value = "";
    if (replaceInputRef.current) replaceInputRef.current.value = "";
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  }, [product]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
    setError("");
    setNotice("");
  };

  const ensureAdmin = () => {
    if (!isAdmin) throw new Error("Faqat administrator rasm yuklashi/o'chirishi mumkin.");
  };

  const handlePrimaryImageSelect = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    ensureAdmin();
    if (!file.type.startsWith("image/")) {
      setError("Faqat rasm faylini tanlang.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Rasm hajmi 5 MB dan kam bo'lishi kerak.");
      return;
    }

    setImageBusy(true);
    setError("");
    setNotice("");
    setUploadProgress("Rasm tayyorlanmoqda...");
    try {
      const dataUrl = await readImageFile(file);
      setUploadProgress("Supabase Storage ga yuklanmoqda...");
      const uploadedUrl = await uploadProductImage(dataUrl, product?.id ? `products/${product.id}` : "products/temp");
      setForm((current) => ({ ...current, image: uploadedUrl }));
      setUploadProgress("");
      setNotice("Asosiy rasm yuklandi va tayyor.");
    } catch (uploadError) {
      setUploadProgress("");
      setError(uploadError.message || "Rasmni yuklab bo'lmadi");
    } finally {
      setImageBusy(false);
    }
  };

  const handleReplaceImage = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !form.image) return;
    ensureAdmin();
    if (!file.type.startsWith("image/")) {
      setError("Faqat rasm faylini tanlang.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Rasm hajmi 5 MB dan kam bo'lishi kerak.");
      return;
    }

    setReplacing(true);
    setImageBusy(true);
    setError("");
    setNotice("");
    setUploadProgress("Yangi rasm yuklanmoqda...");
    const oldUrl = form.image;
    try {
      const dataUrl = await readImageFile(file);
      const uploadedUrl = await uploadProductImage(dataUrl, product?.id ? `products/${product.id}` : "products/temp");
      setForm((current) => ({ ...current, image: uploadedUrl }));
      setUploadProgress("");
      setNotice("Yangi rasm yuklandi. Saqlash tugmasini bosib yangilashni yakunlang.");
    } catch (uploadError) {
      setUploadProgress("");
      setError(uploadError.message || "Rasmni almashtirib bo'lmadi");
      setForm((current) => ({ ...current, image: oldUrl }));
    } finally {
      setImageBusy(false);
      setReplacing(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!form.image) return;
    ensureAdmin();
    const confirmed = window.confirm(
      "Asosiy rasmni o'chirishni tasdiqlaysizmi? Bu amal rasmni Supabase Storage dan o'chiradi.",
    );
    if (!confirmed) return;

    setDeletingImage(true);
    setError("");
    setNotice("");
    const urlToDelete = form.image;
    try {
      if (isProductImageUrl(urlToDelete)) {
        await removeProductImage(urlToDelete);
      }
      setForm((current) => ({ ...current, image: "" }));
      setOriginalImage("");
      setNotice("Rasm o'chirildi.");
    } catch (deleteError) {
      setError(deleteError.message || "Rasmni o'chirib bo'lmadi");
    } finally {
      setDeletingImage(false);
    }
  };

  const handleGalleryImages = async (event) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length) return;
    ensureAdmin();
    if (files.some((file) => !file.type.startsWith("image/"))) {
      setError("Faqat rasm fayllarini tanlang.");
      return;
    }
    if (files.some((file) => file.size > 5 * 1024 * 1024)) {
      setError("Har bir rasm 5 MB dan kam bo'lishi kerak.");
      return;
    }

    setImageBusy(true);
    setError("");
    try {
      const images = [];
      for (const file of files) {
        const dataUrl = await readImageFile(file);
        const uploaded = await uploadProductImage(dataUrl, product?.id ? `products/${product.id}` : "products/temp");
        images.push(uploaded);
      }
      setForm((current) => ({
        ...current,
        galleryUrls: [...current.galleryUrls, ...images].slice(0, 6),
      }));
      setNotice("Galereya rasmlari yuklandi.");
    } catch (readError) {
      setError(readError.message || "Galereya rasmlarini yuklab bo'lmadi");
    } finally {
      setImageBusy(false);
    }
  };

  const removeGalleryImage = async (index) => {
    const image = form.galleryUrls[index];
    setForm((current) => ({
      ...current,
      galleryUrls: current.galleryUrls.filter((_, itemIndex) => itemIndex !== index),
    }));
    if (isProductImageUrl(image)) {
      try {
        await removeProductImage(image);
      } catch {
        /* non-blocking */
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");

    const nameUz = form.nameUz.trim();
    const nameRu = form.nameRu.trim();
    const name = nameUz || nameRu;
    const price = Number(form.price);
    const oldPrice = form.oldPrice.trim() ? Number(form.oldPrice) : null;
    const stock = form.stock.trim() === "" ? null : Number(form.stock);
    const sizes = form.sizes
      .split(/[,\s]+/)
      .map((value) => Number(value.trim()))
      .filter(Boolean);

    if (!name) {
      setError("Mahsulot nomini kiriting.");
      return;
    }
    if (!Number.isSafeInteger(price) || price <= 0) {
      setError("Narx butun musbat son bo'lishi kerak.");
      return;
    }
    if (oldPrice !== null && (!Number.isSafeInteger(oldPrice) || oldPrice <= price)) {
      setError("Eski narx joriy narxdan katta butun son bo'lishi kerak.");
      return;
    }
    if (stock !== null && (!Number.isInteger(stock) || stock < 0)) {
      setError("Ombor miqdori noldan katta butun son bo'lishi kerak.");
      return;
    }
    if (sizes.some((size) => !Number.isInteger(size) || size < 20 || size > 60)) {
      setError("O'lchamlar 20–60 oralig'idagi butun sonlar bo'lishi kerak.");
      return;
    }
    if (!form.image.trim()) {
      setError("Mahsulot uchun asosiy rasm yuklang yoki URL kiriting.");
      return;
    }

    const oldUrl = originalImage;
    const newUrl = form.image.trim();
    try {
      await onSubmit({
        name,
        nameUz: nameUz || name,
        nameRu: nameRu || name,
        descriptionUz: form.descriptionUz.trim(),
        descriptionRu: form.descriptionRu.trim(),
        price,
        oldPrice,
        category: form.category,
        brand: form.brand.trim(),
        sizes: [...new Set(sizes)].sort((a, b) => a - b),
        stock,
        badge: form.badge || null,
        featured: form.featured,
        image: newUrl,
        image_url: newUrl,
        galleryUrls: form.galleryUrls,
      });

      if (product?.id && oldUrl && newUrl !== oldUrl && isProductImageUrl(oldUrl)) {
        const isStillUsed = products?.some?.((p) => {
          if (String(p.id) === String(product.id)) return false;
          const url = p.image_url || p.image;
          return url === oldUrl || (Array.isArray(p.galleryUrls) && p.galleryUrls.includes(oldUrl));
        });
        if (!isStillUsed) {
          try {
            await removeProductImage(oldUrl);
          } catch {
            /* ignore cleanup errors */
          }
        }
      }

      if (!product) {
        setForm(emptyForm);
        setOriginalImage("");
      } else {
        setOriginalImage(newUrl);
      }
      if (primaryInputRef.current) primaryInputRef.current.value = "";
      if (replaceInputRef.current) replaceInputRef.current.value = "";
      if (galleryInputRef.current) galleryInputRef.current.value = "";
    } catch (submitError) {
      setError(submitError.message || "Mahsulotni saqlab bo'lmadi");
    }
  };

  const isActionBusy = busy || imageBusy || replacing || deletingImage;

  return (
    <section className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-gold">
            {product ? "Tahrirlash" : "Katalog"}
          </p>
          <h2 className="mt-1 text-lg font-extrabold text-ink">
            {product ? "Mahsulotni tahrirlash" : "Yangi mahsulot"}
          </h2>
          {!isAdmin ? (
            <p className="mt-1 text-[10px] font-semibold text-amber-700">
              Rasm yuklash/o'chirish faqat administratorlar uchun
            </p>
          ) : null}
        </div>
        {product ? (
          <button
            type="button"
            onClick={onCancel}
            className="grid size-9 place-items-center rounded-full bg-canvas text-muted transition hover:bg-line"
            aria-label="Tahrirlashni bekor qilish"
          >
            <X size={16} />
          </button>
        ) : null}
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-xs font-semibold text-red-700">
          {error}
        </div>
      ) : null}
      {notice ? (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-xs font-semibold text-emerald-700">
          {notice}
        </div>
      ) : null}
      {uploadProgress ? (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-3 text-xs font-semibold text-blue-700">
          <Loader2 size={14} className="animate-spin" /> {uploadProgress}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <span className="text-xs font-bold text-slate-600">Asosiy rasm</span>
          <div className="mt-1.5 flex items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-3">
            <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-white text-slate-400 shadow-sm">
              {form.image ? (
                <img src={form.image} alt="Mahsulot ko'rinishi" className="size-full object-cover" />
              ) : (
                <ImagePlus size={22} />
              )}
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap gap-2">
                <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-ink px-3 py-2 text-[11px] font-bold text-white transition hover:bg-ink-soft disabled:opacity-50">
                  <ImagePlus size={13} />
                  {imageBusy && !replacing && !deletingImage ? "Yuklanmoqda..." : "Rasm yuklash"}
                  <input
                    ref={primaryInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePrimaryImageSelect}
                    className="sr-only"
                    disabled={isActionBusy || !isAdmin}
                  />
                </label>
                {form.image && product ? (
                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-[11px] font-bold text-slate-700 transition hover:border-gold">
                    <RefreshCw size={13} />
                    {replacing ? "Almashtirilmoqda..." : "Almashtirish"}
                    <input
                      ref={replaceInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleReplaceImage}
                      className="sr-only"
                      disabled={isActionBusy || !isAdmin}
                    />
                  </label>
                ) : null}
                {form.image ? (
                  <button
                    type="button"
                    onClick={handleDeleteImage}
                    disabled={isActionBusy || !isAdmin}
                    className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-white px-3 py-2 text-[11px] font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 size={13} />
                    {deletingImage ? "O'chirilmoqda..." : "O'chirish"}
                  </button>
                ) : null}
              </div>
              <p className="text-[10px] leading-4 text-slate-400">JPG, PNG, WebP · max 5 MB · Supabase Storage: product-images</p>
              {!isAdmin ? (
                <p className="text-[10px] leading-4 text-amber-700">
                  Xavfsizlik: rasm amallari faqat admin sessiyasi orqali bajariladi.
                </p>
              ) : null}
            </div>
          </div>
          <input
            name="image"
            value={form.image.startsWith("data:") ? "" : form.image}
            onChange={handleChange}
            className={inputClass}
            placeholder="yoki rasm URL manzilini kiriting (public URL)"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Nomi (UZ)" required>
            <input name="nameUz" value={form.nameUz} onChange={handleChange} className={inputClass} placeholder="Aurora Loafer" />
          </Field>
          <Field label="Nomi (RU)">
            <input name="nameRu" value={form.nameRu} onChange={handleChange} className={inputClass} placeholder="Лоферы Aurora" />
          </Field>
        </div>

        <Field label="Tavsif (UZ)">
          <textarea name="descriptionUz" value={form.descriptionUz} onChange={handleChange} rows={2} className={textareaClass} placeholder="Yumshoq charm..." />
        </Field>
        <Field label="Tavsif (RU)">
          <textarea name="descriptionRu" value={form.descriptionRu} onChange={handleChange} rows={2} className={textareaClass} placeholder="Мягкая кожа..." />
        </Field>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Narx (so'm)" required>
            <input name="price" value={form.price} onChange={handleChange} type="number" min="1" step="1" className={inputClass} placeholder="590000" />
          </Field>
          <Field label="Eski narx (so'm)">
            <input name="oldPrice" value={form.oldPrice} onChange={handleChange} type="number" min="1" step="1" className={inputClass} placeholder="690000" />
          </Field>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Kategoriya">
            <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
              {PRODUCT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Brend">
            <input name="brand" value={form.brand} onChange={handleChange} className={inputClass} placeholder="Soft Shoes" />
          </Field>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="O'lchamlar" hint="Vergul bilan ajrating: 39, 40, 41">
            <input name="sizes" value={form.sizes} onChange={handleChange} className={inputClass} placeholder="39, 40, 41, 42" />
          </Field>
          <Field label="Ombordagi miqdor">
            <input name="stock" value={form.stock} onChange={handleChange} type="number" min="0" step="1" className={inputClass} placeholder="12" />
          </Field>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Badge">
            <select name="badge" value={form.badge} onChange={handleChange} className={inputClass}>
              <option value="">Yo'q</option>
              {PRODUCT_BADGES.map((badge) => (
                <option key={badge} value={badge}>
                  {badge}
                </option>
              ))}
            </select>
          </Field>
          <label className="flex cursor-pointer items-center justify-between gap-3 self-end rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs font-bold text-slate-700">
            <span className="inline-flex items-center gap-2">
              <Star size={14} className="text-gold" aria-hidden="true" />
              Bosh sahifada ko'rsatish
            </span>
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="size-4 accent-[#8a6423]" />
          </label>
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-600">Galereya</span>
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-700 transition hover:border-gold disabled:opacity-50">
              <Plus size={13} />
              Rasm qo'shish
              <input ref={galleryInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleGalleryImages} className="sr-only" disabled={isActionBusy || !isAdmin} />
            </label>
          </div>
          {form.galleryUrls.length ? (
            <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {form.galleryUrls.map((image, index) => (
                <div key={`${image}-${index}`} className="group relative overflow-hidden rounded-xl border border-line">
                  <img src={image} alt={`Galereya ${index + 1}`} className="aspect-square size-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-white/90 text-rose-600 shadow-sm"
                    aria-label="Rasmni olib tashlash"
                    disabled={isActionBusy}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-[10px] leading-4 text-slate-400">Galereya uchun 6 tagacha qo'shimcha rasm.</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isActionBusy}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-extrabold text-white transition hover:bg-ink-soft disabled:opacity-50"
        >
          {product ? <Save size={17} /> : <Plus size={17} />}
          {product ? "O'zgarishlarni saqlash" : "Mahsulot qo'shish"}
        </button>
      </form>
    </section>
  );
}

import { supabase } from "../lib/supabase";

const getClient = () => {
  if (!supabase) throw new Error("Supabase sozlanmagan");
  return supabase;
};

const requireAdminSession = async () => {
  const client = getClient();
  const { data, error } = await client.auth.getSession();
  if (error) throw new Error(`Auth sessionini olishda xatolik: ${error.message}`);
  if (!data.session) throw new Error("Admin login required");

  const { session } = data;
  if (!session.user?.email) throw new Error("Sessionda email yo'q, qayta kiring");

  const { data: isAdmin, error: adminError } = await client.rpc("is_store_admin");
  if (adminError) throw new Error(`Admin huquqni tekshirib bo'lmadi: ${adminError.message}`);
  if (!isAdmin) throw new Error(`Bu session store_admins ro'yxatida yo'q. Session email: ${session.user.email}`);

  return session;
};

const writeError = (action, error, email) => {
  if (error.code === "42501") {
    return new Error(
      `${action}: RLS policy rad etdi. Session email: ${email}. store_admins dagi email bilan solishtiring.`,
    );
  }
  return new Error(`${action}: ${error.message}`);
};

const toRow = (product) => ({
  Name: product.name || product.nameUz || product.nameRu,
  Price: product.price,
  image_url: product.image_url || product.image,
});

const fromRow = (row) => ({
  id: row.id,
  name: row.Name || row.name || row.name_uz || row.name_ru,
  nameUz: row.Name || row.name || row.name_uz || row.name_ru,
  nameRu: row.Name || row.name || row.name_ru || row.name_uz,
  descriptionUz: row.description_uz || "",
  descriptionRu: row.description_ru || "",
  image: row.image_url || row.image || "",
  image_url: row.image_url || row.image || "",
  price: Number(row.Price ?? row.price) || 0,
  oldPrice: row.old_price,
  category: row.category,
  sizes: row.sizes || [],
  stock: row.stock,
  badge: row.badge,
  featured: row.featured,
  createdAt: row.created_at,
});

const uploadProductImage = async (image, productId) => {
  if (!image.startsWith("data:")) return image;
  const blob = await fetch(image).then((response) => response.blob());
  const extension = blob.type === "image/png" ? "png" : blob.type === "image/webp" ? "webp" : "jpg";
  const path = `${productId}/${Date.now()}.${extension}`;
  const client = getClient();
  const { error } = await client.storage.from("product-images").upload(path, blob, {
    cacheControl: "31536000",
    contentType: blob.type,
    upsert: false,
  });
  if (error) throw error;
  return client.storage.from("product-images").getPublicUrl(path).data.publicUrl;
};

export async function fetchRemoteProducts() {
  const { data, error } = await getClient()
    .from("products")
    .select('id, "Name", "Price", image_url');
  if (error) throw error;
  return data.map(fromRow);
}

export async function createRemoteProduct(product) {
  const session = await requireAdminSession();

  console.log("SESSION:", session);
  console.log("USER:", session?.user);
  console.log("EMAIL:", session?.user?.email);

  const storageFolder = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  let publicImageUrl;
  try {
    publicImageUrl = await uploadProductImage(product.image_url || product.image, storageFolder);
  } catch (error) {
    throw new Error(`Rasmni yuklash xatosi: ${error.message}`);
  }

  const { Name, Price } = toRow({ ...product, image: publicImageUrl });

  const { data, error } = await supabase
    .from("products")
    .insert({
      Name,
      Price: Number(Price),
      image_url: publicImageUrl,
    })
    .select('id, "Name", "Price", image_url')
    .single();

  if (error) throw writeError("Product insert xatosi", error, session.user.email);
  return fromRow(data);
}

export async function updateRemoteProduct(product) {
  const session = await requireAdminSession();
  let image;
  try {
    image = await uploadProductImage(product.image_url || product.image, product.id);
  } catch (error) {
    throw new Error(`Rasmni yuklash xatosi: ${error.message}`);
  }
  const { data, error } = await getClient()
    .from("products")
    .update(toRow({ ...product, image }))
    .eq("id", product.id)
    .select('id, "Name", "Price", image_url')
    .single();
  if (error) throw writeError("Product update xatosi", error, session.user.email);
  return fromRow(data);
}

export async function deleteRemoteProduct(id) {
  const session = await requireAdminSession();
  const { error } = await getClient().from("products").delete().eq("id", id);
  if (error) throw writeError("Product o'chirish xatosi", error, session.user.email);
}

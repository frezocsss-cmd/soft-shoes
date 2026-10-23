import { getSupabase } from "./supabase";

export const ORDER_STATUSES = ["new", "confirmed", "shipped", "completed", "cancelled"];

export const ORDER_STATUS_LABELS = {
  new: "Yangi",
  confirmed: "Tasdiqlangan",
  shipped: "Yo'lda",
  completed: "Yakunlangan",
  cancelled: "Bekor qilingan",
};

const getClient = async () => {
  const client = await getSupabase();
  if (!client) throw new Error("Supabase sozlanmagan");
  return client;
};

const friendlyOrderError = (error) => {
  if (error.code === "PGRST202" || error.code === "PGRST204" || error.code === "42P01") {
    return new Error(
      "Buyurtmalar jadvali topilmadi. supabase/ecommerce_setup.sql faylini Supabase SQL Editor'da bajaring.",
    );
  }
  if (error.code === "42501") {
    return new Error("Bu amal uchun admin huquqi kerak.");
  }
  return new Error(error.message || "Buyurtma amalida xatolik yuz berdi");
};

/**
 * Order creation deliberately happens through a SECURITY DEFINER RPC.
 * The client only sends product ids, sizes and quantities — the database
 * re-reads prices, validates stock and computes totals.
 */
export async function createOrder({ customer, items }) {
  const client = await getClient();

  const payload = items.map((item) => ({
    product_id: item.productId,
    size: item.size ?? null,
    quantity: Math.max(1, Math.floor(Number(item.quantity) || 1)),
  }));

  const { data, error } = await client.rpc("create_order", {
    p_customer: customer,
    p_items: payload,
  });

  if (error) throw friendlyOrderError(error);
  return data;
}

export async function fetchOrders() {
  const client = await getClient();
  const { data, error } = await client
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) throw friendlyOrderError(error);
  return data ?? [];
}

export async function updateOrderStatus(orderId, status) {
  if (!ORDER_STATUSES.includes(status)) throw new Error("Noto'g'ri buyurtma holati");
  const client = await getClient();
  const { data, error } = await client
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select("*, order_items(*)")
    .single();

  if (error) throw friendlyOrderError(error);
  return data;
}

import { ClipboardList, RefreshCw, TriangleAlert } from "lucide-react";
import { formatPrice } from "../../data/productUtils";
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from "../../lib/orderRepository";

const dateFormatter = new Intl.DateTimeFormat("uz-UZ", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default function AdminOrders({
  orders,
  status,
  error,
  busyId,
  onRefresh,
  onStatusChange,
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-gold">Orders</p>
          <h2 className="mt-1 text-lg font-extrabold text-ink">Buyurtmalar</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-canvas px-3 py-1.5 text-xs font-extrabold text-muted">
            {orders.length}
          </span>
          <button
            type="button"
            onClick={onRefresh}
            disabled={status === "loading"}
            className="grid size-9 place-items-center rounded-full border border-line text-muted transition hover:border-gold hover:text-gold disabled:opacity-50"
            aria-label="Buyurtmalarni yangilash"
          >
            <RefreshCw size={14} className={status === "loading" ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {status === "loading" && !orders.length ? (
        <div className="space-y-3 p-5" aria-busy="true">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="skeleton h-16 rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="p-6">
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold leading-5 text-amber-800">
            <TriangleAlert size={17} className="mt-0.5 shrink-0" />
            <div>
              <p>{error}</p>
              <button type="button" onClick={onRefresh} className="mt-2 font-extrabold underline">
                Qayta urinish
              </button>
            </div>
          </div>
        </div>
      ) : orders.length ? (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[820px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted">
                  <th className="px-6 py-3.5">Buyurtma</th>
                  <th className="px-3 py-3.5">Mijoz</th>
                  <th className="px-3 py-3.5">Mahsulotlar</th>
                  <th className="px-3 py-3.5">Summa</th>
                  <th className="px-3 py-3.5">Holat</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-line align-top last:border-0">
                    <td className="px-6 py-4">
                      <p className="text-sm font-extrabold text-ink">#{order.order_number}</p>
                      <p className="mt-0.5 text-[10px] font-semibold text-muted">
                        {order.created_at ? dateFormatter.format(new Date(order.created_at)) : "—"}
                      </p>
                    </td>
                    <td className="px-3 py-4">
                      <p className="text-xs font-bold text-ink">{order.customer_name}</p>
                      <p className="mt-0.5 text-[10px] text-muted">{order.customer_phone}</p>
                      {order.customer_telegram ? (
                        <p className="text-[10px] text-muted">{order.customer_telegram}</p>
                      ) : null}
                    </td>
                    <td className="px-3 py-4">
                      <ul className="space-y-1 text-[11px] text-muted">
                        {(order.order_items ?? []).map((item) => (
                          <li key={item.id}>
                            {item.product_name}
                            {item.size ? ` · ${item.size}` : ""} × {item.quantity}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-3 py-4 text-xs font-extrabold text-ink">
                      {formatPrice(order.total)} so'm
                    </td>
                    <td className="px-3 py-4">
                      <select
                        value={order.status}
                        onChange={(event) => onStatusChange(order.id, event.target.value)}
                        disabled={busyId === order.id}
                        className="h-9 cursor-pointer rounded-full border border-line bg-white px-3 text-[11px] font-bold text-ink outline-none focus:border-gold disabled:opacity-50"
                      >
                        {ORDER_STATUSES.map((statusValue) => (
                          <option key={statusValue} value={statusValue}>
                            {ORDER_STATUS_LABELS[statusValue]}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-line md:hidden">
            {orders.map((order) => (
              <article key={order.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-extrabold text-ink">#{order.order_number}</p>
                    <p className="mt-0.5 text-[10px] font-semibold text-muted">
                      {order.created_at ? dateFormatter.format(new Date(order.created_at)) : "—"}
                    </p>
                  </div>
                  <span className="text-sm font-extrabold text-ink">{formatPrice(order.total)} so'm</span>
                </div>
                <p className="mt-3 text-xs font-bold text-ink">{order.customer_name}</p>
                <p className="text-[11px] text-muted">{order.customer_phone}</p>
                <ul className="mt-2 space-y-1 text-[11px] text-muted">
                  {(order.order_items ?? []).map((item) => (
                    <li key={item.id}>
                      {item.product_name}
                      {item.size ? ` · ${item.size}` : ""} × {item.quantity}
                    </li>
                  ))}
                </ul>
                <select
                  value={order.status}
                  onChange={(event) => onStatusChange(order.id, event.target.value)}
                  disabled={busyId === order.id}
                  className="mt-3 h-9 w-full cursor-pointer rounded-full border border-line bg-white px-3 text-[11px] font-bold text-ink outline-none focus:border-gold disabled:opacity-50"
                >
                  {ORDER_STATUSES.map((statusValue) => (
                    <option key={statusValue} value={statusValue}>
                      {ORDER_STATUS_LABELS[statusValue]}
                    </option>
                  ))}
                </select>
              </article>
            ))}
          </div>
        </>
      ) : (
        <div className="grid min-h-72 place-items-center p-8 text-center">
          <div>
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-canvas text-muted">
              <ClipboardList size={22} />
            </span>
            <p className="mt-4 text-sm font-extrabold text-ink">Hali buyurtmalar yo'q</p>
            <p className="mt-1 max-w-xs text-xs leading-5 text-muted">
              Sayt orqali rasmiylashtirilgan buyurtmalar shu yerda paydo bo'ladi.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

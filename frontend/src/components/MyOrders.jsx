import { useState, useEffect } from "react";
import { apiGetMyOrders } from "../api.js";

const STATUS_STYLES = {
  completed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  pending:   "bg-amber-50 text-amber-700 border border-amber-200",
  cancelled: "bg-red-50 text-red-600 border border-red-200",
};

const STATUS_ICONS = {
  completed: "✓",
  pending:   "⏳",
  cancelled: "✕",
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit",
  });
}

export default function MyOrders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    apiGetMyOrders()
      .then(setOrders)
      .catch(e => setError(e.message || "Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-6 h-6 border-2 border-stone-200 border-t-stone-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-4xl mb-4 opacity-20">⚠️</p>
        <p className="text-stone-500 font-medium">{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="text-6xl mb-6 opacity-15">📦</p>
        <p className="font-display text-2xl text-stone-700 mb-2">No orders yet</p>
        <p className="text-stone-400 text-sm">Items you purchase will appear here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl text-stone-800 mb-1">My Orders</h1>
        <p className="text-stone-400 text-sm">
          {orders.length} order{orders.length !== 1 ? "s" : ""} placed
        </p>
      </div>

      <div className="space-y-3">
        {orders.map((order) => {
          const isOpen = expanded === order._id;
          const totalQty = order.items.reduce((s, i) => s + i.qty, 0);

          return (
            <div key={order._id} className="card overflow-hidden">
              {/* Order header row */}
              <button
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-stone-50 transition-colors"
                onClick={() => setExpanded(isOpen ? null : order._id)}
              >
                {/* Status badge */}
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full shrink-0 ${STATUS_STYLES[order.status]}`}>
                  <span>{STATUS_ICONS[order.status]}</span>
                  <span className="capitalize">{order.status}</span>
                </span>

                {/* Order date */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-stone-700">
                    {formatDate(order.createdAt)}
                    <span className="text-stone-400 font-normal ml-1.5">at {formatTime(order.createdAt)}</span>
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5 truncate">
                    {totalQty} item{totalQty !== 1 ? "s" : ""}
                    {" · "}
                    {order.items.map(i => i.name).join(", ")}
                  </p>
                </div>

                {/* Total */}
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-stone-800">₹{order.total.toLocaleString("en-IN")}</p>
                </div>

                {/* Expand icon */}
                <span className={`text-stone-300 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`}>
                  ▾
                </span>
              </button>

              {/* Expanded items */}
              {isOpen && (
                <div className="border-t border-stone-100 bg-stone-50/60">
                  <div className="px-5 py-4 space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        {/* Product image */}
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover border border-stone-200 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-stone-200 flex items-center justify-center text-lg shrink-0">
                            📦
                          </div>
                        )}

                        {/* Item info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-stone-700 truncate">{item.name}</p>
                          <p className="text-xs text-stone-400">
                            ₹{item.price.toLocaleString("en-IN")} × {item.qty}
                          </p>
                        </div>

                        {/* Item subtotal */}
                        <p className="text-sm font-medium text-stone-700 shrink-0">
                          ₹{(item.price * item.qty).toLocaleString("en-IN")}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Order footer */}
                  <div className="px-5 py-3 border-t border-stone-100 flex items-center justify-between">
                    <p className="text-xs text-stone-400 font-mono truncate">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-stone-400">Total</span>
                      <span className="font-semibold text-stone-800 ml-2">
                        ₹{order.total.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

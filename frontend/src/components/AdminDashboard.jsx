import { useState, useEffect } from "react";
import { apiGetAllOrders, apiGetOrderStats } from "../api.js";

const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

export default function AdminDashboard({ products }) {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([apiGetAllOrders(), apiGetOrderStats()])
      .then(([o, s]) => { setOrders(o); setStats(s); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5);

  const statCards = [
    { label: "Total Products", value: products.length, sub: "in catalogue" },
    { label: "Total Revenue", value: fmt(stats.totalRevenue), sub: "all time" },
    { label: "Orders Placed", value: stats.totalOrders, sub: "completed" },
    { label: "Units in Stock", value: totalStock, sub: "across all products" },
  ];

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-6 h-6 border-2 border-stone-200 border-t-stone-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(s => (
          <div key={s.label} className="bg-white border border-stone-200 p-5">
            <p className="text-xs text-stone-400 uppercase tracking-widest mb-2">{s.label}</p>
            <p className="text-2xl font-semibold text-stone-900 mb-0.5">{s.value}</p>
            <p className="text-xs text-stone-400">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Low stock warning */}
      {lowStock.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-4">
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-widest mb-3">⚠ Low Stock Alert</p>
          <div className="flex flex-wrap gap-2">
            {lowStock.map(p => (
              <span key={p._id} className="bg-white border border-amber-200 text-amber-700 text-xs px-3 py-1">
                {p.image} {p.name} — {p.stock} remaining
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Orders table */}
      <div>
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-widest mb-4">Recent Orders</h3>
        {orders.length === 0 ? (
          <div className="bg-white border border-stone-200 p-8 text-center">
            <p className="text-stone-400 text-sm">No orders yet</p>
          </div>
        ) : (
          <div className="bg-white border border-stone-200 divide-y divide-stone-100">
            <div className="grid grid-cols-4 px-5 py-3 bg-stone-50">
              {["Order ID", "Items", "Date", "Total"].map(h => (
                <span key={h} className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">{h}</span>
              ))}
            </div>
            {orders.slice(0, 15).map(o => (
              <div key={o._id} className="grid grid-cols-4 px-5 py-4 items-center hover:bg-stone-50 transition-colors">
                <span className="text-sm font-mono text-stone-600">#{o._id.slice(-8).toUpperCase()}</span>
                <span className="text-sm text-stone-600">{o.items?.length} item{o.items?.length !== 1 ? "s" : ""}</span>
                <span className="text-sm text-stone-400">{new Date(o.createdAt).toLocaleDateString()}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-stone-800">{fmt(o.total)}</span>
                  <span className="text-[10px] uppercase tracking-wider text-green-700 bg-green-50 border border-green-200 px-2 py-0.5">Completed</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

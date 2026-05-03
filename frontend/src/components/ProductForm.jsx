import { useState } from "react";

const CATEGORIES = ["Electronics", "Accessories", "Kitchen", "Sports", "Home"];

const SUGGESTED_IMAGES = [
  { label: "Headphones", url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80" },
  { label: "Wallet", url: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80" },
  { label: "Mug", url: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80" },
  { label: "Keyboard", url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80" },
  { label: "Yoga Mat", url: "https://images.unsplash.com/photo-1601925228892-5c7c9c644c9c?w=600&q=80" },
  { label: "Plant Kit", url: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=600&q=80" },
  { label: "Water Bottle", url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80" },
  { label: "Desk Lamp", url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80" },
  { label: "Shoes", url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80" },
  { label: "Watch", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80" },
  { label: "Speaker", url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80" },
  { label: "Board", url: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&q=80" },
];

export default function ProductForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial ? {
    name: initial.name, category: initial.category, price: initial.price,
    stock: initial.stock, image: initial.image, description: initial.description, badge: initial.badge || ""
  } : {
    name: "", category: "Electronics", price: "", stock: "",
    image: SUGGESTED_IMAGES[0].url, description: "", badge: ""
  });
  const [saving, setSaving] = useState(false);
  const [imgError, setImgError] = useState(false);
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); if (k === "image") setImgError(false); };

  const handleSave = async () => { setSaving(true); await onSave(form); setSaving(false); };
  const isUrl = (s) => typeof s === "string" && s.startsWith("http");

  return (
    <div className="space-y-4">
      <div>
        <label className="label">Product Name *</label>
        <input className="input-base" value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Wireless Earbuds" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Price (₹) *</label>
          <input className="input-base" type="number" value={form.price} onChange={e => set("price", e.target.value)} placeholder="0" min="0" />
        </div>
        <div>
          <label className="label">Stock *</label>
          <input className="input-base" type="number" value={form.stock} onChange={e => set("stock", e.target.value)} placeholder="0" min="0" />
        </div>
      </div>
      <div>
        <label className="label">Category</label>
        <select className="input-base" value={form.category} onChange={e => set("category", e.target.value)}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="label">Description</label>
        <textarea className="input-base resize-none" rows={3} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Product details..." />
      </div>
      <div>
        <label className="label">Badge (optional)</label>
        <input className="input-base" value={form.badge} onChange={e => set("badge", e.target.value)} placeholder="New, Sale, Hot..." />
      </div>
      <div>
        <label className="label">Product Image URL</label>
        <input className="input-base" value={form.image} onChange={e => set("image", e.target.value)} placeholder="https://images.unsplash.com/..." />
        {isUrl(form.image) && (
          <div className="mt-2 w-24 h-24 border border-stone-200 overflow-hidden bg-stone-100">
            {imgError
              ? <div className="w-full h-full flex items-center justify-center text-xs text-stone-400">No image</div>
              : <img src={form.image} alt="preview" className="w-full h-full object-cover" onError={() => setImgError(true)} />}
          </div>
        )}
      </div>
      <div>
        <label className="label">Quick Pick</label>
        <div className="grid grid-cols-6 gap-2">
          {SUGGESTED_IMAGES.map(s => (
            <button key={s.url} type="button" onClick={() => set("image", s.url)} title={s.label}
              className={`aspect-square border overflow-hidden transition-all ${form.image === s.url ? "border-stone-900 ring-1 ring-stone-900" : "border-stone-200 hover:border-stone-400"}`}>
              <img src={s.url} alt={s.label} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button className="btn-outline flex-1" onClick={onClose}>Cancel</button>
        <button className="btn-primary flex-1" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : initial ? "Save Changes" : "Add Product"}
        </button>
      </div>
    </div>
  );
}

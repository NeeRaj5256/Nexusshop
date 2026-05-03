import { useState } from "react";

const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const isUrl = (s) => typeof s === "string" && (s.startsWith("http") || s.startsWith("/"));

export default function ProductCard({ product, onAddToCart, onEdit, onDelete, isAdmin, inCart }) {
  const [justAdded, setJustAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleAdd = () => {
    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  const stockStatus = product.stock === 0
    ? { label: "Out of Stock", cls: "text-red-500" }
    : product.stock <= 5
    ? { label: `Only ${product.stock} left`, cls: "text-amber-600" }
    : { label: "In Stock", cls: "text-green-700" };

  return (
    <div className="bg-white border border-stone-200 group flex flex-col transition-shadow duration-300 hover:shadow-md">
      {/* Image area */}
      <div className="relative bg-stone-100 aspect-square overflow-hidden">
        {isUrl(product.image) && !imgError ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            {imgError ? "📦" : product.image}
          </div>
        )}

        {product.badge && (
          <span className="absolute top-3 left-3 bg-stone-900 text-white text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1">
            {product.badge}
          </span>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-widest">Sold Out</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-0.5">{product.category}</p>
            <h3 className="text-sm font-semibold text-stone-800 leading-snug">{product.name}</h3>
          </div>
          <span className="text-sm font-semibold text-stone-900 shrink-0">{fmt(product.price)}</span>
        </div>

        <p className="text-xs text-stone-400 leading-relaxed line-clamp-2 flex-1">{product.description}</p>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1">
            <div className="flex">
              {[1,2,3,4,5].map(i => (
                <span key={i} className={`text-xs ${i <= Math.round(product.rating) ? "text-amber-400" : "text-stone-200"}`}>★</span>
              ))}
            </div>
            <span className="text-[10px] text-stone-400">({product.reviews})</span>
          </div>
          <span className={`text-[10px] font-medium ${stockStatus.cls}`}>{stockStatus.label}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 pb-4">
        {isAdmin ? (
          <div className="flex gap-2">
            <button onClick={() => onEdit(product)} className="flex-1 btn-outline text-xs py-2 px-3">Edit</button>
            <button onClick={() => onDelete(product._id)} className="btn-danger text-xs py-2 px-3">Delete</button>
          </div>
        ) : (
          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className={`w-full py-2.5 text-xs font-semibold uppercase tracking-widest transition-all duration-300
              ${product.stock === 0
                ? "bg-stone-100 text-stone-300 cursor-not-allowed"
                : justAdded
                ? "bg-green-700 text-white"
                : "bg-stone-900 text-white hover:bg-stone-700"}`}
          >
            {justAdded ? "✓ Added to Cart" : inCart ? "Add Another" : "Add to Cart"}
          </button>
        )}
      </div>
    </div>
  );
}

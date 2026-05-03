const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

export default function CartSidebar({ cart, onClose, onRemove, onQty, onCheckout, checkingOut }) {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const itemCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      {/* Sidebar */}
      <div className="fixed top-0 right-0 bottom-0 w-96 bg-white z-50 flex flex-col shadow-2xl animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <div>
            <h2 className="font-semibold text-stone-800">Shopping Cart</h2>
            <p className="text-xs text-stone-400 mt-0.5">{itemCount} item{itemCount !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-2xl leading-none">×</button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-auto">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="text-5xl mb-4 opacity-30">🛒</div>
              <p className="text-stone-500 font-medium">Your cart is empty</p>
              <p className="text-stone-400 text-sm mt-1">Add some products to get started</p>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {cart.map(item => (
                <div key={item._id} className="flex gap-4 px-6 py-4">
                  <div className="w-16 h-16 bg-stone-100 flex items-center justify-center text-3xl shrink-0 overflow-hidden">
                    {item.image?.startsWith("http") ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl">{item.image}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-800 truncate">{item.name}</p>
                    <p className="text-xs text-stone-400 mt-0.5">{fmt(item.price)} each</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-stone-200">
                        <button onClick={() => onQty(item._id, -1)} className="w-7 h-7 flex items-center justify-center text-stone-500 hover:bg-stone-50 text-base">−</button>
                        <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                        <button onClick={() => onQty(item._id, 1)} className="w-7 h-7 flex items-center justify-center text-stone-500 hover:bg-stone-50 text-base">+</button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-stone-800">{fmt(item.price * item.qty)}</span>
                        <button onClick={() => onRemove(item._id)} className="text-stone-300 hover:text-red-400 text-xs transition-colors">✕</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-stone-100 px-6 py-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-500">Subtotal</span>
              <span className="text-lg font-semibold text-stone-900">{fmt(subtotal)}</span>
            </div>
            <p className="text-xs text-stone-400">Shipping and taxes calculated at checkout</p>
            <button
              className="btn-primary w-full py-3.5 text-sm"
              onClick={onCheckout}
              disabled={checkingOut}
            >
              {checkingOut ? "Processing..." : "Checkout"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

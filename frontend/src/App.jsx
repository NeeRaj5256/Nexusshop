import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./context/AuthContext.jsx";
import { useToast } from "./hooks/useToast.js";
import LoginScreen from "./components/LoginScreen.jsx";
import ProductCard from "./components/ProductCard.jsx";
import ProductForm from "./components/ProductForm.jsx";
import CartSidebar from "./components/CartSidebar.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import AIAssistant from "./components/AIAssistant.jsx";
import Modal from "./components/Modal.jsx";
import Toast from "./components/Toast.jsx";
import MyOrders from "./components/MyOrders.jsx";
import {
  apiGetProducts, apiCreateProduct, apiUpdateProduct,
  apiDeleteProduct, apiPlaceOrder,
} from "./api.js";

const CATEGORIES = ["All", "Electronics", "Accessories", "Kitchen", "Sports", "Home"];

export default function App() {
  const { user, logout } = useAuth();
  const { toasts, toast } = useToast();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [showCart, setShowCart] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [adminView, setAdminView] = useState("products");
  const [checkoutDone, setCheckoutDone] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [showOrders, setShowOrders] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (category !== "All") params.category = category;
      if (search) params.search = search;
      if (sortBy !== "default") params.sort = sortBy;
      setProducts(await apiGetProducts(params));
    } catch { toast("Failed to load products", "error"); }
    setLoading(false);
  }, [category, search, sortBy]);

  useEffect(() => { if (user) fetchProducts(); }, [user, fetchProducts]);

  if (!user) return <LoginScreen />;

  const isAdmin = user.role === "admin";
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const addToCart = (product) => {
    if (product.stock === 0) { toast("This item is out of stock", "error"); return; }
    setCart(c => {
      const ex = c.find(i => i._id === product._id);
      if (ex) return c.map(i => i._id === product._id ? { ...i, qty: i.qty + 1 } : i);
      return [...c, { ...product, qty: 1 }];
    });
    toast(`${product.name} added to cart`, "success");
  };

  const removeFromCart = (id) => setCart(c => c.filter(i => i._id !== id));
  const changeQty = (id, delta) => setCart(c =>
    c.map(i => i._id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
  );

  const checkout = async () => {
    setCheckingOut(true);
    try {
      const items = cart.map(i => ({ productId: i._id, name: i.name, image: i.image, price: i.price, qty: i.qty }));
      await apiPlaceOrder(items);
      setCart([]);
      setShowCart(false);
      setShowOrders(false);
      setCheckoutDone(true);
      setTimeout(() => setCheckoutDone(false), 4000);
      fetchProducts();
    } catch (e) { toast(e.message || "Checkout failed", "error"); }
    setCheckingOut(false);
  };

  const saveProduct = async (form) => {
    if (!form.name || !form.price || !form.stock) { toast("Please fill all required fields", "error"); return; }
    try {
      if (editProduct) {
        const updated = await apiUpdateProduct(editProduct._id, { ...form, price: +form.price, stock: +form.stock });
        setProducts(p => p.map(x => x._id === editProduct._id ? updated : x));
        toast("Product updated successfully", "success");
        setEditProduct(null);
      } else {
        const created = await apiCreateProduct({ ...form, price: +form.price, stock: +form.stock });
        setProducts(p => [...p, created]);
        toast("Product added", "success");
        setShowAddProduct(false);
      }
    } catch (e) { toast(e.message || "Failed to save", "error"); }
  };

  const deleteProduct = async (id) => {
    try {
      await apiDeleteProduct(id);
      setProducts(p => p.filter(x => x._id !== id));
      setDeleteConfirm(null);
      toast("Product removed", "info");
    } catch (e) { toast(e.message || "Failed to delete", "error"); }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-stone-200">
        {/* Top bar */}
        <div className="border-b border-stone-100 px-6 py-2 flex items-center justify-between">
          <p className="text-xs text-stone-400">Free shipping on orders over ₹999</p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-stone-500">{isAdmin ? "🔑 Admin" : "👤"} {user.name}</span>
            <button onClick={logout} className="text-xs text-stone-400 hover:text-stone-600 transition-colors underline">Sign out</button>
          </div>
        </div>

        {/* Main header */}
        <div className="px-6 py-4 flex items-center gap-6 bg-black text-white p-4">
          <a href="#" className="font-display text-xl text-stone-50 tracking-tight shrink-0">NexusShop</a>

          {isAdmin && (
            <div className="flex border border-stone-200">
              {[["products", "Products"], ["dashboard", "Dashboard"]].map(([v, l]) => (
                <button key={v} onClick={() => setAdminView(v)}
                  className={`px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors
                    ${adminView === v ? "bg-stone-900 text-white" : "text-stone-500 hover:text-stone-700"}`}
                >{l}</button>
              ))}
            </div>
          )}

          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">⌕</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="input-base pl-8 py-2"
            />
          </div>

          <div className="flex items-center gap-3 ml-auto shrink-0">
            {isAdmin ? (
              <button onClick={() => setShowAddProduct(true)}
                className="btn-primary py-2 px-4 text-xs">
                + Add Product
              </button>
            ) : (
              <>
                <button
                  onClick={() => { setShowOrders(o => !o); }}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${showOrders ? "text-stone-50 underline underline-offset-4" : "text-stone-50 hover:text-stone-800"}`}
                >
                  <span className="text-base">📋</span>
                  <span>My Orders</span>
                </button>
                <button onClick={() => { setShowCart(true); setShowOrders(false); }}
                  className="relative flex items-center gap-2 text-sm font-medium text-stone-50 hover:text-stone-900 transition-colors">
                  <span className="text-lg">🛒</span>
                  <span>Cart</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-stone-900 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Category nav — only for product view */}
        {(!isAdmin || adminView === "products") && !showOrders && (
          <nav className="flex items-center gap-0 px-6 border-t border-stone-100 overflow-x-auto">
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-3 text-xs font-medium uppercase tracking-widest whitespace-nowrap border-b-2 transition-colors
                  ${category === c
                    ? "border-stone-900 text-stone-900"
                    : "border-transparent text-stone-400 hover:text-stone-600"}`}
              >{c}</button>
            ))}
            <div className="ml-auto flex items-center gap-2 py-2 shrink-0">
              <label className="text-xs text-stone-400">Sort:</label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="text-xs border border-stone-200 px-2 py-1.5 text-stone-600 focus:outline-none bg-white"
              >
                <option value="default">Featured</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="rating">Best Rated</option>
                <option value="stock">In Stock</option>
              </select>
            </div>
          </nav>
        )}
      </header>

      {/* Main */}
      <main className="w-full px-4 py-6">
        {isAdmin && adminView === "dashboard" ? (
          <AdminDashboard products={products} />
        ) : !isAdmin && showOrders ? (
          <MyOrders />
        ) : (
          <>
            {/* Results info */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs text-stone-400 uppercase tracking-widest">
                {loading ? "Loading..." : `${products.length} product${products.length !== 1 ? "s" : ""}${category !== "All" ? ` · ${category}` : ""}${search ? ` · "${search}"` : ""}`}
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="w-6 h-6 border-2 border-stone-200 border-t-stone-600 rounded-full animate-spin" />
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-4xl mb-4 opacity-20">📦</p>
                <p className="text-stone-500 font-medium mb-1">No products found</p>
                <p className="text-stone-400 text-sm">Try adjusting your search or filters</p>
                <button onClick={() => { setSearch(""); setCategory("All"); }} className="btn-outline mt-4 py-2 px-5 text-xs">
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {products.map(p => (
                  <ProductCard
                    key={p._id}
                    product={p}
                    isAdmin={isAdmin}
                    inCart={cart.some(c => c._id === p._id)}
                    onAddToCart={addToCart}
                    onEdit={setEditProduct}
                    onDelete={id => setDeleteConfirm(id)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Cart */}
      {showCart && (
        <CartSidebar
          cart={cart}
          onClose={() => setShowCart(false)}
          onRemove={removeFromCart}
          onQty={changeQty}
          onCheckout={checkout}
          checkingOut={checkingOut}
        />
      )}

      {/* Modals */}
      {showAddProduct && (
        <Modal title="Add New Product" onClose={() => setShowAddProduct(false)}>
          <ProductForm onSave={saveProduct} onClose={() => setShowAddProduct(false)} />
        </Modal>
      )}

      {editProduct && (
        <Modal title="Edit Product" onClose={() => setEditProduct(null)}>
          <ProductForm initial={editProduct} onSave={saveProduct} onClose={() => setEditProduct(null)} />
        </Modal>
      )}

      {deleteConfirm && (
        <Modal title="Remove Product" onClose={() => setDeleteConfirm(null)}>
          <p className="text-stone-500 text-sm mb-6">Are you sure you want to remove this product? This action cannot be undone.</p>
          <div className="flex gap-3">
            <button className="btn-outline flex-1" onClick={() => setDeleteConfirm(null)}>Cancel</button>
            <button className="btn-danger flex-1" onClick={() => deleteProduct(deleteConfirm)}>Remove</button>
          </div>
        </Modal>
      )}

      {/* Order success */}
      {checkoutDone && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white p-12 text-center max-w-sm w-full mx-4 animate-fade-up shadow-2xl">
            <div className="text-5xl mb-4">✓</div>
            <h2 className="font-display text-2xl text-stone-800 mb-2">Order Confirmed</h2>
            <p className="text-stone-400 text-sm">Thank you for your purchase. You'll receive a confirmation shortly.</p>
          </div>
        </div>
      )}

      {/* AI Assistant */}
      {!isAdmin && (
        <>
          <button
            onClick={() => setShowAI(v => !v)}
            className="fixed bottom-6 right-6 bg-stone-900 text-white w-12 h-12 flex items-center justify-center shadow-lg hover:bg-stone-700 transition-colors z-30 text-lg"
            title="Shopping Assistant"
          >
            💬
          </button>
          {showAI && <AIAssistant products={products} onClose={() => setShowAI(false)} />}
        </>
      )}

      <Toast toasts={toasts} />
    </div>
  );
}

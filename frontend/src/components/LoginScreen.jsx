import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginScreen() {
  const { login, register } = useAuth();
  const [tab, setTab] = useState("login"); // login | register | admin
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setErr(""); setLoading(true);
    try {
      if (tab === "register") {
        if (!name.trim()) { setErr("Name is required"); setLoading(false); return; }
        await register(name.trim(), email, pass);
      } else {
        await login(email, pass);
      }
    } catch (e) {
      setErr(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-stone-900 flex-col justify-between p-12">
        <div>
          <span className="text-white font-display text-2xl tracking-tight">NexusShop</span>
        </div>
        <div>
          <p className="text-stone-400 text-sm uppercase tracking-widest mb-4">Curated Collection</p>
          <h2 className="text-white font-display text-5xl leading-tight mb-6">
            Quality goods,<br />thoughtfully made.
          </h2>
          <p className="text-stone-500 text-base leading-relaxed max-w-sm">
            A marketplace for products that stand the test of time. No clutter, no noise — just things worth buying.
          </p>
        </div>
        <div className="flex gap-8">
          {["2,400+ Products", "48hr Delivery", "Free Returns"].map(t => (
            <div key={t}>
              <p className="text-white text-sm font-medium">{t}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="font-display text-3xl text-stone-800 mb-1">Welcome back</h1>
            <p className="text-stone-500 text-sm">Sign in to your account to continue</p>
          </div>

          {/* Tab switcher */}
          <div className="flex border border-stone-200 mb-6">
            {[["login", "Sign In"], ["register", "Register"], ["admin", "Admin"]].map(([v, l]) => (
              <button
                key={v}
                onClick={() => { setTab(v); setErr(""); }}
                className={`flex-1 py-2 text-sm font-medium transition-colors
                  ${tab === v ? "bg-stone-900 text-white" : "bg-white text-stone-500 hover:text-stone-700"}`}
              >{l}</button>
            ))}
          </div>

          {tab === "admin" && (
            <div className="bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-700 mb-5">
              Demo credentials: <strong>admin@shop.com</strong> / <strong>admin123</strong>
            </div>
          )}

          <div className="space-y-4">
            {tab === "register" && (
              <div>
                <label className="label">Full Name</label>
                <input className="input-base" value={name} onChange={e => setName(e.target.value)} placeholder="" />
              </div>
            )}
            <div>
              <label className="label">Email Address</label>
              <input className="input-base" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input-base" type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••"
                onKeyDown={e => e.key === "Enter" && handle()} />
            </div>

            {err && (
              <p className="text-red-600 text-sm flex items-center gap-1.5">
                <span>⚠</span> {err}
              </p>
            )}

            <button className="btn-primary w-full py-3 mt-2" onClick={handle} disabled={loading}>
              {loading ? "Please wait..." : tab === "register" ? "Create Account" : "Sign In →"}
            </button>
          </div>

          {tab === "register" && (
            <p className="text-center text-stone-400 text-xs mt-5">
              Already have an account?{" "}
              <button onClick={() => setTab("login")} className="text-stone-600 underline">Sign in</button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

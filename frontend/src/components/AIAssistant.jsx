import { useState, useRef, useEffect } from "react";

const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

export default function AIAssistant({ products, onClose }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I can help you find products, compare options, or answer any questions about the store." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(m => [...m, { role: "user", content: userMsg }]);
    setLoading(true);
    try {
      const productList = products.map(p =>
        `${p.name} (${p.category}): ${fmt(p.price)}, ${p.stock} in stock, rated ${p.rating}/5. ${p.description}`
      ).join("\n");

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are a helpful shopping assistant for NexusShop. Available products:\n\n${productList}\n\nHelp customers find products, compare items, and make decisions. Be concise and helpful.`,
          messages: [...messages, { role: "user", content: userMsg }].map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await res.json();
      setMessages(m => [...m, { role: "assistant", content: data.content?.[0]?.text || "Sorry, I couldn't process that." }]);
    } catch {
      setMessages(m => [...m, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-20 right-6 w-80 bg-white border border-stone-200 shadow-2xl z-40 flex flex-col animate-fade-up" style={{ height: 440 }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100 bg-stone-900">
        <div>
          <p className="text-white text-sm font-medium">Shopping Assistant</p>
          <p className="text-stone-400 text-xs">Powered by Claude</p>
        </div>
        <button onClick={onClose} className="text-stone-400 hover:text-white text-xl leading-none transition-colors">×</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] px-3 py-2 text-xs leading-relaxed
              ${m.role === "user"
                ? "bg-stone-900 text-white"
                : "bg-stone-100 text-stone-700 border border-stone-200"}`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-stone-100 border border-stone-200 px-3 py-2 flex gap-1 items-center">
              {[0,1,2].map(i => (
                <div key={i} className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-stone-100 flex">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Ask anything..."
          className="flex-1 px-4 py-3 text-xs text-stone-700 placeholder-stone-400 focus:outline-none bg-white"
        />
        <button onClick={send} disabled={loading} className="px-4 bg-stone-900 text-white text-xs font-medium hover:bg-stone-700 transition-colors disabled:opacity-50">
          Send
        </button>
      </div>
    </div>
  );
}

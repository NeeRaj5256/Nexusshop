export default function Toast({ toasts }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 text-sm shadow-lg animate-toast-in min-w-[260px]
            ${t.type === "error" ? "bg-red-600 text-white" :
              t.type === "success" ? "bg-stone-900 text-white" :
              "bg-stone-700 text-white"}`}
        >
          <span className="text-base">
            {t.type === "error" ? "✕" : t.type === "success" ? "✓" : "·"}
          </span>
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

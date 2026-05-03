export default function Modal({ title, onClose, children, wide }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className={`bg-white w-full ${wide ? "max-w-2xl" : "max-w-md"} max-h-[90vh] overflow-auto animate-fade-up shadow-2xl`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h2 className="text-base font-semibold text-stone-800 tracking-wide">{title}</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-xl leading-none transition-colors">×</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

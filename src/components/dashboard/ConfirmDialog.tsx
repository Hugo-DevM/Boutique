"use client";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-espresso/60 backdrop-blur-[2px]" onClick={onCancel} />

      <div className="relative bg-cream-100 w-full max-w-sm p-8 space-y-6">
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-ink/30 mb-3">
            {danger ? "Acción irreversible" : "Confirmar acción"}
          </p>
          <h3
            className="text-xl font-light text-ink"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {title}
          </h3>
          <p className="text-sm text-ink/50 leading-relaxed mt-2">{message}</p>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={onCancel}
            className="flex-1 border border-cream-300 text-ink/50 hover:text-ink hover:border-ink py-3 text-[10px] font-semibold tracking-[0.14em] uppercase transition-colors duration-200"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 text-[10px] font-semibold tracking-[0.14em] uppercase transition-colors duration-200 ${
              danger
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-champagne hover:bg-champagne-dark text-espresso"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

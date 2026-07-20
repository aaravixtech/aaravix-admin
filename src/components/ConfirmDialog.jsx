import { AlertTriangle, Loader2 } from 'lucide-react';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, loading, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/35"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="alertdialog"
        aria-modal="true"
        className="relative w-full max-w-sm rounded-xl border border-[var(--border)] bg-white p-6 text-center"
        style={{ boxShadow: 'var(--shadow-modal)' }}
      >
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-red-100 bg-red-50">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>

        <h3 className="mb-2 text-lg font-bold tracking-tight text-[var(--text-primary)]">{title}</h3>
        <p className="mb-6 text-sm leading-relaxed text-[var(--text-tertiary)]">{message}</p>

        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="btn btn-ghost flex-1">
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="btn btn-danger flex-1"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

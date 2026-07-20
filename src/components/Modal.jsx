import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, size = 'md', flushBody = false }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const sizeClass =
    size === 'lg' ? 'max-w-2xl' :
    size === 'sm' ? 'max-w-sm' :
    'max-w-lg';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/35"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-white ${sizeClass}`}
        style={{ boxShadow: 'var(--shadow-modal)' }}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--bg-muted)] px-5">
          <h3 id="modal-title" className="text-[15px] font-bold tracking-tight text-[var(--text-primary)]">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="btn-icon border-transparent bg-transparent hover:bg-[var(--bg-subtle)]"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className={`flex-1 overflow-y-auto ${flushBody ? 'p-0' : 'px-6 py-6'}`}>
          {children}
        </div>
      </div>
    </div>
  );
}

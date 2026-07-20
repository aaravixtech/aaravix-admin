/**
 * Loading Screen — Full-page spinner
 */
import { Loader2, Layers } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-page)]">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)]">
          <Layers className="h-5 w-5 text-white" />
        </div>
        <Loader2 className="h-6 w-6 animate-spin text-[var(--accent)]" />
        <div className="text-center">
          <p className="text-sm font-semibold text-[var(--text-primary)]">Loading</p>
          <p className="mt-0.5 text-xs text-[var(--text-muted)]">Please wait…</p>
        </div>
      </div>
    </div>
  );
}

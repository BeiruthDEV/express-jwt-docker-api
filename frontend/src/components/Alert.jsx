import { CheckCircle2, XCircle } from 'lucide-react';
import { useEffect } from 'react';

export default function Alert({ toast, onDone }) {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(onDone, 3200);
    return () => clearTimeout(timer);
  }, [toast, onDone]);

  if (!toast) return null;

  const isError = toast.type === 'error';
  const Icon = isError ? XCircle : CheckCircle2;

  return (
    <div className="fixed bottom-6 right-6 z-[90] w-[calc(100%-3rem)] max-w-sm animate-rise">
      <div className="flex items-start gap-3 rounded-3xl border border-white/80 bg-white p-4 shadow-soft">
        <div className={`grid h-10 w-10 place-items-center rounded-2xl ${isError ? 'bg-red-50 text-red-600' : 'bg-aqua text-brandDark'}`}>
          <Icon size={20} />
        </div>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wide text-muted">{isError ? 'Erro' : 'Sucesso'}</p>
          <p className="mt-1 text-sm font-semibold text-ink">{toast.message}</p>
        </div>
      </div>
    </div>
  );
}

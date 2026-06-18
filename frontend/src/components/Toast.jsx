import { useEffect } from 'react';

export default function Toast({ toast, onDone }) {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(onDone, 3200);
    return () => clearTimeout(timer);
  }, [toast, onDone]);

  if (!toast) return null;

  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-5 right-5 z-50 w-[calc(100%-2.5rem)] max-w-sm animate-rise">
      <div className={`rounded-lg border bg-panel p-4 shadow-soft ${isError ? 'border-red-200' : 'border-emerald-200'}`}>
        <p className={`text-xs font-bold uppercase tracking-wide ${isError ? 'text-red-600' : 'text-brand'}`}>
          {isError ? 'Erro' : 'Sucesso'}
        </p>
        <p className="mt-1 text-sm text-ink">{toast.message}</p>
      </div>
    </div>
  );
}

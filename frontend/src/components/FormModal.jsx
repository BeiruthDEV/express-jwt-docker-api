import { useEffect, useState } from 'react';

export default function FormModal({ open, title, fields, initial, onClose, onSubmit, submitting }) {
  const [values, setValues] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return;
    const next = {};
    fields.forEach((field) => {
      next[field.name] = initial?.[field.name] ?? '';
    });
    setValues(next);
    setError(null);
  }, [open, initial, fields]);

  if (!open) return null;

  async function submit(event) {
    event.preventDefault();
    setError(null);

    const payload = {};
    for (const field of fields) {
      let value = values[field.name];
      if (value === '' || value == null) {
        if (field.required && !initial) {
          setError(`Campo "${field.label}" obrigatorio`);
          return;
        }
        continue;
      }
      if (field.type === 'number') value = Number(value);
      payload[field.name] = value;
    }

    try {
      await onSubmit(payload);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
      <div className="w-full max-w-lg rounded-lg bg-panel shadow-soft">
        <div className="flex items-start justify-between border-b border-line px-6 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-muted">{initial ? 'Editar' : 'Novo'}</p>
            <h2 className="mt-1 text-2xl font-bold text-ink">{title}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-md px-2 py-1 text-2xl leading-none text-muted hover:text-ink" aria-label="Fechar">
            x
          </button>
        </div>

        <form onSubmit={submit} className="space-y-5 px-6 py-6">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="label mb-2 block">{field.label}</label>
              {field.type === 'select' ? (
                <select
                  className="input"
                  value={values[field.name] ?? ''}
                  onChange={(event) => setValues({ ...values, [field.name]: event.target.value })}
                >
                  <option value="">Selecione</option>
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  className="input"
                  type={field.type || 'text'}
                  placeholder={field.placeholder || ''}
                  value={values[field.name] ?? ''}
                  onChange={(event) => setValues({ ...values, [field.name]: event.target.value })}
                  autoComplete="off"
                />
              )}
              {field.hint && <p className="mt-1 text-xs text-muted">{field.hint}</p>}
            </div>
          ))}

          {error && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost">
              Cancelar
            </button>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Salvando...' : initial ? 'Atualizar' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

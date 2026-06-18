import { ChevronDown, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

function resolveOptions(field, values) {
  if (field.dependsOn && field.optionsBy) {
    const parentValue = values[field.dependsOn];
    if (!parentValue) return [];
    const list = field.optionsBy[parentValue] || [];
    return list.map((value) => ({ value: String(value), label: String(value) }));
  }
  if (typeof field.options === 'function') {
    return field.options(values) || [];
  }
  return field.options || [];
}

function ensureLegacyOption(options, currentValue) {
  if (currentValue === '' || currentValue == null) return options;
  const exists = options.some((opt) => String(opt.value) === String(currentValue));
  if (exists) return options;
  return [...options, { value: String(currentValue), label: `${currentValue} (atual)` }];
}

const SELECT_CLASS =
  'w-full appearance-none rounded-2xl border border-slate-200 bg-white px-5 py-3 pr-12 text-sm font-medium text-slate-900 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400';

function SelectField({ field, value, options, disabled, onChange }) {
  const placeholder = field.placeholder || `Selecione ${field.label?.toLowerCase() || ''}`;
  return (
    <div className="relative">
      <select
        className={SELECT_CLASS}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      >
        <option value="" disabled>
          {disabled ? field.disabledPlaceholder || placeholder : placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown size={18} className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 ${disabled ? 'text-slate-300' : 'text-slate-400'}`} />
    </div>
  );
}

export default function Modal({ open, title, fields, initial, onClose, onSubmit, submitting }) {
  const [values, setValues] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return;
    const next = {};
    fields.forEach((field) => {
      const raw = initial?.[field.name];
      next[field.name] = raw === null || raw === undefined ? '' : String(raw);
    });
    setValues(next);
    setError(null);
  }, [open, initial, fields]);

  const fieldStates = useMemo(() => {
    return fields.map((field) => {
      const currentValue = values[field.name] ?? '';
      if (field.type !== 'select') {
        return { field, currentValue, options: [], disabled: false };
      }
      let options = resolveOptions(field, values);
      options = ensureLegacyOption(options, currentValue);
      const disabled = Boolean(field.dependsOn && !values[field.dependsOn]);
      return { field, currentValue, options, disabled };
    });
  }, [fields, values]);

  if (!open) return null;

  function updateField(field, newValue) {
    setValues((prev) => {
      const next = { ...prev, [field.name]: newValue };
      fields.forEach((other) => {
        if (other.dependsOn === field.name && other.type === 'select') {
          const childOptions = resolveOptions(other, next);
          const stillValid = childOptions.some((opt) => String(opt.value) === String(next[other.name]));
          if (!stillValid) next[other.name] = '';
        }
      });
      return next;
    });
  }

  async function submit(event) {
    event.preventDefault();
    setError(null);

    const payload = {};
    for (const field of fields) {
      let value = values[field.name];
      if (value === '' || value == null) {
        if (field.required) {
          setError('Preencha todos os campos antes de salvar.');
          return;
        }
        continue;
      }
      if (field.type === 'number' || field.coerce === 'number') value = Number(value);
      payload[field.name] = value;
    }

    try {
      await onSubmit(payload);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl animate-rise overflow-hidden rounded-[1.75rem] border border-white/80 bg-white shadow-soft">
        <div className="flex items-start justify-between border-b border-line bg-slate-50 px-7 py-5">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-brandDark">{initial ? 'Editar registro' : 'Novo registro'}</p>
            <h2 className="mt-1 text-2xl font-extrabold text-ink">{title}</h2>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-muted shadow-sm hover:text-ink" aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-5 px-7 py-7">
          {fieldStates.map(({ field, currentValue, options, disabled }) => (
            <div key={field.name}>
              <label className="label mb-2 block">{field.label}</label>
              {field.type === 'select' ? (
                <SelectField
                  field={field}
                  value={currentValue}
                  options={options}
                  disabled={disabled}
                  onChange={(value) => updateField(field, value)}
                />
              ) : (
                <input
                  className="input"
                  type={field.type || 'text'}
                  placeholder={field.placeholder || ''}
                  value={currentValue}
                  onChange={(event) => updateField(field, event.target.value)}
                  autoComplete="off"
                />
              )}
              {field.hint && <p className="mt-1 text-xs text-muted">{field.hint}</p>}
            </div>
          ))}

          {error && <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-soft">
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

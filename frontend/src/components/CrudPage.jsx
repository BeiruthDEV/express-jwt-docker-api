import { ChevronDown, Filter, Plus, Search, SlidersHorizontal } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../api';
import Alert from './Alert';
import DataTable from './DataTable';
import Modal from './Modal';
import Shell from './Shell';

function getId(row) {
  return row._id || row.id;
}

function getDateValue(row) {
  const value = row.createdAt || row.created_at || row.updatedAt || row.updated_at;
  const time = value ? new Date(value).getTime() : NaN;
  return Number.isNaN(time) ? null : time;
}

function normalizeOption(option) {
  return typeof option === 'string' ? { value: option, label: option } : option;
}

export default function CrudPage({ resource, title, description, columns, fields, filterConfig }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [query, setQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortNewest, setSortNewest] = useState(true);
  const filterRef = useRef(null);

  const filterOptions = useMemo(
    () => [{ value: 'all', label: 'Todas' }, ...((filterConfig?.options || []).map(normalizeOption))],
    [filterConfig]
  );
  const selectedFilterLabel = filterOptions.find((option) => option.value === selectedFilter)?.label || 'Todas';
  const filterActive = selectedFilter !== 'all';
  const filterButtonLabel = filterConfig
    ? filterActive
      ? `${filterConfig.label}: ${selectedFilterLabel}`
      : filterConfig.label
    : 'Filtro';

  const visibleRows = useMemo(() => {
    const searched = rows.filter((row) => JSON.stringify(row).toLowerCase().includes(query.toLowerCase()));
    const filtered = filterConfig && selectedFilter !== 'all'
      ? searched.filter((row) => {
          const value = filterConfig.getValue ? filterConfig.getValue(row) : row[filterConfig.field];
          return String(value || '').toLowerCase() === String(selectedFilter).toLowerCase();
        })
      : searched;
    return [...filtered].sort((a, b) => {
      const dateA = getDateValue(a);
      const dateB = getDateValue(b);
      if (dateA !== null && dateB !== null) {
        return sortNewest ? dateB - dateA : dateA - dateB;
      }
      const indexA = rows.indexOf(a);
      const indexB = rows.indexOf(b);
      return sortNewest ? indexB - indexA : indexA - indexB;
    });
  }, [rows, query, filterConfig, selectedFilter, sortNewest]);

  async function load() {
    setLoading(true);
    try {
      const data = await api.list(resource);
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [resource]);

  useEffect(() => {
    setSelectedFilter('all');
    setFilterOpen(false);
    setSortNewest(true);
    setQuery('');
  }, [resource]);

  useEffect(() => {
    function closeOnOutsideClick(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterOpen(false);
      }
    }

    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(row) {
    setEditing(row);
    setModalOpen(true);
  }

  async function save(payload) {
    setSubmitting(true);
    try {
      if (editing) {
        await api.update(resource, getId(editing), payload);
        setToast({ type: 'success', message: 'Registro atualizado com sucesso.' });
      } else {
        await api.create(resource, payload);
        setToast({ type: 'success', message: 'Registro cadastrado com sucesso.' });
      }
      setModalOpen(false);
      await load();
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(row) {
    const label = row.name || row.model || row.email || 'registro';
    if (!window.confirm(`Remover ${label}?`)) return;

    try {
      await api.remove(resource, getId(row));
      setToast({ type: 'success', message: 'Registro removido com sucesso.' });
      await load();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    }
  }

  return (
    <Shell
      eyebrow="Inventory Control"
      title={title}
      description={description}
      actions={
        <button type="button" onClick={openCreate} className="btn-primary">
            <Plus size={18} />
            Novo registro
        </button>
      }
    >
      <div className="mb-4 grid gap-4 lg:grid-cols-[1fr_280px]">
        <div className="panel-card flex flex-col gap-4 px-5 py-3.5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-aqua text-brandDark">
              <SlidersHorizontal size={19} />
            </div>
            <div>
              <p className="text-sm font-black text-ink">{rows.length} registros no modulo</p>
              <p className="text-xs font-semibold text-muted">Dados sincronizados com a API protegida por JWT.</p>
            </div>
          </div>
          <div className="rounded-full bg-white px-3 py-2 text-xs font-black text-muted ring-1 ring-line">
            Exibindo {visibleRows.length} de {rows.length}
          </div>
        </div>
        <div className="panel-card px-5 py-3.5">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted">Status</p>
          <p className="mt-1 text-sm font-black text-ink">{loading ? 'Carregando' : 'Pronto para operar'}</p>
          <p className="mt-1 text-xs font-semibold text-muted">Sincronizado com API</p>
        </div>
      </div>

      <div className="panel-card mb-4 p-3.5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-3 rounded-full border border-line bg-slate-50 px-4 py-3 text-muted">
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
              placeholder={`Buscar em ${title.toLowerCase()}`}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {filterConfig && (
              <div ref={filterRef} className="relative">
                <button
                  type="button"
                  onClick={() => setFilterOpen((open) => !open)}
                  className={`inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold shadow-sm transition ${
                    filterActive
                      ? 'border-slate-950 bg-slate-950 text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Filter size={16} />
                  {filterButtonLabel}
                  <ChevronDown size={15} className={`transition ${filterOpen ? 'rotate-180' : ''}`} />
                </button>
                {filterOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
                    {filterOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setSelectedFilter(option.value);
                          setFilterOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold transition ${
                          selectedFilter === option.value
                            ? 'bg-slate-950 text-white'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            <button
              type="button"
              onClick={() => setSortNewest((value) => !value)}
              className={`inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold shadow-sm transition ${
                !sortNewest
                  ? 'border-slate-950 bg-slate-950 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <SlidersHorizontal size={19} />
              {sortNewest ? 'Mais recentes' : 'Mais antigos'}
            </button>
          </div>
        </div>
      </div>

      <DataTable columns={columns} rows={visibleRows} loading={loading} onEdit={openEdit} onDelete={remove} />

      <Modal
        open={modalOpen}
        title={title}
        fields={fields}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSubmit={save}
        submitting={submitting}
      />

      <Alert toast={toast} onDone={() => setToast(null)} />
    </Shell>
  );
}

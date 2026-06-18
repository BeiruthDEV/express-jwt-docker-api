import { Edit3, MoreVertical, Trash2 } from 'lucide-react';

export default function DataTable({ columns, rows, onEdit, onDelete, loading, empty }) {
  if (loading) {
    return (
      <div className="panel-card p-10 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-brand border-t-transparent" />
        <p className="mt-4 text-sm font-semibold text-muted">Carregando registros...</p>
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <div className="panel-card p-12 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-[20px] bg-aqua text-brandDark">
          <span className="text-3xl">+</span>
        </div>
        <h3 className="mt-4 text-lg font-black text-ink">Nenhum registro encontrado</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted">{empty || 'Cadastre o primeiro item para preencher esta listagem.'}</p>
      </div>
    );
  }

  return (
    <div className="panel-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-line/70 bg-slate-50/70 text-muted">
              {columns.map((column) => (
                <th key={column.key} className="px-5 py-3.5 text-left text-[10px] font-black uppercase tracking-[0.16em]">
                  {column.label}
                </th>
              ))}
              <th className="px-5 py-3.5 text-right text-[10px] font-black uppercase tracking-[0.16em]">Acoes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/70 bg-white">
            {rows.map((row, index) => (
              <tr key={row._id || row.id || index} className="group transition hover:bg-slate-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-5 py-3.5 align-middle text-ink">
                    {column.render ? column.render(row) : row[column.key] ?? '-'}
                  </td>
                ))}
                <td className="px-5 py-3.5 text-right">
                  <div className="inline-flex gap-2">
                    <button type="button" onClick={() => onEdit(row)} className="grid h-8 w-8 place-items-center rounded-xl border border-line bg-white text-muted transition hover:border-ink hover:text-ink" aria-label="Editar">
                      <Edit3 size={16} />
                    </button>
                    <button type="button" onClick={() => onDelete(row)} className="grid h-8 w-8 place-items-center rounded-xl border border-red-100 bg-red-50 text-red-500 transition hover:bg-red-600 hover:text-white" aria-label="Excluir">
                      <Trash2 size={16} />
                    </button>
                    <button type="button" className="grid h-8 w-8 place-items-center rounded-xl border border-line bg-white text-muted transition group-hover:border-slate-300" aria-label="Mais">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

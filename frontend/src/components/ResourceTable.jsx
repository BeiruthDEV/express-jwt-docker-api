export default function ResourceTable({ columns, rows, onEdit, onDelete, loading, empty }) {
  if (loading) {
    return (
      <div className="rounded-lg border border-line bg-panel p-10 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
        <p className="mt-3 text-sm text-muted">Carregando registros...</p>
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-line bg-panel p-10 text-center">
        <h3 className="text-lg font-semibold text-ink">Nenhum registro encontrado</h3>
        <p className="mt-1 text-sm text-muted">{empty || 'Cadastre o primeiro item para comecar.'}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-panel">
      <table className="w-full min-w-[720px] text-sm">
        <thead className="bg-canvas text-muted">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">
                {column.label}
              </th>
            ))}
            <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide">Acoes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((row, index) => (
            <tr key={row._id || row.id || index} className="transition hover:bg-canvas/70">
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3 align-top text-ink">
                  {column.render ? column.render(row) : row[column.key] ?? '-'}
                </td>
              ))}
              <td className="px-4 py-3 text-right">
                <div className="inline-flex gap-2">
                  <button type="button" onClick={() => onEdit(row)} className="btn-ghost">
                    Editar
                  </button>
                  <button type="button" onClick={() => onDelete(row)} className="btn-danger">
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

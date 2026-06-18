import { useEffect, useState } from 'react';
import { api } from '../api';
import FormModal from './FormModal';
import ResourceTable from './ResourceTable';
import Shell from './Shell';
import Toast from './Toast';

function getId(row) {
  return row._id || row.id;
}

export default function CrudPage({ resource, title, description, columns, fields }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

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
      eyebrow="Cadastro"
      title={title}
      description={description}
      actions={<button type="button" onClick={openCreate} className="btn-primary">Novo registro</button>}
    >
      <ResourceTable
        columns={columns}
        rows={rows}
        loading={loading}
        onEdit={openEdit}
        onDelete={remove}
      />

      <FormModal
        open={modalOpen}
        title={title}
        fields={fields}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSubmit={save}
        submitting={submitting}
      />

      <Toast toast={toast} onDone={() => setToast(null)} />
    </Shell>
  );
}

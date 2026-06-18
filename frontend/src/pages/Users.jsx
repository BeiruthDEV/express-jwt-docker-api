import CrudPage from '../components/CrudPage';

const columns = [
  { key: 'name', label: 'Nome' },
  { key: 'email', label: 'E-mail' },
  { key: 'role', label: 'Perfil' },
  {
    key: 'created_at',
    label: 'Criado em',
    render: (row) => (row.created_at ? new Date(row.created_at).toLocaleDateString('pt-BR') : '-'),
  },
];

const fields = [
  { name: 'name', label: 'Nome', required: true },
  { name: 'email', label: 'E-mail', required: true },
  { name: 'password', label: 'Senha', type: 'password', required: true, hint: 'Obrigatoria ao criar. Na edicao, deixe em branco para manter.' },
  {
    name: 'role',
    label: 'Perfil',
    type: 'select',
    options: [
      { value: 'USER', label: 'USER' },
      { value: 'ADMIN', label: 'ADMIN' },
    ],
  },
];

export default function Users() {
  return (
    <CrudPage
      resource="users"
      title="Usuarios"
      description="CRUD administrativo de usuarios no PostgreSQL. Apenas ADMIN acessa esta tela."
      columns={columns}
      fields={fields}
    />
  );
}

import CrudPage from '../components/CrudPage';

const columns = [
  { key: 'brand', label: 'Marca' },
  { key: 'model', label: 'Modelo' },
  { key: 'year', label: 'Ano' },
  { key: 'cc', label: 'Cilindradas' },
];

const fields = [
  { name: 'brand', label: 'Marca', required: true },
  { name: 'model', label: 'Modelo', required: true },
  { name: 'year', label: 'Ano', type: 'number', required: true },
  { name: 'cc', label: 'Cilindradas', type: 'number' },
];

export default function Motos() {
  return (
    <CrudPage
      resource="motos"
      title="Motos"
      description="Gerencie motos com operacoes protegidas por JWT."
      columns={columns}
      fields={fields}
    />
  );
}

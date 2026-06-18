import CrudPage from '../components/CrudPage';

const columns = [
  { key: 'brand', label: 'Marca' },
  { key: 'model', label: 'Modelo' },
  { key: 'year', label: 'Ano' },
  { key: 'color', label: 'Cor' },
];

const fields = [
  { name: 'brand', label: 'Marca', required: true },
  { name: 'model', label: 'Modelo', required: true },
  { name: 'year', label: 'Ano', type: 'number', required: true },
  { name: 'color', label: 'Cor' },
];

export default function Cars() {
  return (
    <CrudPage
      resource="cars"
      title="Carros"
      description="Liste, cadastre, edite e remova carros salvos no MongoDB."
      columns={columns}
      fields={fields}
    />
  );
}

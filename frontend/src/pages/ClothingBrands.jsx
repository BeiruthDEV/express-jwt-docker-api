import CrudPage from '../components/CrudPage';

const columns = [
  { key: 'name', label: 'Nome' },
  { key: 'country', label: 'Pais' },
  { key: 'foundedYear', label: 'Ano de fundacao' },
];

const fields = [
  { name: 'name', label: 'Nome', required: true },
  { name: 'country', label: 'Pais' },
  { name: 'foundedYear', label: 'Ano de fundacao', type: 'number' },
];

export default function ClothingBrands() {
  return (
    <CrudPage
      resource="clothing-brands"
      title="Marcas de roupa"
      description="Cadastre marcas de roupa armazenadas em banco NoSQL."
      columns={columns}
      fields={fields}
    />
  );
}

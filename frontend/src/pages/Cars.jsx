import CrudPage from '../components/CrudPage';
import Badge from '../components/Badge';
import BrandLogo from '../components/BrandLogo';
import {
  CAR_BRANDS,
  CAR_MODELS_BY_BRAND,
  COLORS,
  YEARS,
  toOptions,
} from '../constants/formOptions';

const columns = [
  {
    key: 'brand',
    label: 'Marca',
    render: (row) => (
      <div className="flex items-center gap-3">
        <BrandLogo name={row.brand} size="md" />
        <span className="font-extrabold">{row.brand}</span>
      </div>
    ),
  },
  { key: 'model', label: 'Modelo' },
  { key: 'year', label: 'Ano', render: (row) => <Badge tone="blue">{row.year}</Badge> },
  { key: 'color', label: 'Cor', render: (row) => <Badge tone="slate">{row.color || '-'}</Badge> },
];

const fields = [
  {
    name: 'brand',
    label: 'Marca',
    type: 'select',
    options: toOptions(CAR_BRANDS),
    placeholder: 'Selecione uma marca',
    required: true,
  },
  {
    name: 'model',
    label: 'Modelo',
    type: 'select',
    dependsOn: 'brand',
    optionsBy: CAR_MODELS_BY_BRAND,
    placeholder: 'Selecione um modelo',
    disabledPlaceholder: 'Selecione uma marca primeiro',
    required: true,
  },
  {
    name: 'year',
    label: 'Ano',
    type: 'select',
    options: toOptions(YEARS),
    placeholder: 'Selecione um ano',
    coerce: 'number',
    required: true,
  },
  {
    name: 'color',
    label: 'Cor',
    type: 'select',
    options: toOptions(COLORS),
    placeholder: 'Selecione uma cor',
  },
];

export default function Cars() {
  return (
    <CrudPage
      resource="cars"
      title="Carros"
      description="Gerencie carros salvos no MongoDB e sincronizados com a API."
      columns={columns}
      fields={fields}
      filterConfig={{ label: 'Marca', field: 'brand', options: CAR_BRANDS }}
    />
  );
}

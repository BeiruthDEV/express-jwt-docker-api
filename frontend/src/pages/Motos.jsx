import CrudPage from '../components/CrudPage';
import Badge from '../components/Badge';
import BrandLogo from '../components/BrandLogo';
import {
  MOTO_BRANDS,
  MOTO_CC_OPTIONS,
  MOTO_MODELS_BY_BRAND,
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
  { key: 'cc', label: 'Cilindradas', render: (row) => <Badge tone="teal">{row.cc || '-'} cc</Badge> },
];

const fields = [
  {
    name: 'brand',
    label: 'Marca',
    type: 'select',
    options: toOptions(MOTO_BRANDS),
    placeholder: 'Selecione uma marca',
    required: true,
  },
  {
    name: 'model',
    label: 'Modelo',
    type: 'select',
    dependsOn: 'brand',
    optionsBy: MOTO_MODELS_BY_BRAND,
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
    name: 'cc',
    label: 'Cilindradas',
    type: 'select',
    options: MOTO_CC_OPTIONS.map((v) => ({ value: String(v), label: `${v} cc` })),
    placeholder: 'Selecione a cilindrada',
    coerce: 'number',
  },
];

export default function Motos() {
  return (
    <CrudPage
      resource="motos"
      title="Motos"
      description="Gerencie motos salvas no MongoDB e sincronizadas com a API."
      columns={columns}
      fields={fields}
      filterConfig={{ label: 'Marca', field: 'brand', options: MOTO_BRANDS }}
    />
  );
}

import CrudPage from '../components/CrudPage';
import Badge from '../components/Badge';
import BrandLogo from '../components/BrandLogo';
import {
  CLOTHING_CATEGORIES,
  CLOTHING_BRANDS,
  COUNTRIES,
  FOUNDED_YEARS,
  toOptions,
} from '../constants/formOptions';

const CATEGORY_BY_BRAND = {
  Nike: 'Sportswear',
  Adidas: 'Sportswear',
  Puma: 'Sportswear',
  Zara: 'Casual',
  Gucci: 'Luxury',
  'Louis Vuitton': 'Luxury',
  Hering: 'Casual',
  Reserva: 'Casual',
  Lacoste: 'Casual',
  'Calvin Klein': 'Formal',
  'Tommy Hilfiger': 'Casual',
  Balenciaga: 'Streetwear',
  Prada: 'Luxury',
  Versace: 'Luxury',
  Uniqlo: 'Casual',
};

function getClothingCategory(row) {
  return row.category || CATEGORY_BY_BRAND[row.name] || '';
}

const columns = [
  {
    key: 'name',
    label: 'Nome',
    render: (row) => (
      <div className="flex items-center gap-3">
        <BrandLogo name={row.name} size="md" />
        <span className="font-extrabold">{row.name}</span>
      </div>
    ),
  },
  { key: 'country', label: 'Pais', render: (row) => <Badge tone="slate">{row.country || '-'}</Badge> },
  { key: 'foundedYear', label: 'Ano de fundacao', render: (row) => <Badge tone="amber">{row.foundedYear || '-'}</Badge> },
];

const fields = [
  {
    name: 'name',
    label: 'Nome',
    type: 'select',
    options: toOptions(CLOTHING_BRANDS),
    placeholder: 'Selecione uma marca',
    required: true,
  },
  {
    name: 'country',
    label: 'Pais',
    type: 'select',
    options: toOptions(COUNTRIES),
    placeholder: 'Selecione um pais',
  },
  {
    name: 'foundedYear',
    label: 'Ano de fundacao',
    type: 'select',
    options: toOptions(FOUNDED_YEARS),
    placeholder: 'Selecione um ano',
    coerce: 'number',
  },
];

export default function ClothingBrands() {
  return (
    <CrudPage
      resource="clothing-brands"
      title="Marcas de roupa"
      description="Gerencie marcas de roupa salvas no MongoDB e sincronizadas com a API."
      columns={columns}
      fields={fields}
      filterConfig={{ label: 'Categoria', getValue: getClothingCategory, options: CLOTHING_CATEGORIES }}
    />
  );
}

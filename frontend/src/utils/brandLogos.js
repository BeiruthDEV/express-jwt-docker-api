const BRAND_DOMAINS = {
  // Carros
  Toyota: 'toyota.com',
  Honda: 'honda.com',
  Ford: 'ford.com',
  Chevrolet: 'chevrolet.com',
  Volkswagen: 'volkswagen.com',
  Jeep: 'jeep.com',
  Hyundai: 'hyundai.com',
  BMW: 'bmw.com',
  Fiat: 'fiat.com',

  // Motos
  Ducati: 'ducati.com',
  Suzuki: 'suzuki.com',
  Yamaha: 'yamaha-motor.com',
  Kawasaki: 'kawasaki.com',
  'Harley-Davidson': 'harley-davidson.com',
  Triumph: 'triumphmotorcycles.com',
  'BMW Motorrad': 'bmw-motorrad.com',

  // Marcas de roupa
  Nike: 'nike.com',
  Adidas: 'adidas.com',
  Puma: 'puma.com',
  Zara: 'zara.com',
  Gucci: 'gucci.com',
  'Louis Vuitton': 'louisvuitton.com',
  Hering: 'hering.com.br',
  Reserva: 'usereserva.com',
};

const DOMAIN_LOOKUP_CI = Object.entries(BRAND_DOMAINS).reduce((acc, [name, domain]) => {
  acc[name.toLowerCase()] = domain;
  return acc;
}, {});

export function normalizeBrandName(name) {
  if (name === null || name === undefined) return '';
  return String(name).trim().replace(/\s+/g, ' ');
}

export function getBrandDomain(brandName) {
  const clean = normalizeBrandName(brandName);
  if (!clean) return null;
  if (BRAND_DOMAINS[clean]) return BRAND_DOMAINS[clean];
  const ci = DOMAIN_LOOKUP_CI[clean.toLowerCase()];
  return ci || null;
}

export function getBrandLogoUrl(brandName) {
  const domain = getBrandDomain(brandName);
  const token = import.meta.env.VITE_LOGO_DEV_TOKEN;
  if (!domain || !token) return null;
  return `https://img.logo.dev/${domain}?token=${token}&size=64&format=png`;
}

export function getBrandInitials(brandName) {
  const clean = normalizeBrandName(brandName);
  if (!clean) return '?';

  if (/^[A-Z]{2,4}$/.test(clean)) return clean;

  const parts = clean.split(/[\s-]+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0][0]?.toUpperCase() || '?';
  }
  return parts
    .slice(0, 3)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}

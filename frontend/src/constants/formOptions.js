export const CAR_BRANDS = [
  'Toyota',
  'Honda',
  'Ford',
  'Chevrolet',
  'Volkswagen',
  'Jeep',
  'Hyundai',
  'BMW',
  'Fiat',
  'Nissan',
  'Renault',
  'Mercedes-Benz',
  'Audi',
];

export const CAR_MODELS_BY_BRAND = {
  Toyota: ['Corolla', 'Hilux', 'SW4', 'Yaris', 'Etios'],
  Honda: ['Civic', 'City', 'HR-V', 'Fit', 'Accord'],
  Ford: ['Mustang', 'Ranger', 'Ka', 'Territory', 'Fusion'],
  Chevrolet: ['Onix', 'Tracker', 'Cruze', 'S10', 'Spin'],
  Volkswagen: ['Golf', 'Polo', 'T-Cross', 'Nivus', 'Jetta'],
  Jeep: ['Compass', 'Renegade', 'Commander', 'Wrangler'],
  Hyundai: ['HB20', 'Creta', 'Tucson', 'Santa Fe'],
  BMW: ['320i', 'X1', 'X3', 'X5', 'M3'],
  Fiat: ['Argo', 'Pulse', 'Toro', 'Strada', 'Cronos'],
  Nissan: ['Kicks', 'Versa', 'Sentra', 'Frontier'],
  Renault: ['Kwid', 'Duster', 'Sandero', 'Logan'],
  'Mercedes-Benz': ['Classe A', 'Classe C', 'GLA', 'GLC'],
  Audi: ['A3', 'A4', 'Q3', 'Q5'],
};

export const MOTO_BRANDS = [
  'Honda',
  'Yamaha',
  'Kawasaki',
  'Suzuki',
  'Ducati',
  'BMW',
  'Harley-Davidson',
  'Triumph',
];

export const MOTO_MODELS_BY_BRAND = {
  Honda: ['CB 500F', 'Biz', 'CG 160', 'XRE 300', 'Africa Twin'],
  Yamaha: ['MT-07', 'Fazer 250', 'Factor 150', 'XTZ 250', 'R3'],
  Kawasaki: ['Ninja 400', 'Z400', 'Versys 650', 'Z900'],
  Suzuki: ['V-Strom 650', 'GSX-S750', 'Hayabusa', 'Burgman'],
  Ducati: ['Monster', 'Panigale V2', 'Multistrada', 'Scrambler'],
  BMW: ['G 310 R', 'R 1250 GS', 'S 1000 RR', 'F 850 GS'],
  'Harley-Davidson': ['Iron 883', 'Fat Boy', 'Street Bob', 'Sportster S'],
  Triumph: ['Trident', 'Street Triple', 'Tiger 900', 'Bonneville'],
};

export const YEARS = Array.from({ length: 2026 - 2015 + 1 }, (_, i) => 2026 - i);

export const COLORS = [
  'Preto',
  'Branco',
  'Prata',
  'Cinza',
  'Vermelho',
  'Azul',
  'Verde',
  'Amarelo',
  'Marrom',
];

export const MOTO_CC_OPTIONS = [110, 125, 150, 160, 250, 300, 400, 500, 650, 750, 883, 900, 1000, 1200];

export const CLOTHING_BRANDS = [
  'Nike',
  'Adidas',
  'Puma',
  'Zara',
  'Gucci',
  'Louis Vuitton',
  'Hering',
  'Reserva',
  'Lacoste',
  'Calvin Klein',
  'Tommy Hilfiger',
  'Balenciaga',
  'Prada',
  'Versace',
];

export const COUNTRIES = [
  'Brazil',
  'USA',
  'Germany',
  'Spain',
  'Italy',
  'France',
  'United Kingdom',
  'Japan',
];

export const CLOTHING_CATEGORIES = [
  'Sportswear',
  'Casual',
  'Luxury',
  'Streetwear',
  'Formal',
  'Footwear',
  'Accessories',
];

export const FOUNDED_YEARS = Array.from({ length: 2026 - 1900 + 1 }, (_, i) => 2026 - i);

export function toOptions(values) {
  return values.map((v) => ({ value: String(v), label: String(v) }));
}

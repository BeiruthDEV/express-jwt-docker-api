require('dotenv').config();

const bcrypt = require('bcryptjs');
const { connectMongo, disconnectMongo } = require('../src/mongo');
const { initPostgres, pool } = require('../src/postgres');
const Car = require('../src/models/Car');
const Moto = require('../src/models/Moto');
const ClothingBrand = require('../src/models/ClothingBrand');

const users = [
  { name: 'Admin', email: 'admin@test.com', password: '123456', role: 'ADMIN' },
  { name: 'Matheus', email: 'user@test.com', password: '123456', role: 'USER' },
];

const cars = [
  { brand: 'Toyota', model: 'Corolla', year: 2022, color: 'Prata' },
  { brand: 'Honda', model: 'Civic', year: 2021, color: 'Preto' },
  { brand: 'Ford', model: 'Mustang', year: 2020, color: 'Vermelho' },
  { brand: 'Chevrolet', model: 'Onix', year: 2023, color: 'Branco' },
  { brand: 'Volkswagen', model: 'Golf', year: 2019, color: 'Azul' },
  { brand: 'Jeep', model: 'Compass', year: 2022, color: 'Cinza' },
  { brand: 'Hyundai', model: 'HB20', year: 2024, color: 'Prata' },
  { brand: 'BMW', model: '320i', year: 2021, color: 'Preto' },
];

const motos = [
  { brand: 'Honda', model: 'CG 160', year: 2023, cc: 160 },
  { brand: 'Yamaha', model: 'Factor 150', year: 2022, cc: 150 },
  { brand: 'Kawasaki', model: 'Ninja 400', year: 2021, cc: 400 },
  { brand: 'BMW', model: 'G 310 R', year: 2020, cc: 313 },
  { brand: 'Ducati', model: 'Monster', year: 2022, cc: 937 },
  { brand: 'Suzuki', model: 'V-Strom 650', year: 2019, cc: 650 },
  { brand: 'Harley-Davidson', model: 'Iron 883', year: 2021, cc: 883 },
  { brand: 'Triumph', model: 'Street Triple', year: 2023, cc: 765 },
];

const clothingBrands = [
  { name: 'Nike', country: 'Estados Unidos', foundedYear: 1964 },
  { name: 'Adidas', country: 'Alemanha', foundedYear: 1949 },
  { name: 'Puma', country: 'Alemanha', foundedYear: 1948 },
  { name: 'Zara', country: 'Espanha', foundedYear: 1975 },
  { name: 'Uniqlo', country: 'Japao', foundedYear: 1949 },
  { name: 'Lacoste', country: 'Franca', foundedYear: 1933 },
  { name: 'Hering', country: 'Brasil', foundedYear: 1880 },
  { name: 'Reserva', country: 'Brasil', foundedYear: 2004 },
];

async function seedUsers() {
  for (const user of users) {
    const exists = await pool.query('SELECT id FROM users WHERE email = $1', [user.email]);
    if (exists.rows.length) {
      console.log(`User already exists: ${user.email}`);
      continue;
    }

    const hash = await bcrypt.hash(user.password, 10);
    await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
      [user.name, user.email, hash, user.role]
    );
    console.log(`User created: ${user.email}`);
  }
}

async function seedMongo() {
  await Promise.all([
    Car.deleteMany({}),
    Moto.deleteMany({}),
    ClothingBrand.deleteMany({}),
  ]);

  await Car.insertMany(cars);
  await Moto.insertMany(motos);
  await ClothingBrand.insertMany(clothingBrands);

  console.log(`Cars created: ${cars.length}`);
  console.log(`Motos created: ${motos.length}`);
  console.log(`Clothing brands created: ${clothingBrands.length}`);
}

async function main() {
  try {
    await connectMongo();
    await initPostgres();
    await seedUsers();
    await seedMongo();
    console.log('Seed completed');
  } catch (err) {
    console.error('Seed failed', err);
    process.exitCode = 1;
  } finally {
    await disconnectMongo().catch(() => {});
    await pool.end().catch(() => {});
  }
}

main();

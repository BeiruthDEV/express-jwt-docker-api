require('dotenv').config();
const app = require('./app');
const { connectMongo } = require('./mongo');
const { initPostgres } = require('./postgres');

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await connectMongo();
    await initPostgres();
    app.listen(PORT, () => console.log(`API on :${PORT}`));
  } catch (err) {
    console.error('Startup failed', err);
    process.exit(1);
  }
})();

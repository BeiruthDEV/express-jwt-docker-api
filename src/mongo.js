const mongoose = require('mongoose');

async function connectMongo(uri) {
  const mongoUri = uri || process.env.MONGO_URI;
  await mongoose.connect(mongoUri);
  console.log('Mongo connected');
}

async function disconnectMongo() {
  await mongoose.disconnect();
}

module.exports = { connectMongo, disconnectMongo, mongoose };

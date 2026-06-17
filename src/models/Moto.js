const { mongoose } = require('../mongo');

const MotoSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    cc: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Moto', MotoSchema);

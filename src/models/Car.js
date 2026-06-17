const { mongoose } = require('../mongo');

const CarSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    color: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Car', CarSchema);

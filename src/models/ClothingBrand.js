const { mongoose } = require('../mongo');

const ClothingBrandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    country: { type: String },
    foundedYear: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ClothingBrand', ClothingBrandSchema);

const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    supplier: { type: String, required: true },
    imageUrl: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    file: { type: String, required: true },
    fileSize: { type: Number },
    discount: { type: Number, min: 0, max: 100 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);

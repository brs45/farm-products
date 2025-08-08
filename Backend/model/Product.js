const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  image: { type: String },
  name: { type: String },
  description: String,
  price: { type: Number },
  phone: { type: String }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;

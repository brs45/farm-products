const Product = require('../model/Product');
const User = require('../model/User');

exports.uploadProduct = async (req, res) => {
  try {
    const { image, name, description, price } = req.body;
    const user = req.user;

    if (!image || !name || !price) {
      return res.status(400).json({ message: "Image, name, and price are required" });
    }

    const product = await Product.create({
      seller: user._id,
      image,
      name,
      description,
      price,
      phone: user.phone || "N/A"
    });

    res.status(201).json({ message: "Product posted", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error uploading product" });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('seller', 'name');

    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: "Error fetching products" });
  }
};

const Product = require("../models/productModel");

const productController = {
  getProducts: async (req, res) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });
      res.render("products", { products });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: "Database query error" });
    }
  },
  showAddProductForm: (req, res) => {
    return res.render("addProduct");
  },
  addProduct: async (req, res) => {
    try {
      const productData = req.body;
      const newProduct = new Product(productData);
      await newProduct.save();
      res.redirect("/products");
    } catch (error) {
      console.error('Error adding product:', error);
      res.status(500).json({ error: "Failed to add product" });
    }
  },
};

module.exports = productController;

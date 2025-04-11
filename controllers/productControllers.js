const Product = require("../models/productModel");

const productController = {
  getProducts: (req, res) => {
    Product.getAllProducts((err, products) => {
      if (err) {
        return res.status(500).json({ error: "Database query error" });
      }
      return res.render("products", { products });
    });
  },
  showAddProductForm: (req, res) => {
    return res.render("addProduct");
  },
  addProduct: (req, res) => {
    const productData = req.body;
    Product.createProduct(productData, (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to add product" });
      }
      return res.redirect("/products");
    });
  },
};

module.exports = productController;

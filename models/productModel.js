const db = require("../config/database");

const Product = {
  getAllProducts: (callback) => {
    db.query("SELECT * FROM products", (err, results) => {
      if (err) return callback(err);
      return callback(null, results);
    });
  },
  createProduct: (productData, callback) => {
    db.query(
      "INSERT INTO products (name, price, description) VALUES (?, ?, ?)",
      [productData.name, productData.price, productData.description],
      (err, results) => {
        if (err) return callback(err);
        return callback(null, results);
      }
    );
  },
};

module.exports = Product;

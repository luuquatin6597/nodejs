const express = require('express');									
const bodyParser = require('body-parser');									
const app = express();									
const productRoutes = require('./routes/productRoutes');									
//const productsRouter = require('./routes/products');									
									
// Thiết lập EJS làm template engine									
app.set('view engine', 'ejs');									
app.set('views', __dirname + '/views');									
									
// Middleware									
app.use(bodyParser.urlencoded({ extended: false }));									
app.use(bodyParser.json());									
									
// Serve static files
app.use(express.static('public'));
									
// Sử dụng định tuyến sản phẩm									
app.use('/products', productRoutes);									
//app.use('/products', productsRouter);									
									
// Lắng nghe cổng									
const PORT = process.env.PORT || 3000;									
app.listen(PORT, () => {									
console.log(`Server is running on port ${PORT}`);									
});
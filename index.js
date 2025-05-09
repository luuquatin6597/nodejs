const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');

const app = express();
const port = 3000;

// Cấu hình EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src/public')));

// Cấu hình session
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // set to true if using https
}));

// Middleware để khởi tạo giỏ hàng nếu chưa có
app.use((req, res, next) => {
    if (!req.session.cart) {
        req.session.cart = [];
    }
    next();
});

// Routes
app.get('/', (req, res) => {
    res.render('pages/shop');
});

app.get('/shop', (req, res) => {
    res.render('pages/shop');
});

app.get('/shopping-cart', (req, res) => {
    res.render('pages/shopping-cart', {
        title: 'Shopping Cart',
        cartItems: req.session.cart || []
    });
});

// API Routes
app.post('/api/cart/add', (req, res) => {
    const { id, name, price, image } = req.body;
    
    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingItem = req.session.cart.find(item => item.id === id);
    
    if (existingItem) {
        // Nếu đã có thì tăng số lượng
        existingItem.quantity += 1;
    } else {
        // Nếu chưa có thì thêm mới
        req.session.cart.push({
            id,
            name,
            price,
            image,
            quantity: 1
        });
    }
    
    // Tính tổng tiền
    const total = req.session.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    res.json({
        success: true,
        cartCount: req.session.cart.reduce((total, item) => total + item.quantity, 0),
        addedItem: {
            id,
            name,
            price,
            image,
            quantity: existingItem ? existingItem.quantity : 1
        },
        total: total
    });
});

app.post('/api/cart/update', (req, res) => {
    const { id, quantity } = req.body;
    const item = req.session.cart.find(item => item.id === id);
    
    if (item) {
        item.quantity = parseInt(quantity);
        res.json({ success: true });
    } else {
        res.status(404).json({ success: false, message: 'Item not found' });
    }
});

app.post('/api/cart/remove', (req, res) => {
    const { id } = req.body;
    req.session.cart = req.session.cart.filter(item => item.id !== id);
    res.json({ success: true });
});

// Khởi động server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
}); 
const Square = require('../models/square');									
									
// Controller để hiển thị form									
exports.showForm = (req, res) => {									
res.render('index', { perimeter: null, area: null });									
};									
									
// Controller để tính chu vi và diện tích									
exports.calculateSquare = (req, res) => {									
const { sideLength } = req.body;									
									
const square = new Square(Number(sideLength));									
const perimeter = square.getPerimeter();									
const area = square.getArea();									
									
res.render('index', { perimeter, area });									
};									
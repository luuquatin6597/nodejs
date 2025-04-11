const express = require('express');
const router = express.Router();
const rectangleController = require('../controllers/rectangleController');

router.get('/', (req, res) => {
    res.render('index', { perimeter: null });
});

router.get('/calculate', rectangleController.calculatePerimeter);
router.post('/calculate', rectangleController.calculatePerimeter);
module.exports = router;
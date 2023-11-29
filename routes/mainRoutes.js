// Import Modules
const express = require('express');
const mainController = require('../controllers/mainController');

// Initialize Router
const router = express.Router();

// GET Request @ / - Render main page
router.get('/', mainController.index);

// GET Request @ /contact - Render contact page
router.get('/contact', mainController.contact);

// GET Request @ /about - Render about page
router.get('/about', mainController.about);

module.exports = router;

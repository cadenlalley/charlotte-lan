// Import Modules
const express = require('express');
const controller = require('../controllers/usersController');
const { isGuest, isLoggedIn } = require('../middlewares/auth');
const { logInLimiter } = require('../middlewares/rateLimiter');
const {
	validateSignUp,
	validateLogin,
	validateResult,
} = require('../middlewares/validator');

// Initialize Router
const router = express.Router();

// GET @ /users/new - Sends HTML Form for Creating a New Account
router.get('/new', isGuest, controller.new);

// POST @ /users - Creates new Account with Information Provided
router.post('/', isGuest, validateSignUp, validateResult, controller.create);

// GET @ /users/login - Sends the HTML Form for Logging-in
router.get('/login', isGuest, controller.getLoginPage);

// POST @ /users/login - Authenticates Credentials Provided Against User DB
router.post(
	'/login',
	isGuest,
	logInLimiter,
	validateLogin,
	validateResult,
	controller.login
);

// GET @ /users/profile - Sends an Account's Profile Page
router.get('/profile', isLoggedIn, controller.profile);

// POST @ /users/logout - Logs a User Out
router.get('/logout', isLoggedIn, controller.logout);

module.exports = router;

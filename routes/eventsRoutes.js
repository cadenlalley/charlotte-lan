// Import Modules
const express = require('express');
const eventsController = require('../controllers/eventsController');
const { isLoggedIn, isCreator, isNotCreator } = require('../middlewares/auth');
const {
	validateEvent,
	validateRSVP,
	validateResult,
} = require('../middlewares/validator');

// Initialize Router
const router = express.Router();

// GET Request @ /events - Send all events
router.get('/', eventsController.index);

// GET Request @ /events/new - Send form for creating new event
router.get('/new', isLoggedIn, eventsController.new);

// POST Request @ /events - Send new created event to DB
router.post(
	'/',
	isLoggedIn,
	validateEvent,
	validateResult,
	eventsController.create
);

// GET Reqeust @ /events/:id - Send event identified by ID
router.get('/:id', eventsController.show);

// GET Request @ /events/:id/edit - Send form for editing event specified by ID
router.get('/:id/edit', isLoggedIn, isCreator, eventsController.edit);

// PUT Request @ /events/:id - Update story identified by ID
router.put(
	'/:id',
	isLoggedIn,
	isCreator,
	validateEvent,
	validateResult,
	eventsController.update
);

// DELETE Request @ /events/:id - Delete story specified by ID
router.delete('/:id', isLoggedIn, isCreator, eventsController.delete);

// POST Request @ /events/:id/rsvp - Create a new RSVP Relation in the RSVP Database
router.post(
	'/:id/rsvp',
	isLoggedIn,
	isNotCreator,
	validateRSVP,
	validateResult,
	eventsController.rsvp
);

// Export Router
module.exports = router;

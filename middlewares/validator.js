const { body, validationResult } = require('express-validator');

exports.validateSignUp = [
	body('firstName', 'First Name cannot be empty.').notEmpty().trim().escape(),
	body('lastName', 'Last Name cannot be empty.').notEmpty().trim().escape(),
	body('email', 'Email field must contain a valid Email Address.')
		.isEmail()
		.trim()
		.escape()
		.normalizeEmail(),
	body('password', 'Must be between 8 and 64 in length.').isLength({
		min: 8,
		max: 64,
	}),
];

exports.validateLogin = [
	body('email', 'Email field must contain a valid Email Address.')
		.isEmail()
		.trim()
		.escape()
		.normalizeEmail(),
	body('password', 'Must be between 8 and 64 in length.').isLength({
		min: 8,
		max: 64,
	}),
];

exports.validateEvent = [
	body('title', 'Title field cannot be empty.').notEmpty().trim().escape(),
	body('category', 'The category must be within predefined categories.')
		.isIn([
			'CS:GO',
			'DOTA 2',
			'Valorant',
			'Fortnite',
			'Call of Duty: Modern Warfare 2',
		])
		.notEmpty()
		.trim()
		.escape(),
	body('startTime', 'The start time must be in ISO8601 format.')
		.notEmpty()
		.isISO8601()
		.isAfter('5/2/2023')
		.trim()
		.escape(),
	body('endTime', 'The end time must be in ISO8601 format.')
		.notEmpty()
		.isISO8601()
		.custom((value, { req }) => {
			return new Date(req.body.endTime) > new Date(req.body.startTime);
		})
		.trim()
		.escape(),
	body('details', 'The details field cannot be empty.')
		.notEmpty()
		.isLength({ min: 10 })
		.trim()
		.escape(),
];

exports.validateRSVP = [
	body('submit', 'RSVP Status must be one of the three options.')
		.notEmpty()
		.isIn(['YES', 'MAYBE', 'NO'])
		.trim()
		.escape(),
];

exports.validateResult = (req, res, next) => {
	let errors = validationResult(req);
	if (!errors.isEmpty()) {
		errors.array().forEach((error) => {
			req.flash('error', error.msg);
		});
		return res.redirect('back');
	}
	return next();
};

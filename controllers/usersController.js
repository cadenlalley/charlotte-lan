// Import Modules
const user = require('../models/user');
const event = require('../models/event');
const rsvp = require('../models/rsvp');

// Callback Function for GET Request @ /users/new
exports.new = (req, res) => {
	return res.render('./users/new');
};

// Callback Function for POST Request @ /users
exports.create = (req, res, next) => {
	let newUser = new user(req.body);
	if (newUser.email) {
		newUser.email = newUser.email.toLowerCase();
	}
	newUser
		.save()
		.then((user) => res.redirect('./users/login'))
		.catch((error) => {
			if (error.name === 'ValidationError') {
				req.flash('error', error.message);
				return res.redirect('/users/new');
			}

			if (error.code === 11000) {
				req.flash('error', 'Email is already in use.');
				return res.redirect('./users/new');
			}

			next(error);
		});
};

// Callback Function for GET Request @ /users/login
exports.getLoginPage = (req, res, next) => {
	return res.render('./users/login');
};

// Callback Function for POST Request @ /users/login
exports.login = (req, res, next) => {
	let { email, password } = req.body;
	if (email) {
		email = email.toLowerCase();
	}
	user.findOne({ email: email })
		.then((user) => {
			if (!user) {
				req.flash('error', 'Incorrect Email Address!');
				res.redirect('/users/login');
			} else {
				user.checkPassword(password).then((result) => {
					if (result) {
						req.session.user = user._id;
						req.flash(
							'success',
							'You have successfully logged in!'
						);
						res.redirect('/');
					} else {
						req.flash('error', 'Incorrect Password!');
						res.redirect('/users/login');
					}
				});
			}
		})
		.catch((error) => next(error));
};

// Callback Function for GET Request @ /users/profile
exports.profile = (req, res, next) => {
	let id = req.session.user;
	Promise.all([
		user.findById(id),
		event.find({ host: id }),
		rsvp.find({ user: id }),
	])
		.then((results) => {
			const [user, events, rsvp] = results;
			res.render('./users/profile', { user, events, rsvp });
		})
		.catch((error) => next(error));
};

// Callback Function for POST Request @ /users/logout
exports.logout = (req, res, next) => {
	req.session.destroy((error) => {
		if (error) {
			return next(error);
		}
		res.redirect('/');
	});
};

// Import Modules
const event = require('../models/event');

// Ensure that the User is a Guest
exports.isGuest = (req, res, next) => {
	if (req.session.user) {
		req.flash('error', 'You are already logged in.');
		return res.redirect('/users/profile');
	}

	return next();
};

// Ensure that the User is Authenticated
exports.isLoggedIn = (req, res, next) => {
	if (!req.session.user) {
		req.flash('error', 'You must be logged in to do that.');
		return res.redirect('/users/login');
	}

	return next();
};

// Ensure that the User is the Creator of an Event
exports.isCreator = (req, res, next) => {
	let { id } = req.params;

	if (!id.match(/^[0-9a-fA-f]{24}$/)) {
		let error = new Error('Invalid event ID.');
		error.status = 400;
		return next(error);
	}

	event
		.findById(id)
		.then((event) => {
			if (event) {
				if (event.host != req.session.user) {
					let error = new Error(
						'You are not authorized to access this resource.'
					);
					error.status = 401;
					return next(error);
				}

				return next();
			} else {
				let error = new Error('Cannot find a event with the ID: ' + id);
				error.status = 404;
				next(error);
			}
		})
		.catch((error) => next(error));
};

exports.isNotCreator = (req, res, next) => {
	let { id } = req.params;

	if (!id.match(/^[0-9a-fA-F]{24}$/)) {
		let error = new Error('Invalid event ID.');
		error.status = 400;
		return next(error);
	}

	event.findById(id).then((event) => {
		if (event) {
			if (event.host == req.session.user) {
				let error = new Error(
					'You are not authorized to complete this action.'
				);
				error.status = 401;
				return next(error);
			}

			return next();
		} else {
			let error = new Error('Cannot find a event with the ID: ' + id);
			error.status = 404;
			next(error);
		}
	});
};

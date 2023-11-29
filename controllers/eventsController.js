// Import Modules
const model = require('../models/event');
const rsvp = require('../models/rsvp');

// Callback Function for GET Request @ /events
exports.index = (req, res, next) => {
	// Set Query Parameter for Distinct Categories
	const findCategories = model
		.distinct('category')
		.then((data) => (categories = data))
		.catch((error) => next(error));

	// Get all Events and Render Page
	model
		.find()
		.then((events) => {
			res.render('../views/events/index', { events, categories });
		})
		.catch((error) => next(error));
};

// Callback Function for GET Request @ /events/new
exports.new = (req, res) => {
	res.render('../views/events/new');
};

// Callback Function for POST Request @ /events
exports.create = (req, res, next) => {
	let event = new model(req.body);
	event.host = req.session.user;
	event
		.save()
		.then(() => {
            res.redirect('/events');
        })
		.catch((error) => {
			if (error.name === 'ValidationError') {
				error.status = 400;
			}
			next(error);
		});
};

// Callback Function for GET Request @ /events/:id
exports.show = (req, res, next) => {
	let { id } = req.params;
	if (!id.match(/^[0-9a-fA-F]{24}$/)) {
		let error = new Error('Invalid event ID format.');
		error.status = 400;
		return next(error);
	}

	let rsvpCount = 0;
	rsvp.find({ event: id })
		.then((data) => {
			data.forEach((data) => {
				if (data.status === 'YES') {
					rsvpCount += 1;
				}
			});
		})
		.catch((error) => next(error));

	model
		.findById(id)
		.populate('host', 'firstName lastName')
		.then((event) => {
			if (!event) {
				let error = new Error('Cannot find event with ID ' + id);
				error.status = 404;
				return next(error);
			}
			res.render('../views/events/show', { event, rsvpCount });
		})
		.catch((error) => next(error));
};

// Callback function for GET Request @ /events/:id/edit
exports.edit = (req, res, next) => {
	let { id } = req.params;
	model
		.findById(id)
		.then((event) => {
			res.render('../views/events/edit', { event });
		})
		.catch((error) => next(error));
};

// Callback function for PUT Request @ /events/:id
exports.update = (req, res, next) => {
	let event = req.body;
	let { id } = req.params;

	if (!id.match(/^[0-9a-fA-F]{24}$/)) {
		let error = new Error('Invalid event ID format.');
		error.status = 400;
		next(error);
	}

	model
		.findByIdAndUpdate(id, event, {
			useFindAndModify: false,
			runValidators: true,
		})
		.then((event) => {
			res.redirect('/events/' + id);
		})
		.catch((error) => {
			if (error.name === 'ValidationError') {
				error.status = 400;
			}
			next(error);
		});
};

// Callback function for DELETE Request @ /events/:id
exports.delete = (req, res, next) => {
	let { id } = req.params;

	model
		.findByIdAndDelete(id, {
			useFindAndModify: false,
			runValidators: true,
		})
		.then((event) => {
			rsvp.deleteMany({ event: id })
				.then()
				.catch((error) => next(error));
			res.redirect('/events');
		})
		.catch((error) => next(error));
};

// Callback function for POST Request @ /events/:id/rsvp
exports.rsvp = (req, res, next) => {
	let { id } = req.params;
	let { user } = req.session;
	let answer = req.body.submit;
	rsvp.findOneAndUpdate(
		{ event: id, user: user },
		{ status: answer },
		{ upsert: true }
	)
		.then((data) => res.redirect('/events/' + id))
		.catch((error) => next(error));
};

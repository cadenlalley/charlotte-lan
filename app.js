// Import Modules
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

const mainRoutes = require('./routes/mainRoutes');
const eventRoutes = require('./routes/eventsRoutes');
const userRoutes = require('./routes/usersRoutes');

// Load Env File
require('dotenv').config();

// Initialize App
const app = express();

// Configure App
const host = process.env.HOST;
const port = process.env.PORT;
let url = process.env.DB_URI;
app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose
	.connect(url)
	.then(
		// Start Server if DB connection is successful
		app.listen(port, host, () => {
			console.log('The server is running on ' + host + ':' + port);
		})
	)
	.catch((error) => console.log(error));

// Mount Middleware
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({
			mongoUrl:
				url,
		}),
		cookie: { maxAge: 60 * 60 * 1000 },
	})
);

app.use(flash());

// Flash Error & Success Messages
app.use((req, res, next) => {
	res.locals.user = req.session.user || null;
	res.locals.errorMessages = req.flash('error');
	res.locals.successMessages = req.flash('success');
	next();
});

// Extras
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

// Create Routes
app.use('/', mainRoutes);
app.use('/events', eventRoutes);
app.use('/users', userRoutes);

// 404 Handler
app.use((req, res, next) => {
	let error = new Error('Unable to locate ' + req.url);
	error.status = 404;
	next(error);
});

// Error Handling
app.use((error, req, res, next) => {
	console.log(error.stack);
	if (!error.status) {
		error.status = 500;
		error.message = 'Internal Server Error';
	}
	res.status(error.status);
	res.render('error', { error: error });
});

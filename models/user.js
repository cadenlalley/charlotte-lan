// Import Modules
const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

// Initialize Schema
const userSchema = new Schema({
	firstName: { type: String, required: [true, 'this field is required'] },
	lastName: { type: String, required: [true, 'this field is required'] },
	email: {
		type: String,
		required: [true, 'this field is required'],
		unique: [true, 'this email address has already been used'],
	},
	password: {
		type: String,
		required: [true, 'this field is required'],
		minLength: [8, 'Your password must contain at least 8 characters.'],
	},
});

userSchema.pre('save', function (next) {
	let user = this;
	if (!user.isModified('password')) {
		return next();
	}

	bcrypt
		.hash(user.password, 10)
		.then((hash) => {
			user.password = hash;
			next();
		})
		.catch((error) => next(error));
});

userSchema.methods.checkPassword = function (inputPassword) {
	let user = this;
	return bcrypt.compare(inputPassword, user.password);
};

module.exports = mongoose.model('User', userSchema);

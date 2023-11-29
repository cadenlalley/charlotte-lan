// Import Modules
const mongoose = require('mongoose');

// Initialize Schema
const { Schema } = mongoose;

const eventSchema = new Schema({
	title: { type: String, required: [true, 'this field is required.'] },
	category: {
		type: String,
		enum: [
			'DOTA 2',
			'Fortnite',
			'CS:GO',
			'Valorant',
			'Call of Duty: Modern Warfare 2',
		],
		required: [true, 'this field is required.'],
	},
	host: { type: Schema.Types.ObjectId, ref: 'User' },
	startTime: { type: Date, required: [true, 'this field is required.'] },
	endTime: { type: Date, required: [true, 'this field is required.'] },
	details: {
		type: String,
		required: [true, 'this field is required.'],
		minLength: [10, 'the details should contain at least 10 characters.'],
	},
	location: { type: String, required: [true, 'this field is required.'] },
	imagePath: { type: String, required: [true, 'this field is required.'] },
});

module.exports = mongoose.model('Event', eventSchema);

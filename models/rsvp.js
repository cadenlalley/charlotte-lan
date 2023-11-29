const mongoose = require('mongoose');
const { Schema } = mongoose;

const rsvpSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'User' },
	event: { type: Schema.Types.ObjectId, ref: 'Event' },
    eventTitle: {type: String, },
	status: {
		type: String,
		enum: ['YES', 'MAYBE', 'NO'],
		required: [true, 'this field is required'],
	},
});

module.exports = mongoose.model('RSVP', rsvpSchema);

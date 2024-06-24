const mongoose = require('mongoose');

const attendeeSchema = new mongoose.Schema({
 
  userName: {type: String, required: false},
  email: {type: String, required: false},
  upcomingEvents: [{type: mongoose.Types.ObjectId,ref: 'event',required: false}],
  ownedEvents: [{type: mongoose.Types.ObjectId,ref: 'event',required: false}],
  profilePic: {type: String, required: true}

},{
  timestamps: true,
  collection: 'attendees',
});

attendeeSchema.index({ email: 1, upcomingEvents: 1 }, { unique: true });

const Attendee = new mongoose.model('attendee',attendeeSchema,'attendees');
module.exports = Attendee;
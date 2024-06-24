const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {type: String, required: true},
  date: {type: String, required: true}, 
  description: {type: String, required: true},
  location: {type: String, required:true},
  owner: {type: mongoose.Types.ObjectId,ref: 'attendee',required: true},
  attendees: [{type: mongoose.Types.ObjectId,ref: 'attendee',required: false}],
  eventImg: {type: String, required: true, }
},{
  timestamps: true,
  collection: 'events'
});

const Event = mongoose.model('event',eventSchema,"events");
module.exports = Event;
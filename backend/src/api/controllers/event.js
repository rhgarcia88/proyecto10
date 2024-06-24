const Attendee = require("../models/attendee");
const Event = require("../models/event");
const User = require("../models/user");

const getEvents = async (req, res, next) => {
  try {
    const events = await Event.find();
    return res.status(200).json(events);
  } catch (error) {
    return res.status(400).json(error);
  }

}

const getAEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('owner').populate('attendees');
    console.log(event);
    return res.status(200).json(event);
  } catch (error) {
    return res.status(400).json(error);
  }
}

const createEvent = async (req, res, next) => {
  try {

    const owner = await Attendee.findOne({ email: req.user.email });
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    const newEvent = new Event({
      title: req.body.title,
      date: req.body.date,
      description: req.body.description ? req.body.description : 'No description yet',
      location: req.body.location,
      owner: owner._id,
      eventImg: req.file ? req.file.path : 'https://res-console.cloudinary.com/dn0z86xkf/thumbnails/v1/image/upload/v1717326485/dXNlclBpY3MvZGVmRXZlbnRfYWRwZDNy/drilldown' 
  
    });
     const eventSaved = await newEvent.save();
    owner.ownedEvents.push(eventSaved._id);

    await owner.save();
    return res.status(200).json(eventSaved);

  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
 
}

module.exports = {
  getEvents,
  getAEvent,
  createEvent
  
}
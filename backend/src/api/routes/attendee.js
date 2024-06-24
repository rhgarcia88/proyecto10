const { attendAsGuest, getAttendeeInfo,getAttendeeInfoByEmail,unattendEvent } = require('../controllers/attendee');
const { isAuth } = require('../../middleware/auth');
const upload = require('../../middleware/file');

const attendeeRouter = require('express').Router();

attendeeRouter.post('/guestAttending/:eventId',upload.single('profilePic'),attendAsGuest);
attendeeRouter.get('/:id',getAttendeeInfo);
attendeeRouter.get('/e/:email',getAttendeeInfoByEmail);
attendeeRouter.put('/unattend/:eventId/:email', isAuth, unattendEvent);

module.exports = attendeeRouter;
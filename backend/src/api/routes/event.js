const { isAuth } = require('../../middleware/auth');
const { getEvents,getAEvent, createEvent } = require('../controllers/event');
const upload = require('../../middleware/file');

const eventsRoutes = require('express').Router();

eventsRoutes.get('/',getEvents);
eventsRoutes.get('/:id',getAEvent);
eventsRoutes.post('/createEvent',[isAuth,upload.single("eventImg")],createEvent);

module.exports = eventsRoutes;
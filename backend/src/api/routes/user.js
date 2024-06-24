const { isAuth } = require('../../middleware/auth');
const upload = require('../../middleware/file');
const { register, login, attendAEvent, quitEvent } = require('../controllers/user');

const userRoutes = require('express').Router();


userRoutes.post('/register',upload.single("profilePic"),register);
userRoutes.post('/login',login);
userRoutes.put('/attendees/quit/:eventId',isAuth,quitEvent);
userRoutes.put('/attendees/:eventId',isAuth,attendAEvent);


module.exports = userRoutes;

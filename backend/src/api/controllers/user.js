const { generateSign } = require("../../config/jwt");
const Attendee = require("../models/attendee");
const Event = require("../models/event");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const register = async (req, res, next) =>{
  try{
      
     const newUser = new User({
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,  
      profilePic: req.file ? req.file.path : 'https://res.cloudinary.com/dn0z86xkf/image/upload/v1717353548/userPics/user.jpg' 
     });
      
     const userDuplicated = await User.findOne({
      $or: [{ userName: req.body.userName }, { email: req.body.email }]
    });
      if(userDuplicated){
        return res.status(400).json("Ya existe este usuario");
      }
   
    const userSaved = await newUser.save();

    const newAttendee = new Attendee({
      userName: req.body.userName,
      email: req.body.email,
      ownedEvents: [],
      upcomingEvents: [],
      profilePic: req.file ? req.file.path : 'https://res.cloudinary.com/dn0z86xkf/image/upload/v1717353548/userPics/user.jpg' 
    });

    const attendeeSaved = await newAttendee.save();

     return res.status(201).json(userSaved);
  }catch(err){
    console.log(err);
      return res.status(400).json(err);
  }
}

//Login User
const login = async (req, res, next) =>{
  try{
    let user;
    if(req.body.userName){
      user = await User.findOne({userName: req.body.userName});
    }else if(req.body.email){
      user = await User.findOne({email: req.body.email});
    }
   
      console.log(user);
    if(user){

      if(bcrypt.compareSync(req.body.password,user.password)){
        // Lo que pasa cuando te logueas con JWT
          const token = generateSign(user._id);
          return res.status(200).json({user,token});
      }else{
        return res.status(400).json("Email or password are incorrect");
      }

    }else{
     console.log(user);
      return res.status(400).json("Email or password are incorrect");
    }

  }catch(err){

  return res.status(400).json(err);
  }
}
const attendAEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId).populate('attendees');
    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    // Comprobar si el email del usuario ya está en la lista de asistentes
    const email = req.user.email.trim().toLowerCase();
    for (const attendee of event.attendees) {
      if (attendee.email === email) {
        return res.status(400).json({ message: 'Ya estás registrado para este evento' });
      }
    }

    // Buscar el asistente afiliado a ese usuario
    const attendee = await Attendee.findOne({ email });
    if (!attendee) {
      // Jamás debería entrar aquí porque crea el attendee asociado en el register
      return res.status(404).json({ message: 'Attendee not found' });
    }

    // Agregar el evento a la lista de eventos próximos del asistente
    attendee.upcomingEvents.push(eventId);
    await attendee.save();

    // Agregar el asistente a la lista de asistentes del evento
    event.attendees.push(attendee._id);
    await event.save();

    return res.status(200).json(attendee);
  } catch (error) {
    return res.status(400).json(error);
  }
}
const quitEvent = async(req, res, next) => {

    try {
      const { eventId } = req.params;
      const event = await Event.findById(eventId).populate('attendees');
      if (!event) {
        return res.status(404).json({ message: 'Evento no encontrado' });
      }

      const email = req.user.email.trim().toLowerCase();
      const attendee = await Attendee.findOne({ email });
      if (!attendee) {
        return res.status(404).json({ message: 'Asistente no encontrado' });
      }
  
      // Verificar si el asistente está registrado para el evento
      const attendeeIndex = event.attendees.findIndex(a => a._id.equals(attendee._id));
      if (attendeeIndex === -1) {
        return res.status(400).json({ message: 'No estás registrado para este evento' });
      }
  
      // Eliminar al asistente de la lista de asistentes del evento
      event.attendees.splice(attendeeIndex, 1);
      await event.save();
  
      // Eliminar el evento de la lista de eventos próximos del asistente
      const eventIndex = attendee.upcomingEvents.findIndex(e => e.equals(event._id));
      if (eventIndex !== -1) {
        attendee.upcomingEvents.splice(eventIndex, 1);
        await attendee.save();
      }
  
      return res.status(200).json({ message: 'Te has dado de baja del evento' });

      

    } catch (error) {
      return res.status(400).json(error);
    }
}


module.exports = {
  register,
  login,
  attendAEvent,
  quitEvent
}
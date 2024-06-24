const Attendee = require('../models/attendee');
const Event = require('../models/event');

const User = require('../models/user');  // Asegúrate de ajustar la ruta al modelo de usuario

const attendAsGuest = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId).populate('attendees');

    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    const email = req.body.email.trim().toLowerCase();

    // Verificar si el usuario ya está registrado para el evento
    for (const attendee of event.attendees) {
      if (attendee.email === email) {
        return res.status(400).json({ message: 'Ya estás registrado para este evento' });
      }
    }

    // Verificar si existe un usuario con el correo electrónico proporcionado
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Este correo electrónico está asociado a una cuenta de usuario. Por favor, inicia sesión.' });
    }

    // Buscar si el asistente ya existe
    let attendee = await Attendee.findOne({ email });

    if (attendee) {
      // Si el asistente ya existe, agregar el evento a su lista de eventos próximos
      attendee.upcomingEvents.push(eventId);
      await attendee.save();
    } else {
      // Si el asistente no existe, crear un nuevo asistente
      attendee = new Attendee({
        userName: req.body.userName,
        email: email,
        ownedEvents: [],
        upcomingEvents: [eventId], // Agregar el evento a la lista de eventos próximos
        profilePic: req.file ? req.file.path : '../../../img/user.jpg'
      });
      await attendee.save();
    }

    // Agregar el asistente a la lista de asistentes del evento
    event.attendees.push(attendee._id);
    await event.save();

    return res.status(200).json(attendee);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
}

const getAttendeeInfo = async (req, res) => {
  try {
    const user = await Attendee.findById(req.params.id).populate('ownedEvents').populate('upcomingEvents');
    return res.status(200).json(user);

  } catch (error) {
    return res.status(400).json({ message: 'Error loading user' });
  }
}

const getAttendeeInfoByEmail = async (req, res) => {
  try {
    const user = await Attendee.findOne({ email: req.params.email })
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ message: 'Error loading user' });
  }
}

const unattendEvent = async (req, res) => {
  try {
    const { eventId, email } = req.params;

    // Buscar el evento
    const event = await Event.findById(eventId).populate('attendees');
    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    // Buscar el asistente
    const attendee = await Attendee.findOne({ email: email.trim().toLowerCase() });
    if (!attendee) {
      return res.status(404).json({ message: 'Asistente no encontrado' });
    }

    // Eliminar al asistente de la lista de asistentes del evento
    event.attendees = event.attendees.filter(a => a._id.toString() !== attendee._id.toString());
    await event.save();

    // Eliminar el evento de la lista de eventos próximos del asistente
    attendee.upcomingEvents = attendee.upcomingEvents.filter(e => e.toString() !== eventId);
    await attendee.save();

    return res.status(200).json({ message: 'Has dejado de asistir al evento' });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'Error al dejar de asistir al evento' });
  }
}

module.exports = {
  unattendEvent,
  attendAsGuest,
  getAttendeeInfo,
  getAttendeeInfoByEmail
}

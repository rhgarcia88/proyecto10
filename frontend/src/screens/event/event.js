import './event.css';
import { createButton } from '../../components/standardButton/standardButton';
import { changeScreen, currentEventId, getCurrentEventId } from '../../../main';
import { launchNoti } from '../../components/notification/notification';
import { getUserData } from '../userProfile/userProfile';
import { getBaseUrl } from '../../utils';
import { createLoader, destroyLoader } from '../../components/loader/loader';

export const createEventScreen = async (idEvent) => {
  const ev = await getEvent(idEvent);
  
  let logged = JSON.parse(localStorage.getItem("attendee"));
  let loggedAttendee;
  let finalBtn;

  try {
    loggedAttendee= await getUserData(logged._id);
  
  } catch (error) {
  
  }

  if (loggedAttendee) {
    finalBtn = isAttending(loggedAttendee, idEvent) ? 
      createButton('button', 'Attending', 'attend-btn green-btn') : 
      createButton('button', 'Attend', 'attend-btn');
  } else {
    finalBtn = createButton('button', 'Attend', 'attend-btn');
  }


  return `<div class="event-screen">
    <div class="event-header">
      <div class="overlay-ev"></div>
      <div class="event-img">
        <img src="${ev.eventImg}">
      </div>
      <h1>${ev.title}</h1>
      <h3>Hosted by <a id="owner-name">${ev.owner.userName}</a></h3>
    </div>
    <div class="event-content">
      <div class="description">
        <h2 class="h2-event">Description</h2>
        <div class="description-container">
          <p>${ev.description}</p>
        </div>
      </div>
      <div class="info-container">
        <div class="icon-container">
          <span class="material-symbols-outlined">event</span>
          <h4>${ev.date}</h4>
        </div>
        <div class="icon-container">
          <span class="material-symbols-outlined">map</span>
          <h4>${ev.location}</h4>
        </div>
      </div>
      <div class="go-btn-container">
        ${finalBtn}
      </div>
    </div>
    <div class="attendees-section">
      <h2 class="h2-event">Attendees</h2>
      <div class="attendees-container">
        ${fillAttendees(ev.attendees)}
      </div>
    </div>
  </div>`;
}

// Obtiene la información del evento desde la API
const getEvent = async (idEvent) => {
  try {
    createLoader();
    const baseUrl = getBaseUrl();
    const eventData = await fetch(`${baseUrl}/api/v1/events/${idEvent}`);
    const thisEvent = await eventData.json();
    destroyLoader();
    return thisEvent;
  } catch (error) {
    return `<p>Error loading event</p>`;
  }
}

// Llena la sección de asistentes
const fillAttendees = (attendees) => {
  if (attendees.length > 0) {
    return attendees.map(attendee => `
      <div class="attendee" attendee-id="${attendee._id}">
        <img src="${attendee.profilePic}" alt="${attendee.userName}" class="attendee-image"/>
      </div>
    `).join('');
  } else {
    return `<p>No attendees yet</p>`;
  }
}

export const addEventInfoListeners = async () => {
  

  const event = await getEvent(currentEventId);
  if (!event || !event.owner) {
    return;
  }
  const ownerId = event.owner._id;

  document.querySelector('#owner-name').addEventListener('click', () => {
    changeScreen(2, ownerId);
  });

  // Botón de asistencia
  document.querySelector('.attend-btn').addEventListener('click', async (e) => {
    const button = e.target;
    button.disabled = true; // Deshabilitar el botón

    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      let logged = JSON.parse(localStorage.getItem("attendee"));
      let loggedAttendee = await getUserData(logged._id);

      loggedAttendee = await getUserData(logged._id); // Actualiza loggedAttendee desde la API
      await attendAsUser(currentEventId, user.token, loggedAttendee);
      loggedAttendee = await getUserData(logged._id); // Actualiza loggedAttendee después de la acción
      const isAttendingNow = isAttending(loggedAttendee, currentEventId);
      button.textContent = isAttendingNow ? 'Attending' : 'Attend';
      button.classList.toggle('green-btn', isAttendingNow);
    }else{
      launchNoti('Log in to attend a event','');
    }

    button.disabled = false; // Habilitar el botón nuevamente
  });

  //Attendees List

  document.querySelectorAll('[attendee-id]').forEach(element => {
    element.addEventListener('click', () => {
      const attendeeId = element.getAttribute('attendee-id');
        changeScreen(2, attendeeId);

    });
});





}

// Maneja la lógica de asistencia del usuario
const attendAsUser = async (eventId, token, loggedAttendee) => {
  if (isAttending(loggedAttendee, eventId)) {
    const baseUrl = getBaseUrl();
    createLoader();
    const response = await fetch(`${baseUrl}/api/v1/attendees/unattend/${eventId}/${loggedAttendee.email}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });
    destroyLoader();
    if (response.ok) {
      try {
        visualUpdateAttendes();
        const data = await response.json();
        console.log(data);
        launchNoti('Unattended!');
      } catch (error) {
        console.log('Error parsing JSON:', error);
        launchNoti('Unattended, but response was not JSON');
      }
    } else {
      try {
        const errorData = await response.json();
        console.log(errorData);
        launchNoti('Error unattending the event', 'red');
      } catch (error) {
        console.log('Error parsing JSON:', error);
        launchNoti('Error unattending the event and response was not JSON', 'red');
      }
    }
  } else {
    try {
      const payload = { eventId };
      const baseUrl = getBaseUrl();
      createLoader()
      const response = await fetch(`${baseUrl}/api/v1/users/attendees/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      destroyLoader();
      if (response.ok) {
        try {
          visualUpdateAttendes();
          createLoader();
          const data = await response.json();
          destroyLoader();
          console.log(data);
          launchNoti('Attending!');
        } catch (error) {
          console.log('Error parsing JSON:', error);
          launchNoti('Attending, but response was not JSON');
        }
      } else {
        try {
          const errorData = await response.json();
          console.log(errorData);
          launchNoti('Error attending the event', 'red');
        } catch (error) {
          console.log('Error parsing JSON:', error);
          launchNoti('Error attending the event and response was not JSON', 'red');
        }
      }
    } catch (error) {
      console.log('Fetch error:', error);
      launchNoti('Error attending', 'red');
    }
  }
};

// Verifica si el usuario está asistiendo al evento
const isAttending = (loggedAttendee, eventId) => {
  if (!loggedAttendee || !loggedAttendee.upcomingEvents) {
    return false;
  }

  for (const upcomingEvent of loggedAttendee.upcomingEvents) {
    if (upcomingEvent._id.toString() === eventId.toString()) {
      return true;
    }
  }
  return false;
}


const visualUpdateAttendes = async() => {

  const ev = await getEvent(getCurrentEventId());
  const attendeesList = ev.attendees;
  const attendees = fillAttendees(attendeesList);

  const container = document.querySelector('.attendees-container');
  container.innerHTML = attendees;

  document.querySelectorAll('[attendee-id]').forEach(element => {
    element.addEventListener('click', () => {
      const attendeeId = element.getAttribute('attendee-id');
        changeScreen(2, attendeeId);

    });
});
}

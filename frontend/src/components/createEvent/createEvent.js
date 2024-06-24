import { changeScreen } from '../../../main';
import { sleep } from '../../utils';
import { launchNoti } from '../notification/notification';
import { createButton } from '../standardButton/standardButton';
import './createEvent.css';

export const createEventModal = () => {
  const today = getTodayDate();

  return `
    <div id="create-event-overlay"></div>
    <div id="create-event-component">
      <form id="create-event-form" method="post" enctype="multipart/form-data">
        <h2 id="create-event-header">Create Event</h2>
        <h4 id="create-event-subtitle">Fill in the gaps to create a new event</h4>
        <div class="form-group">
          <input type="text" id="event-title" name="title" placeholder="Title*" required>
          <input type="date" id="date" name="date" placeholder="Date" min="${today}" required>
        </div>
        <div class="form-group">
          <textarea id="description-form" name="description" placeholder="Description" maxlength="500"></textarea>
        </div>
        <div class="form-group">
          <input type="text" id="location" name="location" placeholder="Location*" required>
        </div>
        <div class="form-group">
          <input type="file" id="eventImg" name="eventImg">
        </div>
        <div>
          ${createButton('submit', 'Create Event', 'green-btn create-event-btn')}
        </div>
      </form>
    </div>
  `;
}

function getTodayDate() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
}

function compareDates(date1, date2) {
  // Función para convertir una fecha en formato DD/MM/YYYY a un objeto Date
  function parseDate(dateString) {
    const parts = dateString.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Los meses en JavaScript son 0-indexados
    const day = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }

  const dateObj1 = parseDate(date1);
  const dateObj2 = parseDate(date2);

  if (dateObj1.getTime() < dateObj2.getTime()) {
    return -1; // date1 es anterior a date2
  } else if (dateObj1.getTime() > dateObj2.getTime()) {
    return 1; // date1 es posterior a date2
  } else {
    return 0; // date1 es igual a date2
  }
}

const createAEvent = async (event) => {
  event.preventDefault();

  const title = document.querySelector('#event-title').value;
  const date = document.querySelector('#date').value;
  const description = document.querySelector('#description-form').value;
  const location = document.querySelector('#location').value;
  const eventImg = document.querySelector('#eventImg').files[0];

  // Validar la fecha
  const today = getTodayDate().split('/').reverse().join('-'); // Convertir a YYYY-MM-DD para la comparación
  if (compareDates(date, today) < 0) {
    launchNoti('The selected date cannot be earlier than today.', 'red');
    return;
  }

  // Crear FormData y añadir los datos del formulario
  const formData = new FormData();
  formData.append('title', title);
  formData.append('date', date);
  formData.append('description', description);
  formData.append('location', location);
  formData.append('eventImg', eventImg);

 const token = JSON.parse(localStorage.getItem('user')).token;



  // Enviar la solicitud POST
  try {
    const response = await fetch('http://localhost:3000/api/v1/events/createEvent', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    });

    if (response.ok) {
      document.querySelector('.create-event-btn').disabled = true;
      launchNoti('Event created successfully!');
      await sleep(500);
      changeScreen(0);
    } else {
      const errorData = await response.json();
      console.error('Error data:', errorData); // Log the error data for debugging
      launchNoti(`Failed to create event: ${errorData.message}`, 'red');
    }
  } catch (error) {
    console.error('Error:', error);
    launchNoti('An error occurred while creating the event. Please try again.', 'red');
  }
}

export const createButtonListener = () => {
  const form = document.querySelector('#create-event-form');
  if (form) {
    form.addEventListener('submit', createAEvent);
  }
};

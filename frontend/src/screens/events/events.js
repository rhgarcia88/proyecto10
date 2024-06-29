import { createEventCard } from '../../components/event-card/eventCard';
import { getBaseUrl } from '../../utils';
import './events.css';

// Función para generar la pantalla principal
export const generateMainScreen = async () => {
  // Generar el contenedor principal y el encabezado
  const mainScreenHTML = `
    <div class="event-section">
      <div class="events-header">
        <h1>Events</h1>
      </div>
  
    
  `;

  // Obtener los eventos y agregarlos al contenedor
  const eventsHTML = await getEvents();
  return mainScreenHTML + `<div class="events-container">${eventsHTML}</div></div>`;
};

// Función asíncrona para obtener eventos
const getEvents = async () => { 
  try {
    const baseUrl = getBaseUrl();
    const eventsData = await fetch(`${baseUrl}/api/v1/events`);
    const events = await eventsData.json();
    
    let htmlResponse = '';
    for (const event of events) {
      htmlResponse += createEventCard(event.title, event.date, event.eventImg, event._id);
    }
  
    return htmlResponse;
  } catch (error) {
    console.error("Error fetching events:", error);
    return `<p>Error loading events</p>`;
  }
};

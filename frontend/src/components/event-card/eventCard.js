import { changeScreen, setCurrentEventId } from '../../../main';
import './eventCard.css';

export const createEventCard = (name, date, imgName, id) => {
  const eventCard = document.createElement('div');
  eventCard.className = 'event-card';
  eventCard.setAttribute("event-id",id);



  // Establecer la imagen de fondo usando JavaScript
  eventCard.style.backgroundImage = `url('${imgName}')`;

  const eventCardContent = document.createElement('div');
  eventCardContent.className = 'event-card-content';

  const eventTitle = document.createElement('h2');
  eventTitle.textContent = name;

  const eventDate = document.createElement('p');
  eventDate.textContent = date;


  eventCardContent.appendChild(eventTitle);
  eventCardContent.appendChild(eventDate);
  eventCard.appendChild(eventCardContent);

  return eventCard.outerHTML;
};

export const addCardListeners = () => {
    // Seleccionar todas las tarjetas de evento
    const eventCards = document.querySelectorAll('.event-card');

    // Agregar event listener a cada tarjeta de evento
    eventCards.forEach(card => {
      card.addEventListener('click', function() {
        const eventId = this.getAttribute('event-id');
       
        setCurrentEventId(eventId);
        changeScreen(1);
 
      });
    });
}

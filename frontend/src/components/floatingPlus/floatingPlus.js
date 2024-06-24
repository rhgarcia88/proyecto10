import { createButtonListener, createEventModal } from '../createEvent/createEvent';
import './floatingPlus.css';

export const createFloatingPlus = () => {

  return `<div id="floating-plus">
          <p>+</p>
          </div>`;

} 

export const addFloatingPlusListener = () => {

  document.querySelector('#floating-plus').addEventListener('click', () => {
    const eventCreatorContainer = document.createElement('div');
    eventCreatorContainer.classList.add('create-event-container');
    eventCreatorContainer.innerHTML = createEventModal();
    document.querySelector('#app').appendChild(eventCreatorContainer);

    document.querySelector('#create-event-overlay').addEventListener('click', () => {
      eventCreatorContainer.innerHTML = "";
      eventCreatorContainer.remove();
    });

    createButtonListener(); 
  });
}
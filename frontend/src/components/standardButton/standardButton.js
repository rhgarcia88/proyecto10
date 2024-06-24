import './standardButton.css';

export const createButton = (type, text, extraClass) => {

  return `<button type="${type}" class="btn ${extraClass}">${text}</button>`;
}
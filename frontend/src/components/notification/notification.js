import './notification.css';
import {sleep} from '../../utils';

export const notification = (message,extraClass) => {

  return `
  <div class="notification closed ${extraClass} ">
  <p class="notification-message">${message}</p>
  </div>
  `;
}

export const launchNoti = async(message,extraClass) => {

  const noti = document.querySelector('.notification');
  const msg = document.querySelector('.notification-message');
  noti.classList.remove('red');

  if(extraClass){
    noti.classList.add(extraClass);
  }
  msg.textContent = message;
  noti.classList.remove('closed');
  await sleep(1000);
  noti.classList.add('closed');



  
}

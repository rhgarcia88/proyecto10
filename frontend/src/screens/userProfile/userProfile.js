import { changeScreen } from '../../../main';
import { createEventCard } from '../../components/event-card/eventCard';
import { createButton } from '../../components/standardButton/standardButton';
import { getBaseUrl } from '../../utils';
import './userProfile.css';

export const generateUserProfile = async(userId) => {

  const user = await getUserData(userId);

  const userLogged = JSON.parse(localStorage.getItem("attendee"));
  let logOutBtn='';
  try {
  
    if(userLogged._id == userId){
     logOutBtn = createButton('button','Log Out','logout');
  }
  } catch (error) {
    
  }
 

  return `
  <div class="user-profile">
        <div class="user">
            <div class="profile-picture">
            <img src="${user.profilePic}">
            </div>
            <h2 class="profile-name">${user.userName}</h2>
            ${logOutBtn}
        </div>
        <div class="events">
            <div class="hosted-events">
                <h2>HOSTED EVENTS</h2>
                <div class="cards-container">
                ${fillHostedEvents(user)}
                </div>
              
            </div>
            <div class="attending-events">
                <h2>ATTENDING</h2>
                <div class="cards-container">
                ${fillAttendingEvents(user)}
                </div>
            </div>
        </div>
        </div>
  `;

}

export const getUserData = async(id) => { 

  try {
    const baseUrl = getBaseUrl();
    const userData = await fetch(baseUrl+'/api/v1/attendees/'+id);
    const user = await userData.json();
    return user;
  } catch (error) {
    
  }

}

const fillHostedEvents = (user) => {
let response='';
  if(user.ownedEvents.length > 0) {
    for (const ev of user.ownedEvents) {
      response+= createEventCard(ev.title,ev.date,ev.eventImg,ev._id);
    }
    
    return response;
  }else{
    return `<h4>No events found</h4>`;
  }

}

const fillAttendingEvents = (user) => {
  let response='';
  if(user.upcomingEvents.length > 0) {
    for (const ev of user.upcomingEvents) {
      response+= createEventCard(ev.title,ev.date,ev.eventImg,ev._id);
    }
    
    return response;
  }else{
    return `<h4>No events found</h4>`;
  }

}

  export const logOutListener = (user) => {

    document.querySelector('.logout').addEventListener('click', () => {
      localStorage.clear();
      location.reload();
    });
  }
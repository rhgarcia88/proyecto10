import './style.css';
import { addProfileImageListener, generateHeader } from './src/components/header/header';
import { generateMainScreen } from './src/screens/events/events';
import { addEventInfoListeners, createEventScreen } from './src/screens/event/event';
import { login, addLoginListener } from './src/screens/login/login';
import { notification } from './src/components/notification/notification';
import { addCardListeners } from './src/components/event-card/eventCard';
import { generateUserProfile, logOutListener } from './src/screens/userProfile/userProfile';
import { addFloatingPlusListener, createFloatingPlus } from './src/components/floatingPlus/floatingPlus';

export let currentEventId;

const initializeApp = async () => {
  const appContainer = document.getElementById('app');
  const screenContainer = document.getElementById('screen-container');
  const attendee = JSON.parse(localStorage.getItem("attendee"));

  // Crear el nodo del encabezado
  const headerElement = document.createElement('div');
  headerElement.innerHTML = await generateHeader();

  // Insertar el encabezado antes del screen-container
  appContainer.insertBefore(headerElement.firstChild, screenContainer);



  // Esperar y generar la pantalla principal
  const mainScreenHTML = await generateMainScreen();
  screenContainer.innerHTML = mainScreenHTML;

  // Agregar listeners después de que el DOM esté listo y los elementos estén presentes
  addCardListeners();
  addLoginListener();

  document.querySelector('.explore').addEventListener('click', () => location.reload());
  document.querySelector('.logo-header').addEventListener('click', () => location.reload());

  if(attendee){
    const floatingPlusHTML = createFloatingPlus();
    const template = document.createElement('template');
    template.innerHTML = floatingPlusHTML.trim(); 
    appContainer.appendChild(template.content.firstChild);
    addFloatingPlusListener();
  }

    // Insertar la notificación después del encabezado
    const notificationElement =notification('Welcome Manu!', '');;
    const notiTemplate = document.createElement('template');
    notiTemplate.innerHTML = notificationElement.trim();
    appContainer.appendChild(notiTemplate.content.firstChild);

 
  if (attendee) {
    addProfileImageListener(attendee._id);
  }

};

export const changeScreen = async (newScreen,extraData) => {
  const container = document.getElementById('screen-container');
  container.innerHTML = " ";

  switch (newScreen) {
    case 0:
      location.reload();
      break;

    case 1:
      // Implementar el cambio de pantalla aquí
      container.innerHTML = await createEventScreen(getCurrentEventId());
      await addEventInfoListeners();
      break;

      case 2: //Pantalla de usuario info
        container.innerHTML = await generateUserProfile(extraData);
        addCardListeners();
        logOutListener();
   
        break;
  }
};

export const getCurrentEventId = () => currentEventId;
export const setCurrentEventId = (id) => { currentEventId = id; };

// Asegurarse de que el DOM esté listo antes de inicializar la aplicación
document.addEventListener('DOMContentLoaded', initializeApp);

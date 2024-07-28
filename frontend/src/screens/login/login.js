import './login.css';
import { createButton } from '../../components/standardButton/standardButton';
import { launchNoti } from '../../components/notification/notification';
import { getBaseUrl, sleep } from '../../utils';
import { addRegisterListener, createSignup } from '../signup/signup';
import { createLoader, destroyLoader } from '../../components/loader/loader';
import { createFormField } from '../../components/form-group/formGroup';

export const loginScreen = () => {
  const container = document.createElement('div');
  container.classList.add('login-container');
  container.innerHTML = `
    <div class="login-screen">
      <h2>Login</h2>
      <form id="login-form" action="/login" method="post">
        ${createFormField('email','email','email','Email', 'required')}
         ${createFormField('password','password','password','Password', 'required')}
        ${createButton('submit', 'Login', 'login-button')}
      </form>
      <div class="register-link-container">
        <p>Don't have an account? <span class="register-link"> &nbsp Sign up</span></p>
      </div>
    </div>
  `;
  return container;
};
 
const loginSubmit = async () => {
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  const baseUrl = getBaseUrl();
  try {
    createLoader();
    const response = await fetch( `${baseUrl}/api/v1/users/login`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const dataRes = await response.json();
    destroyLoader();
    if (!response.ok) {

      
      launchNoti(dataRes, 'red');
    } else {
      createLoader();
      const data = await fetch(baseUrl + "/api/v1/attendees/e/" + dataRes.user.email);
      const res = await data.json();
      destroyLoader();
      localStorage.setItem("user", JSON.stringify(dataRes));
      localStorage.setItem("attendee", JSON.stringify(res));
      launchNoti("Welcome " + dataRes.user.userName + "!", '');
      await sleep(1000);
      location.reload();
    }
  } catch (error) {
    launchNoti("An error occurred during login", 'red');
  }
};

const login = () => {
  if (!document.querySelector('.login-screen') && !document.querySelector('.register-screen')) {
    const app = document.querySelector('#app');
    const overlay = document.querySelector('.overlay') || createOverlay();
    app.appendChild(overlay);
    app.appendChild(loginScreen());
    addLoginListeners();
  }
};

const createOverlay = () => {
  const overlay = document.createElement('div');
  overlay.classList.add('overlay');
  overlay.addEventListener("click", () => {
    document.querySelector('.login-screen')?.remove();
    document.querySelector('.register-screen')?.remove();
    overlay.remove();
  });
  return overlay;
};

export const addLoginListeners = () => {
  const loginForm = document.querySelector("#login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (ev) => {
      ev.preventDefault();
      loginSubmit();
    });
  }

  const registerLink = document.querySelector('.register-link');
  if (registerLink) {
    registerLink.addEventListener("click", () => {
      document.querySelector('.login-screen')?.remove();
      const app = document.querySelector('#app');
      app.appendChild(createSignup());
      addRegisterListener();
    });
  }
};

const addLoginListener = () => {
  const loginBtn = document.querySelector('.login-header');
  if (loginBtn) {
    loginBtn.removeEventListener('click', login);
    loginBtn.addEventListener('click', login);
  }
};

export { login, addLoginListener };

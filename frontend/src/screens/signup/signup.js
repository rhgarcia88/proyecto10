import './signup.css';
import { createButton } from '../../components/standardButton/standardButton';
import { launchNoti } from '../../components/notification/notification';
import { addLoginListener, addLoginListeners, loginScreen } from '../login/login';
import { getBaseUrl, sleep } from '../../utils';
import { changeScreen } from '../../../main';

export const createSignup = () => {
  const container = document.createElement('div');
  container.classList.add('register-container');
  container.innerHTML = `
    <div class="register-screen">
      <h2>Register</h2>
      <form id="register-form" action="/register" method="post" enctype="multipart/form-data">
        <div class="form-group-2">
          <input type="text" id="userName" name="userName" required placeholder="Username"/>
          <input type="email" id="email" name="email" required placeholder="Email"/>
        </div>
        <div class="form-group">
          <input type="password" id="password" name="password" required placeholder="Password"/>
          <input type="password" id="double-password" name="password" required placeholder="Repeat Password"/>
        </div>
        <div class="form-group">
          <div class="file-upload-container">
            <label class="custom-file-upload" for="profile-pic">Profile Image</label>
            <input type="file" id="profile-pic" name="profile-pic" accept=".jpg, .jpeg, .png" placeholder="Profile Picture"/>
            <span class="file-name">No file chosen</span>
          </div>
        </div>
        ${createButton('submit', 'Register', 'register-button')}
      </form>
      <div class="login-link-container">
        <p>Have an account? <span class="login-link"> &nbsp Log in</span></p>
      </div>
    </div>
  `;
  return container;
};

const signUpSubmit = async () => {
  const userName = document.querySelector('#userName').value;
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;
  const doublePassword = document.querySelector('#double-password').value;
  const profilePic = document.querySelector('#profile-pic').files[0];

  try {
    if (password !== doublePassword) {
      launchNoti('Passwords are not the same', 'red');
      return;
    }

    const formData = new FormData();
    formData.append('userName', userName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('profilePic', profilePic);
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/v1/users/register`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      launchNoti('Successful!', 'green');
      document.querySelector(".register-button").disabled = true;
      await sleep(1000);
      location.reload();
    } else {
      const errorData = await response.json();
      console.error('Error del backend:', errorData);
      launchNoti(errorData.message, 'red');
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);
    launchNoti('An error occurred during registration', 'red');
  }
};

const signUp = () => {
  if (!document.querySelector('.register-screen') && !document.querySelector('.login-screen')) {
    const app = document.querySelector('#app');
    const overlay = document.querySelector('.overlay') || createOverlay();
    app.appendChild(overlay);
    app.appendChild(createSignup());
    addRegisterListener();
  }
};

const createOverlay = () => {
  const overlay = document.createElement('div');
  overlay.classList.add('overlay');
  overlay.addEventListener("click", () => {
    document.querySelector('.register-screen')?.remove();
    document.querySelector('.login-screen')?.remove();
    overlay.remove();
  });
  return overlay;
};

const addRegisterListener = () => {
  const registerBtn = document.querySelector('.register-header');
  if (registerBtn) {
    registerBtn.removeEventListener('click', signUp);
    registerBtn.addEventListener('click', signUp);
  }

  const loginLink = document.querySelector('.login-link');
  if (loginLink) {
    loginLink.addEventListener("click", () => {
      document.querySelector('.register-screen')?.remove();
      const app = document.querySelector('#app');
      app.appendChild(loginScreen());
      addLoginListeners();
    });
  }

  const registerForm = document.querySelector("#register-form");
  if (registerForm) {
    registerForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      signUpSubmit();
    });
  }

  const fileInput = document.getElementById('profile-pic');
  const fileNameDisplay = document.querySelector('.file-name');

  if (fileInput && fileNameDisplay) {
    fileInput.addEventListener('change', function() {
      const file = this.files[0];
      if (file) {
        const fileName = file.name;
        const fileExtension = fileName.split('.').pop().toLowerCase();
        const validExtensions = ['jpg', 'jpeg', 'png'];

        if (validExtensions.includes(fileExtension)) {
          fileNameDisplay.textContent = fileName;
        } else {
          launchNoti('Invalid file type. Please select a JPG or PNG file.', 'red');
          fileInput.value = '';
        }
      } else {
        fileNameDisplay.textContent = 'No file chosen';
      }
    });
  } else {
    console.error('File input or file name display element not found in the DOM.');
  }
};

export { addRegisterListener, signUp };

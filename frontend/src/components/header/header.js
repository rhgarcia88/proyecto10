import './header.css';
import { createButton } from '../standardButton/standardButton';
import { changeScreen } from '../../../main';
import { addLoginListener } from '../../screens/login/login';

export const generateHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userSection = user
    ? `<div class="profile-circle">
         <img src="${user.user.profilePic}" alt="Profile Picture" class="profile-pic">
       </div>`
    : `${createButton('button', 'Login', 'green-btn login-header')}`;

  return `<header>
            <div class="logo-header"> 
              <img src="/LONG-LOGO.png"/>
            </div>
            <div>
              ${createButton('button', 'Explore','explore')}
            </div>
            <div>
              ${userSection}
            </div>
          </header>`;
};

export const addProfileImageListener = (attId) => {
  const profileCircle = document.querySelector('.profile-circle');
  if (profileCircle) {
    profileCircle.addEventListener('click', () => {
      changeScreen(2, attId);
    });
  }
}

// Agrega el listener al botón de login después de generar el header
document.addEventListener('DOMContentLoaded', () => {
  addLoginListener();
});

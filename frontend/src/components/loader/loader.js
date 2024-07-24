import './loader.css'

export const loading = () => {
  

  return `
  <div>
  <img src="/loader.gif">
  </div>
  `;

  
}


export const destroyLoader = () => {

  const loader = document.querySelector('.loader-container');
  if (loader) {
    loader.remove();
  }
}

export const createLoader = () => {

  let loaderCont = document.createElement('div');
  loaderCont.classList.add('loader-container');
  loaderCont.innerHTML = loading();

  document.querySelector('#app').appendChild(loaderCont);
}
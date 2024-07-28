import './formGroup.css';


export const createFormField = (type, id, name, placeholder, required  ) => {

  return `
  <div class="form-group">
          <input type="${type}" id="${id}" name="${name}" ${required ? 'required' : ''} placeholder="${placeholder}"/>
        </div>
  `;
}
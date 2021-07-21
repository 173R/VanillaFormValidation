"use strict"

document.addEventListener("DOMContentLoaded", formValidation);

const form = document.querySelector("form");
const submitBtn = document.querySelector("button[type=submit]");
const validationNodes = document.querySelectorAll('[data-validate]');

// состояние валидации каждого поля, для того что бы определить валидность всей формы
const requiredFieldsState = {
  name: false,
  phone: false,
  email: false,
  message: false
}

for (let i = 0; i < validationNodes.length; i++) {
  validationNodes[i].addEventListener('input', () => validation(validationNodes[i]));

  if(validationNodes[i].name === "phone") {
    validationNodes[i].addEventListener('input', (e) => phoneMask(validationNodes[i], e));
    validationNodes[i].addEventListener('focus', (e) => phoneMask(validationNodes[i], e));
    validationNodes[i].addEventListener('blur', (e) => phoneMask(validationNodes[i], e));
  }
}

form.addEventListener('submit', sendData);

function sendData(e){
  e.preventDefault();
  document.querySelector('form').parentNode.classList.add('processing');

  const form = e.target;
  const body = JSON.stringify({
    name: requiredFieldsState.name ? form.elements.name.value : "",
    phone: requiredFieldsState.phone ? form.elements.phone.value : "",
    email: requiredFieldsState.email ? form.elements.email.value : "",
    message: requiredFieldsState.message? form.elements.message.value : "",
  });

  fetch('https://blooming-brook-55073.herokuapp.com', { method: 'POST', body})
    .then(resp => {
      if(resp.status < 200 || resp.status >= 300)
        throw new Error;

      if(resp.ok) {
        form.reset();
        clearFields(requiredFieldsState);
        formValidation();
        addTempClass(form, 'successfully');
      }
    })
    .catch(err => {
      addTempClass(form, 'loss');
    })
}

function validation(targetNode) {
  switch (targetNode.name) {
    case 'email':
      setErrorClass(emailValidation,targetNode);
      break;
    case 'name':
      setErrorClass(nameValidation,targetNode);
      break;
    case 'phone':
      setErrorClass(phoneValidation, targetNode);
      break;
    case 'message':
      setErrorClass(messageValidation,targetNode);
      break;
  }

  formValidation();
}

function formValidation() {
  submitBtn.disabled = false;

  if(!((requiredFieldsState.name && requiredFieldsState.message) && (requiredFieldsState.email || requiredFieldsState.phone))) {
    submitBtn.disabled = true;
  }
}

function emailValidation(target) {
  const result = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(target.value);

  requiredFieldsState.email = result;
  return result;
}

function nameValidation(target) {
  const result = /^[а-яА-ЯёЁa-zA-Z][а-яА-ЯёЁa-zA-Z0-9-_. ]{1,20}$/.test(target.value);

  requiredFieldsState.name = result;
  return result;
}

function phoneValidation(target) {
  const inputNums = target.value.replace(/\D/g,"").substring(0,11);
  const result = inputNums.length === 11 && inputNums[0] === "7";

  requiredFieldsState.phone = result;
  return result;
}

function messageValidation(target) {
  const result = !!target.value;

  requiredFieldsState.message = result;
  return result;
}

function addClassError(target) {
  const childrenNodes = target.parentElement.children;

  for (let i = 0; i < childrenNodes.length; i++) {
    childrenNodes[i].classList.add('error');
  }
}

function removeClassError(target) {
  const childrenNodes = target.parentElement.children;
  for (let i = 0; i < childrenNodes.length; i++) {
    childrenNodes[i].classList.remove('error');
  }
}

// Добавляем или убираем класс error в зависимости от результата прохождения валидации
function setErrorClass(validationFunc, targetNode) {
  removeClassError(targetNode);

  if(!validationFunc(targetNode)) {
    addClassError(targetNode);
  }
}

function phoneMask(target,e) {
  const inputNumbers = target.value.replace(/\D/g,"");

  if(e.type === 'blur' && target.value === "+7" ) {
    target.value = "";
  }

  else {
    target.value = "+7";

    if(inputNumbers.length>1) {
      target.value += " (" + inputNumbers.substring(1,4);
    }
    if(inputNumbers.length>=5) {
      target.value += ") " + inputNumbers.substring(4,7);
    }
    if(inputNumbers.length>=8) {
      target.value += "-" + inputNumbers.substring(7,9);
    }
    if(inputNumbers.length>=10) {
      target.value += "-" + inputNumbers.substring(9,11);
    }
  }
}

// Добавление временного класса отвечающего за отображения результата отправки
function addTempClass(form, className) {
  document.querySelector('form').parentNode.classList.remove('processing');
  form.classList.add(className);
  setTimeout(() => form.classList.remove(className), 2000);
}

function clearFields(stateObj) {

  Array.from(validationNodes).map(elem => {
    if(elem.classList.contains('error')) {
      removeClassError(elem);
    }
  });

  for (let fieldState in stateObj) {
    stateObj[fieldState] = false;
  }
}


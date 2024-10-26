export const getElements = () => ({
  form: document.querySelector('.rss-form'),
  input: document.querySelector('#input-RSS'),
  feedback: document.querySelector('.feedback'),
})

export const renderError = (inputElement, feedbackElement, errorMessage) => {
  inputElement.classList.add('is-invalid');
  feedbackElement.textContent = errorMessage;
}

export const clearField = (inputElement, feedbackElement) => {
  inputElement.classList.remove('is-invalid');
  inputElement.value = '';
  inputElement.focus();
  feedbackElement.textContent = '';
}
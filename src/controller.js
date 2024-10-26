import onChange from "on-change";
import ru from "./locales/ru.js";
import i18next from "i18next";
import { createState, createSchema } from "./model.js";
import { getElements, renderError, clearField } from "./view.js";

export default () => {
  const state = createState();
  const elements = getElements();

  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru: {
        translation: ru,
      }
    },
  });

  const watchedState = onChange(state, (path, value) => {
    if (path === 'errors.validationError' && value !== '') {
      renderError(elements.input, elements.feedback, value);
    }
    if (path === 'errors.validationError' && value === '') {
      clearField(elements.input, elements.feedback);
    }
  });

  const validateField = () => {
    const schema = createSchema(state.addedRSS, i18nextInstance);
    return schema
      .validate(state.data)
      .then(() => {
        watchedState.validation = 'valid';
        watchedState.addedRSS = [...state.addedRSS, state.data];
        return '';
      })
      .catch((err) => {
        watchedState.validation = 'invalid';
        return err.message;
      });
  };

  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();
    watchedState.data = elements.input.value;
    validateField().then((errorMessage) => {
      watchedState.errors.validationError = errorMessage;
    });
  })

}
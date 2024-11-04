import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';
import ru from '../locales/ru.js';
import { state, createSchema } from '../model.js';
import {
  elements,
  renderFeedback,
  createFeed,
  createPosts,
  createFeedsFirstTime,
  createPostsFirstTime,
} from '../view.js';
import parser from './parser.js';
import checkUpdate from './checkUpdate.js';
import proxy from './proxy.js';

export default () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru: {
        translation: ru,
      },
    },
  });

  const watchedState = onChange(state, (path) => {
    if (path === 'feedback.successMessage') {
      renderFeedback(state.feedback.successMessage, true);
    }
    if (path === 'feedback.errorMessage') {
      renderFeedback(state.feedback.errorMessage, false);
    }
  });

  const validateField = () => {
    const schema = createSchema(state.addedRSS, i18nextInstance);
    return schema
      .validate(state.data)
      .catch((err) => {
        watchedState.feedback.errorMessage = err.message;
        throw new Error('Invalid URL');
      });
  };

  checkUpdate(state);

  const renderModal = () => {
    const viewButtons = document.querySelectorAll('[data-bs-toggle="modal"]');
    viewButtons.forEach((btn) => {
      btn.addEventListener('click', (event) => {
        event.preventDefault();

        const postLink = btn.previousSibling;
        postLink.classList.add('fw-normal', 'link-secondary');
        postLink.classList.remove('fw-bold');

        const modalLink = document.querySelector('.modal a');
        const modalTitle = document.querySelector('.modal-title');
        const modalDescription = document.querySelector('.modal-body');

        const btnId = parseInt(btn.getAttribute('data-id'), 10);
        const post = state.posts.filter(({ id }) => id === btnId);
        modalTitle.textContent = post[0].title;
        modalDescription.textContent = post[0].description;
        modalLink.setAttribute('href', `${post[0].link}`);
      });
    });
  };

  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();
    watchedState.data = elements.input.value;
    validateField()
      .then(() => axios.get(proxy(state.data)))
      .then((response) => response.data.contents)
      .then((xml) => parser(xml))
      .then((parsedXml) => {
        const channelElement = parsedXml.querySelector('rss>channel>item');
        if (!channelElement) {
          throw new Error('Invalid RSS');
        }
        return parsedXml;
      })
      .then((parsedXml) => {
        if (state.addedRSS.length === 0) {
          createFeedsFirstTime(parsedXml, state);
          createPostsFirstTime(parsedXml, state);
        } else {
          createFeed(parsedXml, state);
          createPosts(parsedXml, state);
        }
        state.addedRSS = [...state.addedRSS, state.data];
        watchedState.feedback.successMessage = i18nextInstance.t('texts.rssUploaded');
        renderModal();
      })
      .catch((error) => {
        if (error.message === 'Invalid URL') {
          console.log('Ошибка при валидации:', watchedState.feedback.errorMessage);
        } else if (error.message === 'Invalid RSS') {
          watchedState.feedback.errorMessage = i18nextInstance.t('texts.notContainValidRSS');
          console.log('Некорректная ссылка:', watchedState.feedback.errorMessage);
        } else if (axios.isAxiosError(error)) {
          watchedState.feedback.errorMessage = i18nextInstance.t('texts.networkError');
          console.log(watchedState.feedback.errorMessage);
        } else {
          console.log('Неизвестная ошибка:', error.message);
        }
      })
      .finally(() => {
        elements.input.focus();
      });
  });
};

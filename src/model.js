import * as yup from 'yup';

export const state = {
  data: '',
  feedback: {
    successMessage: '',
    errorMessage: '',
  },
  addedRSS: [],
  posts: [],
  feeds: [],
};

export const createSchema = (feeds, i18nextInstance) => yup
  .string()
  .required()
  .url(i18nextInstance.t('texts.incorrectUrl'))
  .notOneOf(feeds, i18nextInstance.t('texts.rssAlreadyExist'));

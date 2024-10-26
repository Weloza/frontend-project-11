import * as yup from 'yup';

export const createState = () => ({
  data: '',
  validation: 'valid',
  errors: {
    validationError: '',
  },
  addedRSS: [],
})

export const createSchema = (feeds, i18nextInstance) => 
  yup
    .string()
    .required()
    .url(i18nextInstance.t('texts.incorrectUrl'))
    .notOneOf(feeds, i18nextInstance.t('texts.rssAlreadyExist'));

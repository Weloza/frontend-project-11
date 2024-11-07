import * as yup from 'yup';

const createSchema = (feeds, i18nextInstance) => yup
  .string()
  .required()
  .url(i18nextInstance.t('texts.incorrectUrl'))
  .notOneOf(feeds, i18nextInstance.t('texts.rssAlreadyExist'));

export default createSchema;

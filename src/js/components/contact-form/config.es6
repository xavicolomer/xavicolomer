import { classesToSelectors } from '../../util/utils.es6';

const base = 'contact';

module.exports.VALUES = {
  emailRegex: /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-?\.?[a-zA-Z0-9])*(\.[a-zA-Z](-?[a-zA-Z0-9])*)+$/, // eslint-disable-line max-len
  ajaxAnimMs: 3000
};

module.exports.CLASSES = {
  button: `${base}-form__button`,
  buttonDisabled: `${base}-form__button--disabled`,
  buttonFailed: `${base}-form__button--failed`,
  buttonSuccess: `${base}-form__button--success`,
  email: `${base}-form__email`,
  form: `${base}-form`,
  formField: `${base}-form__field`,
  formFieldInvalid: `${base}-form__field--invalid`,
  text: `${base}-form__text`
};

module.exports.SELECTORS = classesToSelectors(module.exports.CLASSES);

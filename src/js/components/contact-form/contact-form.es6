import { API } from '../../config/api.es6';
import { CLASSES, SELECTORS, VALUES } from './config.es6';
import { NUMBERS } from '../../config/common.es6';
import { removeClass, addClass } from '../../util/html.es6';

const HTTPS_STATUS_ERROR = 400;
const HTTPS_STATUS_OK = 200;
const MAX_EMAIL_LENGTH = 64;
const MAX_TEXT_LENGTH = 300;
const MIN_TEXT_LENGTH = 10;

const STR_MESSAGE_FAILED = 'Message Failed!';
const STR_MESSAGE_SENT = 'Message Sent!';
const STR_SEND = 'Send';

class ContactForm {
  constructor() {
    this.DOM = {};

    this.el = document.querySelectorAll(SELECTORS.form)[NUMBERS.FIRST];

    if (this.el) {
      this.DOM.emailField = this.el.querySelector(SELECTORS.email);
      this.DOM.textField = this.el.querySelector(SELECTORS.text);
      this.DOM.button = this.el.querySelector(SELECTORS.button);

      this.addEventListeners();
    }
  }

  addEventListeners() {
    this.DOM.emailField.addEventListener('keyup', this.onEmailKeyUp.bind(this));
    this.DOM.textField.addEventListener('keyup', this.onTextKeyUp.bind(this));
    this.DOM.button.addEventListener('click', this.send.bind(this));
  }

  updateButtonStatus() {
    if (this.isTextValid && this.isEmailValid) {
      removeClass(this.DOM.button, CLASSES.buttonDisabled);
    } else {
      addClass(this.DOM.button, CLASSES.buttonDisabled);
    }
  }

  onTextKeyUp(event) {
    const text = event.currentTarget.value;

    if (text.length < MIN_TEXT_LENGTH) {
      addClass(this.DOM.textField, CLASSES.formFieldInvalid);
      this.isTextValid = false;
    } else {
      removeClass(this.DOM.textField, CLASSES.formFieldInvalid);
      this.isTextValid = true;
    }

    this.updateButtonStatus();
  }

  onEmailKeyUp(event) {
    const email = event.currentTarget.value;

    if (email === '') {
      removeClass(this.DOM.emailField, CLASSES.formFieldInvalid);
      this.isEmailValid = false;
    }

    if (!this.validateEmail(email)) {
      addClass(this.DOM.emailField, CLASSES.formFieldInvalid);
      this.isEmailValid = false;
    } else {
      removeClass(this.DOM.emailField, CLASSES.formFieldInvalid);
      this.isEmailValid = true;
    }

    this.updateButtonStatus();
  }

  validateEmail(email) {
    if (!email) {
      return false;
    }

    if (email.length > MAX_TEXT_LENGTH) {
      return false;
    }

    const valid = VALUES.emailRegex.test(email);

    if (!valid) {
      return false;
    }

    // Further checking of some things regex can't handle
    const parts = email.split('@');

    if (parts[NUMBERS.FIRST].length > MAX_EMAIL_LENGTH) {
      return false;
    }

    return true;
  }

  messageOkAnim() {
    this.DOM.button.innerHTML = STR_MESSAGE_SENT;
    addClass(this.DOM.button, CLASSES.buttonSuccess);

    window.setTimeout(() => {
      this.messageRestoreNormal();
    }, VALUES.ajaxAnimMs);
  }

  messageFailedAnim() {
    this.DOM.button.innerHTML = STR_MESSAGE_FAILED;
    addClass(this.DOM.button, CLASSES.buttonFailed);

    window.setTimeout(() => {
      this.messageRestoreNormal();
    }, VALUES.ajaxAnimMs);
  }

  messageRestoreNormal() {
    this.DOM.button.innerHTML = STR_SEND;
    removeClass(this.DOM.button, CLASSES.buttonFailed);
    removeClass(this.DOM.button, CLASSES.buttonSuccess);
  }

  send() {
    const request = new XMLHttpRequest();

    request.open('POST', API.email, true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = () => {
      if (request.status >= HTTPS_STATUS_OK && request.status < HTTPS_STATUS_ERROR) {
        this.messageOkAnim();
      } else {
        this.messageFailedAnim();
      }
    };

    request.onerror = () => {
      this.messageFailedAnim();
    };

    if (this.isTextValid && this.isEmailValid) {
      request.send(JSON.stringify({
        email: this.DOM.emailField.value,
        text: this.DOM.textField.value
      }));
    }
  }
}

module.exports = ContactForm;


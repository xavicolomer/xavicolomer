import { classesToSelectors } from '../util/utils.es6';

module.exports.NUMBERS = {
  NONE: 0,
  FIRST: 0,
  NOT_FOUND: -1,
  ONE: 1
};

module.exports.COMMON_ATTRIBUTES = {
  init: 'data-init',
  initOptions: 'data-init-options'
};

module.exports.COMMON_VALUES = {};

module.exports.COMMON_CLASSES = {
  body: 'body',
  video: 'video',
  bodyNoScroll: 'body--no-scroll',
  bodyAnimated: 'body--animated',
  component: 'component',
  icon: 'icon',
  iconClose: 'icon-close',
  isInvisible: 'is-invisible',
  isHidden: 'is-hidden',
  mainSection: 'main-section'
};

module.exports.COMMON_SELECTORS = classesToSelectors(module.exports.COMMON_CLASSES);

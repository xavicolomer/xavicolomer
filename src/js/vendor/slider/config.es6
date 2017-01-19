import { classesToSelectors } from '../../util/utils.es6';

let base = 'slider';

module.exports.CLASSES = {
  bullet: `${base}-nav-bullet`,
  bulletSelected: `${base}-nav-bullet--selected`,
  button: `${base}-button`,
  buttonRight: `${base}-button-right`,
  buttonLeft: `${base}-button-left`,
  track: `${base}-track`,
  trackAnimated: `${base}-track--animated`,
  trackWrapper: `${base}-track-wrapper`,
  paginator: `${base}-paginator`,
  paginatorIndex: `${base}-paginator-index`,
  paginatorSeparator: `${base}-paginator-separator`,
  paginatorTotal: `${base}-paginator-total`,
  nav: `${base}-nav`,
  navWrapper: `${base}-nav-wrapper`,
  slider: `${base}`,
  slide: `${base}-slide`
};

module.exports.SELECTORS = classesToSelectors(module.exports.CLASSES);

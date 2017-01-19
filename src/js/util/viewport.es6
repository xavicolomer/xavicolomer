import { SM } from '../config/context.es6';

module.exports = {
  isTouchDevice: () => {
    // works on most browsers
    return 'ontouchstart' in window
    // works on IE10/11 and Surface
    || navigator.maxTouchPoints;
  },

  isMobile: () => document.documentElement.clientWidth < SM
};

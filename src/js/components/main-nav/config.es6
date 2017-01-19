import { classesToSelectors } from '../../util/utils.es6';

const base = 'main-nav';
const menu = 'menu';

module.exports.BASE = base;

module.exports.CLASSES = {
  menu: menu,
  menuMobile: `${menu}-mobile`,
  menuNavItem: `${menu}-nav__item`,
  menuNavItemSelected: `${menu}-nav__item--selected`,
  menuMobileButton: `${menu}-mobile-button`,
  menuMobileCloseButton: `${menu}-mobile-close-button`
};

module.exports.ATTRIBUTES = {
  navTarget: 'data-nav-target'
};

module.exports.SELECTORS = classesToSelectors(module.exports.CLASSES);

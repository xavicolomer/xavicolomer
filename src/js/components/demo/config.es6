import { classesToSelectors } from '../../util/utils.es6';

const base = 'demo';

module.exports.BASE = base;

module.exports.CLASSES = {
  demoCloseButton: `${base}-close-button`,
  demoContainer: `${base}-container`,
  demoWrapper: `${base}-wrapper`
};

module.exports.SELECTORS = classesToSelectors(module.exports.CLASSES);

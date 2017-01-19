import { classesToSelectors } from '../../util/utils.es6';

const base = 'zoom';

module.exports.ATTRIBUTES = {
  zoomGroup: 'data-zoom-group'
};

module.exports.CLASSES = {
  mediaZoom: 'media-zoom',
  zoomContainer: `${base}-container`,
  zoomWrapper: `${base}-wrapper`,
  zoomSlide: `${base}-slide`,
  zoomSlider: `${base}-slider`,
  zoomCloseButton: `${base}-close-button`
};

module.exports.SELECTORS = classesToSelectors(module.exports.CLASSES);

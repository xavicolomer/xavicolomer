import { classesToSelectors } from '../../util/utils.es6';

module.exports.CLASSES = {
  mediaWrapperImage: 'media-wrapper__image',
  mediaWrapperIsPlaying: 'media-wrapper--is-playing',
  mediaWrapperWithVideo: 'media-wrapper--with-video',
  zoomWrapper: 'zoom-wrapper',
  zoomSlide: 'zoom-slide',
  zoomSlider: 'zoom-slider',
  mediaZoom: 'media-zoom'
};

module.exports.SELECTORS = classesToSelectors(module.exports.CLASSES);

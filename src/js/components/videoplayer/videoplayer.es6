import {
  parent,
  addGlobalListener,
  removeListener,
  addListener,
  addClass,
  removeClass,
  hasClass
} from '../../util/html.es6';
import { isMobile } from '../../util/viewport.es6';
import { COMMON_ATTRIBUTES, COMMON_CLASSES, NUMBERS } from '../../config/common.es6';
import { CLASSES, SELECTORS } from './config.es6';

let currentVideo = null;

class VideoPlayer {
  constructor() {
    this.DOM = {};

    this.cachedVideoFunction = this.onClickOnVideoElement.bind(this);

    document.addEventListener('oncontextchange', this.onContextChange.bind(this), false);

    addGlobalListener(CLASSES.mediaWrapperWithVideo, this.onClickOnVideo.bind(this), false);

    this.onContextChange({ detail: { isMobile: isMobile() }});
  }

  onClickOnVideo(event) {
    const slider = parent(event.target, CLASSES.zoomSlider);
    const isInsideZoom = slider || hasClass(event.target.parentNode, CLASSES.zoomWrapper);
    const isMobileContext = isMobile();

    if (isInsideZoom || isMobileContext) {
      const newVideo = event.target.querySelector(COMMON_CLASSES.video);

      if (!isMobileContext) {
        if (!isInsideZoom &&
          event.target.getAttribute(COMMON_ATTRIBUTES.init) === CLASSES.mediaZoom) {
          return;
        }
      }

      if (newVideo === currentVideo) {
        this.onClickOnVideoElement();
        return;
      }

      currentVideo = newVideo;
      addClass(event.target, CLASSES.mediaWrapperIsPlaying);
      addListener(newVideo, 'click', this.cachedVideoFunction);
      addClass(event.target.querySelector(SELECTORS.mediaWrapperImage), COMMON_CLASSES.isInvisible);

      if (slider) {
        addListener(slider, 'sliderchanged', this.cachedVideoFunction);
      }

      currentVideo.play();
    }
  }

  onClickOnVideoElement() {
    const slider = parent(currentVideo, CLASSES.zoomSlider);

    if (slider) {
      removeListener(slider, 'sliderchanged', this.cachedVideoFunction);
    }

    removeListener(currentVideo, 'click', this.cachedVideoFunction);

    currentVideo.pause();
    currentVideo = null;
    removeClass(document.querySelector(SELECTORS.mediaWrapperIsPlaying),
      CLASSES.mediaWrapperIsPlaying);
  }

  buildMobile() {
    const sources = document.querySelectorAll('source[src*=".mp4"]');

    for (let i = 0, len = sources.length; i < len; ++i) {
      if (sources[i].src.indexOf('-mobile') === NUMBERS.NOT_FOUND) {
        sources[i].src = sources[i].src.replace('.mp4', '-mobile.mp4');
      }
    }
  }

  buildDesktop() {
    const sources = document.querySelectorAll('source[src*="-mobile.mp4"]');

    for (let i = 0, len = sources.length; i < len; ++i) {
      if (sources[i].src.indexOf('-mobile') !== NUMBERS.NOT_FOUND) {
        sources[i].src = sources[i].src.replace('.mp4', '-mobile.mp4');
      }
    }
  }

  onContextChange(event) {
    if (event.detail.isMobile) {
      this.buildMobile();
    } else {
      this.buildDesktop();
    }
  }
}

module.exports = VideoPlayer;


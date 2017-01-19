import Slider from '../../vendor/slider/slider.es6';
import { isMobile } from '../../util/viewport.es6';
import { BASE } from './config.es6';
import { COMMON_ATTRIBUTES, NUMBERS } from '../../config/common.es6';

class MediaGallery {
  constructor() {
    document.addEventListener('oncontextchange', this.onContextChange.bind(this), false);
    this.onContextChange({ detail: { isMobile: isMobile() }});
  }

  buildGallery() {
    this.slider = new Slider(document.querySelectorAll(
      `[${COMMON_ATTRIBUTES.init}="${BASE}"]`)[NUMBERS.FIRST]);
    this.slider.init();
  }

  destroyGallery() {
    if (this.slider) {
      this.slider.destroy();
      this.slider = null;
    }
  }

  onContextChange(event) {
    if (event.detail.isMobile) {
      this.buildGallery();
    } else {
      this.destroyGallery();
    }
  }
}

module.exports = MediaGallery;


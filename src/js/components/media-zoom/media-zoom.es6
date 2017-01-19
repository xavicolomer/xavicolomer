import { isMobile } from '../../util/viewport.es6';
import { CLASSES, SELECTORS, ATTRIBUTES } from './config.es6';
import { COMMON_ATTRIBUTES, COMMON_CLASSES, NUMBERS } from '../../config/common.es6';
import { addClass, removeClass, index } from '../../util/html.es6';
import Slider from '../../vendor/slider/slider.es6';

let isZoomAlreadyOpen = false;

class MediaZoom {
  constructor() {
    this.DOM = {};

    this.elements = document.querySelectorAll(`[${COMMON_ATTRIBUTES.init}="${CLASSES.mediaZoom}"]`);

    this.cachedCloseFunction = this.onClickOnCloseZoom.bind(this);

    for(let i = 0; i < this.elements.length; i++) {
      this.elements[i].addEventListener('click', this.onClickOnZoomElement.bind(this), false);
    }
  }

  createSlides(items) {
    let html = '';

    for (let i = 0, len = items.length; i < len; ++i) {
      html += `<div class="${CLASSES.zoomSlide}">${items[i].outerHTML}</div>`;
    }

    return html;
  }

  onClickOnZoomElement(event) {
    if (!isMobile()) {
      if (!isZoomAlreadyOpen) {
        isZoomAlreadyOpen = true;

        document.addEventListener('onescape', this.cachedCloseFunction);

        this.wrapper = document.createElement('div');
        this.wrapper.className = `${COMMON_CLASSES.component} ${CLASSES.zoomContainer}`;
        this.wrapper.innerHTML =
          `<div class="${COMMON_CLASSES.component} ${CLASSES.zoomCloseButton}">
                <span class="${COMMON_CLASSES.icon} ${COMMON_CLASSES.iconClose}"></span>
          </div>
          <div class="${COMMON_CLASSES.component} ${CLASSES.zoomWrapper}"></div>`;

        document.body.insertBefore(this.wrapper, document.body.childNodes[NUMBERS.FIRST]);

        const group = event.currentTarget.getAttribute(ATTRIBUTES.zoomGroup);
        let html = `<div class="${CLASSES.zoomSlider}">`;
        let itemIndex = 0;

        if (group) {
          const items = document.querySelectorAll(`[${ATTRIBUTES.zoomGroup}="${group}"]`);

          itemIndex = index(event.currentTarget.parentNode,
            event.currentTarget.parentNode.parentNode);

          html += this.createSlides(items);
          html += '</div>';
        } else {
          html = event.currentTarget.outerHTML;
        }

        this.DOM.zoomWrapper = document.getElementsByClassName(CLASSES.zoomWrapper)[NUMBERS.FIRST];
        this.DOM.zoomWrapper.innerHTML = html;

        this.DOM.closeButton = document.getElementsByClassName(
          CLASSES.zoomCloseButton)[NUMBERS.FIRST];
        this.DOM.slider = document.querySelector(SELECTORS.zoomSlider);
        this.DOM.body = document.getElementsByTagName('body');

        this.DOM.closeButton.addEventListener('click', this.onClickOnCloseZoom.bind(this), false);

        addClass(this.DOM.body, COMMON_CLASSES.bodyNoScroll);

        if (group) {
          this.slider = new Slider(this.DOM.slider);
          this.slider.init(itemIndex, true);
        }
      }
    }
  }

  onClickOnCloseZoom() {
    this.DOM.closeButton.removeEventListener('click', this.onClickOnCloseZoom.bind(this), false);
    this.DOM.body[NUMBERS.FIRST].removeChild(this.wrapper);

    document.removeEventListener('onescape', this.cachedCloseFunction);

    if (this.slider) {
      this.slider.destroy();
      this.slider = null;
    }

    removeClass(this.DOM.body, COMMON_CLASSES.bodyNoScroll);

    isZoomAlreadyOpen = false;
  }
}

module.exports = MediaZoom;


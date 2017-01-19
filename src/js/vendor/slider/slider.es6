import {
  css,
  removeClass,
  addClass,
  addListener,
  removeListener,
  index
} from '../../util/html.es6';
import { CLASSES, SELECTORS } from './config.es6';
import { NUMBERS, COMMON_CLASSES } from '../../config/common.es6';

const MAX_BULLETS_NUM = 7;
const MIN_DRAGGED_DISTANCE = 100;

class Slider {
  constructor(element) {
    if (typeof element === 'undefined') {
      return;
    }

    this.container = element;
    this.DOM = {};

    const children = this.container.children;
    this.numItems = children.length;
    this.currentItem = 0;
    this.step = this.container.offsetWidth;
    this.children = [];
    this.hasButtonNavigation = false;
    this.hasBulletNavigation = this.numItems < MAX_BULLETS_NUM;
    this.onMouseMoveCached = this.onTouchMove.bind(this);

    for (let i = 0, len = children.length; i < len; ++i) {
      this.children.push(children[i]);
    }
  }

  init(initialValue, hasButtonNavigation = false) {
    if (initialValue && initialValue > NUMBERS.NONE) {
      this.currentItem = initialValue;
    }

    this.hasButtonNavigation = hasButtonNavigation;

    if (this.numItems > NUMBERS.ONE) {
      let slides = '';
      let trackWidth = 0;
      let maxHeight = 0;
      let bullets = '';
      let nav;
      let buttons = '';
      let selectedKlass = '';

      this.children.map((slide, slideIndex) => {
        selectedKlass = '';
        slides += `<div class="${CLASSES.slide}">${slide.outerHTML}</div>`;
        trackWidth += slide.offsetWidth;
        maxHeight = Math.max(maxHeight, slide.offsetHeight);

        if (this.hasBulletNavigation) {
          if (slideIndex === NUMBERS.NONE) {
            selectedKlass = ` ${CLASSES.bulletSelected}`;
          }
          bullets += `<li class="${CLASSES.bullet} ${selectedKlass}"></li>`;
        }
      });

      if (this.hasButtonNavigation) {
        buttons = `<div class="${CLASSES.button} ${CLASSES.buttonRight}"></div>
                  <div class="${CLASSES.button} ${CLASSES.buttonLeft}"></div>`;
      }

      if (this.hasBulletNavigation) {
        nav = `<nav class="${CLASSES.nav}">
                <ul class="${CLASSES.navWrapper}">${bullets}</ul>
                </nav>`;
      } else {
        nav = `<div class="${CLASSES.paginator}">
              <span class="${CLASSES.paginatorIndex}">${this.numItems}</span>
              <span class="${CLASSES.paginatorSeparator}">/</span>
              <span class="${CLASSES.paginatorTotal}">${this.numItems}</span>
         </div>`;
      }

      this.container.innerHTML = `<div class="${CLASSES.slider}">
        <div class="${CLASSES.trackWrapper}" style="height: ${maxHeight}px;">
            <div class="${CLASSES.track} ${CLASSES.trackAnimated}"
              style="width: ${trackWidth}px; height: ${maxHeight}px;">
                ${slides}
            </div>
        </div>
        ${buttons}
        ${nav}
      </div>`;

      this.updateComponents();
      this.addEventListeners();
      this.updateTrackPosition();
      this.updateBulletNavigation();
      this.updateArrowsVisibility();
    }
  }

  onClickOnRightButton() {
    this.next();
    const event = new Event('sliderchanged');
    this.container.dispatchEvent(event);
  }

  onClickOnLeftButton() {
    this.previous();
    const event = new Event('sliderchanged');
    this.container.dispatchEvent(event);
  }

  updateBulletNavigation() {
    if (this.hasBulletNavigation) {
      removeClass(this.container.querySelector(SELECTORS.bulletSelected), CLASSES.bulletSelected);
      addClass(this.container.querySelectorAll(SELECTORS.bullet)[this.currentItem],
        CLASSES.bulletSelected);
    } else {
      this.container.querySelector(SELECTORS.paginatorIndex).innerHTML =
        this.currentItem + NUMBERS.ONE;
    }
  }

  next() {
    if (this.currentItem < this.numItems - NUMBERS.ONE) {
      this.currentItem += 1;
    }

    this.updateTrackPosition();
    this.updateBulletNavigation();
    this.updateArrowsVisibility();
  }

  previous() {
    if (this.currentItem) {
      this.currentItem -= 1;
    }

    this.updateTrackPosition();
    this.updateBulletNavigation();
    this.updateArrowsVisibility();
  }

  updateArrowsVisibility() {
    if (this.DOM.leftButton) {
      if (this.currentItem) {
        removeClass(this.DOM.leftButton, COMMON_CLASSES.isHidden);
      } else {
        addClass(this.DOM.leftButton, COMMON_CLASSES.isHidden);
      }

      if (this.currentItem < this.numItems - NUMBERS.ONE) {
        removeClass(this.DOM.rightButton, COMMON_CLASSES.isHidden);
      } else {
        addClass(this.DOM.rightButton, COMMON_CLASSES.isHidden);
      }
    }
  }

  updateTrackPosition() {
    css(this.DOM.sliderTrack, 'transform', `translate(-${this.step * this.currentItem}px, 0);`);
  }

  onTouchDown(event) {
    this.isDragging = true;

    this.initialDraggingX = event.layerX;
    this.initialDraggingY = event.layerY;
    this.initialSliderX = this.step * this.currentItem;

    removeClass(this.DOM.sliderTrack, CLASSES.trackAnimated);

    this.DOM.slider.addEventListener('touchmove', this.onMouseMoveCached);
    this.DOM.slider.addEventListener('mousemove', this.onMouseMoveCached);
  }

  onTouchEnd() {
    this.DOM.slider.removeEventListener('touchmove', this.onMouseMoveCached);
    this.DOM.slider.removeEventListener('mousemove', this.onMouseMoveCached);

    this.isDragging = false;

    addClass(this.DOM.sliderTrack, CLASSES.trackAnimated);

    if (Math.abs(this.draggedDistance) > MIN_DRAGGED_DISTANCE) {
      if (this.draggedDistance < NUMBERS.NONE) {
        this.next();
      } else {
        this.previous();
      }
    } else {
      this.updateTrackPosition();
    }

    this.initialDraggingX = 0;
    this.initialDraggingY = 0;
    this.initialSliderX = 0;
    this.draggedDistance = 0;
  }

  onTouchMove(event) {
    event.preventDefault();

    const position = this.initialSliderX + (this.initialDraggingX - event.layerX);
    this.draggedDistance = event.layerX - this.initialDraggingX;

    css(this.DOM.sliderTrack, 'transform', `translate(${-position}px, 0);`);
  }

  onClickOnBullet(event) {
    this.currentItem = index(event.target, this.DOM.bulletsWrapper[NUMBERS.FIRST]) || NUMBERS.NONE;
    this.updateTrackPosition();
    this.updateBulletNavigation();
  }

  addEventListeners() {
    if (this.hasButtonNavigation) {
      this.DOM.rightButton.addEventListener('click', this.onClickOnRightButton.bind(this), false);
      this.DOM.leftButton.addEventListener('click', this.onClickOnLeftButton.bind(this), false);
    }

    this.DOM.slider.addEventListener('touchstart', this.onTouchDown.bind(this), false);
    this.DOM.slider.addEventListener('mousedown', this.onTouchDown.bind(this), false);
    this.DOM.slider.addEventListener('touchend', this.onTouchEnd.bind(this), false);
    this.DOM.slider.addEventListener('mouseup', this.onTouchEnd.bind(this), false);

    if (this.hasBulletNavigation) {
      addListener(this.DOM.bullets, 'click', this.onClickOnBullet.bind(this), false);
    }
  }

  removeEventListeners() {
    if (this.hasButtonNavigation) {
      this.DOM.rightButton.removeEventListener('click',
        this.onClickOnRightButton.bind(this),
        false);
      this.DOM.leftButton.removeEventListener('click', this.onClickOnLeftButton.bind(this), false);
    }

    this.DOM.slider.removeEventListener('touchstart', this.onTouchDown.bind(this), false);
    this.DOM.slider.removeEventListener('mousedown', this.onTouchDown.bind(this), false);
    this.DOM.slider.removeEventListener('touchend', this.onTouchEnd.bind(this), false);
    this.DOM.slider.removeEventListener('mouseup', this.onTouchEnd.bind(this), false);

    if (this.hasBulletNavigation) {
      removeListener(this.DOM.bullets, 'click', this.onClickOnBullet.bind(this), false);
    }
  }

  updateComponents() {
    this.DOM.slider = this.container.querySelector(SELECTORS.slider);
    this.DOM.leftButton = this.container.querySelector(SELECTORS.buttonLeft);
    this.DOM.rightButton = this.container.querySelector(SELECTORS.buttonRight);
    this.DOM.sliderTrack = this.container.querySelector(SELECTORS.track);
    this.DOM.bullets = this.container.querySelectorAll(SELECTORS.bullet);
    this.DOM.bulletsWrapper = this.container.querySelectorAll(SELECTORS.navWrapper);
  }

  destroy() {
    if (this.numItems > NUMBERS.ONE) {
      let html = '';
      this.children.map((slide) => {
        html += slide.outerHTML;
      });

      this.container.innerHTML = html;

      this.removeEventListeners();
    }
  }
}

module.exports = Slider;

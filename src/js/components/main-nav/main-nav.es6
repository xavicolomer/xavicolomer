import {
  css,
  removeClass,
  addClass,
  onTransitionEnd,
  addListener,
  elementHasParent,
  parent
} from '../../util/html.es6';
import { isMobile } from '../../util/viewport.es6';
import { easeInOutCubic } from '../../util/easing.es6';
import { COMMON_CLASSES, COMMON_ATTRIBUTES, NUMBERS } from '../../config/common.es6';
import { BASE, CLASSES, SELECTORS, ATTRIBUTES } from './config.es6';

const INITIAL_SCROLL_POSITION = 0;
const MIN_SCROLLED_DISTANCE = 1;

class MainNav {
  constructor() {
    this.DOM = {};

    this.el = document.querySelectorAll(`[${COMMON_ATTRIBUTES.init}="${BASE}"]`)[NUMBERS.FIRST];
    if (!this.el) {
      return;
    }

    this.DOM.body = document.querySelectorAll(COMMON_CLASSES.body)[NUMBERS.FIRST];
    this.DOM.menuMobile = document.querySelectorAll(SELECTORS.menuMobile)[NUMBERS.FIRST];
    this.DOM.menu = document.querySelectorAll(SELECTORS.menu)[NUMBERS.FIRST];
    this.DOM.anchors = document.querySelectorAll(`[${ATTRIBUTES.navTarget}]`);

    this.scrollAfterCloseMenu = -1;
    this.currentOffsetIndex = -1;
    this.offsets = [];

    if (this.DOM.menuMobile) {
      this.DOM.menuMobile.addEventListener('touchmove', this.onScroll);
    }

    document.addEventListener('oncontextchange', this.onContextChange.bind(this), false);
    document.addEventListener('onwindowscroll', this.onWindowScroll.bind(this), false);
    addListener(this.DOM.anchors, 'click', this.onClickOnMenuItem.bind(this), false);

    this.onContextChange({ detail: { isMobile: isMobile() }});

    this.updateBreakpoints();
  }

  animateScrollTo(position) {
    const start = Date.now();
    const duration = 700;
    const initialPosition = window.pageYOffset;
    const distance = position - initialPosition;

    const update = () => {
      const p = (Date.now() - start) / duration;

      if (p > MIN_SCROLLED_DISTANCE) {
        window.scrollTo(INITIAL_SCROLL_POSITION, initialPosition + distance);
      } else {
        requestAnimationFrame(update);
        window.scrollTo(INITIAL_SCROLL_POSITION, initialPosition + (distance * easeInOutCubic(p)));
      }
    };

    update();

    this.scrollAfterCloseMenu = -1;
  }

  onClickOnMenuItem(event) {
    const anchorId = event.target.attributes[ATTRIBUTES.navTarget];
    let isMobileMenuItem = false;
    let anchor;

    isMobileMenuItem = elementHasParent(event.target, this.DOM.menuMobile);

    if (typeof anchorId !== 'undefined' && anchorId.value !== '') {
      anchor = document.querySelector(`[href="#${anchorId.value}"]`);

      if (typeof anchor !== 'undefined') {
        const margin = 4;
        const parentSection = parent(anchor, COMMON_CLASSES.mainSection);
        const top = parentSection.getBoundingClientRect().top + margin;
        const position = top + window.pageYOffset - this.DOM.menu.offsetHeight;

        if (isMobileMenuItem) {
          this.scrollAfterCloseMenu = position;
          this.onClickOnMenuCloseButton();
        } else {
          this.animateScrollTo(position);
        }
      }
    }
  }

  getCurrentOffsetIndex() {
    const currentY = window.pageYOffset;

    if (currentY < this.offsets[NUMBERS.FIRST]) {
      return NUMBERS.NONE;
    }

    for (let i = 0, len = this.offsets.length; i < len - NUMBERS.ONE; ++i) {
      if (currentY > this.offsets[i] && currentY < this.offsets[i + NUMBERS.ONE]) {
        return i + NUMBERS.ONE;
      }
    }

    return this.offsets.length;
  }

  updateBreakpoints() {
    const offsetElements = document.querySelectorAll('[href^="#"]');

    this.offsets = [];

    for (let i = 0, len = offsetElements.length; i < len; ++i) {
      const parentSection = parent(offsetElements[i], COMMON_CLASSES.mainSection);
      const top = parentSection.getBoundingClientRect().top + NUMBERS.ONE;
      const position = top + window.pageYOffset - this.DOM.menu.offsetHeight;

      this.offsets.push(position);
    }
  }

  onWindowScroll() {
    const newIndex = this.getCurrentOffsetIndex();

    if (this.currentOffsetIndex !== newIndex) {
      removeClass(document.querySelectorAll(SELECTORS.menuNavItemSelected),
          CLASSES.menuNavItemSelected);

      if (newIndex === NUMBERS.FIRST) {
        addClass(document.querySelectorAll(`${SELECTORS.menuNavItem}:first-child`),
          CLASSES.menuNavItemSelected);
      } else {
        addClass(document.querySelectorAll(`${SELECTORS.menuNavItem}:nth-child(${newIndex})`),
          CLASSES.menuNavItemSelected);
      }

      this.currentOffsetIndex = newIndex;
    }
  }

  buildMobile() {
    this.DOM.menuButton = this.el.querySelectorAll(SELECTORS.menuMobileButton)[NUMBERS.FIRST];
    this.DOM.closeButton = this.el.querySelectorAll(SELECTORS.menuMobileCloseButton)[NUMBERS.FIRST];

    this.DOM.menuButton.addEventListener('click', this.onClickOnMenuButton.bind(this));
    this.DOM.closeButton.addEventListener('click', this.onClickOnMenuCloseButton.bind(this));
  }

  onScroll(event) {
    event.preventDefault();
  }

  onClickOnMenuButton() {
    const width = document.documentElement.clientWidth;

    css(this.DOM.menuMobile, 'top', `${window.pageYOffset}px;`);
    addClass(this.DOM.body, COMMON_CLASSES.bodyAnimated);
    addClass(this.DOM.body, COMMON_CLASSES.bodyNoScroll);
    css(this.DOM.body, 'transform', `translate(-${width}px, 0)`);
  }

  onCloseAnimComplete() {
    css(this.DOM.body, 'transform', '');
    removeClass(this.DOM.body, COMMON_CLASSES.bodyAnimated);
    removeClass(this.DOM.body, COMMON_CLASSES.bodyNoScroll);

    if (this.scrollAfterCloseMenu !== NUMBERS.NOT_FOUND) {
      this.animateScrollTo(this.scrollAfterCloseMenu);
    }
  }

  onClickOnMenuCloseButton() {
    onTransitionEnd(this.DOM.body, this.onCloseAnimComplete.bind(this), 'transform');
    css(this.DOM.body, 'transform', 'translate(0, 0)');
  }

  buildDesktop() {}

  onContextChange(event) {
    if (event.detail.isMobile) {
      this.buildMobile();
    } else {
      this.buildDesktop();
    }
  }
}

module.exports = MainNav;

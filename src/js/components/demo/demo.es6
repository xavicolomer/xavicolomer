import { addListener } from '../../util/html.es6';
import { isMobile } from '../../util/viewport.es6';
import { COMMON_CLASSES, COMMON_ATTRIBUTES, NUMBERS } from '../../config/common.es6';
import { BASE, CLASSES } from './config.es6';

let isDemoAlreadyOpen = false;

class Demo {
  constructor() {
    this.elements = document.querySelectorAll(`[${COMMON_ATTRIBUTES.init}="${BASE}"]`);

    this.cachedCloseFunction = this.onClickOnCloseDemo.bind(this);

    if (this.elements) {
      addListener(this.elements, 'click', this.onClickOnDemoButton.bind(this), false);
    }
  }

  onClickOnDemoButton(event) {
    if (!isMobile()) {
      if (!isDemoAlreadyOpen) {
        const data = JSON.parse(event.currentTarget.getAttribute(COMMON_ATTRIBUTES.initOptions));
        const klass = document.getElementsByTagName(COMMON_CLASSES.body)[NUMBERS.FIRST].className;

        isDemoAlreadyOpen = true;

        document.addEventListener('onescape', this.cachedCloseFunction);

        this.wrapper = document.createElement('div');
        this.wrapper.className = `${COMMON_CLASSES.component} ${CLASSES.demoContainer}`;
        this.wrapper.innerHTML =
          `</div>
            <div class="${COMMON_CLASSES.component} ${CLASSES.demoCloseButton}">
              <span class="icon icon-close"></span>
            </div>
            <div class="${COMMON_CLASSES.component} ${CLASSES.demoWrapper}"></div>`;

        document.body.insertBefore(this.wrapper, document.body.childNodes[NUMBERS.FIRST]);
        this.closeButton = document.getElementsByClassName(CLASSES.demoCloseButton)[NUMBERS.FIRST];

        document.getElementsByClassName(CLASSES.demoWrapper)[NUMBERS.FIRST].innerHTML =
          `<iframe src="${data.url}" width="100%" height="100%" allowTransparency="true"></iframe>`;
        this.closeButton.addEventListener('click', this.onClickOnCloseDemo.bind(this), false);

        document.getElementsByTagName(COMMON_CLASSES.body)[NUMBERS.FIRST].className =
          `${klass} ${COMMON_CLASSES.bodyNoScroll}`;
      }
    }
  }

  onClickOnCloseDemo() {
    const klass = document.getElementsByTagName(COMMON_CLASSES.body)[NUMBERS.FIRST].className;
    this.closeButton.removeEventListener('click', this.onClickOnCloseDemo.bind(this), false);

    document.body.removeChild(this.wrapper);
    document.removeEventListener('onescape', this.cachedCloseFunction);
    document.getElementsByTagName(COMMON_CLASSES.body)[NUMBERS.FIRST].className =
      klass.replace(COMMON_CLASSES.bodyNoScroll, '');

    isDemoAlreadyOpen = false;
  }
}

module.exports = Demo;


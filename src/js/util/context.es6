import { XS, SM, LG, breakpoints } from '../config/context.es6';

const timeoutMs = 66;
const ESC_KEY = 27;
let resizeTimeout;
let scrollTimeout;

const getViewportSize = () => {
  const width = document.documentElement.clientWidth;

  if (width < XS) {
    return XS;
  }

  for (let i = 0, len = breakpoints.length; i < len - 1; ++i) {
    if (width > breakpoints[i] && width <= breakpoints[i + 1]) {
      return breakpoints[i];
    }
  }

  return LG;
};

let viewportSize = getViewportSize();

const resizeThrottler = () => {
  const newViewportSize = getViewportSize();

  if (!resizeTimeout) {
    resizeTimeout = setTimeout(() => {
      resizeTimeout = null;
      const event = new Event('onwindowresize');
      document.dispatchEvent(event);

      if (viewportSize !== newViewportSize) {
        const customEvent = document.createEvent('CustomEvent');
        customEvent.initCustomEvent('onmqchange', true, true, { mq: getViewportSize() });
        document.dispatchEvent(customEvent);
      }

      if (viewportSize < SM && newViewportSize >= SM) {
        const customEvent = document.createEvent('CustomEvent');
        customEvent.initCustomEvent('oncontextchange', true, true, { isMobile: false });
        document.dispatchEvent(customEvent);
      }

      if (viewportSize >= SM && newViewportSize < SM) {
        const customEvent = document.createEvent('CustomEvent');
        customEvent.initCustomEvent('oncontextchange', true, true, { isMobile: true });
        document.dispatchEvent(customEvent);
      }

      viewportSize = newViewportSize;
    }, timeoutMs);
  }
};

const scrollThrottler = () => {
  if (!scrollTimeout) {
    scrollTimeout = setTimeout(() => {
      scrollTimeout = null;
      const event = new Event('onwindowscroll');
      document.dispatchEvent(event);
    }, timeoutMs);
  }
};

const onKeyUp = (event) => {
  if (event.keyCode === ESC_KEY) {
    const customEvent = document.createEvent('CustomEvent');
    customEvent.initCustomEvent('onescape', true, true, {});
    document.dispatchEvent(customEvent);
  }
};

window.addEventListener('resize', resizeThrottler, false);
window.addEventListener('scroll', scrollThrottler, false);
window.addEventListener('keyup', onKeyUp, false);

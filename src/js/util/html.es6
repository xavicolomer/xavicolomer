const prfxs = {
  transform: [
    'transform',
    '-ms-transform',
    '-webkit-transform'
  ]
};

const liveCallbacks = {};
const NOT_FOUND = -1;
const NONE = 0;
const ONE = 1;

document.addEventListener('click', (event) => {
  const el = event.target;
  const className = el.className + ' ';

  for (let klass in liveCallbacks) {
    if (liveCallbacks[klass]) {
      if (className.indexOf(klass + ' ') !== NOT_FOUND) {
        for (let i = 0, len = liveCallbacks[klass].length; i < len; ++i) {
          liveCallbacks[klass][i](event);
        }
      }
    }
  }
});

const UTILS = {
  prfxr: (style, value) => {
    let result = '';

    if (value === '') {
      return result;
    }

    if (prfxs[style]) {
      for (let i = 0, len = prfxs[style].length; i < len; ++i) {
        result += `${prfxs[style][i]}: ${value};`;
      }
    } else {
      result += `${style}: ${value};`;
    }

    return result;
  },

  css: function (element, style, value) {
    let result = '';

    if (element.style.length) {
      for (let i = 0; i < element.style.length; ++i) {
        if (element.style[i] !== style) {
          result += UTILS.prfxr(element.style[i], element.style[element.style[i]]);
        }
        result += UTILS.prfxr(style, value);
      }
    } else {
      result += UTILS.prfxr(style, value);
    }

    element.setAttribute('style', result);
  },

  index: (childElement, parentElement) =>
    Array.prototype.indexOf.call(parentElement.children, childElement),

  addClass: (elements, klass) => {
    elements = UTILS.ensureElementsArray(elements);

    for (let i = 0, len = elements.length; i < len; ++i) {
      if (elements[i].className.indexOf(klass) === NOT_FOUND) {
        elements[i].className = elements[i].className + ' ' + klass;
      }
    }
  },

  removeClass: function (elements, klass) {
    elements = UTILS.ensureElementsArray(elements);

    for (let i = 0, len = elements.length; i < len; ++i) {
      elements[i].className = elements[i].className.replace(klass, '').replace(/( +) /gm, ' ');
    }
  },

  hasClass: (element, klass) => {
    let className = element.className + ' ';
    return className.indexOf(klass + ' ') !== NOT_FOUND;
  },

  ensureElementsArray: (elements) => {
    let elementsArray = [];

    if (elements.length === NONE) {
      return elementsArray;
    }

    if (!Array.isArray(elements)) {
      if (elements.length) {
        for (let i = 0, len = elements.length; i < len; ++i) {
          elementsArray.push(elements[i]);
        }
      } else {
        elementsArray.push(elements);
      }
    } else {
      elementsArray = elements;
    }

    return elementsArray;
  },

  addGlobalListener: (klass, callback) => {
    if (liveCallbacks[klass]) {
      liveCallbacks[klass].push(callback);
    } else {
      liveCallbacks[klass] = [callback];
    }
  },

  removeGlobalListener: (klass, callback) => {
    if (liveCallbacks[klass]) {
      if (liveCallbacks[klass].length > ONE) {
        for (let i = 0, len = liveCallbacks[klass].length; i < len; ++i) {
          if (liveCallbacks[klass][i] === callback) {
            liveCallbacks[klass][i].splice(i, ONE);
          }
        }
      } else {
        delete liveCallbacks[klass];
      }
    }
  },

  addListener: (elements, eventType, listener, deep) => {
    elements = UTILS.ensureElementsArray(elements);

    for (let i = 0, len = elements.length; i < len; ++i) {
      elements[i].addEventListener(eventType, listener, deep);
    }
  },

  removeListener: (elements, eventType, listener) => {
    elements = UTILS.ensureElementsArray(elements);

    for (let i = 0, len = elements.length; i < len; ++i) {
      elements[i].removeEventListener(eventType, listener);
    }
  },

  onTransitionEnd: (element, callback, transitionType) => {
    const events = 'webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd'.split(' ');

    const onTransitionComplete = (event) => {
      if (typeof transitionType === 'undefined' || event.propertyName === transitionType) {
        for (let i = 0, len = events.length; i < len; ++i) {
          element.removeEventListener(events[i], onTransitionComplete, false);
        }

        callback();
      }
    };

    for (let i = 0, len = events.length; i < len; ++i) {
      element.addEventListener(events[i], onTransitionComplete, false);
    }
  },

  parents: (el, parentSelector) => {
    if (parentSelector === undefined) {
      parentSelector = document;
    }

    const parents = [];
    let p = el.parentNode;

    while (p !== parentSelector && p.parentNode) {
      const o = p;
      parents.push(o);
      p = o.parentNode;
    }
    parents.push(parentSelector);

    return parents;
  },

  parent: (el, selector) => {
    let p = el.parentNode;

    while (p !== document && p.parentNode) {
      const o = p;
      const klass = p.className + ' ';

      if (klass.indexOf(selector + ' ') !== NOT_FOUND) {
        return p;
      }

      p = o.parentNode;
    }

    return null;
  },

  elementHasParent: (el, parentSelector) => {
    const parents = [];
    let p = el.parentNode;

    while (p !== parentSelector && p.parentNode) {
      const o = p;
      parents.push(o);
      p = o.parentNode;
    }

    if (p === parentSelector) {
      return true;
    }

    return false;
  }
};

module.exports = UTILS;

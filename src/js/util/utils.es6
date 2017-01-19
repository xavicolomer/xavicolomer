let UTILS = {
  classesToSelectors: function (classes) {
    let selectors = {};

    for (let klass in classes) {
      if (classes[klass]) {
        selectors[klass] = '.' + classes[klass];
      }
    }

    return selectors;
  }
};

module.exports = UTILS;

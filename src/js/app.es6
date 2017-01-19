import './util/context.es6';

window.app = window.app || {};

import ContactForm from './components/contact-form/contact-form.es6';
import Demo from './components/demo/demo.es6';
import MainNav from './components/main-nav/main-nav.es6';
import MediaGallery from './components/media-gallery/media-gallery.es6';
import MediaZoom from './components/media-zoom/media-zoom.es6';
import VideoPlayer from './components/videoplayer/videoplayer.es6';

class App {
  constructor() {
    new Demo();
    new MainNav();
    new MediaGallery();
    new MediaZoom();
    new ContactForm();
    new VideoPlayer();
  }
}

window.onload = function () {
  new App();
};



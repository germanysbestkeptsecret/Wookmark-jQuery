/*global requirejs, define, window, document*/
requirejs.config({
  "paths": {
    "jquery": "../bower_components/jquery/dist/jquery.min",
    "imagesLoaded": "../bower_components/imagesloaded/imagesloaded.pkgd.min",
    "wookmark": "../wookmark",
    "magnificPopup": "../bower_components/magnific-popup/dist/jquery.magnific-popup.min"
  },
  "shim": {
    "magnificPopup": ["jquery"],
    "imagesLoaded": ["jquery"]
  }
});

// Define the window and document modules so they are available for the Wookmark plugin
define('window', function () {
  return window;
});

define('document', function () {
  return document;
});

requirejs(['jquery', 'imagesLoaded', 'wookmark', 'magnificPopup'], function ($, imagesLoaded, Wookmark) {
  imagesLoaded('#container', function () {
    var wookmark = new Wookmark('#container');

    // Init lightbox
    $('#container').magnificPopup({
      delegate: 'li:not(.inactive) a',
      type: 'image',
      gallery: {
        enabled: true
      }
    });
  });
});

requirejs.config({
  "paths": {
    "jquery": "../libs/jquery.min",
    "imagesLoaded": "../libs/jquery.imagesloaded",
    "wookmark": "../jquery.wookmark",
    "colorbox": "../libs/jquery.colorbox-min"
  },
  "shim": {
    "colorbox": ["jquery"],
    "imagesLoaded": ["jquery"]
  }
});

requirejs(['jquery', 'imagesLoaded', 'wookmark', 'colorbox'], function($) {
  $('#tiles').imagesLoaded(function() {
    // Prepare layout options.
    var options = {
      autoResize: true, // This will auto-update the layout when the browser window is resized.
      container: $('#main'), // Optional, used for some extra CSS styling
      offset: 2, // Optional, the distance between grid items
      itemWidth: 210 // Optional, the width of a grid item
    };

    // Get a reference to your grid items.
    var handler = $('#tiles li');

    // Call the layout function.
    handler.wookmark(options);

    // Init lightbox
    $('a', handler).colorbox({
      rel: 'lightbox'
    });
  });
});

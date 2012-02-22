jQuery Wookmark
===============

This is a [jQuery](http://www.jquery.com) plugin for laying out a dynamic grid of elements.

See the [documentation page](http://www.wookmark.com/jquery-plugin) for examples.

The repository also includes two functional examples. All images used in the example are copyrighted 
by their respective owners and only included for showcasing plugin functionality.


Installation
------------

### Prequisites

 * [jQuery](http://www.jquery.com) - 1.4.3 or better
 
### Required files

Copy `jquery.wookmark.js` to your javascript folder.


Usage
-----

The plugin can be called with jQuery in different ways.
    
### Standard call with default settings:

    $('.myElements').wookmark();
    
Where `myElement` is the class of the items you want to lay out in a grid.

### Options

    $('.myElements').wookmark({
      container: $('#myContent'),
      offset: 5,
      itemWidth: 200,
      autoResize: true
    });

See the [documentation page](http://www.wookmark.com/jquery-plugin) for details on available options.

Included examples
-----------------

/example
Is the preferred setup. In this scenario the width and height of all images is set in the HTML img attributes. 
The grid layout can be performed as soon as the document is rendered, BEFORE images are loaded.

/example-load-images
In this example, the width and height of the images is not known. Via Paul Irish's imagesLoaded plugin (slightly
modified by desandro). The grid layout is performed after all images are loaded and their dimensions can be
retrieved. This approach is much slower. The imagesLoaded plugin can also be found on github right here:
https://gist.github.com/797120


Feedback
--------

Please send me an [email](chri@sto.ph) with any feedback you have or contact me on twitter @gbks.

Contributing
------------

Contribute!
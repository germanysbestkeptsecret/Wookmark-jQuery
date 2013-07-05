jQuery Wookmark
===============

This is a [jQuery](http://www.jquery.com) plugin for laying out a dynamic grid of elements.

See the [documentation page](http://www.wookmark.com/jquery-plugin) for examples.

The repository also includes two functional examples. All images used in the example are copyrighted
by their respective owners and only included for showcasing plugin functionality.


Do you like this project?
[Buy me a beer](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=TSN2TDYNKZHF4)

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
      align: 'center',
      autoResize: false,
      container: $('#myContent'),
      itemWidth: 0,
      offset: 2,
      resizeDelay: 50,
      flexibleWidth: 0,
      onLayoutChanged: undefined,
      fillEmptySpace: false
    });

See the [documentation page](http://www.wookmark.com/jquery-plugin) for details on available options.

#### itemWidth and flexibleWidth

These values can be given as numbers which will be interpreted as pixels or you can use percentage strings like '20%'.
If you use a percentage string for itemWidth the number of columns will be fixed and items may overlap if the viewport is small.
When flexibleWidth is set an itemWidth != 0 is used as minimum item width.

### Refresh trigger

Elements which are hidden have cannot be laid out until they are visible. If you use wookmark on a hidden tab layout will not be immediately performed. When the tab is made visible you can manually refresh wookmark using a trigger on your container.

    $('#myContent').trigger('refreshWookmark');

### fillEmptySpace

This creates placeholders at the bottom of each column to create an even layout. See 'example-placeholder' on how to use it. These placeholders use the css class 'wookmark-placeholder'. You can overwrite it in your own css to fit your needs.

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


FAQ
--------

### The tiles overlap after loading.

You should use the 'imagesloaded' plugin. Most the examples in this package include the code how to use it.

### The tiles overlap after their height is changed.

Use the 'finished'-callback of your animation/effect to trigger 'refreshWookmark' on the container element supplied to the plugin.

### The placeholders at the end of each column have wrong heights or positions.

Set 'position: relative' on your container element and check if there are other elements in the container before your tiles.

### My question isn't answered here.

Send us some feedback or create an issue on github.

Feedback
--------

Please send code specific questions and feedback to [Sebastian](mailto:sebastian@helzle.net) or contact him on [twitter](http://twitter.com/sebobo).

If you have other questions and feedback which is for example related to Wookmark send a mail to [Christoph](mailto:chri@sto.ph) or contact him on [twitter](https://twitter.com/gbks).

Contributing
------------

Contribute!

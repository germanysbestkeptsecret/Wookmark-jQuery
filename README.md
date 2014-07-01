[![Stories in Ready](https://badge.waffle.io/gbks/wookmark-jquery.png?label=ready&title=Ready)](https://waffle.io/gbks/wookmark-jquery)
jQuery Wookmark
===============

This is a [jQuery](http://www.jquery.com) plugin for laying out a dynamic grid of elements.

See the [documentation page](http://www.wookmark.com/jquery-plugin) for examples.

The repository also includes many functional examples. All images used in the example are copyrighted
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
      comparator: null,
      container: $('body'),
      direction: undefined,
      ignoreInactiveItems: true,
      itemWidth: 0,
      fillEmptySpace: false,
      flexibleWidth: 0,
      offset: 2,
      onLayoutChanged: undefined,
      outerOffset: 0,
      possibleFilters: [],
      resizeDelay: 50,
      verticalOffset: undefined
    });

See the [documentation page](http://www.wookmark.com/jquery-plugin) for details on available options.

#### itemWidth and flexibleWidth

These values can be given as numbers which will be interpreted as pixels or you can use percentage strings like '20%'.
When `flexibleWidth` is set an `itemWidth` != 0 is used as minimum item width. As example using a `flexibleWidth` of 40% will result in two columns with 10% space to the sides of the container.

#### offset, outerOffset and verticalOffset

`offset` is the horizontal and vertical space between two tiles.
`outerOffset` is the space between the outer tiles and the parent container.
`verticalOffset` is optional and can be set to achieve a vertical offset between two tiles which is different from `offset`.

#### fillEmptySpace

This creates placeholders at the bottom of each column to create an even layout. See `example-placeholder` on how to use it. These placeholders use the css class `wookmark-placeholder`. You can overwrite it in your own css to fit your needs.

#### ignoreInactiveItems

When set to `false` inactive items will still be shown when filtered. This can be used to fade out filtered items. See the example-filter/fade.html example.

#### comparator

You can use this option to provide a custom comparator function which the plugin will use to sort the tiles. See example-sort or example-stamp on how to use it.

### Refresh trigger

Elements which are hidden have cannot be laid out until they are visible. If you use wookmark on a hidden tab layout will not be immediately performed. When the tab is made visible you can manually refresh wookmark using a trigger on your container.

    $('#myContent').trigger('refreshWookmark');

### Filter

You can filter all items of the handler when they have filters specified. See `example-filter` for details how to do this.
The call to filter will also return the resulting list of items.

    handler.wookmarkInstance.filter([filters=[]][,mode='or'][,dryRun=false]);

If you just want to check if there would be a resulting list of items you can call filter with the `dryRun` option set to `true`.

Included examples
-----------------

### example

Is the preferred setup. In this scenario the width and height of all images is set in the HTML img attributes.
The grid layout can be performed as soon as the document is rendered, BEFORE images are loaded.

### example-load-images

In this example, the width and height of the images is not known. Via Paul Irish's imagesLoaded plugin (slightly
modified by desandro). The grid layout is performed after all images are loaded and their dimensions can be
retrieved. This approach is much slower. The imagesLoaded plugin can also be found on github right here:
https://gist.github.com/797120

### example-amd

This example shows how to load and initialize the plugin when using `require.js` or a different amd loading method.

### example-api

This example shows how to load the tile data from a remote api and layout it.

### example-endless-scroll

This example shows how to add new tiles at runtime and refresh the layout.

### example-filter

This example shows to use the `filter` feature of the plugin to show just the tiles the user wants.

### example-flexible

This example shows how to use the `flexibleWidth` option. This option allows your tiles to grow a certain amount, as long as there is room. When using percentage values for the width options you can create a fixed column count layout.

### example-lightbox

This example shows you how to include a lightbox.

### example-placeholder

This example shows you how to enable placeholders at the bottom of the tile layout to create an even footer.

### example-sort

This example shows how the `sort` feature works. This option allows you to specify a sorting function which will rearrange your tiles.
For example you can use it to sort your tiles containing products by price, popularity or name.

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

Mentioned or used by others
---------------------------

Beware: These links lead to sites which are not necessarily related to the authors of the Wookmark plugin so we don't have any control over their content.

 * [Customize the plugin online with bitconfig](http://bitconfig.com/woomark/bitconfig_woomark.html)
 * [TYPO3 extension for YAG](http://typo3.org/extensions/repository/view/yag_themepack_jquery)
 * [Drupal Wookmark plugin](https://drupal.org/project/views_wookmark)
 * [Tumblr template example](http://theme-hunter.tumblr.com/post/31126746878/creating-tumblr-grid-layouts-with-wookmark)

Send a [message](mailto:sebastian@helzle.net) if you want to be included with your site on this list!

Feedback
--------

Please send code specific questions and feedback to [Sebastian](mailto:sebastian@helzle.net) or contact him on [twitter](http://twitter.com/sebobo).

If you have other questions and feedback which is for example related to Wookmark send a mail to [Christoph](mailto:chri@sto.ph) or contact him on [twitter](https://twitter.com/gbks).

Contributing
------------

Contribute!

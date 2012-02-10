jQuery Wookmark
===============

This is a [jQuery](http://www.jquery.com) plugin for laying out a dynamic grid of elements.

See the [documentation page](http://www.wookmark.com/jquery-plugin) for examples.
The repository also includes a working example.


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

Feedback
--------

Please send me an [email](chri@sto.ph) with any feedback you have or contact me on twitter @gbks.

Contributing
------------

Contribute!
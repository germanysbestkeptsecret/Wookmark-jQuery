/*!
  jQuery Wookmark plugin
  @name jquery.wookmark.js
  @author Christoph Ono (chri@sto.ph or @gbks)
  @author Sebastian Helzle (sebastian@helzle.net or @sebobo)
  @version 1.1.1
  @date 4/14/2013
  @category jQuery plugin
  @copyright (c) 2009-2013 Christoph Ono (www.wookmark.com)
  @license Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
*/
(function($){

  var Wookmark, defaultOptions, __bind;

  __bind = function(fn, me) {
    return function() {
      return fn.apply(me, arguments);
    };
  };

  // Wookmark default options
  defaultOptions = {
    align: 'center',
    container: $('body'),
    offset: 2,
    autoResize: false,
    itemWidth: 0,
    flexibleWidth: 0,
    resizeDelay: 50,
    onLayoutChanged: undefined
  };

  Wookmark = (function(options) {

    function Wookmark(handler, options) {
      this.handler = handler;

      // Layout variables.
      this.columns = null;
      this.containerWidth = null;
      this.resizeTimer = null;
      this.direction = 'left';

      $.extend(true, this, defaultOptions, options);

      // Bind methods
      this.update = __bind(this.update, this);
      this.onResize = __bind(this.onResize, this);
      this.getItemWidth = __bind(this.getItemWidth, this);
      this.layout = __bind(this.layout, this);
      this.layoutFull = __bind(this.layoutFull, this);
      this.layoutColumns = __bind(this.layoutColumns, this);
      this.clear = __bind(this.clear, this);

      // Listen to resize event if requested.
      if (this.autoResize) {
        $(window).bind('resize.wookmark', this.onResize);
        this.container.bind('refreshWookmark', this.onResize);
      };
    };

    // Method for updating the plugins options
    Wookmark.prototype.update = function(options) {
      $.extend(true, this, options);
    };

    // This timer ensures that layout is not continuously called as window is being dragged.
    Wookmark.prototype.onResize = function() {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(this.layout, this.resizeDelay);
    };

    // Method to get the standard item width
    Wookmark.prototype.getItemWidth = function() {
      if (this.itemWidth === undefined || this.itemWidth === 0) {
        return this.handler.eq(0).outerWidth();
      }
      else if (typeof this.itemWidth == 'string' && this.itemWidth.indexOf('%') >= 0) {
        return parseFloat(this.itemWidth) / 100 * this.container.width();
      }
      return this.itemWidth;
    };

    // Method to get the flexible item width
    Wookmark.prototype.getFlexibleWidth = function() {
      var containerWidth = this.container.width(),
          flexibleWidth = this.flexibleWidth;

      if (typeof flexibleWidth == 'string' && flexibleWidth.indexOf('%') >= 0) {
        flexibleWidth = parseFloat(flexibleWidth) / 100 * containerWidth;
        flexibleWidth -= this.handler.eq(0).outerWidth() - this.handler.eq(0).innerWidth();
      }

      var columns = Math.floor(1 + containerWidth / (flexibleWidth + this.offset)),
          columnWidth = (containerWidth - (columns - 1) * this.offset) / columns;

      return Math.floor(columnWidth);
    };

    // Main layout methdd.
    Wookmark.prototype.layout = function() {
      // Do nothing if container isn't visible
      if(!this.container.is(":visible")) {
        return;
      }

      // Calculate flexible item width if option is set
      if (this.flexibleWidth) {
        this.itemWidth = this.getFlexibleWidth();
        // Stretch items to fill calculated width
        this.handler.css('width', this.itemWidth);
      }

      // Calculate basic layout parameters.
      var columnWidth = this.getItemWidth() + this.offset,
          containerWidth = this.container.width(),
          columns = Math.floor((containerWidth + this.offset) / columnWidth),
          offset = 0,
          maxHeight = 0;

      // Use less columns if there are to few items
      columns = Math.min(columns, this.handler.length);

      // Calculate the offset based on the alignment of columns to the parent container
      if (this.align == 'left' || this.align == 'right') {
        offset = Math.floor((columns / columnWidth + this.offset) / 2);
      } else {
        offset = Math.round((containerWidth - (columns * columnWidth - this.offset)) / 2);
      }

      // Get direction for positioning
      this.direction = this.align == 'right' ? 'right' : 'left';

      // If container and column count hasn't changed, we can only update the columns.
      if(this.columns != null && this.columns.length == columns) {
        maxHeight = this.layoutColumns(columnWidth, offset);
      } else {
        maxHeight = this.layoutFull(columnWidth, columns, offset);
      }

      // Set container height to height of the grid.
      this.container.css('height', maxHeight);

      if (this.onLayoutChanged !== undefined && typeof this.onLayoutChanged === 'function') {
        this.onLayoutChanged();
      }
    };

    /**
     * Perform a full layout update.
     */
    Wookmark.prototype.layoutFull = function(columnWidth, columns, offset) {
      var item, top, left, i = 0, k = 0 , j = 0,
          length = this.handler.length,
          shortest = null, shortestIndex = null,
          itemCSS = {position: 'absolute'},
          sideOffset, heights = [],
          leftAligned = this.align == 'left' ? true : false;

      this.columns = [];

      // Prepare arrays to store height of columns and items.
      while (heights.length < columns) {
        heights.push(0);
        this.columns.push([]);
      }

      // Loop over items.
      for (; i < length; i++ ) {
        item = this.handler.eq(i);

        // Find the shortest column.
        shortest = heights[0];
        shortestIndex = 0;
        for (k = 0; k < columns; k++) {
          if (heights[k] < shortest) {
            shortest = heights[k];
            shortestIndex = k;
          }
        }

        // stick to left side if alignment is left and this is the first column
        if (shortestIndex == 0 && leftAligned) {
          sideOffset = 0;
        } else {
          sideOffset = shortestIndex * columnWidth + offset;
        }

        // Position the item.
        itemCSS[this.direction] = sideOffset;
        itemCSS.top = shortest;
        item.css(itemCSS);

        // Update column height and store item in shortest column
        heights[shortestIndex] += item.outerHeight() + this.offset;
        this.columns[shortestIndex].push(item);
      }

      // Return longest column
      return Math.max.apply(Math, heights);
    };

    /**
     * This layout method only updates the vertical position of the
     * existing column assignments.
     */
    Wookmark.prototype.layoutColumns = function(columnWidth, offset) {
      var heights = [],
          i = 0, k = 0,
          column, item, itemCSS, sideOffset;

      for (; i < this.columns.length; i++) {
        heights.push(0);
        column = this.columns[i];
        sideOffset = i * columnWidth + offset;

        for (k = 0; k < column.length; k++) {
          item = column[k];
          itemCSS = {
            top: heights[i]
          };
          itemCSS[this.direction] = sideOffset;

          item.css(itemCSS);

          heights[i] += item.outerHeight() + this.offset;
        }
      }

      // Return longest column
      return Math.max.apply(Math, heights);
    };

    /**
     * Clear event listeners and time outs.
     */
    Wookmark.prototype.clear = function() {
      clearTimeout(this.resizeTimer);
      $(window).unbind('resize.wookmark', this.onResize);
      this.container.unbind('refreshWookmark', this.onResize);
    };

    return Wookmark;
  })();

  $.fn.wookmark = function(options) {
    // Create a wookmark instance if not available
    if (!this.wookmarkInstance) {
      this.wookmarkInstance = new Wookmark(this, options || {});
    } else {
      this.wookmarkInstance.update(options || {});
    }

    // Apply layout
    this.wookmarkInstance.layout();

    // Display items (if hidden) and return jQuery object to maintain chainability
    return this.show();
  };
})(jQuery);

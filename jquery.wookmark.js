/*!
  jQuery Wookmark plugin
  @name jquery.wookmark.js
  @author Christoph Ono (chri@sto.ph or @gbks)
  @author Sebastian Helzle (sebastian@helzle.net or @sebobo)
  @version 1.2.0
  @date 5/24/2013
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
      var self = this;
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
      this.filter = __bind(this.filter, this);
      this.clear = __bind(this.clear, this);
      this.getActiveItems = __bind(this.getActiveItems, this);

      // Filter variables
      this.filterClasses = {};

      // Iterate over items and read filter classes
      handler.each(function(i, item) {
        $item = $(item);
        itemFilterClasses = $item.data('filterClass');

        // Globally store each filter class as object and the fitting items in the array
        if (typeof itemFilterClasses == 'object' && itemFilterClasses.length > 0) {
          for (i in itemFilterClasses) {
            filterClass = $.trim(itemFilterClasses[i]).toLowerCase();
            if (!(filterClass in self.filterClasses)) {
              self.filterClasses[filterClass] = [];
            }
            self.filterClasses[filterClass].push($item[0]);
          }
        }
      });

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

    // This timer ensures that layout is not continuously called as window is being dragged.
    Wookmark.prototype.filter = function(filters, mode) {
      var activeFilters = [],
          activeItems = $(),
          i, j, k, filter;

      filters = filters || [];
      mode = mode || 'or';

      if (filters.length) {
        // Collect active filters
        for (i in filters) {
          filter = $.trim(filters[i].toLowerCase());
          if (filter in this.filterClasses) {
            activeFilters.push(this.filterClasses[filter]);
          }
        }

        // Get items for active filters with the selected mode
        if (mode == 'or' || activeFilters.length == 1) {
          for (i in activeFilters) {
            activeItems = activeItems.add(activeFilters[i]);
          }
        } else if (mode == 'and') {
          // Find shortest filter class
          var shortestFilterId = 0;

          for (i in activeFilters) {
            if (activeFilters[i].length < activeFilters[shortestFilterId].length) {
              shortestFilterId = i;
            }
          }

          // Iterate over shortest filter and find elements in other filter classes
          var shortestFilter = activeFilters[shortestFilterId],
              itemValid = true, foundInFilter, currentItem;

          for (i in shortestFilter) {
            currentItem = shortestFilter[i];
            itemValid = true;
            for (j in activeFilters) {
              if (shortestFilterId == j) continue;

              foundInFilter = false;
              for (k in activeFilters[j]) {
                // Search for current item in each active filter class
                if (activeFilters[j][k] == currentItem) {
                  foundInFilter = true;
                  break;
                }
              }

              // Set item invalid if it hasn't been found
              if (!foundInFilter) {
                itemValid = false;
                break;
              }
            }
            if (itemValid) {
              activeItems.push(shortestFilter[i]);
            }
          }
        }
        // Hide inactive items
        this.handler.not(activeItems).addClass('inactive');
      } else {
        // Show all items if no filter is selected
        activeItems = this.handler;
      }

      // Show active items
      activeItems.removeClass('inactive');

      // Unset columns and refresh grid for a full layout
      this.columns = null;
      this.layout();
    };

    // Method the get active items which are not disabled and visible
    Wookmark.prototype.getActiveItems = function() {
      return this.handler.not('.inactive');
    }

    // Method to get the standard item width
    Wookmark.prototype.getItemWidth = function() {
      var itemWidth = this.itemWidth,
          containerWidth = this.container.width(),
          firstElement = this.handler.eq(0);

      if (this.itemWidth === undefined || this.itemWidth === 0 && !this.flexibleWidth) {
        itemWidth = firstElement.outerWidth();
      }
      else if (typeof this.itemWidth == 'string' && this.itemWidth.indexOf('%') >= 0) {
        itemWidth = parseFloat(this.itemWidth) / 100 * containerWidth;
      }

      // Calculate flexible item width if option is set
      if (this.flexibleWidth) {
        var flexibleWidth = this.flexibleWidth;

        if (typeof flexibleWidth == 'string' && flexibleWidth.indexOf('%') >= 0) {
          flexibleWidth = parseFloat(flexibleWidth) / 100 * containerWidth
            - firstElement.outerWidth() + firstElement.innerWidth();
        }

        var columns = Math.floor(1 + containerWidth / (flexibleWidth + this.offset)),
            columnWidth = (containerWidth - (columns - 1) * this.offset) / columns;

        itemWidth = Math.max(itemWidth, Math.floor(columnWidth));

        // Stretch items to fill calculated width
        this.handler.css('width', itemWidth);
      }

      return itemWidth;
    };

    // Main layout method.
    Wookmark.prototype.layout = function() {
      // Do nothing if container isn't visible
      if(!this.container.is(":visible")) {
        return;
      }

      // Calculate basic layout parameters.
      var columnWidth = this.getItemWidth() + this.offset,
          containerWidth = this.container.width(),
          columns = Math.floor((containerWidth + this.offset) / columnWidth),
          offset = 0,
          maxHeight = 0,
          activeItems = this.getActiveItems();

      // Use less columns if there are to few items
      columns = Math.min(columns, activeItems.length);

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
          activeItems = this.getActiveItems(),
          length = activeItems.length,
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
        item = activeItems.eq(i);

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

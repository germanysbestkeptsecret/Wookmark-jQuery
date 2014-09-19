/*!
  jQuery Wookmark plugin
  @name wookmark.js
  @author Christoph Ono (chri@sto.ph or @gbks)
  @author Sebastian Helzle (sebastian@helzle.net or @sebobo)
  @version 2.0.0
  @date 08/27/2014
  @category jQuery plugin
  @copyright (c) 2009-2014 Christoph Ono (www.wookmark.com)
  @license Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
*/
(function (factory) {
  if (typeof define === 'function' && define.amd)
    define(factory);
  else
    factory(window, document);
}(function (window, document) {
  var Wookmark, defaultOptions, __bind;

  // Wookmark default options
  // ------------------------
  defaultOptions = {
    align: 'center',
    autoResize: true,
    comparator: null,
    direction: undefined,
    ignoreInactiveItems: true,
    inactiveClass: 'wookmark-inactive',
    itemSelector: undefined,
    itemWidth: 0,
    fillEmptySpace: false,
    flexibleWidth: 0,
    offset: 5,
    outerOffset: 0,
    onLayoutChanged: undefined,
    placeholderClass: 'wookmark-placeholder',
    possibleFilters: [],
    resizeDelay: 50,
    verticalOffset: undefined
  };

  // Helper functions
  // ----------------

  // Bind function to set the context for the Wookmark instance function
  __bind = function(fn, me) {
    return function() {
      return fn.apply(me, arguments);
    };
  };

  // Function for executing css writes to dom on the next animation frame if supported
  var executeNextFrame = window.requestAnimationFrame || function(callback) {callback();};

  // Update the css properties of multiple elements at the same time
  // befor the browsers next animation frame.
  // The parameter `data` has to be an array containing objects, each
  // with the element and the desired css properties.
  function bulkUpdateCSS(data) {
    executeNextFrame(function() {
      var i, item;
      for (i = 0; i < data.length; i++) {
        item = data[i];
        setCSS(item.el, item.css);
      }
    });
  }

  // Update multiple css values on an object
  function setCSS(el, properties) {
    for (var key in properties) {
      el.style[key] = properties[key];
    }
  }

  // Remove whitespace around filter names
  function cleanFilterName(filterName) {
    return filterName.replace(/^\s+|\s+$/g, '').toLowerCase();
  }

  // Add listener to an element (IE8 compatible)
  function addEventListener(el, eventName, handler) {
    removeEventListener(el, eventName, handler);
    if (el.addEventListener) {
      el.addEventListener(eventName, handler);
    } else {
      el.attachEvent('on' + eventName, function(){
        handler.call(el);
      });
    }
  }

  // Remove listener from an element (IE8 compatible)
  function removeEventListener(el, eventName, handler) {
    if (el.removeEventListener)
      el.removeEventListener(eventName, handler);
    else
      el.detachEvent('on' + eventName, handler);
  }

  // Checks if element `el` is not visible in the browser
  function isHidden(el) {
    return el.offsetParent === null;
  }

  // Returns the elements height without margin
  function getHeight(el) {
    return el.offsetHeight;
  }

  // Returns the elements width without margin
  function getWidth(el) {
    return el.offsetWidth;
  }

  // Return true if element has class
  function hasClass(el, className) {
    if (el.classList)
      return el.classList.contains(className);
    else
      return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
  }

  // Add class to element (IE8+)
  function addClass(el, className) {
    if (el.classList)
      el.classList.add(className);
    else
      el.className += ' ' + className;
  }

  // Remove class from element (IE8+)
  function removeClass(el, className) {
    if (el.classList)
      el.classList.remove(className);
    else
      el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }

  // Get value of specified data attribute
  function getData(el, attr, isInt, prefix) {
    if (prefix === undefined) prefix = 'wookmark-';
    var val = el.getAttribute('data-' + prefix + attr);
    if (isInt === true) return parseInt(val);
    return val;
  }

  // Set value of specified data attribute
  function setData(el, attr, val, prefix) {
    if (prefix === undefined) prefix = 'wookmark-';
    el.setAttribute('data-' + prefix + attr, val);
  }

  // Remove duplicates from given array
  function removeDuplicates(items) {
    var temp = {}, result = [], x, i;
    for (i = items.length; i--;) {
      x = getData(items[i], 'id', true);
      if (!(x in temp)) {
        temp[x] = 1;
        result.push(items[i]);
      }
    }
    return result;
  }

  // Main wookmark plugin class
  // --------------------------
  Wookmark = (function() {

    function Wookmark(container, options) {
      if (options === undefined) options = {};

      if (typeof container === 'string') container = document.querySelector(container);

      // Instance variables.
      this.container = container;
      this.columns = this.containerWidth = this.resizeTimer = null;
      this.activeItemCount = 0;
      this.placeholders = [];
      this.itemHeightsInitialized = false;
      this.itemHeightsDirty = false;
      this.elementTag = 'div';

      // Bind instance methods
      this.initItems = __bind(this.initItems, this);
      this.updateOptions = __bind(this.updateOptions, this);
      this.onResize = __bind(this.onResize, this);
      this.onRefresh = __bind(this.onRefresh, this);
      this.getItemWidth = __bind(this.getItemWidth, this);
      this.layout = __bind(this.layout, this);
      this.layoutFull = __bind(this.layoutFull, this);
      this.layoutColumns = __bind(this.layoutColumns, this);
      this.filter = __bind(this.filter, this);
      this.clear = __bind(this.clear, this);
      this.getActiveItems = __bind(this.getActiveItems, this);
      this.refreshPlaceholders = __bind(this.refreshPlaceholders, this);
      this.sortElements = __bind(this.sortElements, this);
      this.updateFilterClasses = __bind(this.updateFilterClasses, this);

      // Initialize children of the container
      this.initItems();

      // Initial update and layout
      this.container.style.display = 'block';
      this.updateOptions(options);

      // Collect filter classes after items have been initialized
      this.updateFilterClasses();

      // Listen to resize event of the browser if enabled
      if (this.autoResize) {
        window.addEventListener('resize', this.onResize);
      }

      // Listen to external refresh event
      this.container.addEventListener('refreshWookmark', this.onRefresh);
    }

    // Get all valid children of the container object and store them
    Wookmark.prototype.initItems = function() {
      // By select all children of the container if no selector is specified
      if (this.itemSelector === undefined) {
        var items = [], i, child, children = this.container.children;
        for (i = children.length; i--;){
          child = children[i];
          // Skip comment nodes on IE8
          if (child.nodeType != 8) {
            // Show item
            child.style.display = '';
            setData(child, 'id', i);
            items.unshift(child);
          }
        }
        this.items = items;
      } else {
        this.items = this.container.querySelectorAll(this.itemSelector);
      }
      if (this.items.length) this.elementTag = this.items[0].tagName;
    };

    // Reload all filter classes from all items and cache them
    Wookmark.prototype.updateFilterClasses = function() {
      // Collect filter data
      var i, j, k, filterClasses = {}, itemFilterClasses,
          item, filterClass, possibleFilters = this.possibleFilters, possibleFilter;

      for (i = this.items.length; i--;) {
        item = this.items[i];

        // Read filter classes and globally store each filter class as object and the fitting items in the array
        itemFilterClasses = JSON.parse(getData(item, 'filter-class', false, ''));
        if (itemFilterClasses && typeof itemFilterClasses == 'object' && itemFilterClasses.length > 0) {
          for (j = itemFilterClasses.length; j--;) {
            filterClass = cleanFilterName(itemFilterClasses[j]);

            if (typeof(filterClasses[filterClass]) === 'undefined') {
              filterClasses[filterClass] = [];
            }
            filterClasses[filterClass].push(item);
          }
        }
      }

      for (k = possibleFilters.length; k--;) {
        possibleFilter = cleanFilterName(possibleFilters[k]);
        if (!(possibleFilter in filterClasses)) {
          filterClasses[possibleFilter] = [];
        }
      }

      this.filterClasses = filterClasses;
    };

    // Method for updating the plugins options
    Wookmark.prototype.updateOptions = function(options) {
      this.itemHeightsDirty = true;

      // Overwrite non existing instance variables with the ones from options or the defaults
      for (var key in defaultOptions) {
        if (defaultOptions.hasOwnProperty(key)) {
          if (options.hasOwnProperty(key))
            this[key] = options[key];
          else if (!this.hasOwnProperty(key))
            this[key] = defaultOptions[key];
        }
      }

      // Vertical offset uses a fallback to offset
      this.verticalOffset = this.verticalOffset || this.offset;

      // Update layout so changes apply
      this.layout(true);
    };

    // This timer ensures that layout is not continuously called as window is being dragged.
    Wookmark.prototype.onResize = function() {
      clearTimeout(this.resizeTimer);
      this.itemHeightsDirty = this.flexibleWidth !== 0;
      this.resizeTimer = setTimeout(this.layout, this.resizeDelay);
    };

    // Marks the items heights as dirty and does a relayout
    Wookmark.prototype.onRefresh = function() {
      this.itemHeightsDirty = true;
      this.layout();
    };

    // Filters the active items with the given string filters.
    // @param filters array of string
    // @param mode 'or' or 'and'
    Wookmark.prototype.filter = function(filters, mode, dryRun) {
      var activeFilters = [], activeFiltersLength, activeItems = [],
          i, j, k, filter;

      filters = filters || [];
      mode = mode || 'or';
      dryRun = dryRun || false;

      if (filters.length) {
        // Collect active filters
        for (i = 0; i < filters.length; i++) {
          filter = cleanFilterName(filters[i]);
          if (filter in this.filterClasses) {
            activeFilters.push(this.filterClasses[filter]);
          }
        }

        // Get items for active filters with the selected mode
        activeFiltersLength = activeFilters.length;
        if (mode == 'or' || activeFiltersLength == 1) {
          // Set all items in all active filters active
          for (i = activeFiltersLength; i--;) {
            activeItems = activeItems.concat(activeFilters[i]);
          }
        } else if (mode == 'and') {
          var shortestFilter = activeFilters[0],
              itemValid = true, foundInFilter,
              currentItem, currentFilter;

          // Find shortest filter class
          for (i = 1; i < activeFiltersLength; i++) {
            if (activeFilters[i].length < shortestFilter.length) {
              shortestFilter = activeFilters[i];
            }
          }

          // Iterate over shortest filter and find elements in other filter classes
          shortestFilter = shortestFilter || [];
          for (i = shortestFilter.length; i--;) {
            currentItem = shortestFilter[i];
            itemValid = true;

            for (j = activeFilters.length; j-- && itemValid;) {
              currentFilter = activeFilters[j];
              if (shortestFilter == currentFilter) continue;

              // Search for current item in each active filter class
              for (k = currentFilter.length, foundInFilter = false; k-- && !foundInFilter;) {
                foundInFilter = currentFilter[k] == currentItem;
              }
              itemValid &= foundInFilter;
            }

            if (itemValid) {
              activeItems = activeItems.concat(shortestFilter[i]);
            }
          }
        }

        // Remove duplicates from active items
        if (activeFiltersLength > 1) {
          activeItems = removeDuplicates(activeItems);
        }

        // Hide inactive items
        if (!dryRun) {
          for (i = this.items.length; i--;) {
            if (activeItems.indexOf(this.items[i]) == -1) {
              addClass(this.items[i], this.inactiveClass);
            }
          }
        }
      } else {
        // Show all items if no filter is selected
        activeItems = this.items;
      }

      // Show active items
      if (!dryRun) {
        for (i = activeItems.length ; i--;) {
          removeClass(activeItems[i], this.inactiveClass);
        }
        // Unset columns and refresh grid for a full layout
        this.columns = null;
        this.layout();
      }
      return activeItems;
    };

    // Creates or updates existing placeholders to create columns of even height
    Wookmark.prototype.refreshPlaceholders = function(columnWidth, sideOffset) {
      var i = this.placeholders.length,
          placeholdersHtml, placeholder, lastColumnItem,
          columnsLength = this.columns.length, column,
          height, top, innerOffset,
          containerHeight = getHeight(this.container);

      placeHoldersHtml = new Array(columnsLength).join('<' + this.elementTag + ' class="' + this.placeholderClass + '"/>');
      this.container.insertAdjacentHTML('beforeend', placeHoldersHtml);
      this.placeholders = this.container.getElementsByClassName(this.placeholderClass);

      innerOffset = this.offset + parseInt(this.placeholders[0].style.borderLeftWidth, 10) * 2;

      for (i = 0; i < this.placeholders.length; i++) {
        placeholder = this.placeholders[i];
        column = this.columns[i];

        if (i >= columnsLength || !column[column.length - 1]) {
          placeholder.style.display = 'none';
        } else {
          lastColumnItem = column[column.length - 1];
          if (!lastColumnItem) continue;
          top = getData(lastColumnItem, 'top', true) + getData(lastColumnItem, 'height', true) + this.verticalOffset;
          height = containerHeight - top - innerOffset;

          setCSS(placeholder, {
            position: 'absolute',
            display: height > 0 ? 'block' : 'none',
            left: (i * columnWidth + sideOffset) + 'px',
            top: top + 'px',
            width: (columnWidth - innerOffset) + 'px',
            height: height + 'px'
          });
        }
      }
    };

    // Method the get active items which are not disabled and visible
    Wookmark.prototype.getActiveItems = function() {
      var activeItems = this.items, inactiveClass = this.inactiveClass;
      if (this.ignoreInactiveItems) {
        return Array.prototype.filter.call(this.items, function(el) {
          return !hasClass(el, inactiveClass);
        });
      }
      return this.items;
    };

    // Method to get the standard item width
    Wookmark.prototype.getItemWidth = function() {
      var itemWidth = this.itemWidth,
          innerWidth = getWidth(this.container) - 2 * this.outerOffset,
          firstElement = this.items[0],
          flexibleWidth = this.flexibleWidth;

      if (this.itemWidth === undefined || this.itemWidth === 0 && !this.flexibleWidth) {
        itemWidth = getWidth(firstElement);
      }
      else if (typeof this.itemWidth == 'string' && this.itemWidth.indexOf('%') >= 0) {
        itemWidth = parseFloat(this.itemWidth) / 100 * innerWidth;
      }

      // Calculate flexible item width if option is set
      if (flexibleWidth) {
        if (typeof flexibleWidth == 'string' && flexibleWidth.indexOf('%') >= 0) {
          flexibleWidth = parseFloat(flexibleWidth) / 100 * innerWidth;
        }

        // Find highest column count
        var paddedInnerWidth = (innerWidth + this.offset),
            flexibleColumns = ~~(0.5 + paddedInnerWidth / (flexibleWidth + this.offset)),
            fixedColumns = ~~(paddedInnerWidth / (itemWidth + this.offset)),
            columns = Math.max(flexibleColumns, fixedColumns),
            columnWidth = Math.min(flexibleWidth, ~~((innerWidth - (columns - 1) * this.offset) / columns));

        itemWidth = Math.max(itemWidth, columnWidth);

        // Stretch items to fill calculated width
        this.container.style.width = itemWidth + 'px';
      }

      return itemWidth;
    };

    // Main layout method.
    Wookmark.prototype.layout = function(force) {
      // Do nothing if container isn't visible
      if (isHidden(this.container)) return;

      // Calculate basic layout parameters.
      var columnWidth = this.getItemWidth() + this.offset,
          containerWidth = getWidth(this.container),
          innerWidth = containerWidth - 2 * this.outerOffset,
          columns = ~~((innerWidth + this.offset) / columnWidth),
          offset = 0, maxHeight = 0, i = 0,
          activeItems = this.getActiveItems(),
          activeItemsLength = activeItems.length,
          item;

      // Cache item height
      if (this.itemHeightsDirty || !this.itemHeightsInitialized) {
        for (; i < activeItemsLength; i++) {
          item = activeItems[i];
          setData(item, 'height', item.offsetHeight);
        }
        this.itemHeightsDirty = false;
        this.itemHeightsInitialized = true;
      }

      // Use less columns if there are to few items
      columns = Math.max(1, Math.min(columns, activeItemsLength));

      // Calculate the offset based on the alignment of columns to the parent container
      offset = this.outerOffset;
      if (this.align == 'center') {
        offset += ~~(0.5 + (innerWidth - (columns * columnWidth - this.offset)) >> 1);
      }

      // Get direction for positioning
      this.direction = this.direction || (this.align == 'right' ? 'right' : 'left');

      // If container and column count hasn't changed, we can only update the columns.
      if (!force && this.columns !== null && this.columns.length == columns && this.activeItemCount == activeItemsLength) {
        maxHeight = this.layoutColumns(columnWidth, offset);
      } else {
        maxHeight = this.layoutFull(columnWidth, columns, offset);
      }
      this.activeItemCount = activeItemsLength;

      // Set container height to height of the grid.
      this.container.style.height = maxHeight + 'px';

      // Update placeholders
      if (this.fillEmptySpace) {
        this.refreshPlaceholders(columnWidth, offset);
      }

      if (this.onLayoutChanged !== undefined && typeof this.onLayoutChanged === 'function') {
        this.onLayoutChanged();
      }
    };

    // Sort elements with configurable comparator
    Wookmark.prototype.sortElements = function(elements) {
      return typeof(this.comparator) === 'function' ? elements.sort(this.comparator) : elements;
    };

    // Perform a full layout update.
    Wookmark.prototype.layoutFull = function(columnWidth, columns, offset) {
      var item, i = 0, k = 0,
          activeItems = this.getActiveItems(),
          length = activeItems.length,
          shortest = null, shortestIndex = null,
          sideOffset, heights = [], itemBulkCSS = [],
          leftAligned = this.align == 'left' ? true : false;

      this.columns = [];

      // Sort elements before layouting
      activeItems = this.sortElements(activeItems);

      // Prepare arrays to store height of columns and items.
      while (heights.length < columns) {
        heights.push(this.outerOffset);
        this.columns.push([]);
      }

      // Loop over items.
      for (; i < length; i++ ) {
        item = activeItems[i];

        // Find the shortest column.
        shortest = heights[0];
        shortestIndex = 0;
        for (k = 0; k < columns; k++) {
          if (heights[k] < shortest) {
            shortest = heights[k];
            shortestIndex = k;
          }
        }
        setData(item, 'top', shortest);

        // stick to left side if alignment is left and this is the first column
        sideOffset = offset;
        if (shortestIndex > 0 || !leftAligned)
          sideOffset += shortestIndex * columnWidth;

        // Position the item.
        (itemBulkCSS[i] = {
          el: item,
          css: {
            position: 'absolute',
            top: shortest + 'px'
          }
        }).css[this.direction] = sideOffset + 'px';

        // Update column height and store item in shortest column
        heights[shortestIndex] += getData(item, 'height', true) + this.verticalOffset;
        this.columns[shortestIndex].push(item);
      }

      bulkUpdateCSS(itemBulkCSS);

      // Return longest column
      return Math.max.apply(Math, heights);
    };

    // This layout method only updates the vertical position of the
    // existing column assignments.
    Wookmark.prototype.layoutColumns = function(columnWidth, offset) {
      var heights = [], itemBulkCSS = [],
          i = 0, k = 0, j = 0, currentHeight,
          column, item, itemData, sideOffset;

      for (; i < this.columns.length; i++) {
        heights.push(this.outerOffset);
        column = this.columns[i];
        sideOffset = i * columnWidth + offset;
        currentHeight = heights[i];

        for (k = 0; k < column.length; k++, j++) {
          item = column[k];
          setData(item, 'top', currentHeight);
          (itemBulkCSS[j] = {
            el: item,
            css: {
              top: currentHeight + 'px'
            }
          }).css[this.direction] = sideOffset + 'px';

          currentHeight += getData(item, 'height', true) + this.verticalOffset;
        }
        heights[i] = currentHeight;
      }

      bulkUpdateCSS(itemBulkCSS);

      // Return longest column
      return Math.max.apply(Math, heights);
    };

    // Clear event listeners and time outs and the instance itself
    Wookmark.prototype.clear = function() {
      clearTimeout(this.resizeTimer);
      for (var i = this.placeholders.length; i--;) {
        this.container.removeChild(this.placeholders[i]);
      }
      removeEventListener(window, 'resize', this.onResize);
      removeEventListener(this.container, 'refreshWookmark', this.onRefresh);
    };

    return Wookmark;
  })();

  if (window.jQuery !== undefined) {
    jQuery.fn.wookmark = function(options) {
      // Use first element if container is an jQuery object
      if (options !== undefined && options.container instanceof jQuery) {
        options.container = options.container[0];
      }

      // Call plugin multiple times if there are multiple elements selected
      if (this.length > 1) {
        for (var i = this.length; i--;) {
          this[i].wookmark(options);
        }
      } else if (this.length == 1) {
        // Create a wookmark instance or update an existing one
        if (!this.wookmarkInstance) {
          this.wookmarkInstance = new Wookmark(this[0], options || {});
        } else {
          this.wookmarkInstance.update(options || {});
        }
      }
      return this;
    };
  }

  window.Wookmark = Wookmark;
}));

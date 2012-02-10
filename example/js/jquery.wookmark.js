/*!
  jQuery Wookmark plugin 0.1
  @name jquery.wookmark.js
  @author Christoph Ono (chri@sto.ph or @gbks)
  @version 0.1
  @date 12/14/2011
  @category jQuery plugin
  @copyright (c) 2009-2011 Christoph Ono (www.wookmark.com)
  @license Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
*/
$.fn.wookmark = function(options) {
  this.options = options;
  
  // Set default values for undefined options.
  var defaults = {
    container: $('body'),
    offset: 2,
    autoResize: false,
    itemWidth: $(this[0]).outerWidth(),
    resizeDelay: 50
  }

  // Override defaults for submitted options.
  for(var i in defaults) {
    if(!this.options[i]) {
      this.options[i] = defaults[i];
    }
  }
  
  // Main layout function.
  this.layout = function() {
    // Calculate basic layout parameters.
    var columnWidth = this.options.itemWidth + this.options.offset;
    var containerWidth = this.options.container.width();
    var columns = Math.floor((containerWidth+this.options.offset)/columnWidth);
    var offset = Math.round((containerWidth - (columns*columnWidth-this.options.offset))/2);
    
    // Prepare Array to store height of columns.
    var heights = [];
    while(heights.length < columns) heights.push(0);
    
    // Loop over items.
    var item, top, left, i=0, k=0, length=this.length, shortest=null, shortestIndex=null, bottom = 0;
    for(; i<length; i++ ) {
      item = $(this[i]);
      
      // Find the shortest column.
      shortest = null;
      shortestIndex = 0;
      for(k=0; k<columns; k++) {
        if(shortest == null || heights[k] < shortest) {
          shortest = heights[k];
          shortestIndex = k;
        }
      }
      
      // Postion the item.
      item.css({
        position: 'absolute',
        top: shortest+'px',
        left: (shortestIndex*columnWidth + offset)+'px'
      });
      
      // Update column height.
      heights[shortestIndex] = shortest + item.outerHeight() + this.options.offset;
      bottom = Math.max(bottom, heights[shortestIndex]);
    }
    
    // Set container height to height of the grid.
    this.options.container.css('height', bottom+'px');
  };
  
  // Listen to resize event if requested.
  if(options.autoResize) {
    // This timer ensures that layout is not continuously called as window is being dragged.
    this.resizeTimer = null;
    this.onResize = function(event) {
      if(this.resizeTimer) {
        clearTimeout(this.resizeTimer);
      }
      this.resizeTimer = setTimeout($.proxy(this.layout, this), this.options.resizeDelay)
    };
    
    // Bind event listener.
    $(window).resize($.proxy(this.onResize, this));
  };
  
  // Apply layout
  this.layout();
  
  // Display items (if hidden).
  this.show();
};

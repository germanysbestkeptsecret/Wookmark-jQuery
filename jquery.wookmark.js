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
  // Apply defaults for options if they are not provided.
  if(!options.container) options.container = $(window);
  if(!options.offset) options.offset = 2;
  if(!options.itemWidth) {
    options.itemWidth = $(this[0]).width();
  }
  
  // Calculate basic layout parameters.
  var columnWidth = options.itemWidth + options.offset;
  var containerWidth = options.container.width();
  var columns = Math.floor((containerWidth+options.offset)/columnWidth);
  var offset = Math.round((containerWidth - (columns*columnWidth-options.offset))/2);
  
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
    heights[shortestIndex] = shortest + item.outerHeight() + options.offset;
    bottom = Math.max(bottom, heights[shortestIndex]);
  }
  
  // Set container height to height of the grid.
  options.container.css('height', bottom+'px');
  
  // Display items (if hidden).
  this.show();
};

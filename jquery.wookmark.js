
$.fn.wookmark = function(options) {
  if(!options.container) options.container = $(window);
  if(!options.offset) options.offset = 2;
  
  if(!options.itemWidth) {
    options.itemWidth = $(this[0]).width();
  }
  
  var columnWidth = options.itemWidth + options.offset;
  var containerWidth = options.container.width();
  var columns = Math.floor((containerWidth+options.offset)/columnWidth);
  var offset = Math.round((containerWidth - (columns*columnWidth-options.offset))/2);
  
  var heights = [];
  while(heights.length < columns) heights.push(0);
  
  var item, top, left, i=0, k=0, length=this.length, shortest=null, shortestIndex=null, bottom = 0;
  for(; i<length; i++ ) {
    item = $(this[i]);
    
    shortest = null;
    shortestIndex = 0;
    for(k=0; k<columns; k++) {
      if(shortest == null || heights[k] < shortest) {
        shortest = heights[k];
        shortestIndex = k;
      }
    }
    
    item.css({
      position: 'absolute',
      top: shortest+'px',
      left: (shortestIndex*columnWidth + offset)+'px'
    });
    
    heights[shortestIndex] = shortest + item.outerHeight() + options.offset;
    bottom = Math.max(bottom, heights[shortestIndex]);
  }
  
  options.container.css('height', bottom+'px');
  
  this.show();
};
